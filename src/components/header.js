import React from 'react'
import Icon from './icon'
import { Link } from 'gatsby'

const HeaderLinkInternal = ({ url, title }) => {
  return (
    <li className="header__nav-item header__nav-item-text">
      <Link to={url}>{title}</Link>
    </li>
  )
}

const HeaderLinkExnternal = ({ url, title, iconName }) => {
  const classes =
    iconName === ''
      ? 'header__nav-item header__nav-item-text'
      : 'header__nav-item'
  const target = iconName === '' ? '' : '_blank'

  return (
    <li className={classes}>
      <a href={url} target={target} rel="nofollow noopener">
        {iconName === '' ? title : <Icon name={iconName} />}
      </a>
    </li>
  )
}

const NavList = ({ navList }) => (
  <nav className="header__nav">
    <ul className="ul header__nav-list">
      {navList.map((listItem) => {
        if (listItem.internalLink) {
          return (
            <HeaderLinkInternal
              key={listItem.title}
              url={listItem.url}
              title={listItem.title}
            />
          )
        } else {
          return (
            <HeaderLinkExnternal
              key={listItem.title}
              url={listItem.url}
              title={listItem.title}
              iconName={listItem.iconName}
            />
          )
        }
      })}
    </ul>
  </nav>
)

// @note description can be false and when it is, we don't show the site tagline
const Header = ({ description, navList, isBlogLayout }) => (
  <div
    className={`${
      isBlogLayout || isBlogLayout === undefined ? 'wrapperBlog' : 'wrapper'
    }`}
  >
    <div className="switcher">
      <div>
        <div className="header__logo-wrapper">
          <Link to="/" className="header__logo-link">
            <Icon name="betweenTwoParensLogo" />

            <h1 className="h__base header__title">
              <span className="header__title-line-1">Between</span>
              <span className="header__title-line-2">Two Parens</span>
            </h1>
          </Link>
        </div>

        {isBlogLayout || isBlogLayout === undefined ? (
          <div class="header__nav-wrapper">
            <NavList navList={navList} />
          </div>
        ) : (
          <div className="switcher header__main-content">
            <div>
              {description ? (
                <div className="header__tagline">
                  <p className="h__base header__tagline-text">{description}</p>
                  <span className="header__tagline-divider" />
                </div>
              ) : (
                false
              )}

              <NavList navList={navList} />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)

export default Header
