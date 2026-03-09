import * as ExcelJS from 'exceljs';
import { Expense } from '../models';

export const generateExpenseExcel = async (expenses: Expense[]): Promise<ExcelJS.Workbook> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Expenses');

    worksheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Description', key: 'description', width: 30 },
    ];

    // Make header row bold
    worksheet.getRow(1).font = { bold: true };

    expenses.forEach((expense) => {
        worksheet.addRow({
            date: expense.date,
            category: expense.category?.name || 'Uncategorized',
            amount: `$${expense.amount.toFixed(2)}`,
            description: expense.description || '',
        });
    });

    return workbook;
};
