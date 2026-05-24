/**
 * Generates llms-full.txt from properties.json
 * Run: node scripts/generate-llms-full.mjs
 * Auto-run: added to the build script in package.json
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

output += `## Summary

- **Total Listings:** ${properties.length}
- **Cities:** ${[...new Set(properties.map(p => p.location.city))].join(', ')}
- **For Sale:** ${properties.filter(p => p.category === 'buy').length} properties
- **For Rent:** ${properties.filter(p => p.category === 'rent').length} properties
- **Property Types:** ${[...new Set(properties.map(p => p.type))].join(', ')}

All owners can be contacted directly via phone or WhatsApp. No broker commission is charged on any listing.
`

writeFileSync(join(root, 'public/llms-full.txt'), output)
console.log(`✅ Generated llms-full.txt (${properties.length} listings)`)
