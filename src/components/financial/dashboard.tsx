import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, TrendingUp, TrendingDown, PiggyBank, Target } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import UploadCSV from "./upload-csv";

interface TransactionData {
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface FinancialDashboardProps {
  onDataUpload?: (data: TransactionData[]) => void;
}

const FinancialDashboard = ({ onDataUpload }: FinancialDashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-2 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header with Theme Toggle */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div></div>
            <ThemeToggle />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-success rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg sm:text-2xl">C</span>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                Casha
              </h1>
              <p className="text-sm sm:text-lg text-muted-foreground mt-1 sm:mt-2">
                AI-Powered Personal Finance Advisor
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-4">
            Transform your financial data into actionable insights with our intelligent budgeting assistant
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-income to-success">
            <CardContent className="p-3 sm:p-6 text-center">
              <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-income-foreground" />
              <h3 className="text-lg sm:text-2xl font-bold text-income-foreground">$0</h3>
              <p className="text-xs sm:text-sm text-income-foreground/80">Total Income</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-expense to-destructive">
            <CardContent className="p-3 sm:p-6 text-center">
              <TrendingDown className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-expense-foreground" />
              <h3 className="text-lg sm:text-2xl font-bold text-expense-foreground">$0</h3>
              <p className="text-xs sm:text-sm text-expense-foreground/80">Total Expenses</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary to-primary/80">
            <CardContent className="p-3 sm:p-6 text-center">
              <PiggyBank className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-primary-foreground" />
              <h3 className="text-lg sm:text-2xl font-bold text-primary-foreground">$0</h3>
              <p className="text-xs sm:text-sm text-primary-foreground/80">Net Savings</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-warning to-warning/80">
            <CardContent className="p-3 sm:p-6 text-center">
              <Target className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-warning-foreground" />
              <h3 className="text-lg sm:text-2xl font-bold text-warning-foreground">0%</h3>
              <p className="text-xs sm:text-sm text-warning-foreground/80">Budget Goal</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section - Now Functional */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-3 sm:pb-4 px-3 sm:px-6">
            <CardTitle className="text-lg sm:text-2xl font-bold text-foreground">Start Your Financial Analysis</CardTitle>
            <p className="text-muted-foreground text-sm sm:text-base">Upload your transaction data to get personalized insights powered by IBM Granite AI</p>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <UploadCSV onDataUpload={onDataUpload} />
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 sm:space-x-3">
                <TrendingUp className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                <span className="text-lg sm:text-xl">Pattern Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm sm:text-lg">
                AI analyzes your spending patterns and provides deep insights into your financial behavior
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 sm:space-x-3">
                <PiggyBank className="h-5 w-5 sm:h-7 sm:w-7 text-success" />
                <span className="text-lg sm:text-xl">Smart Savings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm sm:text-lg">
                Get personalized recommendations to save more effectively and reach your financial goals
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 sm:space-x-3">
                <Target className="h-5 w-5 sm:h-7 sm:w-7 text-warning" />
                <span className="text-lg sm:text-xl">Auto Budgeting</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm sm:text-lg">
                Automated budget planning that adapts to your lifestyle and financial goals
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;