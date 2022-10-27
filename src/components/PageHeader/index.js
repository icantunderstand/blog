import React from "react"
import { 
  Header,
  createStyles,
  Text,
} from '@mantine/core';
import { IconGhost } from '@tabler/icons';

import { Link } from "gatsby"
import useReadingProgress from '../../hooks/useReadingProgress'

const useStyles = createStyles(() => ({
  progressBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    bottom: -2,
    background: 'yellow',
  },
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
  },
}))


const PageHeader = ({ isDetailPage = false }) => {
  const { classes } = useStyles()  
  const completion = useReadingProgress();
  return (
      <Header className={classes.container} height={70} p="xs"  >
          <Link to="/" >
            <div className={classes.horizontalContainer}>
              <IconGhost size="30" />
              <Text>noodles的笔记本</Text>
            </div>
          </Link>
          {isDetailPage ? <span
              style={{
                transform: `translateX(${completion - 100}%)`,
              }}
              className={classes.progressBar}
            ></span> : null}
      </Header>);
}


export default PageHeader
