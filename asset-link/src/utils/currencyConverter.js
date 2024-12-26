import axios from 'axios';

const currencyCache = {
    rates: {},
    timestamp: null,
    expiryTime: 1000 * 60 * 60 // 1 hour
};

const fetchExchangeRate = async (fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return 1;

    const cacheKey = `${fromCurrency}_${toCurrency}`;
    const now = Date.now();

    // Check cache
    if (
        currencyCache.rates[cacheKey] &&
        currencyCache.timestamp &&
        (now - currencyCache.timestamp) < currencyCache.expiryTime
    ) {
        return currencyCache.rates[cacheKey];
    }

    try {
        const response = await axios.get(
            `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
        );

        const rate = parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);

        // Update cache
        currencyCache.rates[cacheKey] = rate;
        currencyCache.timestamp = now;

        return rate;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        throw new Error('Failed to fetch exchange rate');
    }
};

export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    const rate = await fetchExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
}; 