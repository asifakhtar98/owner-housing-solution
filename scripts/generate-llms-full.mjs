/**
 * Generates llms.txt and llms-full.txt from properties.json
 * Run: node scripts/generate-llms-full.mjs
 * Auto-run: added to the prebuild script in package.json
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const properties = JSON.parse(
  readFileSync(join(root, 'src/data/properties.json'), 'utf-8')
)

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

// --- Generate llms.txt (summary) ---

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

Owner Housing connects property seekers directly with property owners across India. All listings are verified and posted by owners themselves. The platform covers both residential and commercial properties for sale and rent, with prices in Indian Rupees (INR) formatted in lakhs and crores.

## Key Pages

- [Homepage](https://ownerhousing.in/): Browse all property listings with filters for buy/rent, price range, and sorting options
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

    output += `- [${p.title}](https://ownerhousing.in/listing/${p.slug}): ${priceShort}, ${extras.join(', ')}\n`
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

For complete listing data, see [llms-full.txt](https://ownerhousing.in/llms-full.txt)
`

  return output
}

// --- Generate llms-full.txt (detailed) ---

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

    output += `## ${p.title}

- **Price:** ${price}
- **Category:** ${category}
- **Type:** ${p.type.charAt(0).toUpperCase() + p.type.slice(1)}
- **Area:** ${p.area} ${p.areaUnit}
${bedBath.length > 0 ? `- **Configuration:** ${bedBath.join(', ')}\n` : ''}- **Furnishing:** ${p.furnishing === 'na' ? 'Not applicable' : p.furnishing.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
- **Location:** ${p.location.locality}, ${p.location.city}, ${p.location.state} — ${p.location.pincode}
- **Contact:** ${p.contact.name} (${p.contact.isOwner ? 'Owner' : 'Agent'}) — Phone: ${p.contact.phone}
- **Posted:** ${p.postedDate}
- **URL:** https://ownerhousing.in/listing/${p.slug}

${p.description}

**Amenities:** ${p.features.join(', ')}

---

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

// --- Write both files ---

const llmsTxt = generateLlmsTxt()
writeFileSync(join(root, 'public/llms.txt'), llmsTxt)
console.log(`✅ Generated llms.txt (${properties.length} listings)`)

const llmsFullTxt = generateLlmsFullTxt()
writeFileSync(join(root, 'public/llms-full.txt'), llmsFullTxt)
console.log(`✅ Generated llms-full.txt (${properties.length} listings)`)
