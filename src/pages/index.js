import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`clojurescript`, `clojure`, `javascript`]} />
    <footer>
      Here lives footer
    </footer>
  </Layout>
)

export default IndexPage
