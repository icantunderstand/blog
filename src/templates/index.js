import React, { useEffect } from 'react'
import { 
  AppShell,
  Navbar,
  createStyles,
  Footer,
  MantineProvider,
  Pagination,
} from '@mantine/core';
import { IconBoxMultiple0, IconBoxMultiple1 } from '@tabler/icons';
import { fairyDustCursor } from 'cursor-effects'
import { navigate } from "gatsby"
import Link from 'gatsby-link'

import ArticleCard from '@components/ArticleCard';
import NavLink from '@components/NavLInk';
import PageHeader from '@components/PageHeader'
import { sendHomePv } from '../utils'
import './style.css'
import './reset.css'

const useStyles = createStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 70,
  }
}));


const IndexPage = ({ pageContext }) => {
  const { group, index, pageCount, pageAllCount } = pageContext;
  const { classes } = useStyles();
  function setJumpPage(pageNum) {
    if(pageNum === 1) {
      navigate(`/`)
    } else {
      navigate(`/${pageNum}`)
    }
  }
  useEffect(() => {
    sendHomePv()
    new fairyDustCursor({colors: ["#ff0000", "#00ff00", "#0000ff"]})
  }, [])
  return (
    <AppShell
        padding="md"
        navbar={<Navbar 
          width={{ base: 300 }}
          height={1000}
          p="xs"
        >
          <Navbar.Section>
            <Link to="/">
            <NavLink icon={<IconBoxMultiple0 size={16} color="blue" />} label="首页"  />
            </Link>
          </Navbar.Section>
          <Navbar.Section>
            <Link to='/category'>
              <NavLink icon={<IconBoxMultiple1 size={16} color="teal"  />} label="分类" />
            </Link>
          </Navbar.Section>
        </Navbar>}
        footer={<Footer >
          <div className="paginate-container">
            <Pagination total={pageCount} onChange={setJumpPage} page={index} />
            <div className="paginate-item">共 {pageAllCount} 篇文章 </div>
          </div>
        </Footer>}
        header={<PageHeader />}
        styles={(theme) => ({
          root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
          main: { paddingTop: 20 },
        })}
    >
      <div className={classes.content} >
        {group.map((data = {}) => {
          const { frontmatter } = data.node || {}
          return <div key={frontmatter.path} >
            <Link to={frontmatter.path}>
              <ArticleCard 
                title={frontmatter.title}
                tags={frontmatter.tags}
                isTop={frontmatter.top}
                date={frontmatter.date}
                summary={frontmatter.summary}
              />
            </Link>
          </div>
        })}
      </div>
    </AppShell>
  )
}


const HOME = ({ pageContext }) => {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <IndexPage pageContext={pageContext} />
    </MantineProvider>
  );
}

export default HOME