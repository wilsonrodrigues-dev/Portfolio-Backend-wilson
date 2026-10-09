"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const promises_1 = __importDefault(require("dns/promises"));
dotenv_1.default.config();
promises_1.default.setServers(["8.8.8.8", "1.1.1.1"]);
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        await (0, database_1.connectDatabase)();
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
            console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
