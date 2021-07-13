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
						<div key={category}>
							<Link to={`/${category}/`}>{category}</Link>
						</div>
					);
				})}
			</div>
		</Layout>
	);
};

export default CategoryPage;