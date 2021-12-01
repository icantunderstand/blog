import * as React from "react"
import PropTypes from "prop-types"
import { useSiteData } from '../hooks/site-data'

import Header from "./header"
import AdComponent from './adComponent'
import "./layout.css"

const Layout = ({ children }) => {
  const { title, description } = useSiteData()
  return (
    <>
      <Header siteTitle={title || `Title`} description={description} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <main>{children}</main>
      </div>
      <AdComponent />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
