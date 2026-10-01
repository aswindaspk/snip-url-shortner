import app from './app.js';
import { env } from './config/env.js';
import initialize from './config/infra/initialize.js';

let server: ReturnType<typeof app.listen>;

function shutdown(reason: string, error?: unknown) {
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
        await initialize();

        server = app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`);
        });

    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
};

startServer();