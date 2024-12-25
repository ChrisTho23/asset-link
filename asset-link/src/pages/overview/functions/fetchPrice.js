import { supportedCryptos } from "./cryptoConfig";
import { supportedPreciousMetals } from "./preciousMetalsConfig";
import axios from "axios";

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
            const crypto = supportedCryptos.find(c => c.symbol === ticker);
            if (!crypto) {
                throw new Error('Unsupported cryptocurrency');
            }

            try {
                const response = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.id}&vs_currencies=usd`,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                return {
                    name: crypto.name,
                    price: response.data[crypto.id].usd,
                }
            } catch (error) {
                console.error('Error fetching crypto price:', error);
                throw new Error('Failed to fetch cryptocurrency price');
            }

        case 'precious_metals':
            const metal = supportedPreciousMetals.find(m => m.symbol === ticker);
            if (!metal) {
                throw new Error('Unsupported precious metal!');
            }
            try {
                const response = await fetch(
                    `https://www.goldapi.io/api/${metal.symbol}/USD`,
                    {
                        headers: {
                            'x-access-token': import.meta.env.VITE_GOLDAPI_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch precious metal price');
                }

                const data = await response.json();
                return {
                    name: metal.name,
                    price: data.price
                };
            } catch (error) {
                console.error('Error fetching precious metal price:', error);
                throw new Error('Failed to fetch precious metal price');
            }

        default:
            throw new Error('Invalid asset type for ticker lookup');
    }
}

export default fetchPrice;