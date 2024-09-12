import { PrismaClient } from "@prisma/client";
import { PublicKey } from "@solana/web3.js";
import { Router } from "express";
import jwt from "jsonwebtoken";
import nacl from "tweetnacl";
import { getNextTask } from "../db";
import { workerMiddleware } from "../middlewares/middleware";
import { createSubmissionInput } from "../types";

const router = Router();
const prismaClient = new PrismaClient();
const DEFAULT_TITLE = "Select the most clickable thumbnail";
const TOTAL_DECIMALS = 10;
const TOTAL_SUBMISSIONS = 1;

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

    const amount = (Number(task.amount) / TOTAL_SUBMISSIONS).toString();

    const submission = await prismaClient.$transaction(async (tx) => {
      const submission = await prismaClient.submission.create({
        data: {
          option_id: Number(parsedBody.data.selection),
          worker_id: userId,
          task_id: Number(parsedBody.data.taskId),
          amount: Number(amount),
          postDate: body.postDate, // Day from frontend
          postMonth: body.postMonth, // Month from frontend
          postYear: body.postYear, // Year from frontend
        },
      });

      // console.log(submission);

      await tx.worker.update({
        where: {
          id: userId,
        },
        data: {
          pending_amount: {
            increment: Number(amount),
          },
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
    lockedAmount: worker?.pending_amount,
  });
});

//! payout logic is pending
// router.post("/payout", workerMiddleware, async (req, res) => {
//   //@ts-ignore
//   const userId: string = req.userId;

//   const worker = await prismaClient.worker.findFirst({
//     where: {
//       id: Number(userId),
//     },
//   });

//   if (!worker) {
//     return res.status(403).json({
//       message: "Worker not found",
//     });
//   }

//   const address = worker.address;
//   const txnId = "0x123123123";

//   //! we should add the lock here
//   await prismaClient.$transaction(async (tx) => {
//     await tx.worker.update({
//       where: {
//         id: Number(userId),
//       },
//       data: {
//         pending_amount: {
//           decrement: worker.pending_amount,
//         },
//         locked_amount: {
//           increment: worker.pending_amount,
//         },
//       },
//     });

//     await tx.payouts.create({
//       data: {
//         id: Number(txnId), //! fix this later
//         user_id: Number(userId),
//         amount: worker.pending_amount,
//         status: "Processing",
//         signature: txnId,
//       },
//     });
//   });
// });

router.post("/payout", workerMiddleware, async (req, res) => {
  //@ts-ignore
  const userId: string = req.userId;

  // Minimum amount required for a payout
  const MIN_AMOUNT_FOR_PAYOUT = 10000000;

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

  if (worker.pending_amount < MIN_AMOUNT_FOR_PAYOUT) {
    return res.status(400).json({
      message: `Pending amount must be at least ${MIN_AMOUNT_FOR_PAYOUT} for payout`,
    });
  }

  const address = worker.address;
  const txnId = "0x123123123"; // You should generate or obtain a real transaction ID

  try {
    await prismaClient.$transaction(async (tx) => {
      await tx.worker.update({
        where: {
          id: Number(userId),
        },
        data: {
          pending_amount: {
            decrement: worker.pending_amount,
          },
          locked_amount: {
            increment: worker.pending_amount,
          },
          withdrawn: {
            increment: worker.pending_amount,
          },
        },
      });

      await tx.payouts.create({
        data: {
          user_id: Number(userId),
          amount: worker.pending_amount,
          status: "Processing",
          signature: txnId,
        },
      });
    });

    res.status(200).json({
      message: "Payout initiated successfully",
    });
  } catch (error) {
    console.error("Error processing payout:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//! sigining with wallet
router.post("/signin", async (req, res) => {
  // console.log(req.body);
  const { publicKey, signature } = req.body;

  if (!publicKey || !signature) {
    return res.status(400).json({ message: "Missing publicKey or signature" });
  }

  const message = new TextEncoder().encode("verify this to authenticate");
  const signedString = "verify this to authenticate";
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
    res.json({ token });
  } else {
    const user = await prismaClient.worker.create({
      data: {
        address: hardCodedWalletAddress,
        locked_amount: 0,
        pending_amount: 0,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.WORKER_JWT_SECRET as string
    );

    res.json({ token });
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

export default router;
