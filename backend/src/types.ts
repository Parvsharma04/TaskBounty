import z from "zod";

export const createTaskInput = z.object({
  category: z.string(),
  title: z.string(),
  url: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  votingType: z.string().optional(),
  signature: z.string(),
  postDate: z.number(),
  postMonth: z.number(),
  postYear: z.number(),
  // .min(2),
});

export const createSubmissionInput = z.object({
  taskId: z.string(),
  selection: z.string(),
});
