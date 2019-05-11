import React from 'react'
import PropTypes from 'prop-types'
import './header.css'

const Header = ({ title, name, interests, picture }) => (
  <div className="root">
    <h1 className="site-title">{title}</h1>

    <h2 className="h__base h__1 site-description">{`A blog about ${name} between two parens`}</h2>
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
