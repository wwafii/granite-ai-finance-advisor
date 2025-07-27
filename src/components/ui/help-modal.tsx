import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Upload, BarChart3, Brain, Shield, FileText } from "lucide-react";

export function HelpModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">How to Use</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-success rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span>How to Use Casha - Your AI Financial Advisor</span>
          </DialogTitle>
          <DialogDescription>
            Learn how to get the most out of your personal finance management
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Getting Started */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Getting Started</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Welcome to Casha! This application helps you analyze your spending patterns and get personalized financial insights using AI.</p>
              <p>Your data is processed securely and never shared with third parties.</p>
            </div>
          </div>

          {/* Step 1: Upload Data */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Step 1: Upload Your Financial Data</h3>
              <Badge variant="outline">Required</Badge>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Supported Format:</strong> CSV files only</p>
              <p><strong>Required Columns:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><code className="bg-muted px-1 rounded">date</code> - Transaction date (YYYY-MM-DD format)</li>
                <li><code className="bg-muted px-1 rounded">description</code> - Transaction description</li>
                <li><code className="bg-muted px-1 rounded">amount</code> - Transaction amount (positive for income, negative for expenses)</li>
                <li><code className="bg-muted px-1 rounded">category</code> - Transaction category (e.g., Food, Transportation, Salary)</li>
              </ul>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium mb-2">Example CSV format:</p>
                <code className="text-xs">
                  date,description,amount,category<br/>
                  2024-01-15,Grocery Store,-85.50,Food<br/>
                  2024-01-16,Salary,3000.00,Income<br/>
                  2024-01-17,Gas Station,-45.20,Transportation
                </code>
              </div>
            </div>
          </div>

          {/* Step 2: Review Analysis */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-success" />
              <h3 className="text-lg font-semibold">Step 2: Review Your Financial Analysis</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>After uploading your data, you'll see:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Spending Overview:</strong> Visual charts showing your income vs expenses</li>
                <li><strong>Category Breakdown:</strong> See where your money goes by category</li>
                <li><strong>Monthly Trends:</strong> Track your financial patterns over time</li>
                <li><strong>Key Metrics:</strong> Total income, expenses, and net savings</li>
              </ul>
            </div>
          </div>

          {/* Step 3: Get AI Insights */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-warning" />
              <h3 className="text-lg font-semibold">Step 3: Get AI-Powered Insights</h3>
              <Badge variant="secondary">IBM Granite AI</Badge>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Our AI analyzes your data to provide:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Spending Pattern Analysis:</strong> Identify trends and habits</li>
                <li><strong>Budget Recommendations:</strong> Personalized suggestions for improvement</li>
                <li><strong>Savings Opportunities:</strong> Find areas where you can cut costs</li>
                <li><strong>Financial Health Score:</strong> Overall assessment of your financial habits</li>
              </ul>
            </div>
          </div>

          {/* Data Privacy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Data Privacy & Security</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Your financial data is processed securely and encrypted</li>
                <li>Data is only used for generating your personal insights</li>
                <li>No personal information is shared with third parties</li>
                <li>You can delete your data at any time</li>
              </ul>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-primary/5 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-primary">💡 Pro Tips</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Upload at least 3 months of data for better insights</li>
              <li>Use consistent category names for accurate analysis</li>
              <li>Include both income and expense transactions</li>
              <li>Check your CSV file format before uploading</li>
              <li>Regular uploads help track your progress over time</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}