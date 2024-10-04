import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import IPinfoWrapper, { ApiLimitError, IPinfo } from "node-ipinfo";

const prisma = new PrismaClient();
const ipinfo = new IPinfoWrapper(process.env.IPINFO_ACCESS_TOKEN!);

export const getVisitTrends = asyncHandler(async (req: AuthRequest, res) => {
  const projectName = req.params.projectName;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOf7DaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);

  const [overall, lastYear, lastMonth, last7Days, today] = await Promise.all([
    getVisitCount(projectName),
    getVisitCount(projectName, startOfLastYear),
    getVisitCount(projectName, startOfLastMonth),
    getVisitCount(projectName, startOf7DaysAgo),
    getVisitCount(projectName, startOfToday),
  ]);

  const dailyTrends = await getDailyTrends(projectName, startOf7DaysAgo);

  res.json({
    overall,
    lastYear,
    lastMonth,
    last7Days,
    today,
    dailyTrends,
  });
});

export const getGeographicalDistribution = asyncHandler(async (req: AuthRequest, res) => {
  const projectName = req.params.projectName;

  const distribution = await prisma.request.groupBy({
    by: ['country'],
    where: {
      projectName,
      country: { not: null },
    },
    _count: {
      country: true,
    },
  });

  const result = distribution.reduce((acc, item) => {
    acc[item.country!] = item._count.country;
    return acc;
  }, {} as Record<string, number>);

  res.json(result);
});

async function getVisitCount(projectName: string, startDate?: Date) {
  return prisma.request.count({
    where: {
      projectName,
      ...(startDate && { createdAt: { gte: startDate } }),
    },
  });
}

async function getDailyTrends(projectName: string, startDate: Date) {
  const visits = await prisma.request.groupBy({
    by: ['createdAt'],
    where: {
      projectName,
      createdAt: { gte: startDate },
    },
    _count: {
      id: true,
    },
  });

  return visits.map(visit => ({
    date: visit.createdAt.toISOString().split('T')[0],
    count: visit._count.id,
  }));
}

export const updateCountryInfo = asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const request = await prisma.request.findUnique({ where: { id } });

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  if (!request.country && request.ipAddress) {
    try {
      const ipDetails: IPinfo = await ipinfo.lookupIp(request.ipAddress);
      const country = ipDetails.country || "Unknown";

      await prisma.request.update({
        where: { id },
        data: { country },
      });

      res.json({ message: "Country information updated successfully" });
    } catch (err) {
      if (err instanceof ApiLimitError) {
        throw new ApiError(429, "API Limit Exceeded");
      } else {
        throw new ApiError(500, "Internal Server Error");
      }
    }
  } else {
    res.json({ message: "Country information already exists or IP address is missing" });
  }
});