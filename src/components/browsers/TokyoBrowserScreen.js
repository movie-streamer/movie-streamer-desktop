/* @flow */

import React from 'react';
import { connect } from 'react-redux';

import SukeibeiMovieGrid from '../SukeibeiMovieGrid';
import fetchTokyoAsync from '../../actions/fetchTokyoAsync';
import { getTokyoLinks } from '../../store/selectors';
import type { ThunkAction, SukeibeiLink } from '../../actions/types';
import type { State } from '../../store/selectors';

type Props = {
  tokyoLinks: SukeibeiLink[],
  fetchTokyo: () => ThunkAction,
};

class TokyoBrowserScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.fetchTokyo();
  }

  render() {
    return (
      // TODO: Put loading gif while fetching links
      <SukeibeiMovieGrid sukeibeiLinks={this.props.tokyoLinks} />
    );
  }
}

export default connect((state: State) => ({
  tokyoLinks: getTokyoLinks(state),
}), {
  fetchTokyo: fetchTokyoAsync,
})(TokyoBrowserScreen);
