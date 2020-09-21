import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import './layout.css'

// TODO Please find a better way to deal with `CustomHeader`.  We added this
//      because the original layout was structured that everything would be part
//      of the Grid, but that came with it's own struggles, so now we want some
//      things to live outside of the grid.
const Layout = ({ CustomHeader, children, className }) => {
  const classes = className ? className : 'app'

  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={(data) => {
        return (
          <React.Fragment>
            {CustomHeader ? CustomHeader : undefined}
            <main className={classes}>{children}</main>
          </React.Fragment>
        )
      }}
    />
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
