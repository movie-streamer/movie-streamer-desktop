/* @flow */

import React from 'react';
import { connect } from 'react-redux';

import SukeibeiMovieGrid from '../SukeibeiMovieGrid';
import fetchKnightsVisualAsync from '../../actions/fetchKnightsVisualAsync';
import { getKnightsVisualLinks } from '../../store/selectors';
import type { ThunkAction, SukeibeiLink } from '../../actions/types';
import type { State } from '../../store/selectors';

type Props = {
  knightsVisualLinks: SukeibeiLink[],
  fetchKnightsVisual: () => ThunkAction,
};

class KnightsVisualBrowserScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.fetchKnightsVisual();
  }

  render() {
    return (
      // TODO: Put loading gif while fetching links
      <SukeibeiMovieGrid sukeibeiLinks={this.props.knightsVisualLinks} />
    );
  }
}

export default connect((state: State) => ({
  knightsVisualLinks: getKnightsVisualLinks(state),
}), {
  fetchKnightsVisual: fetchKnightsVisualAsync,
})(KnightsVisualBrowserScreen);
