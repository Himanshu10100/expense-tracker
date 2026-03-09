import { Category } from '../models';

export class CategoryRepository {
    async findAll() {
        return await Category.findAll({
            order: [['name', 'ASC']],
        });
    }

    async create(data: { name: string; color?: string }) {
        return await Category.create(data);
    }

    async findById(id: string) {
        return await Category.findByPk(id);
    }

    // Pre-seed some default categories if table is empty
    async seedDefaultsIfEmpty() {
        const count = await Category.count();
        if (count === 0) {
            const defaults = [
                { name: 'Food', color: '#f87171' },
                { name: 'Transport', color: '#60a5fa' },
                { name: 'Utilities', color: '#fbbf24' },
                { name: 'Entertainment', color: '#34d399' },
                { name: 'Health', color: '#f472b6' },
            ];
            await Category.bulkCreate(defaults);
        }
    }
}
