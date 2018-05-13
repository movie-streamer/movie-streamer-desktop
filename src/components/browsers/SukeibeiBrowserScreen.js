/* @flow */

import React from 'react';
import { connect } from 'react-redux';

import SukeibeiMovieGrid from '../SukeibeiMovieGrid';
import fetchSukeibeiAsync from '../../actions/fetchSukeibeiAsync';
import { getSukeibeiLinks } from '../../store/selectors';
import type { ThunkAction, SukeibeiLink } from '../../actions/types';
import type { State } from '../../store/selectors';

type Props = {
  sukeibeiLinks: SukeibeiLink[],
  fetchSukeibei: () => ThunkAction,
};

class SukeibeiBrowserScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.fetchSukeibei();
  }

  render() {
    return (
      // TODO: Put loading gif while fetching links
      <SukeibeiMovieGrid sukeibeiLinks={this.props.sukeibeiLinks} />
    );
  }
}

export default connect((state: State) => ({
  sukeibeiLinks: getSukeibeiLinks(state),
}), {
  fetchSukeibei: fetchSukeibeiAsync,
})(SukeibeiBrowserScreen);
