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
//now its "/{*splat}" for catch-all syntax because we are using express 4.18.2 and above"
app.all('/{*splat}', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Page not found' });
});
app.use(errorMiddleware);


export default app;