import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"] ?? "";

  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET as string);
    // console.log(decoded);
    // @ts-ignore
    if (decoded.userId) {
      // @ts-ignore
      req.userId = decoded.userId;
      return next();
    } else {
      return res.status(403).json({
        message: "You are not logged in",
      });
    }
  } catch (e) {
    return res.status(403).json({
      message: "You are not logged in",
    });
  }
}

export function workerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"] ?? "";

  console.log("Authorization Header:", authHeader); // Log the authorization header

  try {
    const decoded = jwt.verify(
      authHeader,
      process.env.WORKER_JWT_SECRET as string
    );
    console.log("Decoded JWT:", decoded); // Log the decoded JWT for verification

    // @ts-ignore
    if (decoded.userId) {
      // @ts-ignore
      req.userId = decoded.userId;
      return next();
    } else {
      return res.status(403).json({
        message: "You are not logged in",
      });
    }
  } catch (e) {
    console.error("JWT Verification Error:", e); // Log the error
    return res.status(403).json({
      message: "You are not logged in",
    });
  }
}
