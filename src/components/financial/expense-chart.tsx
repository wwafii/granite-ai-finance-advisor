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

  // Monthly spending trend
  const monthlyData = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      acc[month] = (acc[month] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const barData = Object.entries(monthlyData)
    .map(([month, amount]) => ({
      month,
      amount
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
      {/* Pie Chart - Category Breakdown */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4 sm:pb-6 lg:pb-8">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="h-80 sm:h-96 lg:h-[400px] xl:h-[450px]">
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
                  outerRadius={window.innerWidth < 640 ? 60 : window.innerWidth < 1024 ? 80 : 100}
                  innerRadius={window.innerWidth < 640 ? 20 : 0}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: window.innerWidth < 640 ? '12px' : window.innerWidth < 1024 ? '14px' : '16px' }}
                  iconSize={window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 16 : 20}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart - Monthly Trend */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4 sm:pb-6 lg:pb-8">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="h-80 sm:h-96 lg:h-[400px] xl:h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                <XAxis 
                  dataKey="month" 
                  className="text-muted-foreground"
                  fontSize={window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14}
                  tick={{ fontSize: window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14 }}
                  angle={window.innerWidth < 640 ? -45 : 0}
                  textAnchor={window.innerWidth < 640 ? 'end' : 'middle'}
                  height={window.innerWidth < 640 ? 60 : 40}
                />
                <YAxis 
                  className="text-muted-foreground"
                  fontSize={window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14}
                  tick={{ fontSize: window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14 }}
                  tickFormatter={(value) => 
                    window.innerWidth < 640 
                      ? formatCurrency(value, currency).replace(/\.\d+/, '').replace(/,.*/, 'K')
                      : window.innerWidth < 1024
                      ? formatCurrency(value, currency).replace(/\.\d+/, '')
                      : formatCurrency(value, currency)
                  }
                  width={window.innerWidth < 640 ? 50 : window.innerWidth < 1024 ? 70 : 80}
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