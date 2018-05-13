/* @flow */

import React from 'react';
import { Grid } from 'material-ui';
import { Link } from 'react-router-dom';

import MovieCard from './MovieCard';

import type { SukeibeiLink } from '../actions/types';

type Props = {
  sukeibeiLinks: SukeibeiLink[],
};

function SukeibeiMovieGrid(props: Props) {
  return (
    <Grid container spacing={16}>
      {props.sukeibeiLinks.map(link => (
        <Grid item lg={3} sm={6}>
          <Link
            style={styles.link}
            to={{
              pathname: '/movieInfo',
              state: { sukeibeiLink: link },
            }}
          >
            <MovieCard
              key={link.longTitle}
              sukeibeiLink={link}
            />
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}

const styles = {
  link: {
    textDecoration: 'none',
  },
};

export default SukeibeiMovieGrid;
