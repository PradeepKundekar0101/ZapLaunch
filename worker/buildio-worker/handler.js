const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");

const ecsClient = new ECSClient({ region: process.env.AWS_REGION });

exports.runBuildTask = async (event) => {
  const results = [];

  for (const record of event.Records) {
    const message = JSON.parse(record.body);
    const {
      gitUrl,
      projectName,
      deploymentId,
      env,
      branch,
      installCommand,
      buildCommand,
      token,
      srcDir,
    } = message;

    const containerEnv = [
      { name: "GIT_REPO_URL", value: gitUrl },
      { name: "PROJECT_ID", value: projectName },
      { name: "DEPLOYMENT_ID", value: deploymentId },
      { name: "BRANCH", value: branch || "" },
      { name: "INSTALL_COMMAND", value: installCommand || "npm install" },
      { name: "BUILD_COMMAND", value: buildCommand || "npm run build" },
      { name: "SRC_DIR", value: srcDir || "" },
      { name: "JWT_TOKEN", value: token },
      { name: "ENV_VARIABLES", value: typeof env === "string" ? env : JSON.stringify(env || []) },
      { name: "API_SERVER_URL", value: process.env.API_SERVER_URL },
      { name: "REDIS_URI", value: process.env.REDIS_URI },
      { name: "AWS_ACCESS_KEY", value: process.env.MY_AWS_ACCESS_KEY },
      { name: "AWS_SECRET_ACCESS_KEY", value: process.env.MY_AWS_SECRET_ACCESS_KEY },
      { name:"AWS_REGION", value: process.env.MY_AWS_REGION },
      { name:"AWS_BUCKET_NAME", value: process.env.MY_AWS_BUCKET_NAME }
    ];

    const params = {
      cluster: process.env.ECS_CLUSTER_NAME,
      taskDefinition: process.env.ECS_TASK_ARN,
      launchType: "FARGATE",
      count: 1,
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: [
            process.env.ECS_SUBNET1,
            process.env.ECS_SUBNET2,
            process.env.ECS_SUBNET3,
          ],
          securityGroups: [process.env.ECS_SECURITY_GROUP],
          assignPublicIp: "ENABLED",
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: process.env.ECS_CONTAINER_NAME,
            environment: containerEnv,
          },
        ],
      },
    };

    try {
      const command = new RunTaskCommand(params);
      const response = await ecsClient.send(command);
      const taskArn = response.tasks?.[0]?.taskArn;
      console.log(`ECS task started for deployment ${deploymentId}: ${taskArn}`);
      results.push({ deploymentId, taskArn, status: "started" });
    } catch (error) {
      console.error(`Failed to start ECS task for deployment ${deploymentId}:`, error);
      results.push({ deploymentId, error: error.message, status: "failed" });
    }
  }

  return { batchItemFailures: results.filter((r) => r.status === "failed").map((r) => ({ itemIdentifier: r.deploymentId })) };
};
