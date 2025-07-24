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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                  Analisis Keuangan Anda
                </h1>
                <p className="text-muted-foreground text-lg">
                  Berikut adalah ringkasan dan insight dari data transaksi Anda
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
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-primary hover:text-primary/80 font-medium"
            >
              ← Kembali ke Dashboard
            </button>
            {currentView === 'summary' && (
              <button
                onClick={() => setCurrentView('upload')}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Upload Data Baru
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
          aria-label="Upload CSV"
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
