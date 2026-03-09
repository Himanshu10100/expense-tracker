import sequelize from '../config/database';
import Category from './Category';
import Expense from './Expense';

// Define Associations
Category.hasMany(Expense, {
    foreignKey: 'categoryId',
    as: 'expenses',
});

Expense.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category',
});

export { sequelize, Category, Expense };
