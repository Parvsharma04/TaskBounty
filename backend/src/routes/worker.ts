import { PrismaClient, TxnStatus } from "@prisma/client";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { config } from "dotenv";
import { Router } from "express";
import jwt from "jsonwebtoken";
import nacl from "tweetnacl";
import { getNextTask } from "../db";
import { workerMiddleware } from "../middlewares/middleware";
import { createSubmissionInput } from "../types";

const router = Router();
const prismaClient = new PrismaClient();
const TASK_SUBMISSION_AMT = 0.0002;
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
config();

router.get("/nextTask", workerMiddleware, async (req, res) => {
  try {
    // @ts-ignore
    const userId: string = req.userId;

    const task = await getNextTask(Number(userId));

    if (task?.message) {
      res.status(423).json({ message: task.message });
    } else if (!task) {
      res.status(404).json({
        message: "No more tasks left for you to review",
      });
    } else {
      // If a task is found, return it in the response
      res.json({
        task,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/submission", workerMiddleware, async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const body = req.body;
    const parsedBody = createSubmissionInput.safeParse(body);

    // validating the request body
    if (parsedBody.success) {
      const task = await getNextTask(Number(userId));
      if (!task || task?.id !== Number(parsedBody.data.taskId)) {
        return res.status(411).json({
          message: "Incorrect task id",
        });
      }

      const taskmodel = await prismaClient.task.findFirst({
        where: {
          id: Number(parsedBody.data.taskId),
        },
      });

      if (!taskmodel) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      // Check for existing submission
      const existingSubmission = await prismaClient.submission.findUnique({
        where: {
          worker_id_task_id: {
            worker_id: Number(userId),
            task_id: Number(parsedBody.data.taskId),
          },
        },
      });

      if (existingSubmission) {
        return res.status(409).json({
          message: "You have already submitted this task.",
        });
      }

      const taskCategory = taskmodel?.category;
      let categoryModel: any;

      if (taskCategory === "UI_UX_Design") {
        categoryModel = await prismaClient.uI_UX_Design.findFirst({
          where: {
            id: taskmodel?.uiUxDesign_id!,
          },
        });
      } else if (taskCategory === "Idea_Product") {
        categoryModel = await prismaClient.idea_Product.findFirst({
          where: {
            id: taskmodel?.ideaProduct_id!,
          },
        });
      } else if (taskCategory === "Youtube_Thumbnail") {
        categoryModel = await prismaClient.youtube_Thumbnail.findFirst({
          where: {
            id: taskmodel?.youtubeThumbnail_id!,
          },
        });
      } else if (taskCategory === "Miscellaneous") {
        categoryModel = await prismaClient.miscellaneous.findFirst({
          where: {
            id: taskmodel?.miscellaneous_id!,
          },
        });
      }

      const worker = await prismaClient.worker.findFirst({
        where: {
          id: Number(userId),
        },
      });
      if (!worker) {
        return res.status(403).json({
          message: "Worker not found",
        });
      }

      const amount = TASK_SUBMISSION_AMT.toString();
      try {
        console.log("Creating submission");
        const submission = await prismaClient.$transaction(async (tx) => {
          const submission = await tx.submission.create({
            data: {
              worker_id: Number(userId),
              task_id: parsedBody.data.taskId,
              amount: amount,
              postDate: parsedBody.data.postDate,
              postMonth: parsedBody.data.postMonth,
              postYear: parsedBody.data.postYear,
            },
          });

          // Update task
          console.log("Updating task");

          await tx.task.update({
            where: {
              id: Number(parsedBody.data.taskId),
            },
            data: {
              worker_id: Array.isArray(taskmodel?.worker_id)
                ? [...(taskmodel.worker_id as any[]), { id: userId }]
                : [{ id: userId }],
            },
          });
          const task = await tx.task.findFirst({
            where: {
              id: Number(parsedBody.data.taskId),
            },
          });
          // Check if task votes are complete
          console.log("Checking if task votes are complete");
          let totalVotes =
            parseFloat(task?.amount ?? "0") /
            1000_000_000 /
            TASK_SUBMISSION_AMT;
          if (task?.worker_id.length === totalVotes) {
            await tx.task.update({
              where: {
                id: Number(parsedBody.data.taskId),
              },
              data: {
                done: true,
              },
            });
          }

          // Update category
          console.log("Updating category");

          if (taskCategory === "UI_UX_Design") {
            await tx.uI_UX_Design.update({
              where: {
                id: taskmodel?.uiUxDesign_id!,
              },
              data: {
                Responses: Array.isArray(categoryModel?.Responses)
                  ? [
                      ...categoryModel.Responses,
                      {
                        id: userId,
                        value: parsedBody.data.voteOptionId,
                        taskOption: parsedBody.data.optionId,
                      },
                    ]
                  : [
                      {
                        id: userId,
                        value: parsedBody.data.voteOptionId,
                        taskOption: parsedBody.data.optionId,
                      },
                    ],
              },
            });
          } else if (taskCategory === "Idea_Product") {
            await tx.idea_Product.update({
              where: {
                id: taskmodel?.ideaProduct_id!,
              },
              data: {
                Responses: Array.isArray(categoryModel?.Responses)
                  ? [
                      ...categoryModel.Responses,
                      {
                        id: userId,
                        value: parsedBody.data.voteOptionId,
                        taskOption: parsedBody.data.optionId,
                      },
                    ]
                  : [
                      {
                        id: userId,
                        value: parsedBody.data.voteOptionId,
                        taskOption: parsedBody.data.optionId,
                      },
                    ],
              },
            });
          } else if (taskCategory === "Youtube_Thumbnail") {
            await tx.youtube_Thumbnail.update({
              where: {
                id: taskmodel?.youtubeThumbnail_id!,
              },
              data: {
                Responses: Array.isArray(categoryModel?.Responses)
                  ? [
                      ...categoryModel.Responses,
                      {
                        id: userId,
                        value: parsedBody.data.voteOptionId,
                        taskOption: parsedBody.data.optionId,
                      },
                    ]
                  : [
                      {
                        id: userId,
                        value: parsedBody.data.voteOptionId,
                        taskOption: parsedBody.data.optionId,
                      },
                    ],
              },
            });
          } else if (taskCategory === "Miscellaneous") {
            await tx.miscellaneous.update({
              where: {
                id: taskmodel?.miscellaneous_id!,
              },
              data: {
                Responses: Array.isArray(categoryModel?.Responses)
                  ? [
                      ...categoryModel.Responses,
                      {
                        id: userId,
                        value: parsedBody.data.voteOptionId,
                        taskOption: parsedBody.data.optionId,
                      },
                    ]
                  : [
                      {
                        id: userId,
                        value: parsedBody.data.voteOptionId,
                        taskOption: parsedBody.data.optionId,
                      },
                    ],
              },
            });
          }

          // Update worker
          console.log("Updating worker");
          await tx.worker.update({
            where: {
              id: userId,
            },
            data: {
              pending_amount: (
                Number(worker.pending_amount) + Number(amount)
              ).toString(),
            },
          });
          return submission;
        });
        const nextTask = await getNextTask(Number(userId));
        res.status(200).json({
          nextTask,
          amount,
        });
      } catch (error: any) {
        if (error.code === "P2002") {
          return res.status(409).json({
            message: "You have already submitted this task.",
          });
        } else {
          console.error("Error creating submission:", error);
          return res.status(500).json({
            message: "Internal server error",
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/balance", workerMiddleware, async (req, res) => {
  try {
    // @ts-ignore
    const userId: string = req.userId;

    const worker = await prismaClient.worker.findFirst({
      where: {
        id: Number(userId),
      },
    });

    res.json({
      pendingAmount: worker?.pending_amount,
      lockedAmount: worker?.locked_amount,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/payout", workerMiddleware, async (req, res) => {
  try {
    // @ts-ignore
    const userId: string = req.userId;
    const MIN_AMOUNT_FOR_PAYOUT = 2;

    const worker = await prismaClient.worker.findFirst({
      where: { id: Number(userId) },
    });

    if (!worker) {
      return res.status(403).json({ message: "Worker not found" });
    }

    if (parseFloat(worker.pending_amount) < MIN_AMOUNT_FOR_PAYOUT) {
      return res.status(400).json({
        message: `Pending amount must be at least ${MIN_AMOUNT_FOR_PAYOUT} SOL for payout`,
      });
    }

    const transaction = new Transaction();

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(process.env.PARENT_WALLET_ADDRESS as string),
        toPubkey: new PublicKey(worker.address),
        lamports: Math.floor(1_000_000_000 * parseFloat(worker.pending_amount)),
      })
    );

    // console.log(transaction);
    // console.log("PRIVATE_KEY environment variable:", process.env.PRIVATE_KEY);
    let keypair;
    try {
      const secretKey = Uint8Array.from(
        JSON.parse(process.env.PRIVATE_KEY as string)
      );

      // console.log("Length of secretKey:", secretKey.length);
      if (secretKey.length !== 64) {
        throw new Error(
          `Invalid secret key length. Expected 64, got ${secretKey.length}`
        );
      }
      keypair = Keypair.fromSecretKey(secretKey);
      // console.log(keypair);
    } catch (e) {
      console.error("Error with Private Key Configuration:", e);
      return res
        .status(500)
        .json({ message: "Invalid private key configuration." });
    }

    let signature = "";
    let txnStatus: TxnStatus = "Processing";
    try {
      signature = await sendAndConfirmTransaction(connection, transaction, [
        keypair,
      ]);
      txnStatus = "Success";
    } catch (e) {
      console.error("Transaction failed:", e);
      txnStatus = "Failure";
      return res.status(400).json({
        message:
          "Transaction failed. Error: " +
          (e instanceof Error ? e.message : String(e)),
      });
    }

    const now = new Date();
    await prismaClient.$transaction(async (tx) => {
      if (txnStatus === "Success") {
        await tx.worker.update({
          where: { id: Number(userId) },
          data: {
            pending_amount: "0",
            locked_amount: (
              BigInt(worker.locked_amount) + BigInt(worker.pending_amount)
            ).toString(),
            withdrawn: (
              BigInt(worker.withdrawn) + BigInt(worker.pending_amount)
            ).toString(),
          },
        });
      }

      await tx.payouts.create({
        data: {
          worker_id: Number(userId),
          amount: worker.pending_amount,
          status: txnStatus,
          signature: signature,
          date: now,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
      });
    });

    res.status(200).json({
      message: "Payout completed successfully",
      amount: worker.pending_amount,
    });
  } catch (e) {
    console.error("Error processing payout:", e);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { publicKey, signature } = req.body;

    if (!publicKey || !signature) {
      return res
        .status(400)
        .json({ message: "Missing publicKey or signature" });
    }

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

    const hardCodedWalletAddress = publicKey;

    const existingUser = await prismaClient.worker.findFirst({
      where: {
        address: hardCodedWalletAddress,
      },
    });

    if (existingUser) {
      const token = jwt.sign(
        {
          userId: existingUser.id,
        },
        process.env.WORKER_JWT_SECRET as string
      );
      res.json({ token, amount: existingUser.pending_amount });
    } else {
      const user = await prismaClient.worker.create({
        data: {
          address: hardCodedWalletAddress,
          locked_amount: "0",
          pending_amount: "0",
        },
      });

      const token = jwt.sign(
        {
          userId: user.id,
        },
        process.env.WORKER_JWT_SECRET as string
      );

      res.json({ token, amount: 0 });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/transactions", workerMiddleware, async (req, res) => {
  const { publicKey } = req.query;
  if (!publicKey) {
    return res.status(400).json({ error: "Public key is required" });
  }

  try {
    const worker = await prismaClient.worker.findUnique({
      where: {
        address: publicKey.toString(),
      },
      select: {
        payouts: true,
      },
    });

    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // Reverse the payouts array to send the latest entries first
    const reversedPayouts = worker.payouts.reverse();

    res.json(reversedPayouts);
  } catch (error) {
    console.error("Error fetching worker payouts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getTesterData", workerMiddleware, async (req, res) => {
  const { publicKey } = req.query; // Extract publicKey from query params

  if (!publicKey) {
    return res.status(400).json({ error: "Public key is required" });
  }

  try {
    // Fetch the worker's data, including submissions and payouts
    const workerData = await prismaClient.worker.findUnique({
      where: {
        address: String(publicKey), // Match the worker's address to the provided public key
      },
      include: {
        payouts: true, // Include all payout records related to this worker
        submissions: {
          include: {
            task: {
              include: {
                uiUxDesign: true,
                ideaProduct: true,
                youtubeThumbnail: true,
                miscellaneous: true,
              },
            },
          },
        },
      },
    });

    if (!workerData) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // Calculate the number of tasks marked as done by the worker
    const tasksDoneCount = await prismaClient.submission.count({
      where: {
        worker_id: workerData.id,
        task: {
          done: true, // Only count submissions where the task is marked as done
        },
      },
    });

    // Calculate the number of tasks completed today
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Month is zero-indexed
    const currentYear = currentDate.getFullYear();

    const tasksCompletedToday = await prismaClient.submission.count({
      where: {
        worker_id: workerData.id,
        postDate: currentDay,
        postMonth: currentMonth,
        postYear: currentYear,
      },
    });

    // Calculate the number of tasks left (maximum of 5 tasks per day)
    const tasksLeft = 5 - tasksCompletedToday;

    // Return response with worker's data, calculated task count, and tasks left
    res.json({
      testerData: {
        pending_amount: workerData.pending_amount,
        locked_amount: workerData.locked_amount,
        withdrawn: workerData.withdrawn, // Added withdrawn amount
        payouts: workerData.payouts,
        submissions: workerData.submissions,
        tasksDoneCount,
        tasksCompletedToday, // Added tasks completed today
        tasksLeft, // Added tasks left
      },
    });
  } catch (error) {
    console.error("Error fetching tester data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
