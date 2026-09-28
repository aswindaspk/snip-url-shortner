import app from './app.js';
import { checkDatabaseConnection } from './config/db/checkDatabase.js';
import { env } from './config/env.js';

let server: ReturnType<typeof app.listen>;

const shutdown = (reason: string, error?: unknown) => {
    console.error(reason, error);

    if (server) {
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

process.on('uncaughtException', (err) => {
    shutdown('Uncaught Exception', err);
});

process.on('unhandledRejection', (err) => {
    shutdown('Unhandled Rejection', err);
});

const startServer = async () => {
    try {
        await checkDatabaseConnection();

        server = app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`);
        });

    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
};

startServer();