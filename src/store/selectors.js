/* @flow */

import type { SukeibeiLinks } from '../reducers/sukeibeiLinks';
import type { SukeibeiLink } from '../actions/types';

export type State = {
  sukeibeiLinks: SukeibeiLinks,
};

export function getCaribbeanLinks(state: State) {
  return state.sukeibeiLinks.caribbean;
}

export function getTokyoLinks(state: State) {
  return state.sukeibeiLinks.tokyo;
}

export function getKnightsVisualLinks(state: State) {
  return state.sukeibeiLinks.kv;
}

export function getSukeibeiLinks(state: State) {
  return state.sukeibeiLinks.sukeibei;
}

export function getUpdatedMovieInfo(
  state: State,
  newMovie: SukeibeiLink,
  movieType: 'tokyo' | 'caribbean' | 'sukeibei' | 'kv',
) {
  return state.sukeibeiLinks[movieType].find(movie => movie.magnetLink === newMovie.magnetLink);
}
