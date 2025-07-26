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
        input: `Analyze these financial transactions and provide intelligent insights:

Total Income: $${totalIncome.toFixed(2)}
Total Expenses: $${totalExpenses.toFixed(2)}
Categories: ${categories.join(', ')}

Transaction Details:
${transactionSummary}

Please provide:
1. Spending pattern analysis
2. Budget optimization suggestions
3. Potential savings opportunities
4. Financial health assessment
5. Anomaly detection (unusual transactions)

Keep the response concise and actionable.`,
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