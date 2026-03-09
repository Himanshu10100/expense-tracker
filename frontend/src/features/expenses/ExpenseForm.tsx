import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useCreateExpenseMutation, useGetCategoriesQuery } from '../../store/apiSlice';

const expenseSchema = z.object({
    amount: z.string().min(1, 'Amount is required'),
    date: z.string().min(1, 'Date is required'),
    categoryId: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export function ExpenseForm({ onSuccess }: { onSuccess: () => void }) {
    const { data: categories, isLoading: isCatLoading } = useGetCategoriesQuery();
    const [createExpense, { isLoading: isSubmitting }] = useCreateExpenseMutation();

    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            amount: '',
            date: new Date().toISOString().split('T')[0],
            categoryId: '',
            description: '',
        },
    });

    const onSubmit = async (values: ExpenseFormValues) => {
        try {
            await createExpense({
                amount: parseFloat(values.amount),
                date: values.date,
                categoryId: values.categoryId,
                description: values.description,
            }).unwrap();
            form.reset();
            onSuccess();
        } catch (error) {
            console.error('Failed to create expense:', error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isCatLoading ? (
                                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : (
                                        categories?.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Lunch, Taxi, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Saving...' : 'Add Expense'}
                </Button>
            </form>
        </Form>
    );
}
