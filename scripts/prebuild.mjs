/**
 * Pre-build script: generates SEO & AI-discoverability files from properties.json
 *
 * Outputs (all written to public/):
 *   - llms.txt        — summary for AI crawlers
 *   - llms-full.txt   — full listing data for AI crawlers
 *   - sitemap.xml     — XML sitemap for search engines
 *
 * Run: node scripts/prebuild.mjs
 * Auto-run: wired as the "prebuild" npm script in package.json
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const publicDir = join(root, 'public')

const BASE_URL = 'https://onrhosn-internal.web.app'
const DEFAULT_PHONE = '+917002689673'
const DEFAULT_CONTACT_NAME = 'Owner Housing'

const rawProperties = JSON.parse(
  readFileSync(join(root, 'src/data/properties.json'), 'utf-8')
)

// Resolve defaults for each property
const properties = rawProperties.map(p => ({
  ...p,
  area: p.area ?? 0,
  areaUnit: p.areaUnit ?? 'sqft',
  bedrooms: p.bedrooms ?? 0,
  bathrooms: p.bathrooms ?? 0,
  furnishing: p.furnishing ?? 'na',
  location: {
    city: p.location.city,
    locality: p.location?.locality ?? '',
    state: p.location?.state ?? 'Assam',
    pincode: p.location?.pincode ?? '',
  },
  description: p.description ?? '',
  features: p.features ?? [],
  images: p.images ?? [],
  contact: {
    name: p.contact?.name ?? DEFAULT_CONTACT_NAME,
    phone: p.contact?.phone ?? DEFAULT_PHONE,
    isOwner: p.contact?.isOwner ?? false,
  },
  postedDate: p.postedDate ?? new Date().toISOString().split('T')[0],
  featured: p.featured ?? false,
}))

// ── Helpers ──────────────────────────────────────────────────────────────

function formatPriceText(price, priceUnit) {
  if (priceUnit === 'monthly') {
    return `₹${price.toLocaleString('en-IN')}/month`
  }
  if (price >= 10000000) {
    const cr = price / 10000000
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Crore`
  }
  if (price >= 100000) {
    const l = price / 100000
    return `₹${l % 1 === 0 ? l : l.toFixed(2)} Lakh`
  }
  return `₹${price.toLocaleString('en-IN')}`
}

function formatPriceShort(price, priceUnit) {
  if (priceUnit === 'monthly') {
    return `₹${price.toLocaleString('en-IN')}/mo`
  }
  if (price >= 10000000) {
    const cr = price / 10000000
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`
  }
  if (price >= 100000) {
    const l = price / 100000
    return `₹${l % 1 === 0 ? l : l.toFixed(2)} L`
  }
  return `₹${price.toLocaleString('en-IN')}`
}

// ── llms.txt (summary) ──────────────────────────────────────────────────

function generateLlmsTxt() {
  const cities = [...new Set(properties.map(p => p.location.city))]
  const types = [...new Set(properties.map(p => p.type))]

  const typeLabels = {
    apartment: 'Apartments (1BHK, 2BHK, 3BHK)',
    house: 'Independent Houses',
    villa: 'Villas',
    plot: 'Plots / Land',
    pg: 'PG Accommodations',
    office: 'Commercial Office Spaces',
    shop: 'Shops / Retail Spaces',
  }

  let output = `# Owner Housing

> Owner Housing is a property listing platform for India where buyers and renters can find verified properties directly from owners — no brokers, no commission. Browse apartments, houses, villas, plots, PG accommodations, and commercial spaces across ${cities.join(', ')}, and more.

## About

Owner Housing connects property seekers directly with property owners across Assam. All listings are verified and posted by owners themselves. The platform covers both residential and commercial properties for sale and rent, with prices in Indian Rupees (INR) formatted in lakhs and crores.

## Key Pages

- [Homepage](${BASE_URL}/): Browse all property listings with filters for buy/rent, price range, and sorting options
`

  for (const p of properties) {
    const priceShort = formatPriceShort(p.price, p.priceUnit)
    const category = p.category === 'buy' ? 'For Sale' : 'For Rent'
    const extras = []
    if (p.area > 0) extras.push(`${p.area} ${p.areaUnit}`)
    extras.push(category)
    if (p.furnishing === 'fully-furnished') extras.push('Fully Furnished')
    if (p.type === 'pg' && p.features.includes('Meals Included')) extras.push('Meals Included')
    if (p.type === 'shop' && p.features.includes('Freehold')) extras.push('Freehold')

    output += `- [${p.title}](${BASE_URL}/listing/${p.slug}): ${priceShort}, ${extras.join(', ')}\n`
  }

  output += `
## Property Types Available

`
  for (const t of types) {
    output += `- ${typeLabels[t] || t.charAt(0).toUpperCase() + t.slice(1)}\n`
  }

  output += `
## Cities Covered

${cities.join(', ')}

## Contact

All property owners can be contacted directly via phone or WhatsApp. No broker involvement, no commission charged.

## Full Content

For complete listing data, see [llms-full.txt](${BASE_URL}/llms-full.txt)
`

  return output
}

// ── llms-full.txt (detailed) ────────────────────────────────────────────

function generateLlmsFullTxt() {
  let output = `# Owner Housing — Complete Property Listings

> This file contains the full listing data for Owner Housing, a property listing platform for India. All properties are listed directly by owners — no brokers, no commission. Data is current as of the latest build.

---

`

  for (const p of properties) {
    const price = formatPriceText(p.price, p.priceUnit)
    const category = p.category === 'buy' ? 'For Sale' : 'For Rent'
    const bedBath = []
    if (p.bedrooms > 0) bedBath.push(`${p.bedrooms} Bedrooms`)
    if (p.bathrooms > 0) bedBath.push(`${p.bathrooms} Bathrooms`)

    const locationParts = [p.location.locality, p.location.city, p.location.state, p.location.pincode].filter(Boolean)

    output += `## ${p.title}

- **Price:** ${price}
- **Category:** ${category}
- **Type:** ${p.type.charAt(0).toUpperCase() + p.type.slice(1)}
`
    if (p.area > 0) output += `- **Area:** ${p.area} ${p.areaUnit}\n`
    if (bedBath.length > 0) output += `- **Configuration:** ${bedBath.join(', ')}\n`
    if (p.furnishing !== 'na') {
      output += `- **Furnishing:** ${p.furnishing.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}\n`
    }
    output += `- **Location:** ${locationParts.join(', ')}
- **Contact:** ${p.contact.name} (${p.contact.isOwner ? 'Owner' : 'Agent'}) — Phone: ${p.contact.phone}
- **Posted:** ${p.postedDate}
- **URL:** ${BASE_URL}/listing/${p.slug}

`
    if (p.description) output += `${p.description}\n\n`
    if (p.features.length > 0) output += `**Amenities:** ${p.features.join(', ')}\n\n`
    output += `---

`
  }

  const cities = [...new Set(properties.map(p => p.location.city))]
  output += `## Summary

- **Total Listings:** ${properties.length}
- **Cities:** ${cities.join(', ')}
- **For Sale:** ${properties.filter(p => p.category === 'buy').length} properties
- **For Rent:** ${properties.filter(p => p.category === 'rent').length} properties
- **Property Types:** ${[...new Set(properties.map(p => p.type))].join(', ')}

All owners can be contacted directly via phone or WhatsApp. No broker commission is charged on any listing.
`

  return output
}

// ── sitemap.xml ─────────────────────────────────────────────────────────

function generateSitemapXml() {
  const today = new Date().toISOString().split('T')[0]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`

  for (const p of properties) {
    xml += `  <url>
    <loc>${BASE_URL}/listing/${p.slug}</loc>
    <lastmod>${p.postedDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
  }

  xml += `  <url>
    <loc>${BASE_URL}/llms.txt</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/llms-full.txt</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
`
  return xml
}

// ── Write all files ─────────────────────────────────────────────────────

const llmsTxt = generateLlmsTxt()
writeFileSync(join(publicDir, 'llms.txt'), llmsTxt)
console.log(`✅ Generated llms.txt (${properties.length} listings)`)

const llmsFullTxt = generateLlmsFullTxt()
writeFileSync(join(publicDir, 'llms-full.txt'), llmsFullTxt)
console.log(`✅ Generated llms-full.txt (${properties.length} listings)`)

const sitemapXml = generateSitemapXml()
writeFileSync(join(publicDir, 'sitemap.xml'), sitemapXml)
console.log(`✅ Generated sitemap.xml (${properties.length + 3} URLs)`)
