import React, { useState } from 'react'
import Link from 'gatsby-link'
import Layout from '../components/layout';

import './style.css'

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>
  } else {
    return <span>{props.text}</span>
  }
}

const IndexPage = ({ pageContext }) => {
  const { group, index, first, last, pageCount } = pageContext
  console.log(pageContext, 1000)
  const previousUrl = index - 1 === 1 ? '/' : (index - 1).toString()
  const nextUrl = (index + 1).toString()
  const [ nextPage, setNextPage ] = useState(nextUrl)
  const [ jumpError, setJumpError ] = useState(false)
  function setJumpPage(e) {
    let transferNum = Number(e.target.value)
    if(!isNaN(transferNum)) {
      if(transferNum >= pageCount) {
        transferNum = pageCount
      }
      if(transferNum <= 1) {
        transferNum = ''
      }
      setJumpError(false)
      setNextPage(`${transferNum}`)
    } else {
      setJumpError(true)
    }
  }
  return (
    <Layout>
      <div>
      {group.map(({ node }) => {
        const { frontmatter } = node
        return <div key={frontmatter.path} >
          <Link to={frontmatter.path}>{frontmatter.title}</Link>
          &nbsp;
          <small>
            {' '}
            <em>published on</em> {frontmatter.date}
          </small>
          <br />
        </div>
      })}
      <div className="paginate-container">
        <NavLink test={first} url={`/${previousUrl}`} text="前一页" />
        <NavLink test={last} url={`/${nextUrl}`} text="下一页" />
        <div className="paginate-item">共{pageCount}页</div>
        {jumpError ? <div className="paginate-item">跳转到</div> : <div className="paginate-item"><Link to={`/${nextPage}`}>跳转到</Link></div>}
        <input onChange={setJumpPage} className="paginate-input" />
      </div>
    </div>
    </Layout>
  )
}
export default IndexPage