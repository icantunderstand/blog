import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import useReadingProgress from '../../hooks/useReadingProgress'
import './index.css'


const Header = ({ siteTitle, description, isDetailPage = false }) => {
  const completion = useReadingProgress();
  return <div className="headerContainer">
      {isDetailPage ? <span
         style={{
          transform: `translateX(${completion - 100}%)`,
        }}
        className='progressBar'
      ></span> : null}
      <div  className='title'>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
        <div className="desc">{description}</div>
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
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
  isDetailPage: false,
}

export default Header
