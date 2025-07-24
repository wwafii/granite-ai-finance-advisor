import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, PiggyBank, AlertTriangle } from "lucide-react";

interface TransactionData {
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface FinancialSummaryProps {
  transactions: TransactionData[];
}

const FinancialSummary = ({ transactions }: FinancialSummaryProps) => {
  // Calculate financial metrics
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));
    
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Calculate category breakdowns
  const expensesByCategory = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const category = t.category || 'Lainnya';
      acc[category] = (acc[category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Main Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-income to-success">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-income-foreground" />
            <h3 className="text-2xl font-bold text-income-foreground">
              {formatCurrency(totalIncome)}
            </h3>
            <p className="text-income-foreground/80">Total Pemasukan</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-expense to-destructive">
          <CardContent className="p-6 text-center">
            <TrendingDown className="h-12 w-12 mx-auto mb-3 text-expense-foreground" />
            <h3 className="text-2xl font-bold text-expense-foreground">
              {formatCurrency(totalExpenses)}
            </h3>
            <p className="text-expense-foreground/80">Total Pengeluaran</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary to-primary/80">
          <CardContent className="p-6 text-center">
            <PiggyBank className="h-12 w-12 mx-auto mb-3 text-primary-foreground" />
            <h3 className="text-2xl font-bold text-primary-foreground">
              {formatCurrency(netSavings)}
            </h3>
            <p className="text-primary-foreground/80">Net Tabungan</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-warning to-warning/80">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-warning-foreground" />
            <h3 className="text-2xl font-bold text-warning-foreground">
              {savingsRate.toFixed(1)}%
            </h3>
            <p className="text-warning-foreground/80">Tingkat Tabungan</p>
          </CardContent>
        </Card>
      </div>

      {/* Savings Rate Progress */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Tingkat Tabungan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progress menabung Anda</span>
              <span>{savingsRate.toFixed(1)}%</span>
            </div>
            <Progress value={Math.max(0, Math.min(100, savingsRate))} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Target minimum: 20%</span>
              <span>Target ideal: 30%</span>
            </div>
            {savingsRate < 20 && (
              <Badge variant="destructive" className="mt-2">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Perlu meningkatkan tabungan
              </Badge>
            )}
            {savingsRate >= 20 && savingsRate < 30 && (
              <Badge variant="secondary" className="mt-2">
                Tabungan cukup baik
              </Badge>
            )}
            {savingsRate >= 30 && (
              <Badge className="mt-2 bg-success text-success-foreground">
                Tabungan sangat baik!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Pengeluaran per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCategories.map(([category, amount]) => {
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category}</span>
                    <span>{formatCurrency(amount)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Insight Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold text-primary mb-1">Total Transaksi</h4>
              <p className="text-sm text-muted-foreground">
                Anda memiliki {transactions.length} transaksi yang tercatat
              </p>
            </div>
            
            {topCategories.length > 0 && (
              <div className="p-4 bg-warning/10 rounded-lg">
                <h4 className="font-semibold text-warning mb-1">Kategori Terbesar</h4>
                <p className="text-sm text-muted-foreground">
                  Pengeluaran terbesar ada di kategori "{topCategories[0][0]}" 
                  sebesar {formatCurrency(topCategories[0][1])}
                </p>
              </div>
            )}
            
            <div className={`p-4 rounded-lg ${netSavings >= 0 ? 'bg-success/10' : 'bg-expense/10'}`}>
              <h4 className={`font-semibold mb-1 ${netSavings >= 0 ? 'text-success' : 'text-expense'}`}>
                Status Keuangan
              </h4>
              <p className="text-sm text-muted-foreground">
                {netSavings >= 0 
                  ? `Selamat! Anda berhasil menabung ${formatCurrency(netSavings)} bulan ini`
                  : `Anda mengalami defisit sebesar ${formatCurrency(Math.abs(netSavings))} bulan ini`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummary;