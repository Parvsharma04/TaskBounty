import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { PrismaClient } from "@prisma/client";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Router } from "express";
import jwt from "jsonwebtoken";
import nacl from "tweetnacl";
import { authMiddleware, JWT_SECRET } from "../middlewares/middleware";
import { createTaskInput } from "../types";

const router = Router();
const prismaClient = new PrismaClient();
const s3Client = new S3Client({
  credentials: {
    accessKeyId: "AKIAYS2NSTW6ZSQX4H4E",
    secretAccessKey: "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",
  },
  region: "ap-south-1",
});
const DEFAULT_TITLE = "Select the most clickable thumbnail";
const TOTAL_DECIMALS = 1000;
const connection = new Connection(
  "https://solana-devnet.g.alchemy.com/v2/0scTmkMbVkTEeLPVGwcn3BDnxCxidQTt" ??
    ""
);
const PARENT_WALLET_ADDRESS = "12AvcKeKRFCn1Gh1qVCzNgumHhXtqnMUpT3xtvoE4fzG";

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
    include: {
      options: true,
    },
  });

  if (!taskDetails) {
    return res.status(411).json({
      message: "You dont have access to this task",
    });
  }

  // Todo: Can u make this faster?
  const responses = await prismaClient.submission.findMany({
    where: {
      task_id: Number(taskId),
    },
    include: {
      option: true,
    },
  });

  const result: Record<
    string,
    {
      count: number;
      option: {
        imageUrl: string;
      };
    }
  > = {};

  taskDetails.options.forEach((option) => {
    result[option.id] = {
      count: 0,
      option: {
        imageUrl: option.image_url,
      },
    };
  });

  responses.forEach((r) => {
    result[r.option_id].count++;
  });

  res.json({
    result,
    taskDetails,
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

  const amountTransferred =
    (transaction.meta?.postBalances[1] ?? 0) -
    (transaction.meta?.preBalances[1] ?? 0);

  if (amountTransferred !== 100000000) {
    return res.status(411).json({
      message: "Transaction amount is incorrect. Expected 0.1 SOL",
    });
  }

  const recipientAddress = transaction.transaction.message
    .getAccountKeys()
    .get(1)
    ?.toString();
  const senderAddress = transaction.transaction.message
    .getAccountKeys()
    .get(0)
    ?.toString();

  if (recipientAddress !== PARENT_WALLET_ADDRESS) {
    return res.status(411).json({
      message: "Transaction sent to the wrong address",
    });
  }

  if (senderAddress !== user.address) {
    return res.status(411).json({
      message: "Transaction sent from the wrong address",
    });
  }

  try {
    const response = await prismaClient.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          title: parseData.data.title ?? DEFAULT_TITLE,
          amount: 0.1 * TOTAL_DECIMALS,
          signature: parseData.data.signature,
          user_id: userId,
        },
      });

      await tx.option.createMany({
        data: parseData.data.options.map((x) => ({
          image_url: x.imageUrl,
          task_id: task.id,
        })),
      });

      return task;
    });

    res.json({
      id: response.id,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/presignedUrl", authMiddleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: "hackindiaspark5",
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

//! sigining with wallet
router.post("/signin", async (req, res) => {
  const { publicKey, signature } = req.body;
  const message = new TextEncoder().encode("verify this to authenticate");
  const signedString = "verify this to authenticate";
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
      JWT_SECRET
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
      JWT_SECRET
    );

    res.json({ token });
  }
});

export default router;
