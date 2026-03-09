import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

const router = Router();
const categoryController = new CategoryController();

router.get('/', categoryController.getAll);
router.post('/', categoryController.create);

export default router;
