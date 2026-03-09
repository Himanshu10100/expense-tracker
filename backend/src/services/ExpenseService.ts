import { ExpenseRepository, ExpenseFilters } from '../repositories/ExpenseRepository';
import { sequelize } from '../models';
import moment from 'moment'; // We need moment or just native dates, let's use native for now

export class ExpenseService {
    private expenseRepository: ExpenseRepository;

    constructor() {
        this.expenseRepository = new ExpenseRepository();
    }

    async getExpenses(deviceId: string, filters?: ExpenseFilters) {
        return await this.expenseRepository.findAllByDevice(deviceId, filters);
    }

    async addExpense(data: { deviceId: string; amount: number; date: string; categoryId: string; description?: string }) {
        if (!data.deviceId || !data.amount || !data.date || !data.categoryId) {
            throw new Error('Missing required fields: deviceId, amount, date, categoryId');
        }

        // Basic validation
        if (isNaN(Number(data.amount)) || Number(data.amount) <= 0) {
            throw new Error('Amount must be a positive number');
        }

        const parsedDate = new Date(data.date);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date format');
        }

        return await this.expenseRepository.create({
            ...data,
            amount: Number(data.amount),
            date: parsedDate,
        });
    }

    async getSummary(deviceId: string) {
        // We can do this in SQL or memory. For simplicity and since volume per device is low, 
        // we fetch all and calculate, or use Sequelize scopes. 
        // A better approach is to query via Sequelize raw or group by.
        // Let's use raw query for speed

        // Group by category
        const categoryQuery = `
      SELECT c.name, c.color, SUM(e.amount) as total
      FROM expenses e
      JOIN categories c ON e."categoryId" = c.id
      WHERE e."deviceId" = :deviceId
      GROUP BY c.id, c.name, c.color
      ORDER BY total DESC;
    `;

        // Last 30 days daily
        const dailyQuery = `
      SELECT date, SUM(amount) as total
      FROM expenses
      WHERE "deviceId" = :deviceId
        AND date >= (CURRENT_DATE - INTERVAL '30 days')
      GROUP BY date
      ORDER BY date ASC;
    `;

        const [categorySummary] = await sequelize.query(categoryQuery, {
            replacements: { deviceId }
        });

        const [dailySummary] = await sequelize.query(dailyQuery, {
            replacements: { deviceId }
        });

        return {
            byCategory: categorySummary,
            daily: dailySummary
        };
    }
}
