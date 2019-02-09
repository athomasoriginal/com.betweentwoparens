import PropTypes from 'prop-types'
import React from 'react'

import { Link } from 'gatsby'

import './article-index-item.css'

const ArticleIndexItem = ({ title, date, description }) => (
  <article className="article-index-item">
    <header>
      <h2 className="article-index-item__title">
        <Link className="article-index-item__link" to="/another-page/">
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

ArticleIndexItem.propTypes = {
  articleTitle: PropTypes.string,
  date: PropTypes.string,
  description: PropTypes.string,
}

ArticleIndexItem.defaultProps = {
  articleTitle: ``,
  date: '',
  description: '',
}

export default ArticleIndexItem
