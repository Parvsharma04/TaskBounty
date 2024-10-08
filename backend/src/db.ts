import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const getNextTask = async (userId: number) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth(); // Month is zero-indexed
  const currentYear = currentDate.getFullYear();

  // Count tasks completed today
  const tasksCompletedToday = await prismaClient.submission.count({
    where: {
      worker_id: userId,
      postDate: currentDay,
      postMonth: currentMonth,
      postYear: currentYear,
    },
  });
  // console.log(tasksCompletedToday)
  // Check if the worker has completed 5 tasks today
  if (tasksCompletedToday >= 5) {
    return {
      message:
        "You have completed your 5 bounties today. Come Back Tomorrow for more",
    };
  } else {
    // Fetch tasks that are not done
    const tasks = await prismaClient.task.findMany({
      where: {
        done: false,
      },
    });

    // Filter out tasks that the worker has already been assigned
    const filteredTasks = tasks.filter((task) => {
      return task.worker_id.every((val) => {
        return JSON.parse(JSON.stringify(val)).id !== userId;
      });
    });

    // Return null if there are no available tasks
    if (filteredTasks.length === 0) {
      return null;
    }

    const task = filteredTasks[0];
    let categoryDetails;
    if (task?.category === "UI_UX_Design") {
      categoryDetails = await prismaClient.uI_UX_Design.findFirst({
        where: {
          id: task.uiUxDesign_id!,
        },
      });
    } else if (task?.category === "Idea_Product") {
      categoryDetails = await prismaClient.idea_Product.findFirst({
        where: {
          id: task.ideaProduct_id!,
        },
      });
    } else if (task?.category === "Youtube_Thumbnail") {
      categoryDetails = await prismaClient.youtube_Thumbnail.findFirst({
        where: {
          id: task.youtubeThumbnail_id!,
        },
      });
    } else if (task?.category === "Miscellaneous") {
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
    if (votingDetails?.type === "Rating_Scale") {
      votingTypeDetails = await prismaClient.rating_Scale.findFirst({
        where: {
          id: votingDetails.rating_ScaleId!,
        },
      });
    } else if (votingDetails?.type === "Poll") {
      votingTypeDetails = await prismaClient.poll.findFirst({
        where: {
          id: votingDetails.pollId!,
        },
      });
    } else if (votingDetails?.type === "Upvote_Downvote") {
      votingTypeDetails = await prismaClient.upvote_Downvote.findFirst({
        where: {
          id: votingDetails.upvote_DownvoteId!,
        },
      });
    } else if (votingDetails?.type === "Emoji_Reaction") {
      votingTypeDetails = await prismaClient.emoji_Reaction.findFirst({
        where: {
          id: votingDetails.emoji_ReactionId!,
        },
      });
    }

    let votingType = votingDetails?.type;
    let id = task?.id;
    let amount = task?.amount ? parseFloat(task?.amount) / 1_000_000_000 : 0; // Fixed the division
    let category = task?.category;

    let title;
    let description;
    if (
      category === "UI_UX_Design" &&
      categoryDetails &&
      "Design_Title" in categoryDetails
    ) {
      title = categoryDetails.Design_Title;
      description = categoryDetails.Design_Description;
    } else if (
      category === "Idea_Product" &&
      categoryDetails &&
      "Idea_Title" in categoryDetails
    ) {
      title = categoryDetails.Idea_Title;
      description = categoryDetails.Idea_Description;
    } else if (
      category === "Youtube_Thumbnail" &&
      categoryDetails &&
      "Youtube_Thumbnail_Title" in categoryDetails
    ) {
      title = categoryDetails.Youtube_Thumbnail_Title;
      description = null;
    } else if (
      category === "Miscellaneous" &&
      categoryDetails &&
      "title" in categoryDetails
    ) {
      title = categoryDetails.title;
      description = categoryDetails.Description;
    }

    let options = [];
    if (
      category === "UI_UX_Design" &&
      categoryDetails &&
      "Design_Url" in categoryDetails
    ) {
      options.push({ id: 1, image_url: categoryDetails.Design_Url });
    } else if (
      category === "Idea_Product" &&
      categoryDetails &&
      "Idea_Images" in categoryDetails
    ) {
      options.push({ id: 1, image_url: categoryDetails.Idea_Images });
    } else if (
      category === "Youtube_Thumbnail" &&
      categoryDetails &&
      "Youtube_Thumbnail_Images" in categoryDetails
    ) {
      options.push({
        id: 1,
        image_url: categoryDetails.Youtube_Thumbnail_Images,
      });
    } else if (
      category === "Miscellaneous" &&
      categoryDetails &&
      ("Images" in categoryDetails || "Design_Url" in categoryDetails)
    ) {
      options.push({
        id: 1,
        image_url: "Images" in categoryDetails ? categoryDetails.Images : [],
        Design_Url: categoryDetails.Design_Url
          ? categoryDetails.Design_Url
          : [],
      });
    }

    return {
      id,
      amount,
      category,
      title,
      description,
      options,
      votingType,
      votingTypeDetails,
    };
  }
};
