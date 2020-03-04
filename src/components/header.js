import React from 'react'
import Icon from './icon'
import { Link } from 'gatsby'
import { OutboundLink } from 'gatsby-plugin-google-analytics'

const HeaderLinkInternal = ({ url, title }) => {
  return (
    <li className="header__nav-list-item header__nav-list-item-text">
      <Link to={url}>{title}</Link>
    </li>
  )
}

const HeaderLinkExnternal = ({ url, title, iconName }) => {
  const classes =
    iconName === ''
      ? 'header__nav-list-item header__nav-list-item-text'
      : 'header__nav-list-item'
  const target = iconName === '' ? '' : '_blank'

  return (
    <li className={classes}>
      <OutboundLink href={url} target={target} rel="nofollow noopener">
        {iconName === '' ? title : <Icon name={iconName} />}
      </OutboundLink>
    </li>
  )
}

// @note description can be false and when it is, we don't show the site tagline
const Header = ({ title, description, name, interests, picture, navList }) => (
  <div className="header">
    <div className="header__logo">
      Logo
    </div>

    {description ? (
      <div className="header__tagline">
        <p className="h__base header__tagline-text">{description}</p>
        <span className="header__tagline-hr" />
      </div>
    ) : (
      false
    )}

    <nav className="header__nav">
      <ul className="header__nav-list">
        {navList.map(listItem => {
          if (listItem.internalLink) {
            return (
              <HeaderLinkInternal url={listItem.url} title={listItem.title} />
            )
          } else {
            return (
              <HeaderLinkExnternal
                url={listItem.url}
                title={listItem.title}
                iconName={listItem.iconName}
              />
            )
          }
        })}
      </ul>
    </nav>
  </div>
)

export default Header
