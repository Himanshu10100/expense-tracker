import { Op } from 'sequelize';
import { Expense, Category } from '../models';

export interface ExpenseFilters {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
}

export class ExpenseRepository {
    async findAllByDevice(deviceId: string, filters?: ExpenseFilters) {
        const whereClause: any = { deviceId };

        if (filters) {
            if (filters.startDate && filters.endDate) {
                whereClause.date = { [Op.between]: [filters.startDate, filters.endDate] };
            } else if (filters.startDate) {
                whereClause.date = { [Op.gte]: filters.startDate };
            } else if (filters.endDate) {
                whereClause.date = { [Op.lte]: filters.endDate };
            }

            if (filters.categoryId) {
                whereClause.categoryId = filters.categoryId;
            }
        }

        return await Expense.findAll({
            where: whereClause,
            include: [{ model: Category, as: 'category' }],
            order: [['date', 'DESC'], ['createdAt', 'DESC']],
        });
    }

    async create(data: { deviceId: string; amount: number; date: Date; categoryId: string; description?: string }) {
        return await Expense.create(data);
    }
}
