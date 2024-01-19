import React, { useState } from "react"
import { graphql, Link } from "gatsby"
import { 
  AppShell,
  createStyles,
  Footer,
  Pagination
} from '@mantine/core';

import AdComponent from "../components/adComponent";
import PageHeader from '../components/PageHeader';
import ArticleCard from '../components/ArticleCard';

import './style.css'

const useStyles = createStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 70,
  },
  footer: {
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
}));

const PAGE_SIZE = 6;
const INIT_PAGE_NUM = 1;

export default function Template({ data, pageContext = { } }) {
  const { meta } = pageContext 
  const { totalCount, edges = [] } = data?.allMarkdownRemark || { edges: [] }
  const [ pageNum, setPageNum ] = useState(INIT_PAGE_NUM)
  const { classes } = useStyles();
  const totalPage = Math.ceil(totalCount / PAGE_SIZE)
  const initIndex = (pageNum - 1) * PAGE_SIZE;
  const endIndex = pageNum * PAGE_SIZE  
  const dateToRender = edges.slice(initIndex, endIndex);
  return (
    <AppShell
        padding="md"
        header={<PageHeader />}
        styles={(theme) => ({
          root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
          main: { paddingTop: 20 }
        })}
        footer={<Footer >
          <div className={classes.footer}>
            <Pagination 
              total={totalPage}
              page={pageNum}
              onChange={(page)=> { setPageNum(page); }}
            />
          </div>
        </Footer>}
    >
      <div className={classes.content}>
        <div className="blog-post">
          <div
            className="blog-post-content"
          >
            {!!meta ? <div>{meta}</div> : null}
            {totalCount < 1 ? '当前分类暂无内容敬请期待' : dateToRender.map(edge => {
              const { path, title, date, summary, tags, } = edge?.node?.frontmatter || {}
              const id = edge?.node?.id
              return <Link key={id} to={`${path}`}>
                  <ArticleCard 
                    summary={summary}
                    tags={tags}
                    title={title}
                    date={date}
                  />
                </Link>
            })}
          </div>
          <AdComponent />
        </div>
      </div>
    </AppShell>
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
            tags
            path
            top
            summary
          }
        }
      }
    }
  }
`