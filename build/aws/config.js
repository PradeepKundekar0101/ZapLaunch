"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getECSConfig = exports.getRunTaskConfig = void 0;
const getRunTaskConfig = (gitUrl, projectId) => {
    return {
        count: 1,
        cluster: process.env.AWS_ECS_CLUSTER_ARN,
        taskDefinition: process.env.AWS_ECS_TASK_ARN,
        launchType: "FARGATE",
        overrides: {
            containerOverrides: [
                {
                    name: "build-server",
                    environment: [
                        {
                            name: "AWS_SECRET_ACCESS_KEY",
                            value: process.env.AWS_SECRET_ACCESS_KEY,
                        },
                        {
                            name: "AWS_ACCESS_KEY",
                            value: process.env.AWS_ACCESS_KEY,
                        },
                        {
                            name: "AWS_REGION",
                            value: process.env.AWS_REGION,
                        },
                        {
                            name: "AWS_BUCKET_NAME",
                            value: process.env.AWS_BUCKET_NAME
                        },
                        {
                            name: "PROJECT_ID",
                            value: projectId
                        },
                        {
                            name: "GIT_REPO_URL",
                            value: gitUrl
                        },
                        {
                            name: "REDIS_URI",
                            value: process.env.REDIS_URI
                        }
                    ],
                },
            ],
        },
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: [
                    process.env.AWS_ECS_SUB1,
                    process.env.AWS_ECS_SUB2,
                    process.env.AWS_ECS_SUB3,
                ],
                securityGroups: [process.env.AWS_ECS_SG],
            },
        },
    };
};
exports.getRunTaskConfig = getRunTaskConfig;
const getECSConfig = () => {
    return {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    };
};
exports.getECSConfig = getECSConfig;
