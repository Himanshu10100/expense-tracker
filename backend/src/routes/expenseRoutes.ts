import { Router } from 'express';
import { ExpenseController } from '../controllers/ExpenseController';
import requireDeviceId from '../middlewares/deviceId';

const router = Router();
const expenseController = new ExpenseController();

// Apply deviceId middleware to all expense routes
router.use(requireDeviceId);

router.get('/', expenseController.getExpenses);
router.post('/', expenseController.createExpense);
router.get('/summary', expenseController.getSummary);
router.get('/export', expenseController.exportExpenses);

export default router;
