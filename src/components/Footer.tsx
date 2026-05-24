export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="site-container">
        <p className="site-footer__text">
          © {year} <span className="site-footer__brand">Owner Housing</span>. All rights reserved.
        </p>
        <p className="site-footer__tagline">
          Buy & rent properties directly from owners across India. No brokers, no commission.
        </p>
      </div>
    </footer>
  )
}
