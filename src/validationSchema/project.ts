import { z } from "zod";
const GitUrlRegex =
  /^(?:git|https?|git@)(:\/\/|:\/\/(?:[^@\/\n]+@)?)([\w.-]+)(?::|\/)([^\/\n]+\/[^\/\n]+)(?:\.git)?$/;

export const projectSchema = z.object({
  projectName: z
    .string({
      required_error: "Project Name is requried",
    })
    .trim()
    .min(6, "Project Name must be atleast 6 character")
    .max(100, "Project Name must not exceed 100 character"),
  gitUrl: z
    .string({
      required_error: "Git Hub URL is required",
    })
    .trim()
    .regex(GitUrlRegex, {message:"Invalid github url"}),

});
