import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { config } from './config/env.js';
import { seedDatabase } from './seed/seed.js';
import { User } from './models/User.js';

async function bootstrap() {
  try {
    console.log('----------------------------------------------------');
    console.log(`[Lotus Impex Backend] Initializing Server in ${config.nodeEnv} mode...`);

    // 1. Connect to Database (real or in-memory fallback)
    await connectDB();

    // 2. Check if initial database requires seeding
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Bootstrap] No users detected. Running initial automated seed...');
      await seedDatabase({ silent: false });
    } else {
      console.log(`[Bootstrap] Database already contains ${userCount} user accounts.`);
    }

    // 3. Start Express HTTP Server
    const app = createApp();
    const server = app.listen(config.port, () => {
      console.log(`[Lotus Impex Backend] REST API listening on port ${config.port}`);
      console.log(`[Lotus Impex Backend] Health check: http://localhost:${config.port}/api/v1/health`);
      console.log(`[Lotus Impex Backend] Allowed Client URL: ${config.clientUrl}`);
      console.log('----------------------------------------------------');
    });

    // Graceful shutdown handling
    const shutdown = async () => {
      console.log('\n[Server] Gracefully shutting down...');
      server.close(async () => {
        await disconnectDB();
        console.log('[Server] MongoDB disconnected. Process exiting.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('[Bootstrap Error] Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
