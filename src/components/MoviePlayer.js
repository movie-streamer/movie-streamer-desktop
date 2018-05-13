/* @flow */

import React from 'react';

class MoviePlayer extends React.Component<{}> {
  componentDidMount() {

  }

  render() {
    return (
      <video style={styles.movie} />
    );
  }
}

const styles = {
  movie: {
    height: '100%',
  },
};

export default MoviePlayer;
