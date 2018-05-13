/* @flow */

import type { SukeibeiLinks } from '../reducers/sukeibeiLinks';

export type State = {
  sukeibeiLinks: SukeibeiLinks,
};

export function getCaribbeanLinks(state: State) {
  return state.sukeibeiLinks.caribbean;
}

export function getSukeibeiLinks(state: State) {
  return state.sukeibeiLinks.sukeibei;
}
