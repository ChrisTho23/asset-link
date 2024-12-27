import axios from 'axios';

const currencyCache = {
    rates: {},
    timestamp: null,
    expiryTime: 1000 * 60 * 60 * 24 // 24 hours
};

const getCacheKey = (fromCurrency, toCurrency) => `${fromCurrency}_${toCurrency}`;

const isRateCached = (fromCurrency, toCurrency) => {
    const cacheKey = getCacheKey(fromCurrency, toCurrency);
    const now = Date.now();
    return (
        currencyCache.rates[cacheKey] &&
        currencyCache.timestamp &&
        (now - currencyCache.timestamp) < currencyCache.expiryTime
    );
};

const getCachedRate = (fromCurrency, toCurrency) => {
    const cacheKey = getCacheKey(fromCurrency, toCurrency);
    return currencyCache.rates[cacheKey];
};

const setCachedRate = (fromCurrency, toCurrency, rate) => {
    const cacheKey = getCacheKey(fromCurrency, toCurrency);
    currencyCache.rates[cacheKey] = rate;
    currencyCache.timestamp = Date.now();
};

const fetchExchangeRate = async (fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return 1;

    // Check cache first
    if (isRateCached(fromCurrency, toCurrency)) {
        return getCachedRate(fromCurrency, toCurrency);
    }

    try {
        const response = await axios.get(
            `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
        );

        const rate = parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);

        // Update cache
        setCachedRate(fromCurrency, toCurrency, rate);

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

// Add new export to check if we need to convert
export const needsConversion = (fromCurrency, toCurrency) => {
    return !isRateCached(fromCurrency, toCurrency) && fromCurrency !== toCurrency;
}; 