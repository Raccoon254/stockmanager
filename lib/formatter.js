
export function formatLargeNumber(value) {
    if (typeof value !== 'number') {
        // Check if it's a string with KSH prefix
        if (typeof value === 'string' && value.toUpperCase().includes('KSH')) {
            const numericValue = parseFloat(value.toUpperCase().replace('KSH', '').trim())
            if (isNaN(numericValue)) return value

            // Format the number
            let formattedValue
            if (numericValue >= 1e9) formattedValue = `${(numericValue / 1e9).toFixed(1)}B`
            else if (numericValue >= 1e6) formattedValue = `${(numericValue / 1e6).toFixed(1)}M`
            else if (numericValue >= 1e3) formattedValue = `${(numericValue / 1e3).toFixed(1)}K`
            else formattedValue = numericValue.toString()

            // Add KSH prefix back
            return `KSH ${formattedValue}`
        }
        return value
    }
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
    return value.toString()
}