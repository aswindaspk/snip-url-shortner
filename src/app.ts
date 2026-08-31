import express from 'express';
import urlRoutes from './routes/url.routes.js';
import redirectRoutes from './routes/redirect.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

//setting up app
const app = express();
app.use(express.json());

//routes and middlewares
app.use('/api/v1/urls', urlRoutes);
app.use('/', redirectRoutes);
app.use(errorMiddleware);

export default app;