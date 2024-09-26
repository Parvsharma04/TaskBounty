import { PrismaClient, TxnStatus } from "@prisma/client";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Router } from "express";
import jwt from "jsonwebtoken";
import nacl from "tweetnacl";
import { getNextTask } from "../db";
import { workerMiddleware } from "../middlewares/middleware";
import { createSubmissionInput } from "../types";

const router = Router();
const prismaClient = new PrismaClient();
const DEFAULT_TITLE = "Select the most clickable thumbnail";
const TOTAL_DECIMALS = 1000000000;
const SOL_PRICE = 134.64; //! 1 SOL = $134.64
const TASK_SUBMISSION_AMT = 0.0002;
const connection = new Connection("https://api.devnet.solana.com");

router.get("/nextTask", workerMiddleware, async (req, res) => {
  // @ts-ignore
  const userId: string = req.userId;

  const task = await getNextTask(Number(userId));

  if (!task) {
    res.status(411).json({
      message: "No more tasks left for you to review",
    });
  } else {
    res.json({
      task,
    });
  }
});
router.post("/submission", workerMiddleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  const body = req.body;
  const parsedBody = createSubmissionInput.safeParse(body);

  if (parsedBody.success) {
    const task = await getNextTask(Number(userId));
    if (!task || task?.id !== Number(parsedBody.data.taskId)) {
      return res.status(411).json({
        message: "Incorrect task id",
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

    const submission = await prismaClient.$transaction(async (tx) => {
      const submission = await prismaClient.submission.create({
        data: {
          option_id: Number(parsedBody.data.selection),
          worker_id: userId,
          task_id: Number(parsedBody.data.taskId),
          amount: amount,
          postDate: body.postDate,
          postMonth: body.postMonth,
          postYear: body.postYear,
        },
      });

      // console.log(submission);

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
  } else {
    res.status(411).json({
      message: "Incorrect inputs",
    });
  }
});
router.get("/balance", workerMiddleware, async (req, res) => {
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
});

router.post("/payout", workerMiddleware, async (req, res) => {
  // @ts-ignore
  const userId: string = req.userId; // Ensure this is a string

  const MIN_AMOUNT_FOR_PAYOUT = 2;

  const worker = await prismaClient.worker.findFirst({
    where: {
      id: Number(userId), // Cast userId to a number here
    },
  });

  if (!worker) {
    return res.status(403).json({
      message: "Worker not found",
    });
  }

  if (parseFloat(worker.pending_amount) < MIN_AMOUNT_FOR_PAYOUT) {
    return res.status(400).json({
      message: `Pending amount must be at least ${MIN_AMOUNT_FOR_PAYOUT} SOL for payout`,
    });
  }

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey("12AvcKeKRFCn1Gh1qVCzNgumHhXtqnMUpT3xtvoE4fzG"),
      toPubkey: new PublicKey(worker.address),
      lamports: Math.floor(1_000_000_000 * parseFloat(worker.pending_amount)),
    })
  );

  let keypair;
  try {
    const secretKey = Uint8Array.from(
      JSON.parse(process.env.PRIVATE_KEY as string)
    );
    keypair = Keypair.fromSecretKey(secretKey);
  } catch (e) {
    return res.status(500).json({
      message: "Invalid private key configuration.",
    });
  }

  let signature = "";
  let txnStatus: TxnStatus = "Processing";

  try {
    signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);
    txnStatus = "Success";
  } catch (e: unknown) {
    console.error("Transaction failed:", e);
    txnStatus = "Failure";
    return res.status(400).json({
      message:
        "Transaction failed. Error: " +
        (e instanceof Error ? e.message : String(e)),
    });
  }

  try {
    const now = new Date();
    await prismaClient.$transaction(async (tx) => {
      if (txnStatus === "Success") {
        await tx.worker.update({
          where: {
            id: Number(userId),
          },
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

    if (txnStatus.includes("Failure")) {
      return res.status(400).json({
        message: "Transaction failed. Please try again later.",
      });
    }

    res.status(200).json({
      message: "Payout completed successfully",
      amount: worker.pending_amount,
    });
  } catch (error) {
    console.error("Error processing payout:", error); // Log the error for debugging
    return res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
});

router.post("/signin", async (req, res) => {
  // console.log(req.body);
  const { publicKey, signature } = req.body;

  if (!publicKey || !signature) {
    return res.status(400).json({ message: "Missing publicKey or signature" });
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

  // console.log(existingUser);

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
});

router.get("/getTesterData", workerMiddleware, async (req, res) => {
  const { publicKey } = req.query; // Extract publicKey from query params

  if (!publicKey) {
    return res.status(400).json({ error: "Public key is required" });
  }

  try {
    // Fetch the worker's data, including submissions and payouts
    const workerData = await prismaClient.worker.findFirst({
      where: {
        address: String(publicKey), // Match the worker's address to the provided public key
      },
      include: {
        payouts: true, // Include all payout records related to this worker
        submissions: {
          include: {
            task: true, // Include task details related to each submission
            option: true, // Include option details related to each submission
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

    // Return response with worker's data and calculated task count
    res.json({
      testerData: {
        pending_amount: workerData.pending_amount, // Send worker's pending amount
        locked_amount: workerData.locked_amount, // Send worker's locked amount
        payouts: workerData.payouts, // Send array of payouts
        submissions: workerData.submissions, // Send worker's submissions
        tasksDoneCount, // Send number of tasks completed by the worker
      },
    });
  } catch (error) {
    console.error("Error fetching tester data:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
    res.json(worker.payouts);
  } catch (error) {
    console.error("Error fetching worker payouts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
