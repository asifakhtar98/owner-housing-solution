import { Link } from '@tanstack/react-router'
import type { Property } from '../utils/formatPrice'
import { formatPrice, getPropertyTypeLabel, getRelativeTime } from '../utils/formatPrice'
import { ContactButtons } from './ContactButtons'

interface ListingCardProps {
  property: Property
}

export function ListingCard({ property }: ListingCardProps) {
  return (
    <article className="listing-card" id={`listing-${property.id}`}>
      <Link
        to="/listing/$slug"
        params={{ slug: property.slug }}
        className="listing-card__image-wrap"
        aria-label={`View details of ${property.title}`}
      >
        <img
          src={property.images[0]}
          alt={property.title}
          className="listing-card__image"
          loading="lazy"
          width="160"
          height="110"
        />
        {property.featured && (
          <span className="listing-card__featured-badge">Featured</span>
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

        <div className="listing-card__meta">
          <span className="listing-card__location">
            📍 {property.location.locality}, {property.location.city}
          </span>
        </div>

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
          <span className="listing-card__detail">
            📐 {property.area} {property.areaUnit}
          </span>
        </div>

        <div className="listing-card__footer">
          <div className="listing-card__badges">
            <span className={`badge badge--${property.category}`}>
              {property.category === 'buy' ? 'For Sale' : 'For Rent'}
            </span>
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
