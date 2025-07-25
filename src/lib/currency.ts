export const detectCurrency = (transactions: Array<{ description: string; amount: number }>) => {
  // Check for IDR/Rupiah indicators in transaction descriptions
  const idrKeywords = ['idr', 'rupiah', 'rp', 'indonesia', 'indo'];
  const usdKeywords = ['usd', 'dollar', '$', 'us'];
  
  const descriptions = transactions.map(t => t.description.toLowerCase()).join(' ');
  
  const idrCount = idrKeywords.reduce((count, keyword) => 
    count + (descriptions.includes(keyword) ? 1 : 0), 0
  );
  
  const usdCount = usdKeywords.reduce((count, keyword) => 
    count + (descriptions.includes(keyword) ? 1 : 0), 0
  );
  
  // Also check typical amount patterns (IDR typically has larger numbers)
  const averageAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactions.length;
  
  // If average transaction is > 10000, likely IDR
  if (averageAmount > 10000 || idrCount > usdCount) {
    return 'IDR';
  }
  
  return 'USD';
};

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};