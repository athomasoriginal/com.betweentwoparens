import PropTypes from 'prop-types'
import React from 'react'

import { Link } from 'gatsby'

import './blog-post.css'

const BlogPost = ({ title, date, description, url }) => (
  <article className="article-index-item">
    <header>
      <h2 className="article-index-item__title">
        <Link className="article-index-item__link" to={url}>
          {title}
        </Link>
      </h2>
    </header>
    <p className="article-index-item__meta">
      <span className="hide">posted on</span>
      <time>{date}</time>
    </p>
    <p className="article-index-item__description">{description}</p>
  </article>
)

BlogPost.propTypes = {
  title: PropTypes.string,
  date: PropTypes.string,
  description: PropTypes.string,
}

BlogPost.defaultProps = {
  title: ``,
  date: '',
  description: '',
}

export default BlogPost
