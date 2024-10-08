import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError";
import { cassandraClient } from "../services/cassandraClient";
import AWS from "aws-sdk";
import { getSQSConfig } from "../aws/SQSconfig";
import axios from "axios";
import { deleteS3Folder } from "../aws/S3";

const prismaClient = new PrismaClient();

interface AuthRequest extends Request {
  headers: {
    authorization?: string;
  };
  userId?: any;
}
export const createProject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { gitUrl, projectName } = req.body;
    const userId = req.userId;
    const existingProject = await prismaClient.project.findFirst({
      where: {
        projectName,
      },
    });
    if (existingProject) {
      throw new ApiError(400, "Project with this name already exists");
    }

    const [owner, repo] = gitUrl.replace("https://github.com/", "").split("/");

    const user = await prismaClient.user.findFirst({ where: { id: userId } });
    if (!user) 
      throw new ApiError(404, "User not found");
    let defaultBranch=""
    try {
      const repoResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}`,
        {
          headers: {
            Authorization: `token ${user.githubAccessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      defaultBranch = repoResponse.data?.default_branch;
    } catch (e) {
      console.log(e);
    }

    const project = await prismaClient.project.create({
      data: {
        projectName,
        gitUrl,
        userId,
        branch: defaultBranch,
        env:""
      },
    });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Project created successfully",
          { projectId: project.id },
          true
        )
      );
  }
);
export const updateProject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {  buildCommand, installCommand,projectId,branch,srcDir } =
      req.body;
    const existingProject = await prismaClient.project.findFirst({
      where: {
        id:projectId,
      },
    });
    if (existingProject && existingProject?.id!==projectId) {
      throw new ApiError(409, "Project Name already taken");
    }
    const updatedProject = await prismaClient.project.update({
      where:{id:projectId},data:{buildCommand,installCommand,branch,lastModified:new Date(),srcDir}
    })
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Project updated successfully",
          { projectId: updatedProject.id },
          true
        )
      );
  }
);
export const updateEnvFields = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { env,projectId} =
      req.body;
    console.log(projectId)
    const updatedProject = await prismaClient.project.update({
      where:{id:projectId},data:{env}
    })
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Project env updated successfully",
          { projectId: updatedProject.id },
          true
        )
      );
  }
);

export const deployProject = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    const project = await prismaClient.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        user: true,
      },
    });

    if (!project) throw new ApiError(404, "Project not found");
    const token = project.user.githubAccessToken;
    if (!token) {
      throw new ApiError(401, "User's GitHub access token not found");
    }
    const repoUrlParts = project.gitUrl.split("/");
    const owner = repoUrlParts[repoUrlParts.length - 2];
    const repo = repoUrlParts[repoUrlParts.length - 1].replace(".git", "");
    let latestCommitMessage = "No commit message";
    try {
      const commitResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits?sha=${project.branch}`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      latestCommitMessage =
        commitResponse.data[0]?.commit?.message || "No commit message";
    } catch (error: any) {

      console.error("Error fetching the latest commit:", error.message);
      throw new ApiError(500, "Error fetching the latest commit message");
    }
    const deployment = await prismaClient.deployment.create({
      data: {
        projectId: projectId,
        title: latestCommitMessage,
        status: "QUEUED",
      },
    });

    const sqsClient = new AWS.SQS(getSQSConfig());

    const paramsSendMessage = {
      MessageBody: JSON.stringify({
        gitUrl: project.gitUrl,
        projectName: project.projectName,
        deploymentId: deployment.id,
        env:project.env,
        branch:project.branch,
        installCommand:project.installCommand,
        buildCommand:project.buildCommand,
        token,
        srcDir:project.srcDir
      }),
      QueueUrl: process.env.AWS_SQS_URL!,
    };

    sqsClient.sendMessage(paramsSendMessage, (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Successfully added message", data.MessageId);
    }
    });
    await prismaClient.project.update({
      where:{id:projectId},data:{lastDeployed:new Date()}
    })

    res.json({
      message: "QUEUED",
      data: {
        title: latestCommitMessage,
        projectId,
        status: "QUEUED",
        url: `http://${project.projectName}.localhost:3000`, // Example project URL
        id: deployment.id,
      },
    });
  }
);

