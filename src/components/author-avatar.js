import React from 'react'
import PropTypes from 'prop-types'
import './author-avatar.css'

const DefaultAuthorPicture = () => (
  <div className="circle1">
    <div className="circle2">
      <div className="circle3" />
    </div>
  </div>
)

const AuthorAvatar = ({ name, interests, picture }) => (
  <div className="root">
    {picture ? picture : <DefaultAuthorPicture />}
    <h2 className="h__base h__1">{name}</h2>
    <ul className={`ul skills`}>
      {interests.map(interest => (
        <li key={interest}>{interest}</li>
      ))}
    </ul>
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
