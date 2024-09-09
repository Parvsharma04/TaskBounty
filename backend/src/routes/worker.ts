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
      const submission = await tx.submission.create({
        data: {
          option_id: Number(parsedBody.data.selection),
          worker_id: userId,
          task_id: Number(parsedBody.data.taskId),
          amount: Number(amount),
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
router.post("/payout", async (req, res) => {
  //@ts-ignore
  const userId: string = req.userId;

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

  const address = worker.address;
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

export default router;
