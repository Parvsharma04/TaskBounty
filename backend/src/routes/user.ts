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
// INITIALIZING PRISMA CLIENT
const prismaClient = new PrismaClient();
// INITIALIZING S3 CLIENT
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_REGION as string,
});
// RPC SERVER
const connection = new Connection(
  "https://solana-devnet.g.alchemy.com/v2/0scTmkMbVkTEeLPVGwcn3BDnxCxidQTt"
);

router.get("/task", authMiddleware, async (req, res) => {
  // @ts-ignore
  const taskId: string = req.query.taskId;
  // @ts-ignore
  const userId: string = req.userId;

  try {
    const taskDetails = await prismaClient.task.findFirst({
      where: {
        user_id: Number(userId),
        id: Number(taskId),
      },
      select: {
        id: true,
        category: true,
        amount: true,
        status: true,
        postDate: true,
        postMonth: true,
        postYear: true,
        done: true,
        uiUxDesign_id: true,
        ideaProduct_id: true,
        youtubeThumbnail_id: true,
        miscellaneous_id: true,
        Voting_Type_id: true,
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
        select: {
          Five_Star: true,
          Four_Star: true,
          Three_Star: true,
          Two_Star: true,
          One_Star: true,
        },
      });

      if (!ratingScale) {
        return res.status(411).json({
          message: "Rating scale not found",
        });
      }

      votingTypeDetails = ratingScale;
    } else if (votingDetails.type === "Poll") {
      if (votingDetails.pollId === null) {
        return res.status(411).json({
          message: "Poll not found",
        });
      }

      const poll = await prismaClient.poll.findFirst({
        where: {
          id: votingDetails.pollId,
        },
        select: {
          option1: true,
          option2: true,
          option3: true,
          option4: true,
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
        select: {
          Upvote: true,
          Downvote: true,
        },
      });

      if (!upvoteDownvote) {
        return res.status(411).json({
          message: "Upvote downvote not found",
        });
      }

      votingTypeDetails = upvoteDownvote;
    } else if (votingDetails.type === "Emoji_Reaction") {
      if (votingDetails.emoji_ReactionId === null) {
        return res.status(411).json({
          message: "Emoji reaction not found",
        });
      }

      const emojiReaction = await prismaClient.emoji_Reaction.findFirst({
        where: {
          id: votingDetails.emoji_ReactionId,
        },
        select: {
          Emoji_1: true,
          Emoji_2: true,
          Emoji_3: true,
          Emoji_4: true,
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

    // // Todo: Can u make this faster?
    // const responses = await prismaClient.submission.findMany({
    //   where: {
    //     task_id: Number(taskId),
    //   },
    // });
    res.json({
      taskDetails,
      categoryDetails,
      votingDetails,
      votingTypeDetails,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
router.get("/getAllTask", authMiddleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  try {
    let resTasksDetails: any = [];
    const tasksDetails = await prismaClient.task.findMany({
      where: {
        user_id: Number(userId),
      },
    });
    if (!tasksDetails || tasksDetails.length === 0) {
      return res.status(411).json({
        message: "You don't have access to this task",
      });
    }

    // Use Promise.all to wait for all asynchronous operations to finish
    await Promise.all(
      tasksDetails.map(async (task: any) => {
        let categoryDetails;
        let title = "No Title";
        let category = task.category;

        if (category === Category.UI_UX_Design) {
          if (!task.uiUxDesign_id) {
            throw new Error("You don't have access to this task");
          }
          categoryDetails = await prismaClient.uI_UX_Design.findFirst({
            where: { id: task.uiUxDesign_id },
          });
          title = categoryDetails?.Design_Title ?? "No Title";
        } else if (category === Category.Idea_Product) {
          if (!task.ideaProduct_id) {
            throw new Error("You don't have access to this task");
          }
          categoryDetails = await prismaClient.idea_Product.findFirst({
            where: { id: task.ideaProduct_id },
          });
          title = categoryDetails?.Idea_Title ?? "No Title";
        } else if (category === Category.Youtube_Thumbnail) {
          if (!task.youtubeThumbnail_id) {
            throw new Error("You don't have access to this task");
          }
          categoryDetails = await prismaClient.youtube_Thumbnail.findFirst({
            where: { id: task.youtubeThumbnail_id },
          });
          title = categoryDetails?.Youtube_Thumbnail_Title ?? "No Title";
        } else if (category === Category.Miscellaneous) {
          if (!task.miscellaneous_id) {
            throw new Error("You don't have access to this task");
          }
          categoryDetails = await prismaClient.miscellaneous.findFirst({
            where: { id: task.miscellaneous_id },
          });
          title = categoryDetails?.title ?? "No Title";
        }

        // Push task details to resTasksDetails array
        resTasksDetails.push({
          id: task.id,
          title: title,
          category: task.category,
          amount: task.amount,
          postDate: task.postDate,
          postMonth: task.postMonth,
          postYear: task.postYear,
          done: task.done,
        });
      })
    );

    res.json({
      tasksDetails: resTasksDetails,
      message: "All tasks fetched successfully",
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/task", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const body = req.body;
  try {
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
      try {
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

        // console.log(recipientAddress, senderAddress);

        if (recipientAddress !== process.env.PARENT_WALLET_ADDRESS) {
          return res.status(411).json({
            message: "Transaction sent to the wrong address",
          });
        }

        // console.log(senderAddress, user.address);

        if (senderAddress !== user.address) {
          return res.status(411).json({
            message: "Transaction sent from the wrong address",
          });
        }

        const response = await prismaClient.$transaction(
          async (tx) => {
            let category: Category = parseData.data.category as Category;

            async function voting_type_generator(parseData: any) {
              if (parseData.data.votingType === "Rating_Scale") {
                const rating_scale_model = await tx.rating_Scale.create({
                  data: {
                    Five_Star:
                      parseData.data.votingCustomOptionsArr[0] ?? "⭐⭐⭐⭐⭐",
                    Four_Star:
                      parseData.data.votingCustomOptionsArr[1] ?? "⭐⭐⭐⭐",
                    Three_Star:
                      parseData.data.votingCustomOptionsArr[2] ?? "⭐⭐⭐",
                    Two_Star:
                      parseData.data.votingCustomOptionsArr[3] ?? "⭐⭐",
                    One_Star: parseData.data.votingCustomOptionsArr[4] ?? "⭐",
                  },
                });

                const votingModel = await tx.voting_Type.create({
                  data: {
                    rating_ScaleId: rating_scale_model.id,
                    type: parseData.data.votingType,
                  },
                });

                return votingModel;
              } else if (parseData.data.votingType === "Poll") {
                const multiple_choice_poll_model = await tx.poll.create({
                  data: {
                    option1:
                      parseData.data.votingCustomOptionsArr[0] ?? "Awesome",
                    option2: parseData.data.votingCustomOptionsArr[1] ?? "Good",
                    option3: parseData.data.votingCustomOptionsArr[2] ?? "Bad",
                    option4:
                      parseData.data.votingCustomOptionsArr[3] ?? "Worst",
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
                    Upvote: parseData.data.votingCustomOptionsArr[0] ?? "👍",
                    Downvote: parseData.data.votingCustomOptionsArr[1] ?? "👎",
                  },
                });

                const votingModel = await tx.voting_Type.create({
                  data: {
                    upvote_DownvoteId: upvote_downvote_model.id,
                    type: parseData.data.votingType,
                  },
                });

                return votingModel;
              } else if (parseData.data.votingType === "Emoji_Reaction") {
                const emoji_reaction_vote_model =
                  await tx.emoji_Reaction.create({
                    data: {
                      Emoji_1: parseData.data.votingCustomOptionsArr[0] ?? "😍",
                      Emoji_2: parseData.data.votingCustomOptionsArr[1] ?? "😂",
                      Emoji_3: parseData.data.votingCustomOptionsArr[2] ?? "😲",
                      Emoji_4: parseData.data.votingCustomOptionsArr[3] ?? "😡",
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
                  status: true,
                  done: false,
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
                  status: true,
                  done: false,
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
                  status: true,
                  done: false,
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
                  status: true,
                  done: false,
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
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/presignedUrl", authMiddleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  try {
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: `taskbounty/${userId}/${Math.random()}/image.jpg`,
      Conditions: [
        ["content-length-range", 0, 5 * 1024 * 1024], // 5 MB max
      ],
      Expires: 3600,
    });

    res.json({
      preSignedUrl: url,
      fields,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/transactions", authMiddleware, async (req, res) => {
  //@ts-ignore
  const id = req.userId;
  try {
    const transaction = await prismaClient.task.findMany({
      where: {
        user_id: Number(id),
      },
      select: {
        amount: true,
        category: true,
        done: true,
        status: true,
        id: true,
        postDate: true,
        postMonth: true,
        postYear: true,
      },
    });

    res.json({
      transaction,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

//! sigining with wallet
router.post("/signin", async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
