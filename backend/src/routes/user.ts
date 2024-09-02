import { PrismaClient } from "@prisma/client";
import { response, Router } from "express";
import jwt from "jsonwebtoken";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
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
  // validate the inputs from the user;
  const body = req.body;

  const parseData = createTaskInput.safeParse(body);

  // const user = await prismaClient.user.findFirst({
  //   where: {
  //     id: userId,
  //   },
  // });

  if (!parseData.success) {
    return res.status(411).json({
      message: "You've sent the wrong inputs",
    });
  }

  // const transaction = await connection.getTransaction(
  //   parseData.data.signature,
  //   {
  //     maxSupportedTransactionVersion: 1,
  //   }
  // );

  // console.log(transaction);

  // if (
  //   (transaction?.meta?.postBalances[1] ?? 0) -
  //     (transaction?.meta?.preBalances[1] ?? 0) !==
  //   100000000
  // ) {
  //   return res.status(411).json({
  //     message: "Transaction signature/amount incorrect",
  //   });
  // }

  // if (
  //   transaction?.transaction.message.getAccountKeys().get(1)?.toString() !==
  //   PARENT_WALLET_ADDRESS
  // ) {
  //   return res.status(411).json({
  //     message: "Transaction sent to wrong address",
  //   });
  // }

  // if (
  //   transaction?.transaction.message.getAccountKeys().get(0)?.toString() !==
  //   user?.address
  // ) {
  //   return res.status(411).json({
  //     message: "Transaction sent to wrong address",
  //   });
  // }
  // // was this money paid by this user address or a different address?

  // // parse the signature here to ensure the person has paid 0.1 SOL
  // // const transaction = Transaction.from(parseData.data.signature);

  let response = await prismaClient.$transaction(async (tx) => {
    const response = await tx.task.create({
      data: {
        title: parseData.data.title ?? DEFAULT_TITLE,
        amount: 0.1 * TOTAL_DECIMALS,
        // amount: "1",
        //TODO: Signature should be unique in the table else people can reuse a signature
        signature: parseData.data.signature,
        user_id: userId,
      },
    });
    console.log(response);

    await tx.option.createMany({
      data: parseData.data.options.map((x) => ({
        image_url: x.imageUrl,
        task_id: response.id,
      })),
    });

    return response;
  });

  res.json({
    id: response.id,
  });
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
  const hardCodedWalletAddress = "0x2d209aB8b8BAF8698395a872Ef2d1e355B77BAb8";

  const existingUser = await prismaClient.user.findFirst({
    where: {
      address: hardCodedWalletAddress,
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
        address: hardCodedWalletAddress,
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
