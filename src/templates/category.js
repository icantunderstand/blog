import React from "react"
import Header from "../components/header"
import { graphql } from "gatsby"
import { useSiteData } from '../hooks/site-data'
import { Link } from 'gatsby';
import './style.css'

export default function Template({ data, pageContext = { } }) {
  const { title, description } = useSiteData()
  const { meta } = pageContext 
  const { totalCount, edges = [] } = data?.allMarkdownRemark || { edges: [] }
  return (
    <div className="blog-post">
      <Header siteTitle={title} description={description} />
      <div
        className="blog-post-content"
      >
        {!!meta ? <div>{meta}</div> : null}
        {totalCount < 1 ? '当前分类暂无内容敬请期待' : edges.map(edge => {
          const { path, title, date } = edge?.node?.frontmatter || {}
          const id = edge?.node?.id
          return <div key={id}>
            <Link key={id} to={`${path}`}>{title}  {date}</Link>
          </div>
        })}
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query($category: String!) {
    allMarkdownRemark(
      filter: {frontmatter: {tags: {eq: $category}}}
      sort: {order: DESC, fields: frontmatter___date}
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date
            path
          }
        }
      }
    }
  }
`