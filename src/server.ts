import dotenv from 'dotenv';
dotenv.config();
import dns from "dns/promises";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import app from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
