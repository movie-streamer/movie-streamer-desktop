/* @flow */

import React from 'react';

import type { SukeibeiLink } from '../actions/types';

type Props = {
  location: {
    state: {
      sukeibeiLink: SukeibeiLink,
    },
  },
}

type State = {
  movieUri: ?string,
};

class MovieScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      movieUri: null,
    };
  }

  componentDidMount() {
    if (this.props.location && this.props.location.state) {
      const { sukeibeiLink } = this.props.location.state;
      console.warn(sukeibeiLink);
    }
    // const { magnetLink } = this.props.navigation.state.params.sukeibeiLink;
  }

  componentWillUnmount() {
    // const { params } = this.props.navigation.state;
  }

  render() {
    if (this.state.movieUri) {
      return (
        <div style={styles.container}>
          <span>MOVIE PLAYER HERE</span>
        </div>
      );
    }

    return <span>Loading...</span>;
  }
}

const styles = {
  container: {
    flex: 1,
  },
  movie: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
};

export default MovieScreen;
