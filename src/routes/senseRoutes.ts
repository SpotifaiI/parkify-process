import { Router } from 'express';
import { SenseController } from '../controllers/SenseController';

const senseRoutes = Router();
const senseController = new SenseController();

senseRoutes.post('/', senseController.byEncodedUrl.bind(senseController));
senseRoutes.get('/', senseController.view.bind(senseController));

export { senseRoutes };
