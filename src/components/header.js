import PropTypes from 'prop-types'
import React from 'react'

import './header.css'

const Header = ({ siteTitle }) => (
  <header className="header">
    <h1>Thomas Town</h1>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
