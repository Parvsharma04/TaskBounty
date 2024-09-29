import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { Category, PrismaClient } from "@prisma/client";
import { Connection, PublicKey } from "@solana/web3.js";
import "dotenv/config";
import { Router } from "express";
import jwt from "jsonwebtoken";
import nacl from "tweetnacl";
import { authMiddleware } from "../middlewares/middleware";
import { createTaskInput } from "../types";

const router = Router();
const prismaClient = new PrismaClient();
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_REGION as string,
});
const DEFAULT_TITLE = "Select the most clickable thumbnail";
const connection = new Connection(
  "https://solana-devnet.g.alchemy.com/v2/0scTmkMbVkTEeLPVGwcn3BDnxCxidQTt" ??
    ""
);

router.get("/task", authMiddleware, async (req, res) => {
  // @ts-ignore
  const taskId: string = req.query.taskId;
  // @ts-ignore
  const userId: string = req.userId;

  const taskDetails = await prismaClient.task.findFirst({
    where: {
      user_id: Number(userId),
      id: Number(taskId),
    },
  });
  if (!taskDetails) {
    return res.status(411).json({
      message: "You dont have access to this task",
    });
  }

  let categoryDetails;
  let category = taskDetails?.category;
  if (category == Category.UI_UX_Design) {
    if (!taskDetails?.uiUxDesign_id) {
      return res.status(411).json({
        message: "You dont have access to this task",
      });
    }
    categoryDetails = await prismaClient.uI_UX_Design.findFirst({
      where: {
        id: taskDetails?.uiUxDesign_id,
      },
    });
  } else if (category == Category.Idea_Product) {
    if (!taskDetails?.ideaProduct_id) {
      return res.status(411).json({
        message: "You dont have access to this task",
      });
    }
    categoryDetails = await prismaClient.idea_Product.findFirst({
      where: {
        id: taskDetails?.ideaProduct_id,
      },
    });
  } else if (category == Category.Youtube_Thumbnail) {
    if (!taskDetails?.youtubeThumbnail_id) {
      return res.status(411).json({
        message: "You dont have access to this task",
      });
    }
    categoryDetails = await prismaClient.youtube_Thumbnail.findFirst({
      where: {
        id: taskDetails?.youtubeThumbnail_id,
      },
    });
  } else if (category == Category.Miscellaneous) {
    if (!taskDetails?.miscellaneous_id) {
      return res.status(411).json({
        message: "You dont have access to this task",
      });
    }
    categoryDetails = await prismaClient.miscellaneous.findFirst({
      where: {
        id: taskDetails?.miscellaneous_id,
      },
    });
  }

  if (taskDetails.Voting_Type_id === null) {
    return res.status(411).json({
      message: "Voting type not found",
    });
  }

  let votingDetails;
  let votingTypeDetails;
  votingDetails = await prismaClient.voting_Type.findFirst({
    where: {
      id: taskDetails?.Voting_Type_id,
    },
  });

  if (!votingDetails) {
    return res.status(411).json({
      message: "Voting type not found",
    });
  }

  if (votingDetails.type === "Rating_Scale") {
    if (votingDetails.rating_ScaleId === null) {
      return res.status(411).json({
        message: "Rating scale not found",
      });
    }

    const ratingScale = await prismaClient.rating_Scale.findFirst({
      where: {
        id: votingDetails.rating_ScaleId,
      },
    });

    if (!ratingScale) {
      return res.status(411).json({
        message: "Rating scale not found",
      });
    }

    votingTypeDetails = ratingScale;
  } else if (votingDetails.type === "Multiple_Choice_Poll") {
    if (votingDetails.pollId === null) {
      return res.status(411).json({
        message: "Poll not found",
      });
    }

    const poll = await prismaClient.poll.findFirst({
      where: {
        id: votingDetails.pollId,
      },
    });

    if (!poll) {
      return res.status(411).json({
        message: "Poll not found",
      });
    }

    votingTypeDetails = poll;
  } else if (votingDetails.type === "Upvote_Downvote") {
    if (votingDetails.upvote_DownvoteId === null) {
      return res.status(411).json({
        message: "Upvote downvote not found",
      });
    }

    const upvoteDownvote = await prismaClient.upvote_Downvote.findFirst({
      where: {
        id: votingDetails.upvote_DownvoteId,
      },
    });

    if (!upvoteDownvote) {
      return res.status(411).json({
        message: "Upvote downvote not found",
      });
    }

    votingTypeDetails = upvoteDownvote;
  } else if (votingDetails.type === "Emoji_Reaction_Vote") {
    if (votingDetails.emoji_ReactionId === null) {
      return res.status(411).json({
        message: "Emoji reaction not found",
      });
    }

    const emojiReaction = await prismaClient.emoji_Reaction.findFirst({
      where: {
        id: votingDetails.emoji_ReactionId,
      },
    });

    if (!emojiReaction) {
      return res.status(411).json({
        message: "Emoji reaction not found",
      });
    }

    votingTypeDetails = emojiReaction;
  } else {
    return res.status(411).json({
      message: "Voting type not found",
    });
  }

  // Todo: Can u make this faster?
  const responses = await prismaClient.submission.findMany({
    where: {
      task_id: Number(taskId),
    },
  });

  // console.log(responses, taskDetails);

  res.json({
    taskDetails,
    categoryDetails,
    votingDetails,
    votingTypeDetails,
    responses,
  });
});
router.get("/getAllTask", authMiddleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;

  const tasksDetails = await prismaClient.task.findMany({
    where: {
      user_id: Number(userId),
    },
  });

  if (!tasksDetails) {
    return res.status(411).json({
      message: "You dont have access to this task",
    });
  }

  res.json({
    tasksDetails,
    message: "All tasks fetched successfully",
  });
});
router.post("/task", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const body = req.body;

  // Validate inputs using zod schema
  const parseData = createTaskInput.safeParse(body);
  if (!parseData.success) {
    return res.status(411).json({
      message: "Invalid input data",
    });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(411).json({
      message: "User not found",
    });
  }

  console.log("dummy delay for 10 sec active");
  //! add dummy delay for 10 sec
  setTimeout(async () => {
    const transaction = await connection.getTransaction(
      parseData.data.signature,
      {
        maxSupportedTransactionVersion: 1,
      }
    );

    if (!transaction) {
      return res.status(411).json({
        message: "Transaction not found",
      });
    }

    const amountTransferred = (
      (transaction.meta?.postBalances[1] ?? 0) -
      (transaction.meta?.preBalances[1] ?? 0)
    ).toString();

    // console.log(transaction.transaction.message.getAccountKeys());

    const recipientAddress = transaction.transaction.message
      .getAccountKeys()
      .get(1)
      ?.toString();
    const senderAddress = transaction.transaction.message
      .getAccountKeys()
      .get(0)
      ?.toString();

    // if (recipientAddress !== PARENT_WALLET_ADDRESS) {
    //   return res.status(411).json({
    //     message: "Transaction sent to the wrong address",
    //   });
    // }

    // console.log(senderAddress, user.address);
    // if (senderAddress !== user.address) {
    //   return res.status(411).json({
    //     message: "Transaction sent from the wrong address",
    //   });
    // }

    try {
      const response = await prismaClient.$transaction(
        async (tx) => {
          let category: Category = parseData.data.category as Category;

          async function voting_type_generator(parseData: any) {
            if (parseData.data.votingType === "Rating_Scale") {
              const rating_scale_model = await tx.rating_Scale.create({
                data: {
                  Five_Star: parseData.data.fiveStar,
                  Four_Star: parseData.data.fourStar,
                  Three_Star: parseData.data.threeStar,
                  Two_Star: parseData.data.twoStar,
                  One_Star: parseData.data.oneStar,
                },
              });

              const votingModel = await tx.voting_Type.create({
                data: {
                  rating_ScaleId: rating_scale_model.id,
                  type: parseData.data.votingType,
                },
              });

              return votingModel;
            } else if (parseData.data.votingType === "Multiple_Choice_Poll") {
              const multiple_choice_poll_model = await tx.poll.create({
                data: {
                  option1: parseData.data.option1,
                  option2: parseData.data.option2,
                  option3: parseData.data.option3,
                  option4: parseData.data.option4,
                },
              });

              const votingModel = await tx.voting_Type.create({
                data: {
                  pollId: multiple_choice_poll_model.id,
                  type: parseData.data.votingType,
                },
              });

              return votingModel;
            } else if (parseData.data.votingType === "Upvote_Downvote") {
              const upvote_downvote_model = await tx.upvote_Downvote.create({
                data: {
                  Upvote: parseData.data.upvote,
                  Downvote: parseData.data.downvote,
                },
              });

              const votingModel = await tx.voting_Type.create({
                data: {
                  upvote_DownvoteId: upvote_downvote_model.id,
                  type: parseData.data.votingType,
                },
              });

              return votingModel;
            } else if (parseData.data.votingType === "Emoji_Reaction_Vote") {
              const emoji_reaction_vote_model = await tx.emoji_Reaction.create({
                data: {
                  Emoji_1: parseData.data.emoji1,
                  Emoji_2: parseData.data.emoji2,
                  Emoji_3: parseData.data.emoji3,
                  Emoji_4: parseData.data.emoji4,
                },
              });

              const votingModel = await tx.voting_Type.create({
                data: {
                  emoji_ReactionId: emoji_reaction_vote_model.id,
                  type: parseData.data.votingType,
                },
              });

              return votingModel;
            } else {
              return null;
            }
          }

          let categoryModel:
            | {
                id: number;
                Design_Title: string;
                Design_Description: string | null;
                Design_Url: string[];
                Voting_Type: String;
              }
            | {
                id: number;
                Idea_Title: string;
                Idea_Description: string | null;
                Idea_Images: string[] | null;
                Voting_Type: String;
              }
            | {
                id: number;
                Youtube_Thumbnail_Title: String;
                Youtube_Thumbnail_Images: string[];
                Voting_Type: String;
              }
            | {
                id: number;
                title: string;
                Images: string[];
                Description: string;
                Design_Url: string[];
                Voting_Type: String;
              };
          if (category == Category.UI_UX_Design) {
            categoryModel = await tx.uI_UX_Design.create({
              data: {
                Design_Title: parseData.data.title,
                Design_Url: parseData.data.url ?? [],
                Design_Description: parseData.data.description ?? "",
                Voting_Type: parseData.data.votingType ?? "Rating_Scale",
              },
            });

            const votingModel = await voting_type_generator(parseData);

            if (votingModel === null) {
              return "Invalid voting type";
            }

            const task = await tx.task.create({
              data: {
                category: category,
                amount: amountTransferred,
                signature: parseData.data.signature,
                user_id: userId,
                postDate: body.postDate,
                postMonth: body.postMonth,
                postYear: body.postYear,
                uiUxDesign_id: categoryModel.id,
                Voting_Type_id: votingModel.id,
              },
            });

            return task;
          } else if (category == Category.Idea_Product) {
            categoryModel = await tx.idea_Product.create({
              data: {
                Idea_Title: parseData.data.title,
                Idea_Description: parseData.data.description ?? "",
                Idea_Images: parseData.data.images ?? [],
                Voting_Type: parseData.data.votingType ?? "Rating_Scale",
              },
            });

            await parseData.data.images?.map((image: string) => {
              return tx.option.create({
                data: {
                  image_url: image ?? "",
                  Idea_Product_id: categoryModel.id,
                },
              });
            });

            const votingModel = await voting_type_generator(parseData);

            if (votingModel === null) {
              return "Invalid voting type";
            }

            const task = await tx.task.create({
              data: {
                category: category,
                amount: amountTransferred,
                signature: parseData.data.signature,
                user_id: userId,
                postDate: body.postDate,
                postMonth: body.postMonth,
                postYear: body.postYear,
                ideaProduct_id: categoryModel.id,
                Voting_Type_id: votingModel.id,
              },
            });

            return task;
          } else if (category == Category.Youtube_Thumbnail) {
            categoryModel = await tx.youtube_Thumbnail.create({
              data: {
                Youtube_Thumbnail_Title: parseData.data.title,
                Youtube_Thumbnail_Images: parseData.data.images ?? [],
                Voting_Type: parseData.data.votingType ?? "Rating_Scale",
              },
            });

            await Promise.all(
              (parseData.data.images ?? []).map(async (image: string) => {
                await tx.option.create({
                  data: {
                    image_url: image ?? "",
                    Youtube_Thumbnail_id: categoryModel.id,
                  },
                });
              })
            );

            const votingModel = await voting_type_generator(parseData);

            if (votingModel === null) {
              return "Invalid voting type";
            }

            const task = await tx.task.create({
              data: {
                category: category,
                amount: amountTransferred,
                signature: parseData.data.signature,
                user_id: userId,
                postDate: body.postDate,
                postMonth: body.postMonth,
                postYear: body.postYear,
                youtubeThumbnail_id: categoryModel.id,
                Voting_Type_id: votingModel.id,
              },
            });

            return task;
          } else if (category == Category.Miscellaneous) {
            categoryModel = await tx.miscellaneous.create({
              data: {
                title: parseData.data.title,
                Images: parseData.data.images ?? [],
                Description: parseData.data.description ?? "",
                Design_Url: parseData.data.url ?? [],
                Voting_Type: parseData.data.votingType ?? "Rating_Scale",
              },
            });
            await Promise.all(
              (parseData.data.images ?? []).map(async (image: string) => {
                await tx.option.create({
                  data: {
                    image_url: image ?? "",
                    Miscellaneous_id: categoryModel.id,
                  },
                });
              })
            );
            await Promise.all(
              (parseData.data.url ?? []).map(async (urlString: string) => {
                await tx.option.create({
                  data: {
                    website_url: urlString ?? "",
                    Miscellaneous_id: categoryModel.id,
                  },
                });
              })
            );

            const votingModel = await voting_type_generator(parseData);

            if (votingModel === null) {
              return "Invalid voting type";
            }

            const task = await tx.task.create({
              data: {
                category: category,
                amount: amountTransferred,
                signature: parseData.data.signature,
                user_id: userId,
                postDate: body.postDate,
                postMonth: body.postMonth,
                postYear: body.postYear,
                miscellaneous_id: categoryModel.id,
                Voting_Type_id: votingModel.id,
              },
            });
            return task;
          }
        },
        {
          maxWait: 5000,
          timeout: 10000,
        }
      );

      if (response === "Invalid voting type") {
        return res.status(411).json({
          message: "Invalid voting type",
        });
      }
      res.json({
        id: response?.id ?? -1,
      });
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }, 10000);
});
router.get("/presignedUrl", authMiddleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: `fiver/${userId}/${Math.random()}/image.jpg`,
    Conditions: [
      ["content-length-range", 0, 5 * 1024 * 1024], // 5 MB max
    ],
    Expires: 3600,
  });

  res.json({
    preSignedUrl: url,
    fields,
  });
});
router.post("/transactions", authMiddleware, async (req, res) => {
  //@ts-ignore
  const id = req.userId;

  const transaction = await prismaClient.task.findMany({
    where: {
      user_id: Number(id),
    },
  });

  res.json({
    transaction,
  });
});

//! sigining with wallet
router.post("/signin", async (req, res) => {
  const { publicKey, signature } = req.body;
  const message = new TextEncoder().encode(
    "Wallet confirmation 🌓🚀\n\nI have read and agreed to the Terms and Conditions.\n\nNo amount will be charged."
  );
  const signedString =
    "Wallet confirmation 🌓🚀\n\nI have read and agreed to the Terms and Conditions.\n\nNo amount will be charged.";

  const result = nacl.sign.detached.verify(
    message,
    new Uint8Array(signature.data),
    new PublicKey(publicKey).toBytes()
  );

  // console.log(result);

  const existingUser = await prismaClient.user.findFirst({
    where: {
      address: publicKey,
    },
  });

  if (existingUser) {
    const token = jwt.sign(
      {
        userId: existingUser.id,
      },
      process.env.JWT_SECRET as string
    );
    res.json({ token });
  } else {
    const user = await prismaClient.user.create({
      data: {
        address: publicKey,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET as string
    );

    res.json({ token });
  }
});

export default router;
