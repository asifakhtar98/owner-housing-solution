import { formatPrice } from '../utils/formatPrice'

interface FilterBarProps {
  category: 'all' | 'buy' | 'rent'
  onCategoryChange: (category: 'all' | 'buy' | 'rent') => void
  maxPrice: number
  priceLimit: number
  onPriceLimitChange: (limit: number) => void
  sortBy: string
  onSortChange: (sort: string) => void
  isBuyMode: boolean
}

export function FilterBar({
  category,
  onCategoryChange,
  maxPrice,
  priceLimit,
  onPriceLimitChange,
  sortBy,
  onSortChange,
  isBuyMode,
}: FilterBarProps) {
  return (
    <div className="filter-bar" role="search" aria-label="Filter properties">
      <div className="filter-bar__tabs" role="tablist" aria-label="Property category">
        {(['all', 'buy', 'rent'] as const).map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={category === cat}
            className={`filter-bar__tab${category === cat ? ' filter-bar__tab--active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat === 'all' ? 'All' : cat === 'buy' ? 'Buy' : 'Rent'}
          </button>
        ))}
      </div>

      <span className="filter-bar__separator" aria-hidden="true" />

      <div className="filter-bar__price-group">
        <span className="filter-bar__label">Max Price</span>
        <input
          type="range"
          className="filter-bar__slider"
          min={0}
          max={maxPrice}
          value={priceLimit}
          onChange={(e) => onPriceLimitChange(Number(e.target.value))}
          aria-label="Maximum price filter"
        />
        <span className="filter-bar__price-value">
          {priceLimit >= maxPrice
            ? 'Any'
            : formatPrice(priceLimit, isBuyMode ? 'total' : 'monthly')}
        </span>
      </div>

      <select
        className="filter-bar__sort"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort listings"
      >
        <option value="newest">Newest First</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="area-desc">Area: Largest</option>
      </select>
    </div>
  )
}
