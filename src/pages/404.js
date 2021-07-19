import React from 'react'
import Layout from '../components/layout';
import Link from 'gatsby-link'



const NotFoundPage = () => {
  return (
    <Layout>
      <div>
        当前页面已消失！！！
        <Link to={'/'}>回到首页</Link>
      </div>
    </Layout>
  )
}
export default NotFoundPage