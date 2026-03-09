import { useGetExpensesQuery } from '../../store/apiSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

export function ExpenseList() {
    const { data: expenses, isLoading } = useGetExpensesQuery();

    if (isLoading) {
        return <div className="flex justify-center p-8 text-slate-500">Loading expenses...</div>;
    }

    if (!expenses || expenses.length === 0) {
        return (
            <div className="flex justify-center p-8 text-slate-500 border-2 border-dashed rounded-lg">
                No expenses found. Add your first expense to see it here!
            </div>
        );
    }

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell className="font-medium">{expense.date}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: expense.category?.color || '#ccc' }}
                                    />
                                    {expense.category?.name || 'Unknown'}
                                </div>
                            </TableCell>
                            <TableCell>{expense.description || '-'}</TableCell>
                            <TableCell className="text-right font-semibold">
                                ${parseFloat(expense.amount).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
