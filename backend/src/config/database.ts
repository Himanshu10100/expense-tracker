import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load .env only if not provided by the environment
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/expensetracker';

const sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export default sequelize;
