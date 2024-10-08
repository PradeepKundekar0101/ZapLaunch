import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { ApiError } from "../utils/ApiError";
const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const deleteS3Folder = async (
  bucketName: string,
  folderPrefix: string
) => {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: folderPrefix,
    });
    const { Contents } = await s3Client.send(listCommand);
    if (!Contents || Contents.length === 0) {
      console.log("No objects found in the specified folder.");
      return;
    }

    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: Contents.map((object) => ({ Key: object.Key! })),
      },
    };

    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    await s3Client.send(deleteCommand);
    console.log(`Folder ${folderPrefix} and its objects deleted successfully`);
  } catch (error) {
    console.error("Error deleting S3 folder:", error);
    throw new ApiError(500, "Failed to delete S3 folder");
  }
};
