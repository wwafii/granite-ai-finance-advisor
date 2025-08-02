import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TransactionData {
  date: string;
  description: string;
  amount: number;
  category: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactions } = await req.json() as { transactions: TransactionData[] };

    // Get IBM API key from Supabase secrets
    const ibmApiKey = Deno.env.get('IBM_API_KEY');
    if (!ibmApiKey) {
      throw new Error('IBM API key not configured');
    }

    // Prepare detailed transaction analysis for IBM Granite
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    // Advanced analytics for varied insights
    const categorySpending = transactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const transactionsByDate = transactions.reduce((acc, t) => {
      const date = t.date.substring(0, 10);
      if (!acc[date]) acc[date] = [];
      acc[date].push(t);
      return acc;
    }, {} as Record<string, TransactionData[]>);

    const avgDailySpending = totalExpenses / Object.keys(transactionsByDate).length;
    const highSpendingDays = Object.entries(transactionsByDate)
      .filter(([, dayTransactions]) => {
        const dayTotal = dayTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return dayTotal > avgDailySpending * 1.5;
      })
      .map(([date, dayTransactions]) => ({
        date,
        amount: dayTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
      }));

    const frequentMerchants = transactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => {
        const merchant = t.description.split(' ')[0].toUpperCase();
        acc[merchant] = (acc[merchant] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const timeOfMonth = new Date().getDate();
    const userPersonality = totalExpenses > totalIncome * 0.8 ? 'high-spender' : 
                           totalExpenses < totalIncome * 0.5 ? 'conservative-saver' : 'balanced';

    // Dynamic prompt based on user's financial personality and patterns
    const dynamicPrompt = `You are IBM Granite AI, a sophisticated financial advisor AI. Analyze this REAL user's financial data with deep personalization:

USER PROFILE DETECTED: ${userPersonality}
ANALYSIS DATE: ${new Date().toLocaleDateString()}
FINANCIAL SNAPSHOT:
- Income: $${totalIncome.toFixed(2)}
- Expenses: $${totalExpenses.toFixed(2)} 
- Net Position: $${(totalIncome - totalExpenses).toFixed(2)}
- Savings Rate: ${totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : '0'}%

TOP SPENDING CATEGORIES:
${sortedCategories.map(([cat, amount], i) => 
  `${i+1}. ${cat}: $${amount.toFixed(2)} (${((amount/totalExpenses)*100).toFixed(1)}%)`).join('\n')}

HIGH-SPENDING PATTERNS:
${highSpendingDays.length > 0 ? `Detected ${highSpendingDays.length} high-spending days averaging $${(highSpendingDays.reduce((sum, day) => sum + day.amount, 0) / highSpendingDays.length).toFixed(2)} per day` : 'No unusual spending spikes detected'}

DETAILED TRANSACTIONS (Last 10):
${transactions.slice(-10).map(t => 
  `${t.date}: ${t.description} → ${t.amount >= 0 ? '+' : ''}$${t.amount.toFixed(2)} [${t.category}]`).join('\n')}

Based on this SPECIFIC data, provide insights that are:
1. PERSONALIZED to this exact spending pattern
2. ACTIONABLE with specific dollar amounts
3. UNIQUE to their financial behavior
4. DATA-DRIVEN with percentages and calculations

Analyze and respond with:

💡 PERSONALIZED INSIGHTS (Based on YOUR specific data):
- Your unique spending signature: [describe their specific pattern]
- Compared to similar income levels, you are: [specific comparison]
- Your biggest financial strength: [specific to their data]
- Your primary financial risk: [specific concern]

📊 BEHAVIORAL ANALYSIS:
- Peak spending periods: [identify their specific patterns]
- Spending triggers detected: [based on transaction descriptions]
- Category dominance: [explain why certain categories dominate]
- Transaction frequency patterns: [daily/weekly analysis]

💰 CUSTOM OPTIMIZATION PLAN:
- Immediate savings potential: $[specific amount] monthly
- Quick wins: [3 specific actions with dollar impacts]
- Long-term strategy: [based on their exact situation]
- Category rebalancing: [specific percentage changes needed]

🎯 30-DAY ACTION PLAN:
- Week 1: [specific task with expected $X savings]
- Week 2: [specific task with expected $X savings]  
- Week 3: [specific task with expected $X savings]
- Week 4: [specific task with expected $X savings]

🔮 PREDICTIVE ANALYSIS:
- At current rate, in 6 months you'll have: $[calculation]
- If you reduce [top category] by 15%, you'll save: $[specific amount]
- Your financial trajectory: [improving/declining/stable with reasoning]

Be specific, use their exact numbers, and avoid generic advice. Reference their actual transaction descriptions and amounts.`;

    // Call IBM Granite AI with enhanced authentication and parameters
    const response = await fetch('https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ibmApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-IBM-User-Agent': 'Granite-Financial-Advisor/1.0'
      },
      body: JSON.stringify({
        input: dynamicPrompt,
        parameters: {
          decoding_method: "sample",
          max_new_tokens: 800,
          min_new_tokens: 400,
          stop_sequences: [],
          repetition_penalty: 1.1,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 50
        },
        model_id: "ibm/granite-13b-chat-v2",
        project_id: Deno.env.get('IBM_PROJECT_ID') || 'default'
      })
    });

    if (!response.ok) {
      throw new Error(`IBM Granite API error: ${response.status}`);
    }

    const data = await response.json();
    const insights = data.results[0]?.generated_text || 'Unable to generate insights at this time.';

    // Generate smart categorization suggestions
    const categorizationSuggestions = transactions
      .filter(t => t.category === 'Uncategorized' || !t.category)
      .slice(0, 5)
      .map(t => ({
        description: t.description,
        suggestedCategory: t.description.toLowerCase().includes('grocery') ? 'Food & Dining' :
                         t.description.toLowerCase().includes('gas') ? 'Transportation' :
                         t.description.toLowerCase().includes('netflix') ? 'Entertainment' :
                         'Other'
      }));

    // Calculate spending trends
    const monthlySpending = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

    console.log('Generated insights for', transactions.length, 'transactions');

    return new Response(JSON.stringify({
      insights,
      categorizationSuggestions,
      monthlySpending,
      totalIncome,
      totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : '0'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in granite-insights function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      insights: 'Unable to generate AI insights at this time. Please try again later.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});