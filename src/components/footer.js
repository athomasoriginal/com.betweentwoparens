import PropTypes from 'prop-types'
import React from 'react'
import Icon from './icon'

import './footer.css'

const FooterLink = ({ title, url }) => (
  <a
    className="footer__link link__underline"
    href={url}
    target="__blank"
    rel="noopener noreferrer"
  >
    {title}
  </a>
)

const SocialLinksList = ({ links }) => {
  return (
    <ul className="social-icons__list">
      {links.map(link => {
        // @note remove the youtube icon because in our design it only appears
        // in the header for now
        if (link.iconName === 'youtube') return false

        return (
          <li key={link.title} className="social-icons__list-item">
            <a
              className="social-icons__list-item-link"
              href={link.url}
              target="__blank"
              rel="noopener noreferrer"
            >
              <Icon name={link.iconName} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export const FooterLicense = ({ license }) => {
  return (
    <p>
      <span className="footer-license__description">© 2020 | Licensed under{' '}</span>
      <FooterLink title={license.name} url={license.url} />
    </p>
  )
}

const Footer = ({ links, license }) => {
  return (
    <footer className="footer">
      <SocialLinksList links={links} />
      <FooterLicense license={license} />
    </footer>
  )
}

Footer.propTypes = {
  links: PropTypes.array,
}

Footer.defaultProps = {
  links: [],
}

export default Footer
