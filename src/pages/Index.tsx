import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import FinancialDashboard from "@/components/financial/dashboard";
import FinancialSummary from "@/components/financial/financial-summary";
import UploadCSV from "@/components/financial/upload-csv";
import { HelpModal } from "@/components/ui/help-modal";
import { ChangePasswordModal } from "@/components/ui/change-password-modal";
import { DeleteAccountModal } from "@/components/ui/delete-account-modal";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

interface TransactionData {
  date: string;
  description: string;
  amount: number;
  category: string;
}

const Index = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'upload' | 'summary'>('dashboard');
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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
          <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-2 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
              <div className="text-center space-y-2 sm:space-y-4">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-success rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-lg">C</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                    Casha
                  </h1>
                </div>
                <h2 className="text-lg sm:text-2xl font-semibold text-foreground">
                  Your Financial Analysis
                </h2>
                <p className="text-muted-foreground text-sm sm:text-lg px-4">
                  Here's your financial summary and insights from your transaction data
                </p>
              </div>
              <FinancialSummary transactions={transactions} />
            </div>
          </div>
        );
      default:
        return <FinancialDashboard onDataUpload={handleDataUpload} />;
    }
  };

  if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>
      );
    }

    if (!user) {
      return null; // Will redirect to auth
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <nav className="p-2 sm:p-4 border-b bg-background/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Finance Advisor
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('dashboard')}
                  size="sm"
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentView === 'summary' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('summary')}
                  size="sm"
                  disabled={transactions.length === 0}
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  Analysis
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate max-w-[120px] sm:max-w-none">
                    {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <HelpModal />
                  <ChangePasswordModal />
                  <DeleteAccountModal />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="sm:inline">Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto p-2 sm:p-6">
          {renderView()}
        </div>

        {/* Floating Upload Button for Dashboard */}
        {currentView === 'dashboard' && (
          <Button
            onClick={() => setCurrentView('upload')}
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-r from-primary to-success shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-full p-3 sm:p-4"
            aria-label="Upload Financial Data"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </Button>
        )}
    </div>
  );
};

export default Index;
