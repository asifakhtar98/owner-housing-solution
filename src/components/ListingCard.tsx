import { Link } from '@tanstack/react-router'
import type { ResolvedProperty } from '../utils/formatPrice'
import { formatPrice, getPropertyTypeLabel, getRelativeTime, getOfferingLabel } from '../utils/formatPrice'
import { ContactButtons } from './ContactButtons'

interface ListingCardProps {
  property: ResolvedProperty
}

export function ListingCard({ property }: ListingCardProps) {
  const hasImage = property.images.length > 0
  const hasLocation = property.location.locality || property.location.city
  const isMultiOffering = property.offerings.length > 1

  return (
    <article className="listing-card" id={`listing-${property.id}`}>
      <Link
        to="/listing/$slug"
        params={{ slug: property.slug }}
        className="listing-card__image-wrap"
        aria-label={`View details of ${property.title}`}
      >
        {hasImage ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="listing-card__image"
            loading="lazy"
            width="160"
            height="110"
          />
        ) : (
          <div className="listing-card__image listing-card__image--placeholder" aria-hidden="true">
            🏠
          </div>
        )}
        {property.featured && (
          <span className="listing-card__featured-badge">Featured</span>
        )}
        {isMultiOffering && (
          <span className="listing-card__multi-badge">
            {property.offerings.length} Types
          </span>
        )}
      </Link>

      <div className="listing-card__body">
        <div className="listing-card__header">
          <Link
            to="/listing/$slug"
            params={{ slug: property.slug }}
            className="listing-card__title-link"
          >
            <h2 className="listing-card__title">{property.title}</h2>
          </Link>
          <span className="listing-card__price">
            {formatPrice(property.price, property.priceUnit)}
          </span>
        </div>

        {hasLocation && (
          <div className="listing-card__meta">
            <span className="listing-card__location">
              📍 {[property.location.locality, property.location.city].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        <div className="listing-card__details">
          {property.bedrooms > 0 && (
            <span className="listing-card__detail">
              🛏 {property.bedrooms} BHK
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="listing-card__detail">
              🚿 {property.bathrooms} Bath
            </span>
          )}
          {property.area > 0 && (
            <span className="listing-card__detail">
              📐 {property.area} {property.areaUnit}
            </span>
          )}
        </div>

        <div className="listing-card__footer">
          <div className="listing-card__badges">
            {isMultiOffering ? (
              property.offerings.map((offering) => (
                <span key={offering} className={`badge badge--${offering}`}>
                  {getOfferingLabel(offering)}
                </span>
              ))
            ) : (
              <span className={`badge badge--${property.category}`}>
                {property.category === 'buy' ? 'For Sale' : 'For Rent'}
              </span>
            )}
            <span className="badge badge--type">
              {getPropertyTypeLabel(property.type)}
            </span>
            {property.contact.isOwner && (
              <span className="badge badge--owner">Owner</span>
            )}
            <span className="listing-card__time">
              {getRelativeTime(property.postedDate)}
            </span>
          </div>

          <ContactButtons
            contact={property.contact}
            propertyTitle={property.title}
            size="small"
          />
        </div>
      </div>
    </article>
  )
}

