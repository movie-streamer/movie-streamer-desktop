/* @flow */

import DomParser from 'dom-parser';

import fetchHtml from './fetchHtml';
import type { Action, SukeibeiLink, ThunkAction } from './types';

export const tokyoUrl = 'https://sukebei.nyaa.si/?q=tokyo-hot&f=0&c=2_2&s=seeders&o=desc';

function parseAdditionalInfo(movie: SukeibeiLink, htmlPage: string): SukeibeiLink {
  const parser = new DomParser();
  const dom = parser.parseFromString(htmlPage);

  const videoDiv = dom.getElementsByTagName('video')[0];
  const coverUrl = videoDiv.getAttribute('poster');

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
    dispatch({ type: 'UPDATED_MOVIE_INFO', movie: newMovie, movieType: 'tokyo' });
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

    const regex = /(Tokyo-Hot)\s+?(n)(\d+)/i;

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
      const trailer360pUrl = `http://my.cdn.tokyo-hot.com/media/samples/${titleMatch[2]}${titleMatch[3]}.mp4`;
      const trailer480pUrl = trailer360pUrl;
      const trailer720pUrl = trailer360pUrl;
      const trailer1080pUrl = trailer360pUrl;

      const movie: SukeibeiLink = {
        longTitle: titleString,
        shortTitle: `${titleMatch[1]} ${titleMatch[2]}${titleMatch[3]}`,
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

      if (titleMatch[3].charAt(0) !== '0') {
        fetchAdditionalInfoAsync(
          movie,
          `http://my.tokyo-hot.com/product/${titleMatch[2]}${titleMatch[3]}/`,
          dispatch,
        );
      }
    }

    return links;
  }, []);
}

function fetchTokyoAsync(): ThunkAction {
  return async (dispatch) => {
    try {
      const htmlPage = await fetchHtml(tokyoUrl);
      const links = parseSukeibeiPage(htmlPage, dispatch);
      dispatch({ type: 'FETCHED_TOKYO_SUKEIBEI_LINKS', links });
    } catch (error) {
      dispatch({ type: 'FETCH_TOKYO_SUKEIBEI_LINKS_FAILED', error });
    }
  };
}

export default fetchTokyoAsync;
