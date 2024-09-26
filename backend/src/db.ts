import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const getNextTask = async (userId: number) => {
  const task = await prismaClient.task.findFirst({
    where: {
      done: false,
      submissions: {
        none: {
          worker_id: userId,
        },
      },
    },
    select: {
      id: true,
      amount: true,
      category: true,
      signature: true,
      postDate: true,
      postMonth: true,
      postYear: true,
      uiUxDesign: {
        select: {
          id: true,
          Design_Title: true,
          Design_Description: true,
          Design_Url: true,
        },
      },
      ideaProduct: {
        select: {
          id: true,
          Idea_Title: true,
          Idea_Description: true,
          Idea_Images: true,
          Voting_Type: {
            select: {
              id: true,
              type: true,
            },
          },
          Option: {
            select: {
              id: true,
              image_url: true,
              website_url: true,
            },
          },
        },
      },
      youtubeThumbnail: {
        select: {
          id: true,
          Youtube_Thumbnail_Title: true,
          Youtube_Thumbnail_Images: true,
          Option: {
            select: {
              id: true,
              image_url: true,
              website_url: true,
            },
          },
        },
      },
      miscellaneous: {
        select: {
          id: true,
          title: true,
          Description: true,
          Images: true,
          Design_Url: true,
          Voting_Type: {
            select: {
              id: true,
              type: true,
            },
          },
          Option: {
            select: {
              id: true,
              image_url: true,
              website_url: true,
            },
          },
        },
      },
    },
  });

  // Determine the correct title and options based on the category
  let taskTitle = "";
  let options: any[] = [];
  if (task) {
    switch (task.category) {
      case "UI_UX_Design":
        taskTitle = task.uiUxDesign?.Design_Title || "";
        options = []; // UI/UX Design might not have options
        break;
      case "Idea_Product":
        taskTitle = task.ideaProduct?.Idea_Title || "";
        options = task.ideaProduct?.Option || [];
        break;
      case "Youtube_Thumbnail":
        taskTitle = task.youtubeThumbnail?.Youtube_Thumbnail_Title || "";
        options = task.youtubeThumbnail?.Option || [];
        break;
      case "Miscellaneous":
        taskTitle = task.miscellaneous?.title || "";
        options = task.miscellaneous?.Option || [];
        break;
      default:
        taskTitle = "";
    }
  }

  return {
    id: task?.id,
    amount: task?.amount,
    category: task?.category,
    signature: task?.signature,
    postDate: task?.postDate,
    postMonth: task?.postMonth,
    postYear: task?.postYear,
    title: taskTitle,
    options: options.map((option) => ({
      id: option.id,
      image_url: option.image_url,
      website_url: option.website_url,
    })),
    uiUxDesign: task?.uiUxDesign,
    ideaProduct: task?.ideaProduct,
    youtubeThumbnail: task?.youtubeThumbnail,
    miscellaneous: task?.miscellaneous,
  };
};
