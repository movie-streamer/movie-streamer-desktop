/* @flow */

import type { SukeibeiLink, Action } from '../actions/types';

export type SukeibeiLinks = {
  caribbean: SukeibeiLink[],
  sukeibei: SukeibeiLink[],
};

const initialState = {
  caribbean: [],
  sukeibei: [],
};

function sukeibeiLinks(state: SukeibeiLinks = initialState, action: Action): SukeibeiLinks {
  if (action.type === 'FETCHED_CARIBBEAN_SUKEIBEI_LINKS') {
    return {
      ...state,
      caribbean: action.links,
    };
  }

  if (action.type === 'FETCHED_SUKEIBEI_LINKS') {
    return {
      ...state,
      sukeibei: action.links,
    };
  }

  return state;
}

export default sukeibeiLinks;
