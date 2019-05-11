import React from 'react'
import PropTypes from 'prop-types'
import './author-avatar.css'

const AuthorAvatar = ({ name, interests, picture }) => (
  <div className="root">
    <h1 className="site-title">Between Two Parens</h1>

    <h2 className="h__base h__1 site-description">{`A blog about ${name} between two parens`}</h2>
  </div>
)

AuthorAvatar.propTypes = {
  name: PropTypes.string,
  interests: PropTypes.array,
  picture: PropTypes.element,
}

AuthorAvatar.defaultProps = {
  siteTitle: ``,
}

export default AuthorAvatar
