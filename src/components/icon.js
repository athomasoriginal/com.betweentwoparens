/**
 * Icon
 *
 * @note these icons are svgs inside of React components to make styling them
 * easier
 */

import React from 'react'
import GitIcon from './icon/git-square'
import LinkedinIcon from './icon/linkedin'
import RssIcon from './icon/rss'
import TwitterIcon from './icon/twitter'
import YoutubeIcon from './icon/youtube'
import BetweenTwoParensLogo from './icon/between-two-parens-logo'

const icon = {
  git: GitIcon,
  linkedin: LinkedinIcon,
  rss: RssIcon,
  twitter: TwitterIcon,
  youtube: YoutubeIcon,
  betweenTwoParensLogo: BetweenTwoParensLogo,
}

const Icon = ({ name }) => {
  const Icon = icon[name]

  return <Icon name={name} />
}

export default Icon