export const getAllProjects = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const userIdProvided = req.params.userId;
    if (userId !== userIdProvided) {
      throw new ApiError(403, "Forbidden");
    }
    const projects = await prismaClient.project.findMany({
      where: {
        userId,
      },
    });
    res
      .status(200)
      .json(new ApiResponse(200, "Fetched Projects", { projects }, true));
  }
);
export const getProjectById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const projectId = req.params.projectId;
    const project = await prismaClient.project.findFirst({
      where: {
        id: projectId,
      },
    });
    res
      .status(200)
      .json(new ApiResponse(200, "Fetched Projects", { project }, true));
  }
);
export const getDeploymentsByProjectID = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const projectId = req.params.projectId;
    const deployments = await prismaClient.deployment.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res
      .status(200)
      .json(new ApiResponse(200, "Fetched Deployments", { deployments }, true));
  }
);

export const changeStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const deploymentId = req.params.deployId;
    const status = req.body.status;
    const updatedDeployment = await prismaClient.deployment.update({
      where: {
        id: deploymentId,
      },
      data: {
        status,
      },
    });
    res
      .status(200)
      .json(
        new ApiResponse(200, "Status updated", { updatedDeployment }, true)
      );
  }
);

export const checkProjectExists = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const projectId = req.params.projectId;

    const exists = await prismaClient.project.findFirst({
      where: {
        id: projectId,
      },
    });
    if (exists) throw new ApiError(400, "Project Already exists");
    res
      .status(200)
      .json(new ApiResponse(200, "Project does not exists", {}, true));
  }
);

export const getLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const deployId = req.params.deployId;
  const deployment = await prismaClient.deployment.findUnique({
    where: {
      id: deployId,
    },
  });
  if (!deployment) {
    throw new ApiError(404, "Deployment does not exist");
  }
  try {
    const result = await cassandraClient.execute(
      `
          SELECT * FROM default_keyspace.Logs WHERE deployment_id = ? ALLOW FILTERING;
      `,
      [deployId]
    );
    const logs = result.rows.map((row) => {
      return { log: row.log, timestamp: row.timestamp };
    });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Logs retrieved successfully",
          { deploymentStatus: deployment.status, logs },
          true
        )
      );
  } catch (error: any) {
    console.error("Error retrieving logs:", error.message);
    throw new ApiError(500, "Internal Server Error");
  }
});

export const getRepos = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const user = await prismaClient.user.findFirst({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");
    try {
      console.log("user");
      console.log(user);
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `token ${user.githubAccessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          sort: "updated",
          per_page: 100, // Adjust as needed
        },
      });

      const repos = response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        private: repo.private,
        description: repo.description,
        html_url: repo.html_url,
        updated_at: repo.updated_at,
      }));

      res.status(200).json(repos);
    } catch (error) {
      console.error("Error fetching GitHub repos:", error);
      res.status(500).json({ message: "Failed to fetch repositories" });
    }
  }
);

export const getBranches = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const projectId = req.params.projectId;

    const project = await prismaClient.project.findFirst({
      where: { id: projectId },
    });
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const githubUrl = project.gitUrl;
    if (!githubUrl) {
      throw new ApiError(400, "Project does not have a valid GitHub URL");
    }


    const [owner, repo] = githubUrl
      .replace("https://github.com/", "")
      .split("/");


    const user = await prismaClient.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    try {

      const repoResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}`,
        {
          headers: {
            Authorization: `token ${user.githubAccessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      const defaultBranch = repoResponse.data.default_branch;


      const branchesResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/branches`,
        {
          headers: {
            Authorization: `token ${user.githubAccessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          params: {
            per_page: 100, 
          },
        }
      );

      const branches = branchesResponse.data.map((branch: any) => ({
        name: branch.name,
        commitSha: branch.commit.sha,
        protected: branch.protected,
        isDefault: branch.name === defaultBranch, 
      }));

      res.status(200).json(branches);
    } catch (error) {
      console.error("Error fetching GitHub branches:", error);
      res.status(500).json({ message: "Failed to fetch branches" });
    }
  }
);

export const updateIsLive = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const projectId = req.params.projectId;
    const {  isLive } = req.body;
    console.log(projectId)
    console.log(isLive)
    const updatedProject = await prismaClient.project.updateMany({
      where:{projectName:projectId},data:{isLive}
    })
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Project updated successfully",
          { projectId: updatedProject },
          true
        )
      );
  }
);

export const deleteProject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const projectId = req.params.projectId;
    const existingProject = await prismaClient.project.findFirst({
      where: {
        id:projectId,
      },
    });
    if (!existingProject) {
      throw new ApiError(404, "Project not found");
    }
    const bucketName = process.env.AWS_BUCKET_NAME!;
    const s3Key = `/outputs/${existingProject.projectName}`;
    await deleteS3Folder(bucketName, s3Key);
    await prismaClient.request.deleteMany({where:{projectName:existingProject.projectName}});
    await prismaClient.project.delete({where:{id:projectId}});

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Project deleted successfully",
          {},
          true
        )
      );
  }
);