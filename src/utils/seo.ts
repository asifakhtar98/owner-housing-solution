import type { ResolvedProperty } from './formatPrice'

const BASE_URL = 'https://ownerhousing.in'

/**
 * Generate JSON-LD for a RealEstateListing (detail pages)
 */
export function generateListingJsonLd(property: ResolvedProperty): object {
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
      streetAddress: property.location.locality || property.location.city,
      addressLocality: property.location.city,
      addressRegion: property.location.state || 'Assam',
      postalCode: property.location.pincode || undefined,
      addressCountry: 'IN',
    },
  }

  if (property.area > 0) {
    propertySchema.floorSize = {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitText: property.areaUnit,
    }
  }

  if (property.bedrooms > 0) {
    propertySchema.numberOfRooms = property.bedrooms
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    url: `${BASE_URL}/listing/${property.slug}`,
    description: property.description || property.title,
    datePosted: property.postedDate,
    image: property.images.length > 0 ? property.images[0] : undefined,
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
    description: 'Buy & rent properties directly from owners in Assam. No brokers, no commission. Listings in Guwahati, Jorhat, Dibrugarh, Silchar, Tezpur, and Nagaon.',
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
export function generateListingMeta(property: ResolvedProperty) {
  const locationParts = [property.location.locality, property.location.city].filter(Boolean).join(', ')
  const areaText = property.area > 0 ? `${property.area} ${property.areaUnit}` : ''
  const descSnippet = property.description
    ? property.description.slice(0, 120) + '...'
    : property.title

  return [
    { title: `${property.title} | Owner Housing` },
    {
      name: 'description',
      content: `${property.title}${areaText ? ` - ${areaText}` : ''} in ${locationParts}. ${descSnippet}`,
    },
    { property: 'og:title', content: `${property.title} | Owner Housing` },
    {
      property: 'og:description',
      content: `${areaText ? `${areaText} ` : ''}${property.type} in ${locationParts}`,
    },
    ...(property.images.length > 0 ? [{ property: 'og:image', content: property.images[0] }] : []),
    { property: 'og:url', content: `${BASE_URL}/listing/${property.slug}` },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Owner Housing' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${property.title} | Owner Housing` },
    {
      name: 'twitter:description',
      content: `${areaText ? `${areaText} ` : ''}${property.type} in ${locationParts}`,
    },
    ...(property.images.length > 0 ? [{ name: 'twitter:image', content: property.images[0] }] : []),
  ]
}

/**
 * Generate head meta tags for the homepage
 */
export function generateHomeMeta() {
  return [
    { title: 'Owner Housing — Buy & Rent Properties Directly from Owners in Assam' },
    {
      name: 'description',
      content:
        'Find verified properties directly from owners across Assam. No brokers, no commission. Buy or rent apartments, houses, villas, plots, commercial spaces, and PG accommodations in Guwahati, Jorhat, Dibrugarh, Silchar, Tezpur, and Nagaon.',
    },
    { property: 'og:title', content: 'Owner Housing — Buy & Rent Properties Directly from Owners in Assam' },
    {
      property: 'og:description',
      content: 'Find verified properties directly from owners across Assam. No brokers, no commission.',
    },
    { property: 'og:url', content: BASE_URL },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Owner Housing' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Owner Housing — Properties from Owners in Assam' },
    {
      name: 'twitter:description',
      content: 'Buy & rent properties directly from owners in Assam. Guwahati, Jorhat, Dibrugarh & more.',
    },
  ]
}
