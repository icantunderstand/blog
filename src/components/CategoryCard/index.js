import React from 'react'
import { Link } from 'gatsby'
import { createStyles, Card, Image, Avatar, Text, Group, Tooltip } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    height: 80,
    marginBottom: 5,
    overflow: 'visible',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  title: {
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.2,
  },
  body: {
    padding: theme.spacing.md,
  },
}));


export default function CategoryCard({
  meta,
  title,
}) {
  const { classes } = useStyles();
  return (
    <Card withBorder radius="md" p={0} className={classes.card}>
      <Group noWrap spacing={0}>
        <div className={classes.body}>
          <Text className={classes.title} size="md" mb="md">
            {title}
          </Text>
          <Text size="xs" color="dimmed">
            {meta}
          </Text>
        </div>
      </Group>
    </Card>
  );
}