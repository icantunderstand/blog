import React from 'react'
import { Link } from 'gatsby'
import { isMobile } from 'react-device-detect'
import { createStyles, Card, Text, Group } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    marginBottom: 5,
    marginBottom: 20,
    overflow: 'visible',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  title: {
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.2,
  },
  meta: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.2,
    fontSize: 12,
  },
  body: {
    padding: theme.spacing.md,
  },
}));


export default function CategiryCardVertical({
  meta,
  title,
}) {
  const { classes } = useStyles();
  return (
    <Card withBorder radius="md" p={0} className={classes.card} >
      <Group noWrap spacing={0}>
        <div className={classes.body}>
          <Text className={classes.title} mt="xs" mb="md">
            {title}
          </Text>
          {/* <Text className={classes.meta} >
            {meta}
          </Text> */}
        </div>
      </Group>
    </Card>
  );
}