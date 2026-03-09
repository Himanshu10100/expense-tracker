import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Category from './Category';

interface ExpenseAttributes {
    id: string;
    deviceId: string;
    amount: number;
    description?: string;
    date: Date;
    categoryId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, 'id' | 'description'> { }

class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes> implements ExpenseAttributes {
    public id!: string;
    public deviceId!: string;
    public amount!: number;
    public description!: string;
    public date!: Date;
    public categoryId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public category?: Category;
}

Expense.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        deviceId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            get() {
                const value = this.getDataValue('amount');
                return value === null ? null : parseFloat(value as unknown as string);
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        tableName: 'expenses',
        indexes: [
            {
                fields: ['deviceId'], // Index for faster device-based queries
            },
            {
                fields: ['date'], // Index for date-range queries
            }
        ]
    }
);

export default Expense;
