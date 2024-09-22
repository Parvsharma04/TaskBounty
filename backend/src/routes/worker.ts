import { PrismaClient, TxnStatus } from "@prisma/client";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { decode } from "bs58";
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
  //@ts-ignore
  const userId: string = req.userId;

  // Minimum amount required for a payout
  const MIN_AMOUNT_FOR_PAYOUT = 2;

  // Fetch worker details
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

  if (parseFloat(worker.pending_amount) < MIN_AMOUNT_FOR_PAYOUT) {
    return res.status(400).json({
      message: `Pending amount must be at least ${MIN_AMOUNT_FOR_PAYOUT} sol for payout`,
    });
  }

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey("12AvcKeKRFCn1Gh1qVCzNgumHhXtqnMUpT3xtvoE4fzG"),
      toPubkey: new PublicKey(worker.address),
      lamports: 1000_000_000 * parseFloat(worker.pending_amount),
    })
  );

  const keypair = Keypair.fromSecretKey(
    decode(process.env.PRIVATE_KEY as string)
  );

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
          month: now.getMonth() + 1, // getMonth() returns 0-11, so we add 1
          year: now.getFullYear(),
        },
      });
    });

    if (txnStatus === "Failure") {
      return res.status(400).json({
        message: "Transaction failed. Please try again later.",
      });
    }

    res.status(200).json({
      message: "Payout completed successfully",
      amount: worker.pending_amount,
    });
  } catch (error) {
    console.error("Error processing payout:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post("/payout", workerMiddleware, async (req, res) => {
  //@ts-ignore
  const userId: string = req.userId;

  // Minimum amount required for a payout
  const MIN_AMOUNT_FOR_PAYOUT = 2;

  // Fetch worker details
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

  if (parseFloat(worker.pending_amount) < MIN_AMOUNT_FOR_PAYOUT) {
    return res.status(400).json({
      message: `Pending amount must be at least ${MIN_AMOUNT_FOR_PAYOUT} sol for payout`,
    });
  }

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey("12AvcKeKRFCn1Gh1qVCzNgumHhXtqnMUpT3xtvoE4fzG"),
      toPubkey: new PublicKey(worker.address),
      lamports: 1000_000_000 * parseFloat(worker.pending_amount),
    })
  );

  const keypair = Keypair.fromSecretKey(
    decode(process.env.PRIVATE_KEY as string)
  );

  let signature = "";
  let txnStatus: TxnStatus = TxnStatus.Processing;

  try {
    signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);
    txnStatus = TxnStatus.Success;
  } catch (e) {
    console.error("Transaction failed:", e);
    txnStatus = TxnStatus.Failure;
  }

  try {
    const now = new Date();
    await prismaClient.$transaction(async (tx) => {
      if (txnStatus === TxnStatus.Success) {
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
          month: now.getMonth() + 1, // getMonth() returns 0-11, so we add 1
          year: now.getFullYear(),
        },
      });
    });

    if (txnStatus === TxnStatus.Failure) {
      return res.status(400).json({
        message: "Transaction failed. Please try again later.",
      });
    }

    res.status(200).json({
      message: "Payout completed successfully",
      amount: worker.pending_amount,
    });
  } catch (error) {
    console.error("Error processing payout:", error);
    res.status(500).json({
      message: "Internal Server Error",
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
    // Fetch tester data with their submissions
    let testerData = await prismaClient.worker.findFirst({
      where: {
        address: String(publicKey), // Ensure that 'address' is the correct field in your database schema
      },
      include: {
        submissions: {
          include: {
            task: true, // Includes task details
            option: true, // Includes option details
          },
        },
      },
    });

    if (!testerData) {
      return res.status(404).json({ error: "Tester not found" });
    }

    // Fetch the count of submissions grouped by month and year
    const submissionCountByMonthYear = await prismaClient.submission.groupBy({
      by: ["postMonth", "postYear"],
      where: {
        worker_id: testerData.id,
      },
      _count: {
        id: true, // Count number of submissions
      },
    });

    // Respond with both tester data and the monthly submission counts
    res.json({
      testerData,
      submissionCountByMonthYear,
      withdrawn: testerData.withdrawn, // Include withdrawn field
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

    console.log("Payouts data sent");
    res.json(worker.payouts);
  } catch (error) {
    console.error("Error fetching worker payouts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
