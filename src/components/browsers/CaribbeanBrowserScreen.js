/* @flow */

import React from 'react';
import { connect } from 'react-redux';

import SukeibeiMovieGrid from '../SukeibeiMovieGrid';
import fetchCaribbeanAsync from '../../actions/fetchCaribbeanAsync';
import { getCaribbeanLinks } from '../../store/selectors';
import type { ThunkAction, SukeibeiLink } from '../../actions/types';
import type { State } from '../../store/selectors';

type Props = {
  caribbeanLinks: SukeibeiLink[],
  fetchCaribbean: () => ThunkAction,
};

class CaribbeanBrowserScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.fetchCaribbean();
  }

  render() {
    return (
      // TODO: Put loading gif while fetching links
      <SukeibeiMovieGrid sukeibeiLinks={this.props.caribbeanLinks} />
    );
  }
}

export default connect((state: State) => ({
  caribbeanLinks: getCaribbeanLinks(state),
}), {
  fetchCaribbean: fetchCaribbeanAsync,
})(CaribbeanBrowserScreen);
