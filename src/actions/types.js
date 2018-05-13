/* @flow */

export type SukeibeiLink = {
  shortTitle: string,
  longTitle: string,
  idPrefix: string,
  idSuffix: string,
  magnetLink: string,
  torrentLink: string,
  size: string,
  uploadDate: string,
  seeds: number,
  leechs: number,
  completedDownloads: number,
  coverUrl: string,
  trailer360pUrl: string,
  trailer480pUrl: string,
  trailer720pUrl: string,
  trailer1080pUrl: string,
};

export type Action =
  | { type: 'FETCHED_CARIBBEAN_SUKEIBEI_LINKS', links: SukeibeiLink[] }
  | { type: 'FETCH_CARIBBEAN_SUKEIBEI_LINKS_FAILED', error: Error }
  | { type: 'FETCHED_SUKEIBEI_LINKS', links: SukeibeiLink[] }
  | { type: 'FETCH_SUKEIBEI_LINKS_FAILED', error: Error }

export type ThunkAction = (dispatch: Action => void) => Promise<void>;
