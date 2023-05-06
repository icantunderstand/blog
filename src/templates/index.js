import React, { useEffect, useState, useMemo } from 'react'
import { isMobile } from 'react-device-detect'
import { 
  AppShell,
  Navbar,
  createStyles,
  Footer,
  MantineProvider,
  Pagination,
  Input
} from '@mantine/core';
import { IconBoxMultiple0, IconBoxMultiple1 } from '@tabler/icons';
import { fairyDustCursor } from 'cursor-effects'
import { navigate } from "gatsby"
import Link from 'gatsby-link'
import MiniSearch from 'minisearch'

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
  },
  searchContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  linkStyle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));


let miniSearch = new MiniSearch({
  fields: ['title', 'html'], // fields to index for full-text search
  storeFields: ['title', 'category', 'html', 'date', 'path', 'tags', 'summary'], // fields to return with search results
  searchOptions: {
    fuzzy: 100,
    boost: { title: 100 },
  }
})
let hasAddDocument = false
const IndexPage = ({ pageContext }) => {
  const { group, index, pageCount, pageAllCount, allPage } = pageContext;
  const [searchStr, setSearchStr] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const { classes } = useStyles();
  const showSearchResult = searchStr && setSearchResult?.length > 0
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
    if(!hasAddDocument) {
      miniSearch.addAll(allPage)
      hasAddDocument = true
    }
  }, [])

  useEffect(() => {
    // 查询函数
    if(searchStr || typeof searchStr === 'string') {
      const results = miniSearch.search(searchStr)
      if(results?.length) {
        setSearchResult(results)
      }
    }
  }, [searchStr])

  const onChangeSearch = (e) => {
    setSearchStr(e?.nativeEvent?.target?.value)
  }

  const normalPageContent = useMemo(() => {
    return group.map((data = {}) => {
      const { frontmatter } = data.node || {}
      return (
        <Link 
          className={classes.linkStyle}
          key={frontmatter.path}
          to={frontmatter.path}
        >
          <ArticleCard 
            title={frontmatter.title}
            tags={frontmatter.tags}
            isTop={frontmatter.top}
            date={frontmatter.date}
            summary={frontmatter.summary}
          />
        </Link>
      );
    })
  }, [group])
  const searchPageContent = useMemo(() => {
    return searchResult.map((data = {}) => {
      const {
        date = '',
        path = '',
        tags = '',
        title = '',
        summary = '',
      } = data
      return (
        <Link 
          className={classes.linkStyle} 
          key={path} 
          to={path}
        >
          <ArticleCard 
            title={title}
            tags={tags}
            date={date}
            summary={summary}
            isSearch={true}
          />
        </Link>
      )
    })
  }, [searchResult])
  const NavBarContent = (
      <Navbar 
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
        <Navbar.Section>
          <Input.Wrapper label="搜索内容">
            <Input value={searchStr} onChange={onChangeSearch} />
          </Input.Wrapper>
        </Navbar.Section>
      </Navbar>
  );
  return (
    <AppShell
        padding="md"
        navbar={isMobile ? null : NavBarContent}
        footer={<Footer >
          {showSearchResult ? null : (
            <div className="paginate-container">
              <Pagination total={pageCount} onChange={setJumpPage} page={index} />
              <div className="paginate-item">共 {pageAllCount} 篇文章 </div>
            </div>
          )}
        </Footer>}
        header={<PageHeader />}
        styles={(theme) => ({
          root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0], width: '100%' },
          main: { paddingTop: 20, width: '100%' },
        })}
    >
      <div className={showSearchResult ? classes.searchContent : classes.content} >
        {showSearchResult ? searchPageContent : normalPageContent}
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