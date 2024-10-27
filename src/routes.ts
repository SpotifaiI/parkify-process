import { Router } from 'express';
import { senseRoutes } from './routes/senseRoutes';

const routes = Router();

routes.use('/sense', senseRoutes);

export { routes };
