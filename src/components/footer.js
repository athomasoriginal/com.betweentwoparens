import PropTypes from 'prop-types'
import React from 'react'
import { OutboundLink } from 'gatsby-plugin-google-analytics'

import './footer.css'

const FooterLink = ({ title, url }) => (
  <OutboundLink
    className="footer__link link__underline"
    href={url}
    target="__blank"
    rel="noopener noreferrer"
  >
    {title}
  </OutboundLink>
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
