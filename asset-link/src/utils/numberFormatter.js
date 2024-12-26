export const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';

    return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}; 