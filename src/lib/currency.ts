// Define currency patterns and their detection rules
const CURRENCY_PATTERNS = {
  USD: {
    symbols: ['$', 'usd', 'dollar', 'us'],
    locales: ['en-US'],
    avgAmountRange: [1, 50000],
    decimalSeparator: '.',
    thousandSeparator: ','
  },
  EUR: {
    symbols: ['€', 'eur', 'euro'],
    locales: ['en-GB', 'de-DE', 'fr-FR'],
    avgAmountRange: [1, 50000],
    decimalSeparator: ',',
    thousandSeparator: '.'
  },
  GBP: {
    symbols: ['£', 'gbp', 'pound', 'sterling'],
    locales: ['en-GB'],
    avgAmountRange: [1, 50000],
    decimalSeparator: '.',
    thousandSeparator: ','
  },
  JPY: {
    symbols: ['¥', 'jpy', 'yen'],
    locales: ['ja-JP'],
    avgAmountRange: [100, 1000000],
    decimalSeparator: '.',
    thousandSeparator: ','
  },
  IDR: {
    symbols: ['rp', 'idr', 'rupiah', 'indonesia', 'indo'],
    locales: ['id-ID'],
    avgAmountRange: [1000, 100000000],
    decimalSeparator: ',',
    thousandSeparator: '.'
  },
  CNY: {
    symbols: ['¥', '￥', 'cny', 'yuan', 'rmb'],
    locales: ['zh-CN'],
    avgAmountRange: [1, 100000],
    decimalSeparator: '.',
    thousandSeparator: ','
  },
  INR: {
    symbols: ['₹', 'inr', 'rupee', 'rs'],
    locales: ['en-IN'],
    avgAmountRange: [10, 1000000],
    decimalSeparator: '.',
    thousandSeparator: ','
  },
  KRW: {
    symbols: ['₩', 'krw', 'won'],
    locales: ['ko-KR'],
    avgAmountRange: [1000, 10000000],
    decimalSeparator: '.',
    thousandSeparator: ','
  },
  CAD: {
    symbols: ['cad', 'c$', 'canadian'],
    locales: ['en-CA'],
    avgAmountRange: [1, 50000],
    decimalSeparator: '.',
    thousandSeparator: ','
  },
  AUD: {
    symbols: ['aud', 'a$', 'australian'],
    locales: ['en-AU'],
    avgAmountRange: [1, 50000],
    decimalSeparator: '.',
    thousandSeparator: ','
  }
};

export const detectCurrency = (transactions: Array<{ description: string; amount: number }>) => {
  if (!transactions || transactions.length === 0) return 'USD';
  
  const allText = transactions.map(t => t.description.toLowerCase()).join(' ');
  const averageAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactions.length;
  
  // Score each currency based on keyword matches and amount patterns
  const currencyScores: Record<string, number> = {};
  
  Object.entries(CURRENCY_PATTERNS).forEach(([currency, pattern]) => {
    let score = 0;
    
    // Check for keyword matches
    pattern.symbols.forEach(symbol => {
      const regex = new RegExp(`\\b${symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = (allText.match(regex) || []).length;
      score += matches * 10;
    });
    
    // Check if average amount fits typical range for this currency
    if (averageAmount >= pattern.avgAmountRange[0] && averageAmount <= pattern.avgAmountRange[1]) {
      score += 5;
    }
    
    // Bonus for very large amounts (likely IDR, JPY, KRW)
    if (averageAmount > 10000) {
      if (['IDR', 'JPY', 'KRW'].includes(currency)) {
        score += 3;
      }
    }
    
    // Bonus for very small amounts (likely USD, EUR, GBP)
    if (averageAmount < 1000) {
      if (['USD', 'EUR', 'GBP', 'CAD', 'AUD'].includes(currency)) {
        score += 3;
      }
    }
    
    currencyScores[currency] = score;
  });
  
  // Find the currency with the highest score
  const detectedCurrency = Object.entries(currencyScores)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'USD';
  
  return detectedCurrency;
};

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  // Get the appropriate locale for the currency
  const currencyConfig = CURRENCY_PATTERNS[currency as keyof typeof CURRENCY_PATTERNS];
  const locale = currencyConfig?.locales[0] || 'en-US';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: ['JPY', 'KRW', 'IDR'].includes(currency) ? 0 : 2,
      maximumFractionDigits: ['JPY', 'KRW', 'IDR'].includes(currency) ? 0 : 2,
    }).format(amount);
  } catch (error) {
    // Fallback to USD if currency is not supported
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  }
};

// Enhanced amount parsing function to handle various currency formats
export const parseAmount = (amountStr: string, currency: string = 'USD'): number => {
  if (typeof amountStr === 'number') return amountStr;
  
  const currencyConfig = CURRENCY_PATTERNS[currency as keyof typeof CURRENCY_PATTERNS];
  let cleanStr = String(amountStr).trim();
  
  // Remove currency symbols
  if (currencyConfig) {
    currencyConfig.symbols.forEach(symbol => {
      const regex = new RegExp(symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      cleanStr = cleanStr.replace(regex, '');
    });
  }
  
  // Remove common currency symbols
  cleanStr = cleanStr.replace(/[$€£¥₹₩￥]/g, '');
  
  // Handle different decimal and thousand separators
  if (currencyConfig?.decimalSeparator === ',' && currencyConfig?.thousandSeparator === '.') {
    // European format (1.234,56)
    const parts = cleanStr.split(',');
    if (parts.length === 2) {
      const integerPart = parts[0].replace(/\./g, '');
      const decimalPart = parts[1];
      cleanStr = integerPart + '.' + decimalPart;
    } else {
      cleanStr = cleanStr.replace(/\./g, '');
    }
  } else {
    // US format (1,234.56)
    cleanStr = cleanStr.replace(/,/g, '');
  }
  
  // Remove any remaining non-numeric characters except decimal point and minus sign
  cleanStr = cleanStr.replace(/[^\d.-]/g, '');
  
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
};