import PropTypes from 'prop-types'
import React from 'react'

import './footer.css'

const FooterLink = ({ title, url }) => (
  <a className="footer__link" href={url} target="__blank">
    {title}
  </a>
)

const Footer = ({ links }) => (
  <footer className="footer">
    {links.map(link => (
      <FooterLink key={link.title} title={link.title} url={link.url} />
    ))}
  </footer>
)

Footer.propTypes = {
  links: PropTypes.array,
}

Footer.defaultProps = {
  links: [],
}

export default Footer
