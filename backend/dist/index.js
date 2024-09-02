"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const user_1 = __importDefault(require("./routes/user"));
const worker_1 = __importDefault(require("./routes/worker"));
app.use("/v1/user", user_1.default);
app.use("/v1/worker", worker_1.default);
//! postgres + prima ==> ORM (postgresql://neondb_owner:AKJCl2YGra5T@ep-shrill-glitter-a5dd7u9d.us-east-2.aws.neon.tech/neondb?sslmode=require)
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
