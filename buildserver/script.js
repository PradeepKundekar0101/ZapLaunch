const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const mimetypes = require("mime-types");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const Redis = require("ioredis");
const { promisify } = require('util');
const execAsync = promisify(require('child_process').exec);

dotenv.config();

const PROJECT_ID = process.env.PROJECT_ID;
const INSTALL_COMMAND = process.env.INSTALL_COMMAND;
const BUILD_COMMAND = process.env.BUILD_COMMAND;
const BRANCH = process.env.BRANCH;
const ENV_VARIABLES = process.env.ENV_VARIABLES;
const API_SERVER_URL = process.env.API_SERVER_URL;
const REDIS_URI = process.env.REDIS_URI;
const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID;
const JWT_TOKEN = process.env.JWT_TOKEN;
const SRC_DIR = process.env.SRC_DIR;
const GIT_REPO_URL = process.env.GIT_REPO_URL;

const publisher = new Redis(REDIS_URI);

const publishLog = (log) => {
  console.log(`Publishing log: logs:${DEPLOYMENT_ID}`);
  publisher.publish(`logs:${DEPLOYMENT_ID}`, JSON.stringify({ log }));
};

const updateDeploymentStatus = async (status, isLive = false) => {
  try {
    console.log(`Updating deployment status: ${status}, isLive: ${isLive}`);
    await fetch(
      `${API_SERVER_URL}api/v1/project/deploy/${DEPLOYMENT_ID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
        body: JSON.stringify({ status }),
      }
    );
    await fetch(
      `${API_SERVER_URL}api/v1/project/isLive/${PROJECT_ID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
        body: JSON.stringify({ isLive }),
      }
    );
    console.log(`Deployment status updated to ${status}, isLive: ${isLive}`);
  } catch (error) {
    console.error("Status update failed:", error);
    publishLog(`Error updating status: ${error.message}`);
  }
};

const s3client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function createEnvFile(outdirpath) {
  const envPath = path.join(outdirpath, '.env');
  let envContent = '';
  
  publishLog("Processing environment variables");
  try {
    const envVars = JSON.parse(ENV_VARIABLES && ENV_VARIABLES.trim() ? ENV_VARIABLES : "[]");
    envVars.forEach(variable => {
      const { key, value } = variable;
      envContent += `${key}="${value}"\n`;
    });
    
    fs.writeFileSync(envPath, envContent);
    publishLog('Environment variables file created successfully.');
  } catch (error) {
    publishLog(`Error creating environment variables file: ${error.message}`);
    throw error;
  }
}

async function cloneRepo(outdirpath) {
  try {
    let cloneCommand = `git clone ${GIT_REPO_URL} ${outdirpath}`;
    if (BRANCH) {
      cloneCommand += ` --branch ${BRANCH}`;
    }
    if (SRC_DIR) {
      cloneCommand += ` --single-branch --depth 1`;
    }

    publishLog(`Cloning repository: ${cloneCommand}`);
    await execCommand(cloneCommand);

    if (SRC_DIR) {
      const srcPath = path.join(outdirpath, SRC_DIR);
      if (!fs.existsSync(srcPath)) {
        throw new Error(`Source directory not found: ${srcPath}`);
      }
      publishLog(`Moving contents from ${srcPath} to ${outdirpath}`);
      await execCommand(`mv ${srcPath}/* ${srcPath}/.* ${outdirpath} 2>/dev/null || true`);
      await execCommand(`rm -rf ${path.join(outdirpath, '.git')}`);
    }

    publishLog("Repository cloned successfully");
  } catch (error) {
    publishLog(`Error cloning repository: ${error.message}`);
    throw error;
  }
}

async function buildCode(outdirpath) {
  try {
    await cloneRepo(outdirpath);
    createEnvFile(outdirpath);

    publishLog(`Changing directory to ${outdirpath}`);
    process.chdir(outdirpath);

    publishLog(`Running install command: ${INSTALL_COMMAND}`);
    await execCommand(INSTALL_COMMAND);

    publishLog(`Running build command: ${BUILD_COMMAND}`);
    await execCommand(BUILD_COMMAND);

    console.log("Build completed successfully");
    publishLog("Build completed successfully");
    return "Built";
  } catch (error) {
    console.error("Build failed:", error);
    publishLog(`Error: ${error.message}`);
    await updateDeploymentStatus("FAILED",false);
    throw error;
  }
}

async function execCommand(command) {
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) {
      publishLog(stdout);
      console.log(stdout);
    }
    if (stderr) {
      publishLog(`Warning: ${stderr}`);
      console.warn("Warning:", stderr);
    }
  } catch (error) {
    publishLog(`Error: ${error.message}`);
    console.error("Error:", error.message);
    throw error;
  }
}

async function deployToS3(folderPath) {
  const distFolderContent = fs.readdirSync(folderPath, { recursive: true });

  for (const file of distFolderContent) {
    const filePath = path.join(folderPath, file);
    if (fs.lstatSync(filePath).isDirectory()) continue;

    publishLog(`Uploading ${file}`);
    console.log("Uploading " + filePath);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `outputs/${PROJECT_ID}/${file}`,
      Body: fs.createReadStream(filePath),
      ContentType: mimetypes.lookup(filePath),
    });

    try {
      await s3client.send(command);
    } catch (err) {
      console.error(`Error uploading ${file}: ${err}`);
      publishLog(`Error uploading ${file}: ${err}`);
      throw err;
    }
  }

  publishLog(`Deployment to S3 completed successfully`);
  console.log("Deployed to S3");
}

async function init() {
  try {
    await updateDeploymentStatus("IN_PROGRESS",false);
    console.log("Starting deployment process");
    publishLog(`Initiating deployment for project ${PROJECT_ID}`);

    const outdirpath = path.join(__dirname, "output");
    await buildCode(outdirpath);

    const distFolderPath = path.join(outdirpath, "dist");
    if (!fs.existsSync(distFolderPath)) {
      throw new Error(`Build output folder not found: ${distFolderPath}`);
    }

    publishLog("Starting S3 deployment");
    await deployToS3(distFolderPath);

    await updateDeploymentStatus("DEPLOYED", true);
    publishLog("Deployment completed successfully. Project is now live.");
  } catch (err) {
    console.error("Deployment failed:", err.toString());
    publishLog(`Deployment failed: ${err.toString()}`);
    await updateDeploymentStatus("FAILED",false);
  } finally {
    publisher.disconnect();
    process.exit(0);
  }
}

init();