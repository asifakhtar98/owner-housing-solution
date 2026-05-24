import { createFileRoute } from '@tanstack/react-router'
import propertiesData from '../../data/properties.json'
import type { Property } from '../../utils/formatPrice'
import { resolveProperty, formatPrice, getPropertyTypeLabel, getFurnishingLabel, getRelativeTime } from '../../utils/formatPrice'
import { generateListingMeta, generateListingJsonLd, generateBreadcrumbJsonLd } from '../../utils/seo'
import { ContactButtons } from '../../components/ContactButtons'
import { Breadcrumbs } from '../../components/Breadcrumbs'

const properties = (propertiesData as Property[]).map(resolveProperty)

export const Route = createFileRoute('/listing/$slug')({
  head: ({ params }) => {
    const property = properties.find((p) => p.slug === params.slug)
    if (!property) {
      return { meta: [{ title: 'Property Not Found | Owner Housing' }] }
    }

    const breadcrumbItems = [
      { name: 'Home', url: '/' },
      { name: property.category === 'buy' ? 'Buy' : 'Rent', url: `/?category=${property.category}` },
      { name: property.location.city, url: `/?city=${property.location.city}` },
      { name: property.title, url: `/listing/${property.slug}` },
    ]

    return {
      meta: generateListingMeta(property),
      links: [
        { rel: 'canonical', href: `https://ownerhousing.in/listing/${property.slug}` },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(generateListingJsonLd(property)),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbItems)),
        },
      ],
    }
  },
  component: ListingDetailPage,
})

function ListingDetailPage() {
  const { slug } = Route.useParams()
  const property = properties.find((p) => p.slug === slug)

  if (!property) {
    return (
      <div className="site-container">
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">🔍</div>
          <h1 className="empty-state__title">Property Not Found</h1>
          <p className="empty-state__text">
            This listing may have been removed or the URL is incorrect.
          </p>
        </div>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: property.category === 'buy' ? 'Buy' : 'Rent' },
    { label: property.location.city },
    { label: property.title },
  ]

  const hasLocation = property.location.locality || property.location.pincode
  const hasStats = property.area > 0 || property.bedrooms > 0 || property.bathrooms > 0

  return (
    <div className="site-container">
      <Breadcrumbs items={breadcrumbs} />

      <article className="detail-page" itemScope itemType="https://schema.org/RealEstateListing">
        <div className="detail-page__main">
          {/* Hero Image */}
          {property.images.length > 0 && (
            <div className="detail-page__image-section">
              <img
                src={property.images[0]}
                alt={property.title}
                className="detail-page__image"
                itemProp="image"
                width="960"
                height="400"
              />
            </div>
          )}

          {/* Header: Title + Price */}
          <header className="detail-page__header">
            <h1 className="detail-page__title" itemProp="name">{property.title}</h1>
            <div>
              <span className="detail-page__price">
                {formatPrice(property.price, property.priceUnit)}
              </span>
              {property.priceUnit === 'monthly' && (
                <span className="detail-page__price-unit"> /month</span>
              )}
            </div>
          </header>

          {/* Location */}
          {hasLocation && (
            <div className="detail-page__location">
              <span aria-hidden="true">📍</span>
              <span itemProp="address">
                {[
                  property.location.locality,
                  property.location.city,
                  property.location.state,
                  property.location.pincode ? `— ${property.location.pincode}` : '',
                ]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="detail-page__badges">
            <span className={`badge badge--${property.category}`}>
              {property.category === 'buy' ? 'For Sale' : 'For Rent'}
            </span>
            <span className="badge badge--type">
              {getPropertyTypeLabel(property.type)}
            </span>
            {property.contact.isOwner && (
              <span className="badge badge--owner">Direct Owner</span>
            )}
            {property.furnishing !== 'na' && (
              <span className="badge badge--furnishing">
                {getFurnishingLabel(property.furnishing)}
              </span>
            )}
          </div>

          {/* Stats Grid — only render if there's something to show */}
          {hasStats && (
            <div className="detail-page__stats">
              {property.area > 0 && (
                <div className="detail-page__stat">
                  <div className="detail-page__stat-value">{property.area}</div>
                  <div className="detail-page__stat-label">{property.areaUnit}</div>
                </div>
              )}
              {property.bedrooms > 0 && (
                <div className="detail-page__stat">
                  <div className="detail-page__stat-value">{property.bedrooms}</div>
                  <div className="detail-page__stat-label">Bedrooms</div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="detail-page__stat">
                  <div className="detail-page__stat-value">{property.bathrooms}</div>
                  <div className="detail-page__stat-label">Bathrooms</div>
                </div>
              )}
              <div className="detail-page__stat">
                <div className="detail-page__stat-value">{getRelativeTime(property.postedDate)}</div>
                <div className="detail-page__stat-label">Posted</div>
              </div>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <section className="detail-page__section">
              <h2 className="detail-page__section-title">Description</h2>
              <p className="detail-page__description" itemProp="description">
                {property.description}
              </p>
            </section>
          )}

          {/* Features */}
          {property.features.length > 0 && (
            <section className="detail-page__section">
              <h2 className="detail-page__section-title">Amenities & Features</h2>
              <ul className="detail-page__features">
                {property.features.map((feature) => (
                  <li key={feature} className="detail-page__feature">
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="detail-page__sidebar">
          <div className="detail-page__contact-card">
            <h2 className="detail-page__contact-card-title">
              {property.contact.isOwner ? 'Contact Owner' : 'Contact'}
            </h2>
            <p className="detail-page__contact-name">{property.contact.name}</p>
            <p className="detail-page__contact-label">
              {property.contact.isOwner ? 'Property Owner' : 'Agent'} · Verified Listing
            </p>
            <div className="detail-page__contact-buttons">
              <ContactButtons
                contact={property.contact}
                propertyTitle={property.title}
                size="large"
              />
            </div>
          </div>
        </aside>
      </article>
    </div>
  )
}
