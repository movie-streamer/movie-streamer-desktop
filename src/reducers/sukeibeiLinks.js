/* @flow */

import type { SukeibeiLink, Action } from '../actions/types';

export type SukeibeiLinks = {
  caribbean: SukeibeiLink[],
  sukeibei: SukeibeiLink[],
  tokyo: SukeibeiLink[],
  kv: SukeibeiLink[],
};

const initialState = {
  caribbean: [],
  sukeibei: [],
  tokyo: [],
  kv: [],
};

function sukeibeiLinks(state: SukeibeiLinks = initialState, action: Action): SukeibeiLinks {
  if (action.type === 'FETCHED_CARIBBEAN_SUKEIBEI_LINKS') {
    return {
      ...state,
      caribbean: action.links,
    };
  }

  if (action.type === 'FETCHED_TOKYO_SUKEIBEI_LINKS') {
    return {
      ...state,
      tokyo: action.links,
    };
  }

  if (action.type === 'FETCHED_KV_SUKEIBEI_LINKS') {
    return {
      ...state,
      kv: action.links,
    };
  }

  if (action.type === 'FETCHED_SUKEIBEI_LINKS') {
    return {
      ...state,
      sukeibei: action.links,
    };
  }

  if (action.type === 'UPDATED_MOVIE_INFO') {
    const newMovie = action.movie;

    return {
      ...state,
      [action.movieType]: state[action.movieType].map((movie) => {
        if (movie.magnetLink === newMovie.magnetLink) {
          return newMovie;
        }

        return movie;
      }),
    };
  }

  return state;
}

export default sukeibeiLinks;
