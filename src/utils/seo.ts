import type { Property } from './formatPrice'

const BASE_URL = 'https://ownerhousing.in'

/**
 * Generate JSON-LD for a RealEstateListing (detail pages)
 */
export function generateListingJsonLd(property: Property): object {
  const schemaTypeMap: Record<string, string> = {
    apartment: 'Apartment',
    house: 'SingleFamilyResidence',
    villa: 'SingleFamilyResidence',
    plot: 'LandForm',
    pg: 'Accommodation',
    office: 'OfficeBuilding',
    shop: 'Store',
    warehouse: 'Warehouse',
    commercial: 'CivicStructure',
  }

  const propertySchema: Record<string, unknown> = {
    '@type': schemaTypeMap[property.type] || 'Residence',
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.location.locality,
      addressLocality: property.location.city,
      addressRegion: property.location.state,
      postalCode: property.location.pincode,
      addressCountry: 'IN',
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitText: property.areaUnit,
    },
  }

  if (property.bedrooms > 0) {
    propertySchema.numberOfRooms = property.bedrooms
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    url: `${BASE_URL}/listing/${property.slug}`,
    description: property.description,
    datePosted: property.postedDate,
    image: property.images[0],
    about: propertySchema,
    offers: {
      '@type': 'Offer',
      price: property.price.toString(),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  }
}

/**
 * Generate JSON-LD for the WebSite (homepage)
 */
export function generateWebsiteJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Owner Housing',
    url: BASE_URL,
    description: 'Buy & rent properties directly from owners in India. No brokers, no commission.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  }
}

/**
 * Generate head meta tags for a listing page
 */
export function generateListingMeta(property: Property) {
  return [
    { title: `${property.title} | Owner Housing` },
    {
      name: 'description',
      content: `${property.title} - ${property.area} ${property.areaUnit} in ${property.location.locality}, ${property.location.city}. ${property.description.slice(0, 120)}...`,
    },
    { property: 'og:title', content: `${property.title} | Owner Housing` },
    {
      property: 'og:description',
      content: `${property.area} ${property.areaUnit} ${property.type} in ${property.location.locality}, ${property.location.city}`,
    },
    { property: 'og:image', content: property.images[0] },
    { property: 'og:url', content: `${BASE_URL}/listing/${property.slug}` },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Owner Housing' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${property.title} | Owner Housing` },
    {
      name: 'twitter:description',
      content: `${property.area} ${property.areaUnit} ${property.type} in ${property.location.locality}, ${property.location.city}`,
    },
    { name: 'twitter:image', content: property.images[0] },
  ]
}

/**
 * Generate head meta tags for the homepage
 */
export function generateHomeMeta() {
  return [
    { title: 'Owner Housing — Buy & Rent Properties Directly from Owners in India' },
    {
      name: 'description',
      content:
        'Find verified properties directly from owners across India. No brokers, no commission. Buy or rent apartments, houses, villas, plots, commercial spaces, and PG accommodations.',
    },
    { property: 'og:title', content: 'Owner Housing — Buy & Rent Properties Directly from Owners in India' },
    {
      property: 'og:description',
      content: 'Find verified properties directly from owners across India. No brokers, no commission.',
    },
    { property: 'og:url', content: BASE_URL },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Owner Housing' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Owner Housing — Properties from Owners' },
    {
      name: 'twitter:description',
      content: 'Buy & rent properties directly from owners in India.',
    },
  ]
}
