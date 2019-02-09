import PropTypes from 'prop-types'
import React from 'react'

import { Link } from 'gatsby'

import './footer.css'

const Footer = ({ links }) => (
  <footer className="footer">
    {links.map(link => (
      <Link key={link} to="/another-page/">
        {link}
      </Link>
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
