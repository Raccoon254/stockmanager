// Validation utilities for forms

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`
  }
  return null
}

export const validateEmail = (email) => {
  if (!email) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) ? null : 'Please enter a valid email address'
}

export const validateNumber = (value, fieldName = 'Field', options = {}) => {
  const { min, max, allowDecimals = true, required = true } = options
  
  if (!value && !required) return null
  if (!value && required) return `${fieldName} is required`
  
  const numValue = parseFloat(value)
  
  if (isNaN(numValue)) {
    return `${fieldName} must be a valid number`
  }
  
  if (!allowDecimals && numValue % 1 !== 0) {
    return `${fieldName} must be a whole number`
  }
  
  if (min !== undefined && numValue < min) {
    return `${fieldName} must be at least ${min}`
  }
  
  if (max !== undefined && numValue > max) {
    return `${fieldName} must be no more than ${max}`
  }
  
  return null
}

export const validatePrice = (value, fieldName = 'Price') => {
  return validateNumber(value, fieldName, { min: 0, allowDecimals: true })
}

export const validateQuantity = (value, fieldName = 'Quantity') => {
  return validateNumber(value, fieldName, { min: 0, allowDecimals: false })
}

export const validateSKU = (sku) => {
  if (!sku) return null // SKU is optional, will be auto-generated
  
  if (sku.length < 3) {
    return 'SKU must be at least 3 characters long'
  }
  
  if (sku.length > 50) {
    return 'SKU must be no more than 50 characters long'
  }
  
  // Allow alphanumeric characters, hyphens, and underscores
  const skuRegex = /^[a-zA-Z0-9\-_]+$/
  if (!skuRegex.test(sku)) {
    return 'SKU can only contain letters, numbers, hyphens, and underscores'
  }
  
  return null
}

export const validateText = (value, fieldName = 'Field', options = {}) => {
  const { minLength, maxLength, required = true } = options
  
  if (!value && !required) return null
  if (!value && required) return `${fieldName} is required`
  
  const stringValue = value.toString().trim()
  
  if (minLength && stringValue.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`
  }
  
  if (maxLength && stringValue.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters long`
  }
  
  return null
}

export const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value
  
  // Remove any HTML tags and scripts for basic XSS protection
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

export const validateItemForm = (data) => {
  const errors = {}
  
  // Name validation
  const nameError = validateText(data.name, 'Product name', { minLength: 2, maxLength: 100 })
  if (nameError) errors.name = nameError
  
  // Category validation
  if (!data.category) errors.category = 'Category is required'
  
  // SKU validation (optional)
  const skuError = validateSKU(data.sku)
  if (skuError) errors.sku = skuError
  
  // Price validations
  const purchasePriceError = validatePrice(data.purchasePrice, 'Purchase price')
  if (purchasePriceError) errors.purchasePrice = purchasePriceError
  
  const sellingPriceError = validatePrice(data.sellingPrice, 'Selling price')
  if (sellingPriceError) errors.sellingPrice = sellingPriceError
  
  // Check if selling price is higher than purchase price
  const purchasePrice = parseFloat(data.purchasePrice)
  const sellingPrice = parseFloat(data.sellingPrice)
  if (!isNaN(purchasePrice) && !isNaN(sellingPrice)) {
    if (sellingPrice < purchasePrice) {
      errors.sellingPrice = 'Selling price should be higher than purchase price for profit'
    }
  }
  
  // Stock quantity validation
  const stockError = validateQuantity(data.stockQuantity, 'Stock quantity')
  if (stockError) errors.stockQuantity = stockError
  
  // Min stock level validation
  const minStockError = validateQuantity(data.minStockLevel, 'Minimum stock level')
  if (minStockError) errors.minStockLevel = minStockError
  
  // Description validation (optional)
  if (data.description) {
    const descError = validateText(data.description, 'Description', { 
      required: false, 
      maxLength: 500 
    })
    if (descError) errors.description = descError
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      name: sanitizeInput(data.name),
      description: sanitizeInput(data.description),
      category: sanitizeInput(data.category),
      sku: sanitizeInput(data.sku),
      purchasePrice: data.purchasePrice,
      sellingPrice: data.sellingPrice,
      stockQuantity: data.stockQuantity,
      minStockLevel: data.minStockLevel,
      stockAdjustmentReason: sanitizeInput(data.stockAdjustmentReason)
    }
  }
}

export const validateSaleForm = (data) => {
  const errors = {}
  
  // Items validation
  if (!data.items || data.items.length === 0) {
    errors.items = 'At least one item is required for a sale'
  }
  
  // Payment method validation
  if (!data.paymentMethod) {
    errors.paymentMethod = 'Payment method is required'
  }
  
  // Customer name validation (optional)
  if (data.customerName) {
    const customerError = validateText(data.customerName, 'Customer name', { 
      required: false, 
      maxLength: 100 
    })
    if (customerError) errors.customerName = customerError
  }
  
  // Discount validation
  if (data.discount !== undefined && data.discount !== null) {
    const discountError = validateNumber(data.discount, 'Discount', { min: 0, required: false })
    if (discountError) errors.discount = discountError
  }
  
  // Items quantity validation
  if (data.items && data.items.length > 0) {
    data.items.forEach((item, index) => {
      if (item.quantity > item.maxQuantity) {
        errors[`item_${index}_quantity`] = `Only ${item.maxQuantity} units of ${item.name} available in stock`
      }
    })
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      customerName: sanitizeInput(data.customerName),
      paymentMethod: sanitizeInput(data.paymentMethod),
      discount: data.discount,
      items: data.items
    }
  }
}