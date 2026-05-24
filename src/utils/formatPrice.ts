export const DEFAULT_PHONE = '+917002689673'

export const DEFAULT_CONTACT = {
  name: 'Owner Housing',
  phone: DEFAULT_PHONE,
  isOwner: false,
}

/**
 * Raw property shape as stored in properties.json.
 * Only id, slug, title, type, category, price, priceUnit are required.
 */
export interface Property {
  id: string
  slug: string
  title: string
  type: 'apartment' | 'house' | 'villa' | 'plot' | 'commercial' | 'pg' | 'office' | 'shop' | 'warehouse'
  category: 'buy' | 'rent'
  price: number
  priceUnit: 'total' | 'monthly'
  area?: number
  areaUnit?: string
  bedrooms?: number
  bathrooms?: number
  furnishing?: 'fully-furnished' | 'semi-furnished' | 'unfurnished' | 'na'
  location: {
    city: string
    locality?: string
    state?: string
    pincode?: string
    lat?: number
    lng?: number
  }
  description?: string
  features?: string[]
  images?: string[]
  contact?: {
    name?: string
    phone?: string
    isOwner?: boolean
  }
  postedDate?: string
  featured?: boolean
  offerings?: string[]
}

/**
 * Fully resolved property with all defaults applied.
 * Consumers should use this type for rendering.
 */
export interface ResolvedProperty {
  id: string
  slug: string
  title: string
  type: Property['type']
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
    lat: number
    lng: number
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
  offerings: string[]
}

/**
 * Apply defaults to a partial Property, returning a fully populated object.
 */
export function resolveProperty(p: Property): ResolvedProperty {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    type: p.type,
    category: p.category,
    price: p.price,
    priceUnit: p.priceUnit,
    area: p.area ?? 0,
    areaUnit: p.areaUnit ?? 'sqft',
    bedrooms: p.bedrooms ?? 0,
    bathrooms: p.bathrooms ?? 0,
    furnishing: p.furnishing ?? 'na',
    location: {
      city: p.location.city,
      locality: p.location.locality ?? '',
      state: p.location.state ?? 'Assam',
      pincode: p.location.pincode ?? '',
      lat: p.location.lat ?? 0,
      lng: p.location.lng ?? 0,
    },
    description: p.description ?? '',
    features: p.features ?? [],
    images: p.images ?? [],
    contact: {
      name: p.contact?.name ?? DEFAULT_CONTACT.name,
      phone: p.contact?.phone ?? DEFAULT_CONTACT.phone,
      isOwner: p.contact?.isOwner ?? DEFAULT_CONTACT.isOwner,
    },
    postedDate: p.postedDate ?? new Date().toISOString().split('T')[0],
    featured: p.featured ?? false,
    offerings: p.offerings ?? [p.category],
  }
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
export function getFurnishingLabel(furnishing: NonNullable<Property['furnishing']>): string {
  const labels: Record<NonNullable<Property['furnishing']>, string> = {
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

/**
 * Get human-readable offering label
 */
export function getOfferingLabel(offering: string): string {
  const labels: Record<string, string> = {
    buy: 'Sale',
    rent: 'Rent',
    pg: 'PG',
    shop: 'Shop',
  }
  return labels[offering] || offering
}
