import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const styles = {
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: `0 auto`,
    maxWidth: 960,
    padding: `1.45rem 1.0875rem`,
  },
  title: {
    fontSize: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  desc: {
    fontSize: 20,
    marginLeft: 20,
    color: 'white',
  },
  category: {
    margin: 0, 
    display: 'inline-block',
  }
}

const Header = ({ siteTitle, description }) => (
  <header
    style={{
      background: `rebeccapurple`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={styles.headerContainer}
    >
      <div style={styles.title}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
        <div style={styles.desc}>{description}</div>
      </div>
      <div>
        <Link
          to="/category"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          分类
        </Link>
      </div>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
