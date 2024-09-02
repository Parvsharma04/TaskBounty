import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const prismaClient = new PrismaClient();

const JWT_SECRET = "jwt secret";

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
