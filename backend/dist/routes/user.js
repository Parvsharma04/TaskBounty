"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_presigned_post_1 = require("@aws-sdk/s3-presigned-post");
const client_1 = require("@prisma/client");
const web3_js_1 = require("@solana/web3.js");
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const middleware_1 = require("../middlewares/middleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const prismaClient = new client_1.PrismaClient();
const s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: "AKIAYS2NSTW6ZSQX4H4E",
        secretAccessKey: "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",
    },
    region: "ap-south-1",
});
const DEFAULT_TITLE = "Select the most clickable thumbnail";
const TOTAL_DECIMALS = 1000;
const connection = new web3_js_1.Connection("https://solana-devnet.g.alchemy.com/v2/0scTmkMbVkTEeLPVGwcn3BDnxCxidQTt" !== null && "https://solana-devnet.g.alchemy.com/v2/0scTmkMbVkTEeLPVGwcn3BDnxCxidQTt" !== void 0 ? "https://solana-devnet.g.alchemy.com/v2/0scTmkMbVkTEeLPVGwcn3BDnxCxidQTt" : "");
const PARENT_WALLET_ADDRESS = "27sEXEvZhXmZu9HDTuQDrQp8tGxaCbG9m5nrYBUw2bkc";
router.get("/task", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const taskId = req.query.taskId;
    // @ts-ignore
    const userId = req.userId;
    const taskDetails = yield prismaClient.task.findFirst({
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
    const responses = yield prismaClient.submission.findMany({
        where: {
            task_id: Number(taskId),
        },
        include: {
            option: true,
        },
    });
    const result = {};
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
}));
router.post("/task", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    //@ts-ignore
    const userId = req.userId;
    const body = req.body;
    // Validate inputs using zod schema
    const parseData = types_1.createTaskInput.safeParse(body);
    if (!parseData.success) {
        return res.status(411).json({
            message: "Invalid input data",
        });
    }
    const user = yield prismaClient.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return res.status(411).json({
            message: "User not found",
        });
    }
    const transaction = yield connection.getTransaction(parseData.data.signature, {
        maxSupportedTransactionVersion: 1,
    });
    if (!transaction) {
        return res.status(411).json({
            message: "Transaction not found",
        });
    }
    const amountTransferred = ((_b = (_a = transaction.meta) === null || _a === void 0 ? void 0 : _a.postBalances[1]) !== null && _b !== void 0 ? _b : 0) -
        ((_d = (_c = transaction.meta) === null || _c === void 0 ? void 0 : _c.preBalances[1]) !== null && _d !== void 0 ? _d : 0);
    // if (amountTransferred !== 100000000) {
    //   return res.status(411).json({
    //     message: "Transaction amount is incorrect. Expected 0.1 SOL",
    //   });
    // }
    console.log(transaction.transaction.message.getAccountKeys());
    const recipientAddress = (_e = transaction.transaction.message
        .getAccountKeys()
        .get(1)) === null || _e === void 0 ? void 0 : _e.toString();
    const senderAddress = (_f = transaction.transaction.message
        .getAccountKeys()
        .get(0)) === null || _f === void 0 ? void 0 : _f.toString();
    console.log(PARENT_WALLET_ADDRESS, recipientAddress, senderAddress);
    // if (recipientAddress !== PARENT_WALLET_ADDRESS) {
    //   return res.status(411).json({
    //     message: "Transaction sent to the wrong address",
    //   });
    // }
    // console.log(senderAddress, user.address);
    // if (senderAddress !== user.address) {
    //   return res.status(411).json({
    //     message: "Transaction sent from the wrong address",
    //   });
    // }
    try {
        const response = yield prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const task = yield tx.task.create({
                data: {
                    title: (_a = parseData.data.title) !== null && _a !== void 0 ? _a : DEFAULT_TITLE,
                    amount: 0.1 * TOTAL_DECIMALS,
                    signature: parseData.data.signature,
                    user_id: userId,
                },
            });
            yield tx.option.createMany({
                data: parseData.data.options.map((x) => ({
                    image_url: x.imageUrl,
                    task_id: task.id,
                })),
            });
            return task;
        }));
        res.json({
            id: response.id,
        });
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}));
router.get("/presignedUrl", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const { url, fields } = yield (0, s3_presigned_post_1.createPresignedPost)(s3Client, {
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
}));
//! sigining with wallet
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicKey, signature } = req.body;
    const message = new TextEncoder().encode("verify this to authenticate");
    const signedString = "verify this to authenticate";
    const result = tweetnacl_1.default.sign.detached.verify(message, new Uint8Array(signature.data), new web3_js_1.PublicKey(publicKey).toBytes());
    const existingUser = yield prismaClient.user.findFirst({
        where: {
            address: publicKey,
        },
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            userId: existingUser.id,
        }, middleware_1.JWT_SECRET);
        res.json({ token });
    }
    else {
        const user = yield prismaClient.user.create({
            data: {
                address: publicKey,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, middleware_1.JWT_SECRET);
        res.json({ token });
    }
}));
exports.default = router;
