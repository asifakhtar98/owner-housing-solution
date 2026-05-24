import { Link } from '@tanstack/react-router'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i}>
            {i > 0 && <span className="breadcrumbs__separator" aria-hidden="true"> › </span>}
            {isLast || !item.href ? (
              <span className="breadcrumbs__current" aria-current="page">{item.label}</span>
            ) : (
              <Link to={item.href}>{item.label}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
