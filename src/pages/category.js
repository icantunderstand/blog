import React from 'react';
import { Link } from 'gatsby';
import { 
	AppShell,
	Grid,
  } from '@mantine/core';
import PageHeader from '../components/PageHeader'
import AdComponent from "../components/adComponent";
import CategoryCard from "../components/CategoryCard";

import PageConstants from '../constants/'

const CategoryPage = () => {
	return <AppShell
        padding="md"
        header={<PageHeader />}
		styles={(theme) => ({
			root: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
			main: { paddingTop: 20 }
		})}
    >
	  <Grid >
		{PageConstants.blogCategory.map(category => {
			const { key, meta } = category
			return (
				<Grid.Col key={key}  span={3}>
					<Link to={`/${key}/`} >
					<CategoryCard title={key} meta={meta} />
				</Link>
				</Grid.Col>
			);
		})}
	  </Grid>
	  <AdComponent />
    </AppShell>;
};

export default CategoryPage;