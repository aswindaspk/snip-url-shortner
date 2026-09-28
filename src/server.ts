import app from './app.js';
import { checkDatabaseConnection } from './config/db/checkDatabase.js';
import { env } from './config/env.js';

(async () => {
    try {
        await checkDatabaseConnection();
        const server = app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`);
        });

        //to handle any unhandled promise rejections outside express routes and middlewares
        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Rejection:', err);
            server.close(()=>{
                process.exit(1); // Exit the process with a failure code
            });
        })
    }
    catch (error) {
        console.error("Failed to start the server:", error);
    }

})();