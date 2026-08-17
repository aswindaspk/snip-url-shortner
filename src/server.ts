import app from './app.js';
import { checkDatabaseConnection } from './config/db/checkDatabase.js';
import {env} from './config/env.js';

(async () => {
    try {
        await checkDatabaseConnection();
        app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`);
        });
    } 
    catch (error) {
        console.error("Failed to start the server:", error);
    }
})();