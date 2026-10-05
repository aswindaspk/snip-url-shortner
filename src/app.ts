import express from 'express';
import urlRoutes from './routes/url.routes.js';
import redirectRoutes from './routes/redirect.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { AppError } from './error/AppError.js';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './utils/auth.js';
import cors from 'cors';


//setting up app
const app = express();
app.use(cors())
//better auth setup
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

//routes and middlewares
app.use('/api/v1/urls', urlRoutes);
app.use('/', redirectRoutes);
//now its "/{*splat}" for catch-all syntax because we are using express 4.18.2 and above"
app.all('/{*splat}', (req, res, next) => {
  throw new AppError('Page not found', 404);
});

app.use(errorMiddleware);
export default app;