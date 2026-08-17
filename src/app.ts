import express from 'express';
import urlRoutes from './routes/url.routes.js';

//setting up app
const app = express();
app.use(express.json());

//routes
app.use('/api/v1/urls', urlRoutes)

export default app;