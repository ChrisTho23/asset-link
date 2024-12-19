async function fetchPrice(type, ticker) {
    switch (type) {
        case 'stock':
            const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
            const response = await fetch(
                `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=compact&apikey=${apiKey}`
            );

            const data = await response.json();

            // Check for API error response
            if (data['Error Message']) {
                throw new Error(`Alpha Vantage API error: ${data['Error Message']}`);
            }

            // Get the most recent day's data
            const timeSeries = data['Time Series (Daily)'];
            if (!timeSeries) {
                throw new Error('No data returned from Alpha Vantage');
            }

            const mostRecentDate = Object.keys(timeSeries)[0];
            const mostRecentData = timeSeries[mostRecentDate];

            return {
                name: ticker.toUpperCase(), // Alpha Vantage doesn't provide company names
                price: parseFloat(mostRecentData['4. close'])
            };

        case 'crypto':
            // TODO: Implement crypto price fetching
            throw new Error('Crypto price fetching not yet implemented');

        case 'precious_metals':
            // TODO: Implement precious metals price fetching
            throw new Error('Precious metals price fetching not yet implemented');

        default:
            throw new Error('Invalid asset type for ticker lookup');
    }
}

export default fetchPrice;