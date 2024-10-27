import { Router } from 'express';
import { SenseController } from '../controllers/senseController';

const senseRoutes = Router();
const senseController = new SenseController();

senseRoutes.get('/', senseController.show.bind(senseController));

export { senseRoutes };
