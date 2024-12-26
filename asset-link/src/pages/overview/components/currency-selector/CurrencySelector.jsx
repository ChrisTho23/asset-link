import { useState } from 'react';
import './CurrencySelector.css';

const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
];

const CurrencySelector = ({ selectedCurrency, onCurrencyChange }) => {
    return (
        <div className="currency-selector">
            {currencies.map(currency => (
                <button
                    key={currency.code}
                    className={`currency-button ${selectedCurrency.code === currency.code ? 'active' : ''}`}
                    onClick={() => onCurrencyChange(currency)}
                >
                    {currency.symbol} {currency.code}
                </button>
            ))}
        </div>
    );
};

export default CurrencySelector;
export { currencies }; 