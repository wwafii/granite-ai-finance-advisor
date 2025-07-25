import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Zap, TrendingUp } from "lucide-react";

interface TransactionData {
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface GraniteInsightsProps {
  transactions: TransactionData[];
  currency: string;
}

export const GraniteInsights = ({ transactions, currency }: GraniteInsightsProps) => {
  // This component will integrate with IBM Granite via Supabase Edge Functions
  
  const generateSmartInsights = () => {
    // This would call IBM Granite AI via Supabase Edge Function
    console.log("Calling IBM Granite AI for advanced insights...");
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-success/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-success rounded-lg flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">IBM Granite AI Insights</h3>
            <p className="text-sm text-muted-foreground font-normal">
              Powered by IBM's advanced AI for comprehensive financial analysis
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-card/80 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground">Smart Categorization</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              AI automatically categorizes and analyzes transaction patterns for better insights
            </p>
          </div>
          
          <div className="p-4 bg-card/80 rounded-lg border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <h4 className="font-semibold text-foreground">Predictive Analytics</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Forecasts future spending trends and identifies potential savings opportunities
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-warning/10 to-primary/10 p-4 rounded-lg border border-warning/20">
          <h4 className="font-semibold text-foreground mb-2">🔗 Connect IBM Granite AI</h4>
          <p className="text-sm text-muted-foreground mb-3">
            To unlock advanced AI-powered financial insights, connect this app to IBM Granite through Supabase integration.
          </p>
          <Button 
            onClick={generateSmartInsights}
            className="bg-gradient-to-r from-primary to-success hover:from-primary/90 hover:to-success/90"
          >
            Setup AI Integration
          </Button>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <strong>Note:</strong> IBM Granite integration requires Supabase backend setup for advanced AI features including:
          • Real-time spending analysis • Anomaly detection • Personalized budget recommendations • Smart savings goals
        </div>
      </CardContent>
    </Card>
  );
};