/* @flow */

import React from 'react';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Paper,
  Typography,
} from 'material-ui';

import type { SukeibeiLink } from '../actions/types';

type Props = {
  sukeibeiLink: SukeibeiLink
}

function MovieCard(props: Props) {
  return (
    <Paper>
      <Card style={styles.card}>
        <CardMedia style={styles.cardMedia}>
          <img
            src={props.sukeibeiLink.coverUrl}
            alt={`${props.sukeibeiLink.shortTitle} cover`}
            style={styles.cover}
          />
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {props.sukeibeiLink.shortTitle}
          </Typography>
          <Typography component="p">
            {props.sukeibeiLink.longTitle}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            Cancel
          </Button>
          <Button size="small" color="primary">
            OK
          </Button>
        </CardActions>
      </Card>
    </Paper>
  );
}

const styles = {
  cover: {
    height: '100%',
    resizeMode: 'cover',
  },
  card: {
    height: 500,
  },
  cardMedia: {
    height: 300,
  },
};

export default MovieCard;
