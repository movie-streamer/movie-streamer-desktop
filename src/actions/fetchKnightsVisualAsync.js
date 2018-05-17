/* @flow */

import DomParser from 'dom-parser';

import fetchHtml from './fetchHtml';
import type { Action, SukeibeiLink, ThunkAction } from './types';

export const knightsVisualUrl = 'https://sukebei.nyaa.si/?q=kv&f=0&c=2_2&s=seeders&o=desc';

function parseAdditionalInfo(movie: SukeibeiLink, htmlPage: string): SukeibeiLink {
  const parser = new DomParser();
  const dom = parser.parseFromString(htmlPage);

  const coverDiv = dom.getElementsByClassName('entry-content clearfix')[0];
  const coverPath = coverDiv
    .childNodes.filter(x => x.text === undefined)[0]
    .childNodes.filter(x => x.text === undefined)[0]
    .getAttribute('href');

  const coverUrl = `http://www.knights-visual.com${coverPath}`;

  return {
    ...movie,
    coverUrl,
  };
}

async function fetchAdditionalInfoAsync(
  movie: SukeibeiLink,
  url: string, dispatch: (Action) => void,
) {
  try {
    const htmlPage = await fetchHtml(url);
    const newMovie = parseAdditionalInfo(movie, htmlPage);
    dispatch({ type: 'UPDATED_MOVIE_INFO', movie: newMovie, movieType: 'kv' });
  } catch (error) {
    console.error(error);
    dispatch({ type: 'UPDATE_MOVIE_INFO_FAILED', error });
  }
}

function parseSukeibeiPage(htmlPage: string, dispatch: (Action) => void): SukeibeiLink[] {
  const parser = new DomParser();
  const dom = parser.parseFromString(htmlPage);

  const torrentList = dom.getElementsByClassName('torrent-list')[0];
  const rows = torrentList.getElementsByClassName('default');

  return rows.reduce((links: SukeibeiLink[], row) => {
    const titleString: string = row.childNodes
      .filter(x => x.text === undefined)[1].childNodes
      .filter(x => x.text === undefined)[0].textContent;

    const regex = /(KV)-(\d+)/i;

    const titleMatch = titleString.match(regex);
    const torrentAttribute = row.childNodes.filter(x => x.text === undefined)[2].childNodes.filter(x => x.text === undefined)[0].attributes.find(x => x.name === 'href');
    const magnetAttribute = row.childNodes.filter(x => x.text === undefined)[2].childNodes.filter(x => x.text === undefined)[1].attributes.find(x => x.name === 'href');
    const sizeNode = row.childNodes.filter(x => x.text === undefined)[3];
    const dateNode = row.childNodes.filter(x => x.text === undefined)[4];
    const seedsNode = row.childNodes.filter(x => x.text === undefined)[5];
    const leechsNode = row.childNodes.filter(x => x.text === undefined)[6];
    const completedNode = row.childNodes.filter(x => x.text === undefined)[7];

    if (titleMatch
        && torrentAttribute
        && magnetAttribute
        && sizeNode
        && dateNode
        && seedsNode
        && leechsNode
        && completedNode) {
      const coverUrl = '';
      const trailer360pUrl = `http://fskvsample.knights-visual.com/samplemov/${titleMatch[1].toLowerCase()}-${titleMatch[2]}-samp-st.mp4`;
      const trailer480pUrl = trailer360pUrl;
      const trailer720pUrl = trailer360pUrl;
      const trailer1080pUrl = trailer360pUrl;

      const movie: SukeibeiLink = {
        longTitle: titleString,
        shortTitle: `${titleMatch[1]}-${titleMatch[2]}`,
        idPrefix: titleMatch[2],
        idSuffix: titleMatch[3],
        magnetLink: magnetAttribute.value,
        torrentLink: `https://sukebei.nyaa.si${torrentAttribute.value}`,
        size: sizeNode.textContent,
        uploadDate: dateNode.textContent,
        seeds: seedsNode.textContent,
        leechs: leechsNode.textContent,
        completedDownloads: completedNode.textContent,
        coverUrl,
        trailer360pUrl,
        trailer480pUrl,
        trailer720pUrl,
        trailer1080pUrl,
      };

      links.push(movie);

      // This will run async and update the movie async when it's done, in order to not block the
      // parsing of the other movies

      fetchAdditionalInfoAsync(
        movie,
        `http://www.knights-visual.com/works/${titleMatch[1]}-${titleMatch[2]}/`,
        dispatch,
      );
    }

    return links;
  }, []);
}

function fetchTokyoAsync(): ThunkAction {
  return async (dispatch) => {
    try {
      const htmlPage = await fetchHtml(knightsVisualUrl);
      const links = parseSukeibeiPage(htmlPage, dispatch);
      dispatch({ type: 'FETCHED_KV_SUKEIBEI_LINKS', links });
    } catch (error) {
      dispatch({ type: 'FETCH_KV_SUKEIBEI_LINKS_FAILED', error });
    }
  };
}

export default fetchTokyoAsync;
