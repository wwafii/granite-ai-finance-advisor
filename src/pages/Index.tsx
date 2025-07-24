import { useState } from "react";
import FinancialDashboard from "@/components/financial/dashboard";
import UploadCSV from "@/components/financial/upload-csv";
import FinancialSummary from "@/components/financial/financial-summary";

interface TransactionData {
  date: string;
  description: string;
  amount: number;
  category: string;
}

const Index = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'upload' | 'summary'>('dashboard');

  const handleDataUpload = (data: TransactionData[]) => {
    setTransactions(data);
    setCurrentView('summary');
  };

  const renderView = () => {
    switch (currentView) {
      case 'upload':
        return <UploadCSV onDataUpload={handleDataUpload} />;
      case 'summary':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-success rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                    Casha
                  </h1>
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Your Financial Analysis
                </h2>
                <p className="text-muted-foreground text-lg">
                  Here's your financial summary and insights from your transaction data
                </p>
              </div>
              <FinancialSummary transactions={transactions} />
            </div>
          </div>
        );
      default:
        return <FinancialDashboard />;
    }
  };

  return (
    <div>
      {/* Navigation */}
      {currentView !== 'dashboard' && (
        <div className="bg-card border-b p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-success rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-primary hover:text-primary/80 font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
            {currentView === 'summary' && (
              <button
                onClick={() => setCurrentView('upload')}
                className="bg-gradient-to-r from-primary to-success text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Upload New Data
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Main Content */}
      {renderView()}
      
      {/* Floating Upload Button for Dashboard */}
      {currentView === 'dashboard' && (
        <button
          onClick={() => setCurrentView('upload')}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-primary to-success text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Upload Financial Data"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Index;
