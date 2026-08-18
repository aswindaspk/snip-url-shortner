import express from 'express';
import urlRoutes from './routes/url.routes.js';
import redirectRoutes from './routes/redirect.routes.js';

//setting up app
const app = express();
app.use(express.json());

//routes
app.use('/api/v1/urls', urlRoutes);
app.use('/', redirectRoutes);

export default app;