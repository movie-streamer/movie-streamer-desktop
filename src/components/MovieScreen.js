/* @flow */

import React from 'react';

import { downloadMagnetTorrent, pauseMagnetTorrent } from '../torrent/TorrentManager';
import type { SukeibeiLink } from '../actions/types';

type Props = {
  location: {
    state: {
      sukeibeiLink: SukeibeiLink,
    },
  },
}

class MovieScreen extends React.Component<Props> {
  async componentDidMount() {
    if (this.props.location && this.props.location.state) {
      const { sukeibeiLink } = this.props.location.state;

      await downloadMagnetTorrent(sukeibeiLink.magnetLink, 'video');
    }
  }

  componentWillUnmount() {
    if (this.props.location && this.props.location.state) {
      pauseMagnetTorrent(this.props.location.state.sukeibeiLink.magnetLink);
    }
  }

  render() {
    // TODO: Add loading animation
    return (
      <div>
        <video height={500} controls autoPlay />
      </div>
    );
  }
}

export default MovieScreen;
