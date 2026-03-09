import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useGetSummaryQuery } from '../../store/apiSlice';
import moment from 'moment';

export function ExpenseCharts() {
    const { data: summary, isLoading } = useGetSummaryQuery();

    if (isLoading) {
        return <div className="flex justify-center p-8 text-slate-500">Loading charts...</div>;
    }

    if (!summary || (!summary.byCategory?.length && !summary.daily?.length)) {
        return <div className="flex justify-center items-center h-full text-slate-500">No data to display</div>;
    }

    const pieData = summary.byCategory.map((item: any) => ({
        name: item.name,
        value: parseFloat(item.total),
        color: item.color || '#cccccc',
    }));

    const barData = summary.daily.map((item: any) => ({
        date: moment(item.date).format('MMM DD'),
        total: parseFloat(item.total),
    }));

    return (
        <div className="flex flex-col md:flex-row gap-8 w-full h-full p-4">
            {/* Category Breakdown (Pie) */}
            <div className="flex-1 min-h-[250px] flex flex-col justify-center">
                <h3 className="text-sm font-semibold mb-2 text-center">By Category</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <RechartsTooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Daily Trend (Bar) */}
            <div className="flex-1 min-h-[250px] flex flex-col justify-center border-l-0 md:border-l pl-0 md:pl-4 border-slate-100">
                <h3 className="text-sm font-semibold mb-2 text-center">Last 30 Days Trend</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
                        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
