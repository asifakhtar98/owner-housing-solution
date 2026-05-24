export interface Property {
  id: string
  slug: string
  title: string
  type: 'apartment' | 'house' | 'villa' | 'plot' | 'commercial' | 'pg' | 'office' | 'shop' | 'warehouse'
  category: 'buy' | 'rent'
  price: number
  priceUnit: 'total' | 'monthly'
  area: number
  areaUnit: string
  bedrooms: number
  bathrooms: number
  furnishing: 'fully-furnished' | 'semi-furnished' | 'unfurnished' | 'na'
  location: {
    city: string
    locality: string
    state: string
    pincode: string
  }
  description: string
  features: string[]
  images: string[]
  contact: {
    name: string
    phone: string
    isOwner: boolean
  }
  postedDate: string
  featured: boolean
}

/**
 * Format price in Indian notation (lakhs / crores)
 */
export function formatPrice(price: number, priceUnit: string): string {
  if (priceUnit === 'monthly') {
    return `₹${price.toLocaleString('en-IN')}/mo`
  }

  if (price >= 10000000) {
    const crores = price / 10000000
    const formatted = crores % 1 === 0 ? crores.toString() : crores.toFixed(2).replace(/\.?0+$/, '')
    return `₹${formatted} Cr`
  }

  if (price >= 100000) {
    const lakhs = price / 100000
    const formatted = lakhs % 1 === 0 ? lakhs.toString() : lakhs.toFixed(2).replace(/\.?0+$/, '')
    return `₹${formatted} L`
  }

  return `₹${price.toLocaleString('en-IN')}`
}

/**
 * Get human-readable property type label
 */
export function getPropertyTypeLabel(type: Property['type']): string {
  const labels: Record<Property['type'], string> = {
    apartment: 'Apartment',
    house: 'House',
    villa: 'Villa',
    plot: 'Plot/Land',
    commercial: 'Commercial',
    pg: 'PG',
    office: 'Office',
    shop: 'Shop',
    warehouse: 'Warehouse',
  }
  return labels[type] || type
}

/**
 * Get furnishing label
 */
export function getFurnishingLabel(furnishing: Property['furnishing']): string {
  const labels: Record<Property['furnishing'], string> = {
    'fully-furnished': 'Fully Furnished',
    'semi-furnished': 'Semi Furnished',
    'unfurnished': 'Unfurnished',
    'na': 'N/A',
  }
  return labels[furnishing] || furnishing
}

/**
 * Get relative time string from date
 */
export function getRelativeTime(dateStr: string): string {
  const posted = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - posted.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}
