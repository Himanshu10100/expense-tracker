import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { sequelize } from './models';
import errorHandler from './middlewares/errorHandler';

// Import routes
import categoryRoutes from './routes/categoryRoutes';
import expenseRoutes from './routes/expenseRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/expenses', expenseRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Expense Tracker API is running' });
});

// Error handling middleware matches the signature (err, req, res, next)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models (in production, use migrations)
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('Database synchronized.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
