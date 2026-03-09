import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from '../services/ExpenseService';
import { generateExpenseExcel } from '../utils/excelExport';

export class ExpenseController {
    private expenseService: ExpenseService;

    constructor() {
        this.expenseService = new ExpenseService();
    }

    getExpenses = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deviceId = (req as any).deviceId;
            const { startDate, endDate, categoryId } = req.query;

            const expenses = await this.expenseService.getExpenses(deviceId, {
                startDate: startDate as string,
                endDate: endDate as string,
                categoryId: categoryId as string,
            });

            res.status(200).json(expenses);
        } catch (error) {
            next(error);
        }
    };

    createExpense = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deviceId = (req as any).deviceId;
            const { amount, date, categoryId, description } = req.body;

            const expense = await this.expenseService.addExpense({
                deviceId,
                amount,
                date,
                categoryId,
                description,
            });

            res.status(201).json(expense);
        } catch (error: any) {
            if (
                error.message.includes('Missing required fields') ||
                error.message.includes('Amount must be') ||
                error.message.includes('Invalid date')
            ) {
                res.status(400).json({ error: error.message });
                return;
            }
            next(error);
        }
    };

    getSummary = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deviceId = (req as any).deviceId;
            const summary = await this.expenseService.getSummary(deviceId);

            res.status(200).json(summary);
        } catch (error) {
            next(error);
        }
    };

    exportExpenses = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deviceId = (req as any).deviceId;
            // Fetch all expenses for device
            const expenses = await this.expenseService.getExpenses(deviceId);

            const workbook = await generateExpenseExcel(expenses as any);

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=' + 'expenses.xlsx'
            );

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            next(error);
        }
    };
}
