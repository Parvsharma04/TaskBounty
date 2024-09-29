import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const getNextTask = async (userId: number) => {
  const tasks = await prismaClient.task.findMany({
    where: {
      done: false,
    },
  });
  const filteredTasks = tasks.filter((task) => {
    return task.worker_id.every((val) => {
      return JSON.parse(JSON.stringify(val)).id !== userId;
    });
  });

  const task = filteredTasks[0];

  let categoryDetails;
  if (task?.category == "UI_UX_Design") {
    categoryDetails = await prismaClient.uI_UX_Design.findFirst({
      where: {
        id: task.uiUxDesign_id!,
      },
    });
  } else if (task?.category == "Idea_Product") {
    categoryDetails = await prismaClient.idea_Product.findFirst({
      where: {
        id: task.ideaProduct_id!,
      },
    });
  } else if (task?.category == "Youtube_Thumbnail") {
    categoryDetails = await prismaClient.youtube_Thumbnail.findFirst({
      where: {
        id: task.youtubeThumbnail_id!,
      },
    });
  } else if (task?.category == "Miscellaneous") {
    categoryDetails = await prismaClient.miscellaneous.findFirst({
      where: {
        id: task.miscellaneous_id!,
      },
    });
  }

  if (!task?.Voting_Type_id) {
    return null;
  }

  let votingDetails = await prismaClient.voting_Type.findFirst({
    where: {
      id: task?.Voting_Type_id!,
    },
  });

  let votingTypeDetails;
  if (votingDetails?.type == "Rating_Scale") {
    votingTypeDetails = await prismaClient.rating_Scale.findFirst({
      where: {
        id: votingDetails.rating_ScaleId!,
      },
    });
  } else if (votingDetails?.type == "Multiple_Choice_Poll") {
    votingTypeDetails = await prismaClient.poll.findFirst({
      where: {
        id: votingDetails.pollId!,
      },
    });
  } else if (votingDetails?.type == "Upvote_Downvote") {
    votingTypeDetails = await prismaClient.upvote_Downvote.findFirst({
      where: {
        id: votingDetails.upvote_DownvoteId!,
      },
    });
  } else if (votingDetails?.type == "Emoji_Reaction_Vote") {
    votingTypeDetails = await prismaClient.emoji_Reaction.findFirst({
      where: {
        id: votingDetails.emoji_ReactionId!,
      },
    });
  }

  let votingType = votingDetails?.type;

  let id = task?.id;
  let amount = task?.amount ? parseFloat(task?.amount) / 1000_000_000 : 0;
  let category = task?.category;

  let title;
  if (
    category == "UI_UX_Design" &&
    categoryDetails &&
    "Design_Title" in categoryDetails
  ) {
    title = categoryDetails.Design_Title;
  } else if (
    category == "Idea_Product" &&
    categoryDetails &&
    "Idea_Title" in categoryDetails
  ) {
    title = categoryDetails.Idea_Title;
  } else if (
    category == "Youtube_Thumbnail" &&
    categoryDetails &&
    "Youtube_Thumbnail_Title" in categoryDetails
  ) {
    title = categoryDetails.Youtube_Thumbnail_Title;
  } else if (
    category == "Miscellaneous" &&
    categoryDetails &&
    "title" in categoryDetails
  ) {
    title = categoryDetails.title;
  }

  let options = [];
  if (
    category == "UI_UX_Design" &&
    categoryDetails &&
    "Design_Url" in categoryDetails
  ) {
    options.push({ id: 1, image_url: categoryDetails.Design_Url });
  } else if (
    category == "Idea_Product" &&
    categoryDetails &&
    "Idea_Images" in categoryDetails
  ) {
    options.push({ id: 1, image_url: categoryDetails.Idea_Images });
  } else if (
    category == "Youtube_Thumbnail" &&
    categoryDetails &&
    "Youtube_Thumbnail_Images" in categoryDetails
  ) {
    options.push({
      id: 1,
      image_url: categoryDetails.Youtube_Thumbnail_Images,
    });
  } else if (
    category == "Miscellaneous" &&
    categoryDetails &&
    ("Images" in categoryDetails || "Design_Url" in categoryDetails)
  ) {
    options.push({
      id: 1,
      image_url: "Images" in categoryDetails ? categoryDetails.Images : [],
      Design_Url: categoryDetails.Design_Url ? categoryDetails.Design_Url : [],
    });
  }

  return {
    id,
    amount,
    category,
    title,
    options,
    votingType,
    votingTypeDetails,
  };
};
