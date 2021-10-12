
const path = require(`path`)
const pageConstants = require('./src/constants')
const createPaginatedPages = require('gatsby-paginate')

// 创建分类页面
function createCategoryPage({ actions, graphql }) {
  const { createPage } = actions
  const blogCategory = pageConstants.blogCategory
  for(let i = 0; i < blogCategory.length;i++) {
    const category = blogCategory[i];
    createPage({
      path: category.key,
      context: {
        category: category.key,
        meta: category?.meta
      },
      component: path.resolve(`src/templates/category.js`),
    })
  }
}

// 创建详情页
async function createDetailPage({ actions, graphql }) {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: {fields: frontmatter___date, order: DESC}
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              date
              tags
              path
              top
            }
          }
        }
      }
    }
  `)
  if (result.errors) {
    console.error(result.errors)
  }
  // 做置顶逻辑
  const resultArr = []
  const needCollapseArr = []
  pageConstants.centerList.forEach(item => {
    if(item.needCollapse === true) {
      needCollapseArr.push(item.title)
    }
  })
  const allCount = result.data.allMarkdownRemark.edges.length
  result.data.allMarkdownRemark.edges.forEach(item => {
    const { node } = item || {}
    const { top, tags } = (node || {}).frontmatter
    if(top) {
      resultArr.unshift(item)
    } else {
      const isNeedCollapseArr = needCollapseArr.indexOf(tags)
      if(isNeedCollapseArr < 0) {
        resultArr.push(item)
      }
    }
  })
  // 抽象出聚合页的概念 聚合页默认置顶 聚合页有关闭逻辑 不占列表的内容
  let centerListArr = []
  pageConstants.centerList.map(async ({ title }, index) => {
    const centerResult = await graphql(`
      {
        allMarkdownRemark(filter: {frontmatter: {tags: {eq: "${title}"}}}) {
          edges {
            node {
              id
              frontmatter {
                title
                date
                tags
                path
                top
              }
            }
          }
        }
      }    
    `)
    centerListArr.push({ list: centerResult, extra: { type: pageConstants.centerPageType, path: title } })
    if(index === pageConstants.centerList.length - 1) {
      result.data.allMarkdownRemark.edges = resultArr
      const centerList = centerListArr.reduce((acc,curr) => { return acc.concat(curr.list.data.allMarkdownRemark.edges) }, [])
      createPaginatedPages({
        edges: [...centerListArr, ...result.data.allMarkdownRemark.edges],
        createPage: createPage,
        pageTemplate: 'src/templates/index.js',
        pageLength: 15, // This is optional and defaults to 10 if not used
        pathPrefix: '', // This is optional and defaults to an empty string if not used
        context: { pageAllCount: allCount }, // This is optional and defaults to an empty object if not used
      });
      ([...result.data.allMarkdownRemark.edges,...centerList]).forEach(({ node }) => {
        createPage({
          path: node.frontmatter.path,
          component: path.resolve(`src/templates/post.js`),
        })
      })
    }
  })
}
// 创建博客页面
exports.createPages = async ({ actions, graphql }) => {
  createCategoryPage({ actions, graphql })
  await createDetailPage({ actions, graphql })
}