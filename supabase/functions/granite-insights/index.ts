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

    // Prepare transaction summary for IBM Granite
    const transactionSummary = transactions.map(t => 
      `${t.date}: ${t.description} - ${t.amount} (${t.category})`
    ).join('\n');

    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const categories = [...new Set(transactions.map(t => t.category))];

    // Call IBM Granite AI for financial insights
    const response = await fetch('https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ibmApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        input: `As a professional financial advisor, analyze these detailed financial transactions and provide comprehensive insights:

FINANCIAL OVERVIEW:
• Total Income: $${totalIncome.toFixed(2)}
• Total Expenses: $${totalExpenses.toFixed(2)}
• Net Savings: $${(totalIncome - totalExpenses).toFixed(2)}
• Savings Rate: ${totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : '0'}%
• Active Categories: ${categories.join(', ')}
• Transaction Count: ${transactions.length}

TRANSACTION DETAILS:
${transactionSummary}

Please provide a DETAILED financial analysis covering:

📊 SPENDING PATTERN ANALYSIS:
- Identify your top 3 spending categories and their percentage of total expenses
- Analyze spending frequency and timing patterns
- Compare spending habits across different time periods
- Highlight any seasonal or cyclical spending trends

💰 BUDGET OPTIMIZATION STRATEGIES:
- Provide specific percentage reduction targets for overspending categories
- Suggest realistic monthly budget allocations for each category
- Recommend the 50/30/20 rule application to your specific situation
- Identify categories where you can implement immediate cost-cutting measures

🎯 SAVINGS OPPORTUNITIES:
- Calculate potential monthly savings from reducing specific expenses by 10-20%
- Identify subscriptions or recurring charges that could be eliminated
- Suggest switching to more cost-effective alternatives for major expense categories
- Recommend optimal savings goals based on your income level

🏥 FINANCIAL HEALTH ASSESSMENT:
- Rate your financial health on a scale of 1-10 with detailed reasoning
- Assess your emergency fund adequacy (aim for 3-6 months of expenses)
- Evaluate your debt-to-income ratio if applicable
- Compare your savings rate to recommended financial benchmarks

🚨 ANOMALY & RISK DETECTION:
- Flag any unusually large transactions that deviate from normal patterns
- Identify potential fraudulent or duplicate charges
- Highlight categories with sudden spending spikes
- Warn about any concerning financial trends

🔮 ACTIONABLE RECOMMENDATIONS:
- Provide 5 specific, measurable action items you can implement this month
- Suggest apps, tools, or methods to track and improve spending habits
- Recommend a personalized 3-month financial improvement plan
- Set realistic short-term and long-term financial goals

Format your response with clear headers, bullet points, and specific numbers. Be thorough yet practical in your recommendations.`,
        parameters: {
          decoding_method: "greedy",
          max_new_tokens: 500,
          min_new_tokens: 0,
          stop_sequences: [],
          repetition_penalty: 1
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