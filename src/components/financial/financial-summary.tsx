import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, PiggyBank, AlertTriangle } from "lucide-react";
import { ExpenseChart } from "./expense-chart";
import { detectCurrency, formatCurrency } from "@/lib/currency";
import { ThemeToggle } from "@/components/theme/theme-toggle";

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
  // Detect currency and calculate financial metrics
  const currency = detectCurrency(transactions);
  
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
      const category = t.category || 'Other';
      acc[category] = (acc[category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);


  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Theme Toggle Header */}
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      {/* Main Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-income to-success hover:shadow-xl transition-shadow">
          <CardContent className="p-6 lg:p-8 text-center">
            <TrendingUp className="h-12 lg:h-14 w-12 lg:w-14 mx-auto mb-4 lg:mb-6 text-income-foreground" />
            <h3 className="text-2xl lg:text-3xl font-bold text-income-foreground">
              {formatCurrency(totalIncome, currency)}
            </h3>
            <p className="text-base lg:text-lg text-income-foreground/80 mt-2">Total Income</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-expense to-destructive hover:shadow-xl transition-shadow">
          <CardContent className="p-6 lg:p-8 text-center">
            <TrendingDown className="h-12 lg:h-14 w-12 lg:w-14 mx-auto mb-4 lg:mb-6 text-expense-foreground" />
            <h3 className="text-2xl lg:text-3xl font-bold text-expense-foreground">
              {formatCurrency(totalExpenses, currency)}
            </h3>
            <p className="text-base lg:text-lg text-expense-foreground/80 mt-2">Total Expenses</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl transition-shadow">
          <CardContent className="p-6 lg:p-8 text-center">
            <PiggyBank className="h-12 lg:h-14 w-12 lg:w-14 mx-auto mb-4 lg:mb-6 text-primary-foreground" />
            <h3 className="text-2xl lg:text-3xl font-bold text-primary-foreground">
              {formatCurrency(netSavings, currency)}
            </h3>
            <p className="text-base lg:text-lg text-primary-foreground/80 mt-2">Net Savings</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-warning to-warning/80 hover:shadow-xl transition-shadow">
          <CardContent className="p-6 lg:p-8 text-center">
            <AlertTriangle className="h-12 lg:h-14 w-12 lg:w-14 mx-auto mb-4 lg:mb-6 text-warning-foreground" />
            <h3 className="text-2xl lg:text-3xl font-bold text-warning-foreground">
              {savingsRate.toFixed(1)}%
            </h3>
            <p className="text-base lg:text-lg text-warning-foreground/80 mt-2">Savings Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Savings Rate Progress */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl lg:text-2xl">Savings Rate Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between text-base lg:text-lg">
              <span className="font-medium">Your savings progress</span>
              <span className="font-bold">{savingsRate.toFixed(1)}%</span>
            </div>
            <Progress value={Math.max(0, Math.min(100, savingsRate))} className="h-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Minimum target: 20%</span>
              <span>Ideal target: 30%</span>
            </div>
            {savingsRate < 20 && (
              <Badge variant="destructive" className="mt-2">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Need to improve savings
              </Badge>
            )}
            {savingsRate >= 20 && savingsRate < 30 && (
              <Badge variant="secondary" className="mt-2">
                Good savings rate
              </Badge>
            )}
            {savingsRate >= 30 && (
              <Badge className="mt-2 bg-success text-success-foreground">
                Excellent savings rate!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCategories.map(([category, amount]) => {
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category}</span>
                    <span>{formatCurrency(amount, currency)} ({percentage.toFixed(1)}%)</span>
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
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold text-primary mb-1">Total Transactions</h4>
              <p className="text-sm text-muted-foreground">
                You have {transactions.length} recorded transactions
              </p>
            </div>
            
            {topCategories.length > 0 && (
              <div className="p-4 bg-warning/10 rounded-lg">
                <h4 className="font-semibold text-warning mb-1">Largest Category</h4>
                <p className="text-sm text-muted-foreground">
                  Your biggest expense category is "{topCategories[0][0]}" 
                  with {formatCurrency(topCategories[0][1], currency)}
                </p>
              </div>
            )}
            
            <div className={`p-4 rounded-lg ${netSavings >= 0 ? 'bg-success/10' : 'bg-expense/10'}`}>
              <h4 className={`font-semibold mb-1 ${netSavings >= 0 ? 'text-success' : 'text-expense'}`}>
                Financial Status
              </h4>
              <p className="text-sm text-muted-foreground">
                {netSavings >= 0 
                  ? `Great! You saved ${formatCurrency(netSavings, currency)} this period`
                  : `You have a deficit of ${formatCurrency(Math.abs(netSavings), currency)} this period`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <ExpenseChart transactions={transactions} currency={currency} />

      {/* IBM Granite AI Insights */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-success/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-success rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            IBM Granite AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-card/80 rounded-lg border">
              <h4 className="font-semibold text-foreground mb-2">🧠 Smart Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Based on your spending patterns, our AI suggests focusing on reducing expenses in your largest category ({topCategories.length > 0 ? topCategories[0][0] : 'N/A'}) which could improve your savings by up to 15%.
              </p>
            </div>
            
            <div className="p-4 bg-card/80 rounded-lg border">
              <h4 className="font-semibold text-foreground mb-2">💡 Budgeting Recommendation</h4>
              <p className="text-sm text-muted-foreground">
                {savingsRate < 20 
                  ? "Consider implementing the 50/30/20 rule: 50% needs, 30% wants, 20% savings. You're currently saving " + savingsRate.toFixed(1) + "%."
                  : "Excellent saving habits! Consider investing your surplus savings for long-term growth."
                }
              </p>
            </div>

            <div className="p-4 bg-card/80 rounded-lg border">
              <h4 className="font-semibold text-foreground mb-2">📊 Trend Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Your financial data shows a {netSavings >= 0 ? 'positive' : 'negative'} trend. 
                {netSavings >= 0 
                  ? " Keep maintaining this disciplined approach to reach your financial goals faster."
                  : " Focus on expense reduction and consider additional income sources to balance your budget."
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