import React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';
import PageConstants from '../constants/'

const CategoryPage = () => {
	return (
		<Layout>
			<div>
				{PageConstants.blogCategory.map(category => {
					return (
						<div key={category.key}>
							<Link to={`/${category.key}/`}>{category.key}</Link>
                            {category.meta ? <span>&nbsp;&nbsp;&nbsp;{category.meta}</span> : ''}
						</div>
					);
				})}
			</div>
		</Layout>
	);
};

export default CategoryPage;