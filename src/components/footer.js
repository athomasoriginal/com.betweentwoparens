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

export const FooterLicense = ({license}) => {
  return (
    <div className="footer__license">
      <p>© 2019</p>
      <p>Licensed under <FooterLink title={license.name} url={license.url} /></p>
    </div>
  )
}

const Footer = ({ links, license }) => (
  <footer className="footer">
    {/* footer links */}
    {links.map(link => (
      <FooterLink key={link.title} title={link.title} url={link.url} />
    ))}

    <FooterLicense license={license}/>
  </footer>
)

Footer.propTypes = {
  links: PropTypes.array,
}

Footer.defaultProps = {
  links: [],
}

export default Footer
