import React from 'react'
import PropTypes from 'prop-types'
import './header.css'

const Header = ({ title, description, name, interests, picture }) => (
  <div className="root">
    <h1 className="site-title">{title}</h1>

    <p className="h__base h__1 site-description">{description}</p>
  </div>
)

Header.propTypes = {
  name: PropTypes.string,
  interests: PropTypes.array,
  picture: PropTypes.element,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
