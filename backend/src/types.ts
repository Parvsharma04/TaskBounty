import z from "zod";

export const createTaskInput = z.object({
  category: z.string(),
  title: z.string(),
  signature: z.string(),
  postDate: z.number(),
  postMonth: z.number(),
  postYear: z.number(),
  url: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  votingType: z.string().optional(),
  votingCustomOptionsArr: z.array(z.string()).optional(),
});

export const createSubmissionInput = z.object({
  taskId: z.number(),
  amount: z.string(),
  optionId: z.number(),
  voteOptionId: z.number(),
  postDate: z.number(),
  postMonth: z.number(),
  postYear: z.number(),
});
