"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const web3_js_1 = require("@solana/web3.js");
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const db_1 = require("../db");
const middleware_1 = require("../middlewares/middleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const prismaClient = new client_1.PrismaClient();
const DEFAULT_TITLE = "Select the most clickable thumbnail";
const TOTAL_DECIMALS = 10;
const TOTAL_SUBMISSIONS = 1;
router.get("/nextTask", middleware_1.workerMiddleware, (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const task = yield (0, db_1.getNextTask)(Number(userId));
    if (!task) {
      res.status(411).json({
        message: "No more tasks left for you to review",
      });
    } else {
      res.json({
        task,
      });
    }
  })
);
router.post("/submission", middleware_1.workerMiddleware, (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const body = req.body;
    const parsedBody = types_1.createSubmissionInput.safeParse(body);
    if (parsedBody.success) {
      const task = yield (0, db_1.getNextTask)(Number(userId));
      if (
        !task ||
        (task === null || task === void 0 ? void 0 : task.id) !==
          Number(parsedBody.data.taskId)
      ) {
        return res.status(411).json({
          message: "Incorrect task id",
        });
      }
      const amount = (Number(task.amount) / TOTAL_SUBMISSIONS).toString();
      const submission = yield prismaClient.$transaction((tx) =>
        __awaiter(void 0, void 0, void 0, function* () {
          const submission = yield tx.submission.create({
            data: {
              option_id: Number(parsedBody.data.selection),
              worker_id: userId,
              task_id: Number(parsedBody.data.taskId),
              amount: Number(amount),
            },
          });
          // console.log(submission);
          yield tx.worker.update({
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
        })
      );
      const nextTask = yield (0, db_1.getNextTask)(Number(userId));
      res.status(200).json({
        nextTask,
        amount,
      });
    } else {
      res.status(411).json({
        message: "Incorrect inputs",
      });
    }
  })
);
router.get("/balance", middleware_1.workerMiddleware, (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const worker = yield prismaClient.worker.findFirst({
      where: {
        id: Number(userId),
      },
    });
    res.json({
      pendingAmount:
        worker === null || worker === void 0 ? void 0 : worker.pending_amount,
      lockedAmount:
        worker === null || worker === void 0 ? void 0 : worker.pending_amount,
    });
  })
);
//! payout logic is pending
router.post("/payout", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const worker = yield prismaClient.worker.findFirst({
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
  })
);
//! sigining with wallet
router.post("/signin", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { publicKey, signature } = req.body;
    const message = new TextEncoder().encode("verify this to authenticate");
    const signedString = "verify this to authenticate";
    const result = tweetnacl_1.default.sign.detached.verify(
      message,
      new Uint8Array(signature.data),
      new web3_js_1.PublicKey(publicKey).toBytes()
    );
    const hardCodedWalletAddress = publicKey;
    const existingUser = yield prismaClient.worker.findFirst({
      where: {
        address: hardCodedWalletAddress,
      },
    });
    if (existingUser) {
      const token = jsonwebtoken_1.default.sign(
        {
          userId: existingUser.id,
        },
        process.env.WORKER_JWT_SECRET
      );
      res.json({ token });
    } else {
      const user = yield prismaClient.worker.create({
        data: {
          address: hardCodedWalletAddress,
          locked_amount: 0,
          pending_amount: 0,
        },
      });
      const token = jsonwebtoken_1.default.sign(
        {
          userId: user.id,
        },
        process.env.WORKER_JWT_SECRET
      );
      res.json({ token });
    }
  })
);
exports.default = router;
