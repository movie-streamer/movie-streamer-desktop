/* @flow */

import React from 'react';

import downloadMagnetTorrent from '../torrent/TorrentManager';
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
  video: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      movieUri: null,
    };

    // https://github.com/facebook/flow/pull/5920
    // $FlowFixMe
    this.video = React.createRef();
  }

  async componentDidMount() {
    if (this.props.location && this.props.location.state) {
      const { sukeibeiLink } = this.props.location.state;

      console.warn('VIDEO: ');
      console.warn(this.video.current);

      await downloadMagnetTorrent(sukeibeiLink.magnetLink, 'video');
    }
    // const { magnetLink } = this.props.navigation.state.params.sukeibeiLink;
  }

  componentWillUnmount() {
    // const { params } = this.props.navigation.state;
  }

  render() {
    if (this.state.movieUri || true) {
      return (
        <div>
          <video height={500} controls />
        </div>
      );
    }

    return <span>Loading...</span>;
  }
}

export default MovieScreen;
