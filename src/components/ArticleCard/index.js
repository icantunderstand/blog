import React from 'react'
import { Link } from 'gatsby'
import { createStyles, Card, Image, Avatar, Text, Group, Tooltip } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    width: 700,
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
    width: 140,
    height: 140,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    padding: 10,
    borderRight: '1px solid #dee2e6'
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
}) {
  const { classes } = useStyles();
  const showSummary = !!summary ? summary : '暂无摘要,点击查看内容';
  return (
    <Card withBorder radius="md" p={0} className={classes.card}>
      <Group noWrap spacing={0}>
        <div className={classes.summary}>
          <Tooltip
            label={showSummary}
            width={140}
            multiline
            position="bottom"
          >
            <Text color="dimmed" size="xs" lineClamp={3} >
              {showSummary}
            </Text>
          </Tooltip>
        </div>
        <div className={classes.body}>
          <Link to={`/${tags}`} >
            <Text transform="uppercase" color="dimmed" weight={700} size="xs">
              分类:{tags}
            </Text>
          </Link>
          <Text className={classes.title} mt="xs" mb="md">
            {title}
          </Text>
          <Text size="xs" color="dimmed">
            {date}
          </Text>
        </div>
      </Group>
    </Card>
  );
}