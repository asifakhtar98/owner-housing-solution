import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import propertiesData from '../data/properties.json'
import type { Property } from '../utils/formatPrice'
import { resolveProperty } from '../utils/formatPrice'
import { ListingCard } from '../components/ListingCard'
import { FilterBar } from '../components/FilterBar'
import { generateHomeMeta, generateWebsiteJsonLd } from '../utils/seo'

const properties = (propertiesData as Property[]).map(resolveProperty)

export const Route = createFileRoute('/')({
  head: () => ({
    meta: generateHomeMeta(),
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(generateWebsiteJsonLd()),
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const [category, setCategory] = useState<'all' | 'buy' | 'rent'>('all')
  const [sortBy, setSortBy] = useState('newest')
  const [priceLimit, setPriceLimit] = useState(Infinity)

  // Determine max price based on category for slider range
  const maxPrice = useMemo(() => {
    const filtered = category === 'all'
      ? properties
      : properties.filter((p) => p.category === category)
    return Math.max(...filtered.map((p) => p.price), 0)
  }, [category])

  // Reset price limit when category changes
  const effectivePriceLimit = priceLimit > maxPrice ? maxPrice : priceLimit
  const isBuyMode = category !== 'rent'

  // Filter and sort
  const filteredProperties = useMemo(() => {
    let result = [...properties]

    // Category filter
    if (category !== 'all') {
      result = result.filter((p) => p.category === category)
    }

    // Price filter
    if (effectivePriceLimit < maxPrice) {
      result = result.filter((p) => p.price <= effectivePriceLimit)
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'area-desc':
        result.sort((a, b) => b.area - a.area)
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
        break
    }

    // Featured first (stable within sort)
    result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

    return result
  }, [category, sortBy, effectivePriceLimit, maxPrice])

  return (
    <div className="site-container">
      <section className="hero" aria-label="Site introduction">
        <h1 className="hero__title">
          Find Your Next Home,{' '}
          <span className="hero__title-accent">Direct from Owners</span>
        </h1>
        <p className="hero__subtitle">
          No brokers. No commission. Browse verified property listings across Assam.
        </p>
      </section>

      <FilterBar
        category={category}
        onCategoryChange={(cat) => {
          setCategory(cat)
          setPriceLimit(Infinity)
        }}
        maxPrice={maxPrice}
        priceLimit={effectivePriceLimit >= maxPrice ? maxPrice : effectivePriceLimit}
        onPriceLimitChange={setPriceLimit}
        sortBy={sortBy}
        onSortChange={setSortBy}
        isBuyMode={isBuyMode}
      />

      <div className="results-bar">
        <span className="results-bar__count">
          Showing <strong>{filteredProperties.length}</strong>{' '}
          {filteredProperties.length === 1 ? 'property' : 'properties'}
          {category !== 'all' && ` for ${category === 'buy' ? 'sale' : 'rent'}`}
        </span>
      </div>

      <section className="listings" aria-label="Property listings">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <ListingCard key={property.id} property={property} />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon" aria-hidden="true">🏠</div>
            <h2 className="empty-state__title">No properties found</h2>
            <p className="empty-state__text">
              Try adjusting your filters or browse all properties.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
