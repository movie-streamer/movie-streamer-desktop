/* @flow */

import React from 'react';
import { Button } from 'material-ui';
import { Movie } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import type { SukeibeiLink } from '../actions/types';

type Props = {
  location: {
    state: {
      sukeibeiLink: SukeibeiLink,
    },
  },
}

function MovieInfoScreen(props: Props) {
  if (props.location.state) {
    const { sukeibeiLink } = props.location.state;

    return (
      <div>
        <div>
          <Link
            style={styles.link}
            to={{
              pathname: '/movie',
              state: { sukeibeiLink },
            }}
          >
            <Button variant="raised" color="primary">
              <Movie style={styles.movieIcon} />
              Watch
            </Button>
          </Link>
        </div>
        <video width="320" height="240" controls>
          <source src={sukeibeiLink.trailer1080pUrl} />
          <source src={sukeibeiLink.trailer720pUrl} />
          <source src={sukeibeiLink.trailer480pUrl} />
          <source src={sukeibeiLink.trailer360pUrl} />
        </video>
      </div>
    );
  }

  return (
    <div>
      <span>Unable to load the movie</span>
    </div>
  );
}

const styles = {
  movieIcon: {
    marginRight: 15,
  },
  link: {
    textDecoration: 'none',
  },
};

export default MovieInfoScreen;
