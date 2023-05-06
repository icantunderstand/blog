import React from "react"
import { 
  Header,
  createStyles,
  Text,
} from '@mantine/core';
import { IconGhost } from '@tabler/icons';

import { Link } from "gatsby"

const useStyles = createStyles(() => ({
  horizontalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
  },
  container: {
    position: 'sticky',
    width: '100%',
    height: 70,
  },
}))


const PageHeader = ({ isDetailPage = false }) => {
  const { classes } = useStyles()  
  return (
      <Header className={classes.container} height={70} p="xs"  >
          <Link to="/" >
            <div className={classes.horizontalContainer}>
              <IconGhost size="30" />
              <Text>noodles的笔记本</Text>
            </div>
          </Link>
      </Header>);
}


export default PageHeader
