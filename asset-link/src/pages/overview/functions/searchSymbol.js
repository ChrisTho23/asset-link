async function searchSymbol(query) {
    try {
        const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
        const response = await fetch(
            `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`
        );

        const data = await response.json();

        if (data['Error Message']) {
            throw new Error(`Alpha Vantage API error: ${data['Error Message']}`);
        }

        return data.bestMatches?.map(match => ({
            symbol: match['1. symbol'],
            name: match['2. name'],
            type: match['3. type'],
            region: match['4. region']
        })) || [];
    } catch (error) {
        console.error('Error searching symbols:', error);
        return [];
    }
}

export default searchSymbol; 