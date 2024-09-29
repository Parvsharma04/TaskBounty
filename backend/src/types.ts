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
  fiveStar: z.string().optional(),
  fourStar: z.string().optional(),
  threeStar: z.string().optional(),
  twoStar: z.string().optional(),
  oneStar: z.string().optional(),
  option1: z.string().optional(),
  option2: z.string().optional(),
  option3: z.string().optional(),
  option4: z.string().optional(),
  upvote: z.string().optional(),
  downvote: z.string().optional(),
  emoji1: z.string().optional(),
  emoji2: z.string().optional(),
  emoji3: z.string().optional(),
  emoji4: z.string().optional(),
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
