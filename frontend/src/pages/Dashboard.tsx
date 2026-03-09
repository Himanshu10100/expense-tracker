import { useState } from 'react';
import { useGetExpensesQuery, useGetSummaryQuery } from '../store/apiSlice';
import { getDeviceId } from '../utils/deviceId';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { PlusCircle, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { ExpenseForm } from '../features/expenses/ExpenseForm';
import { ExpenseList } from '../features/expenses/ExpenseList';
import { ExpenseCharts } from '../features/expenses/ExpenseCharts';

export function Dashboard() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { isLoading: expLoading } = useGetExpensesQuery();
    const { data: summary, isLoading: sumLoading } = useGetSummaryQuery();

    const handleExport = async () => {
        try {
            const deviceId = getDeviceId();
            const response = await fetch('http://localhost:5000/api/v1/expenses/export', {
                headers: { 'X-Device-ID': deviceId },
            });
            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'expenses.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
                    <p className="text-muted-foreground">Manage your expenses across your device securely.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" />
                        Export Excel
                    </Button>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                                <PlusCircle className="h-4 w-4" />
                                Add Expense
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Expense</DialogTitle>
                                <DialogDescription>
                                    Enter the details of your expense below. It will be saved securely to your device profile.
                                </DialogDescription>
                            </DialogHeader>
                            <ExpenseForm onSuccess={() => setIsDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {sumLoading || expLoading ? (
                <div className="h-64 flex items-center justify-center">Loading dashboard data...</div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Quick KPI Cards (mocked for now, will connect to summary data later) */}
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-slate-500"
                                >
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ${summary?.byCategory?.reduce((acc: number, cur: any) => acc + Number(cur.total), 0).toFixed(2) || '0.00'}
                                </div>
                                <p className="text-xs text-muted-foreground">Lifetime</p>
                            </CardContent>
                        </Card>
                        {/* More KPI cards... */}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 transition-all hover:shadow-lg">
                            <CardHeader>
                                <CardTitle>Category Analysis</CardTitle>
                                <CardDescription>Breakdown by category over time</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex items-center justify-center border border-slate-100 rounded-md mx-6 mb-6">
                                <ExpenseCharts />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3 transition-all hover:shadow-lg">
                            <CardHeader>
                                <CardTitle>Recent Expenses</CardTitle>
                                <CardDescription>Your latest transactions</CardDescription>
                            </CardHeader>
                            <CardContent className="px-0">
                                <div className="max-h-[300px] overflow-y-auto px-6 pb-6 scrollbar-thin scrollbar-thumb-slate-200">
                                    <ExpenseList />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
