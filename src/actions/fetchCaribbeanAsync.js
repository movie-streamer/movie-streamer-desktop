/* @flow */

import DomParser from 'dom-parser';

import fetchHtml from './fetchHtml';
import type { SukeibeiLink, ThunkAction } from './types';

function parseSukeibeiPage(htmlPage: string): SukeibeiLink[] {
  const parser = new DomParser();
  const dom = parser.parseFromString(htmlPage);

  const torrentList = dom.getElementsByClassName('torrent-list')[0];
  const rows = torrentList.getElementsByClassName('default');

  return rows.reduce((links: SukeibeiLink[], row) => {
    const titleString: string = row.childNodes
      .filter(x => x.text === undefined)[1].childNodes
      .filter(x => x.text === undefined)[0].textContent;

    const regex = /(Caribbean)com.+?(\d+)[-_ ](\d+)/;

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
      links.push({
        longTitle: titleString,
        shortTitle: `${titleMatch[1]}.com ${titleMatch[2]}-${titleMatch[3]}`,
        idPrefix: titleMatch[2],
        idSuffix: titleMatch[3],
        magnetLink: magnetAttribute.value,
        torrentLink: `https://sukebei.nyaa.si${torrentAttribute.value}`,
        size: sizeNode.textContent,
        uploadDate: dateNode.textContent,
        seeds: seedsNode.textContent,
        leechs: leechsNode.textContent,
        completedDownloads: completedNode.textContent,
        coverUrl: `https://www.caribbeancom.com/moviepages/${titleMatch[2]}-${titleMatch[3]}/images/l.jpg`,
        trailer360pUrl: `http://smovie.caribbeancom.com/sample/movies/${titleMatch[2]}-${titleMatch[3]}/360p.mp4`,
        trailer480pUrl: `http://smovie.caribbeancom.com/sample/movies/${titleMatch[2]}-${titleMatch[3]}/480p.mp4`,
        trailer720pUrl: `http://smovie.caribbeancom.com/sample/movies/${titleMatch[2]}-${titleMatch[3]}/720p.mp4`,
        trailer1080pUrl: `http://smovie.caribbeancom.com/sample/movies/${titleMatch[2]}-${titleMatch[3]}/1080p.mp4`,
      });
    }

    return links;
  }, []);
}

function fetchCaribbeanAsync(): ThunkAction {
  const sukeibeiUrl = 'https://sukebei.nyaa.si/?q=caribbean&f=0&c=2_0&s=seeders&o=desc';

  return async (dispatch) => {
    try {
      const htmlPage = await fetchHtml(sukeibeiUrl);
      const links = parseSukeibeiPage(htmlPage);
      dispatch({ type: 'FETCHED_CARIBBEAN_SUKEIBEI_LINKS', links });
    } catch (error) {
      dispatch({ type: 'FETCH_CARIBBEAN_SUKEIBEI_LINKS_FAILED', error });
    }
  };
}

export default fetchCaribbeanAsync;
