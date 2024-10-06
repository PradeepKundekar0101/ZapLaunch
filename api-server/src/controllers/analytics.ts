import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import IPinfoWrapper, { ApiLimitError, IPinfo } from "node-ipinfo";

const prisma = new PrismaClient();
const ipinfo = new IPinfoWrapper(process.env.IPINFO_ACCESS_TOKEN!);

export const getVisitTrends = asyncHandler(async (req: AuthRequest, res) => {
  const projectName = req.params.projectName;
  const { fromDate, toDate } = req.query;

  if (!fromDate || !toDate) {
    throw new ApiError(
      400,
      "fromDate and toDate are required query parameters"
    );
  }

  const startDate = new Date(fromDate as string);
  const endDate = new Date(toDate as string);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new ApiError(
      400,
      "Invalid date format. Please use ISO 8601 format (YYYY-MM-DD)"
    );
  }

  // Adjust the endDate to include the entire day
  endDate.setHours(23, 59, 59, 999);

  const dailyTrends = await getDailyTrends(projectName, startDate, endDate);
  const totalVisits = dailyTrends.reduce((sum, day) => sum + day.count, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = await getTodayCount(projectName, today);

  res.json({
    todayCount,
    totalVisits,
    dailyTrends,
    periodStart: startDate.toISOString(),
    periodEnd: endDate.toISOString(),
  });
});

async function getTodayCount(projectName: string, today: Date) {
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const todayVisits = await prisma.request.count({
    where: {
      projectName,
      createdAt: {
        gte: today,
        lte: endOfDay,
      },
    },
  });

  return todayVisits;
}

async function getDailyTrends(
  projectName: string,
  startDate: Date,
  endDate: Date
) {
  const visits = await prisma.request.groupBy({
    by: ["createdAt"],
    where: {
      projectName,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: {
      id: true,
    },
  });

  const visitsMap = visits.reduce((acc, visit) => {
    const dateStr = visit.createdAt.toISOString().split("T")[0];
    acc.set(dateStr, (acc.get(dateStr) || 0) + visit._count.id);
    return acc;
  }, new Map());

  const allDates = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    allDates.push(new Date(d));
  }

  return allDates.map((date) => ({
    date: date.toISOString().split("T")[0],
    count: visitsMap.get(date.toISOString().split("T")[0]) || 0,
  }));
}

export const getGeographicalDistribution = asyncHandler(
  async (req: AuthRequest, res) => {
    const projectName = req.params.projectName;
    const requestsWithoutCountry = await prisma.request.findMany({
      where: {
        projectName,
        country: undefined,
      },
      select: {
        id: true,
        ipAddress: true,
      },
    });

    if (requestsWithoutCountry.length > 0) {
      const updatePromises = requestsWithoutCountry.map(async (request) => {
        try {
          const ipDetails = await ipinfo.lookupIp(request.ipAddress || "");
          console.log(ipDetails)
          const country = ipDetails.country || "Unknown";

          return prisma.request.update({
            where: { id: request.id },
            data: { country },
          });
        } catch (error) {
          console.error(`Failed to update request ${request.id}:`, error);
          return null;
        }
      });

      await Promise.all(updatePromises);
    }

    const distribution = await prisma.request.groupBy({
      by: ["country"],
      where: { projectName },
      _count: {
        country: true,
      },
    });

    const result = distribution.reduce((acc, item) => {
      acc[item.country ?? "Unknown"] = item._count.country;
      return acc;
    }, {} as Record<string, number>);

    res.json(result);
  }
);

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
    res.json({
      message: "Country information already exists or IP address is missing",
    });
  }
});
