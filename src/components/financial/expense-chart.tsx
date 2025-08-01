import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";

interface TransactionData {
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface ExpenseChartProps {
  transactions: TransactionData[];
  currency: string;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

export const ExpenseChart = ({ transactions, currency }: ExpenseChartProps) => {
  // Calculate category breakdown
  const expensesByCategory = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const category = t.category || 'Other';
      acc[category] = (acc[category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: ((amount / Object.values(expensesByCategory).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Daily spending data with actual dates
  const dailyData = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const dateKey = new Date(t.date).toISOString().split('T')[0]; // YYYY-MM-DD format
      acc[dateKey] = (acc[dateKey] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const barData = Object.entries(dailyData)
    .map(([dateKey, amount]) => ({
      date: dateKey,
      displayDate: new Date(dateKey).toLocaleDateString('default', { 
        month: 'short', 
        day: 'numeric'
      }),
      amount
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-card-foreground font-medium">{label}</p>
          <p className="text-primary">
            {formatCurrency(payload[0].value, currency)}
            {payload[0].payload.percentage && ` (${payload[0].payload.percentage}%)`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
      {/* Pie Chart - Category Breakdown */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl lg:text-2xl">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px] lg:h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => 
                    window.innerWidth < 640 ? `${percentage}%` : 
                    window.innerWidth < 1024 ? `${name.length > 8 ? name.substring(0, 8) + '...' : name} ${percentage}%` :
                    `${name} ${percentage}%`
                  }
                  outerRadius="65%"
                  innerRadius={0}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                  iconSize={16}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart - Daily Spending */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl lg:text-2xl">Daily Spending Pattern</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px] lg:h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="displayDate" 
                  className="text-muted-foreground"
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={Math.max(0, Math.floor(barData.length / 10))}
                />
                <YAxis 
                  className="text-muted-foreground"
                  fontSize={14}
                  tick={{ fontSize: 14 }}
                  tickFormatter={(value) => formatCurrency(value, currency).replace(/\.\d+/, '')}
                  width={90}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  stroke="hsl(var(--primary))"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};