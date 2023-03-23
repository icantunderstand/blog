import React from 'react'
import { Link } from 'gatsby'
import { createStyles, Card, Image, Avatar, Text, Group, Tooltip } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    width: 600,
    marginBottom: 5,
    overflow: 'visible',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  searchCard: {
    width: 200,
    marginRight: 8,
    marginBottom: 5,
    overflow: 'visible',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  title: {
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.2,
  },
  summary: {
    maxWidth: 400,
    marginLeft: 10,
    fontSize: 14,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  horizontalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  body: {
    padding: theme.spacing.md,
  },
}));


export default function ArticleCardVertical({
  summary,
  tags,
  title,
  date,
  isTop,
  isSearch
}) {
  const { classes } = useStyles();
  const showSummary = !!summary ? summary : '';
  return (
    <Card withBorder radius="md" p={0} className={isSearch ? classes.searchCard : classes.card} >
      <Group noWrap spacing={0}>
        <div className={classes.body}>
          <Link to={`/${tags}`} >
            <Text transform="uppercase" color="dimmed" weight={700} size="xs">
              分类:{tags}
            </Text>
          </Link>
          <Text className={classes.title} mt="xs" mb="md">
            {title}
          </Text>
          <div className={classes.horizontalContainer}>
            <Text size="xs" color="dimmed">
              {date}
            </Text>
            <div className={classes.summary}>
              <Tooltip
                label={showSummary}
                multiline
                position="bottom"
              >
                <Text color="dimmed" size="xs" lineClamp={3} >
                  {showSummary}
                </Text>
              </Tooltip>
            </div>
          </div>
        </div>
      </Group>
    </Card>
  );
}