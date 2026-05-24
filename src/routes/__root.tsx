import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Footer } from '../components/Footer'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Owner Housing — Buy & Rent Properties Directly from Owners in India' },
      {
        name: 'description',
        content:
          'Find verified properties directly from owners across India. No brokers, no commission. Buy or rent apartments, houses, villas, plots, and more.',
      },
      { property: 'og:site_name', content: 'Owner Housing' },
      { name: 'theme-color', content: '#00796B' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
      },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <>
      <header className="site-header" role="banner">
        <div className="site-header__inner">
          <Link to="/" className="site-logo" aria-label="Owner Housing - Home">
            <span className="site-logo__icon" aria-hidden="true">⌂</span>
            <span>
              Owner Housing
              <span className="site-logo__tagline">Direct from Owners</span>
            </span>
          </Link>
        </div>
      </header>

      <main role="main">
        <Outlet />
      </main>

      <Footer />
    </>
  )
}
