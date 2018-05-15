/* @flow */

import DomParser from 'dom-parser';

import fetchHtml from './fetchHtml';
import type { SukeibeiLink, ThunkAction } from './types';

export const sukeibeiUrl = 'https://sukebei.nyaa.si/?q=&f=0&c=2_0&s=seeders&o=desc';

function isSODMovie(idPrefix: string): boolean {
  return ['SDMU', 'STAR'].includes(idPrefix);
}

function isR18Movie(idPrefix: string): boolean {
  return [
    'AMBI', 'ADN', 'APKH', 'APNS', 'AVSA', 'BRK', 'DCX', 'DOCP', 'DOHI', 'EBOD', 'EYAN', 'FSET',
    'GVG', 'INCT', 'IPX', 'JUFD', 'JUY', 'KAWD', 'KTKL', 'KTKZ', 'MIAE', 'MIDE', 'MIFD', 'MMGH',
    'MUDR', 'MUKD', 'MRXD', 'MXGS', 'NDRA', 'NGOD', 'NHDTB', 'NKKD', 'REAL', 'RCTD', 'SCOP', 'SCPX',
    'SDDE', 'SDMU', 'SHKN', 'SNTL', 'SOAN', 'SSNI', 'STAR', 'SVDVD', 'SW', 'TRE', 'URMC', 'VRTM',
    'YPAA',
  ].includes(idPrefix);
}

function isAliceJapanMovie(idPrefix: string): boolean {
  return ['DVAJ'].includes(idPrefix);
}

function getTrailerPrefix(idPrefix: string): string {
  let trailerPrefix = idPrefix;

  if (idPrefix === 'ABP') {
    trailerPrefix = `TKT${idPrefix}`;
  } else if (idPrefix === 'SGA') {
    trailerPrefix = `SHA${idPrefix}`;
  } else if (isSODMovie(idPrefix) ||
    [
      'FSET', 'MMGH', 'NHDTB', 'RCTD', 'SDDE', 'SVDVD', 'SW',
    ].includes(idPrefix)) {
    trailerPrefix = `1${idPrefix}`;
  } else if (idPrefix === 'VRTM') {
    trailerPrefix = `h_910${idPrefix}`;
  } else if (idPrefix === 'DOHI') {
    trailerPrefix = `h_139${idPrefix}`;
  } else if (['REAL', 'SCOP', 'SCPX'].includes(idPrefix)) {
    trailerPrefix = `84${idPrefix}`;
  } else if (idPrefix === 'SHKN') {
    trailerPrefix = `h_1281${idPrefix}`;
  } else if (idPrefix === 'YPAA') {
    trailerPrefix = `h_086${idPrefix}`;
  } else if (idPrefix === 'BRK') {
    trailerPrefix = `143${idPrefix}`;
  } else if (idPrefix === 'MXGS') {
    trailerPrefix = `h_068${idPrefix}`;
  } else if (['TRE', 'DCX', 'DOCP'].includes(idPrefix)) {
    trailerPrefix = `118${idPrefix}`;
  } else if (idPrefix === 'GVG') {
    trailerPrefix = `13${idPrefix}`;
  }

  return trailerPrefix.toLowerCase();
}

function getImagePrefix(idPrefix: string): string {
  let imagePrefix = getTrailerPrefix(idPrefix);

  if (idPrefix === 'REAL') {
    imagePrefix = `172${idPrefix}`;
  } else if (['SCOP', 'SCPX'].includes(idPrefix)) {
    imagePrefix = `h_565${idPrefix}`;
  }

  return imagePrefix.toLowerCase();
}

function getImageSuffix(idPrefix: string, idSuffix: string): string {
  let imageSuffix = idSuffix;

  if (isR18Movie(idPrefix)) {
    imageSuffix = idSuffix.padStart(5, '0');
  }

  return imageSuffix;
}

function getTrailerSuffix(idPrefix: string, idSuffix: string): string {
  let trailerSuffix = getImageSuffix(idPrefix, idSuffix);

  if (
    [
      'AMBI', 'APKH', 'APNS', 'AVSA', 'BRK', 'DCX', 'DOCP', 'DOHI', 'MXGS', 'REAL', 'SCPX', 'SCOP',
      'SHKN', 'TRE', 'VRTM', 'YPAA',
    ].includes(idPrefix)) {
    trailerSuffix = idSuffix;
  }

  return trailerSuffix;
}

function parseSukeibeiPage(htmlPage: string): SukeibeiLink[] {
  const parser = new DomParser();
  const dom = parser.parseFromString(htmlPage);

  const torrentList = dom.getElementsByClassName('torrent-list')[0];
  const rows = torrentList.getElementsByTagName('tr');

  return rows.reduce((links: SukeibeiLink[], row) => {
    const titleString: string = row.childNodes
      .filter(x => x.text === undefined)[1].childNodes
      .filter(x => x.text === undefined)[0].textContent;

    const regex = /(\s|^)([A-Z]+)-(\d+)/;

    const titleMatch = titleString.match(regex);
    const torrentAttribute = row.childNodes
      .filter(x => x.text === undefined)[2].childNodes
      .filter(x => x.text === undefined)[0].attributes
      .find(x => x.name === 'href');

    const magnetAttribute = row.childNodes
      .filter(x => x.text === undefined)[2].childNodes
      .filter(x => x.text === undefined)[1].attributes
      .find(x => x.name === 'href');
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
      links.push(generateMovieLink(
        titleString,
        titleMatch[2],
        titleMatch[3],
        getImagePrefix(titleMatch[2]),
        getImageSuffix(titleMatch[2], titleMatch[3]),
        getTrailerPrefix(titleMatch[2]),
        getTrailerSuffix(titleMatch[2], titleMatch[3]),
        magnetAttribute.value,
        `https://sukebei.nyaa.si${torrentAttribute.value}`,
        seedsNode.textContent,
        leechsNode.textContent,
        sizeNode.textContent,
        dateNode.textContent,
        completedNode.textContent,
      ));
    }

    return links;
  }, []);
}

function generateMovieLink(
  longTitle: string,
  idPrefix: string,
  idSuffix: string,
  imagePrefix: string,
  imageSuffix: string,
  trailerPrefix: string,
  trailerSuffix: string,
  magnetLink: string,
  torrentLink: string,
  seeds: number,
  leechs: number,
  size: string,
  uploadDate: string,
  completedDownloads: number,
): SukeibeiLink {
  const shortTitle = `${idPrefix}-${idSuffix}`;
  let coverUrl = '';
  let trailer360pUrl = '';
  let trailer480pUrl = '';
  let trailer720pUrl = '';
  let trailer1080pUrl = '';

  if (['BAZX', 'MDB', 'MDTM', 'SUPA', 'XRW'].includes(idPrefix)) {
    // KM Produce (Bazooka, Super Shiroto, Media Station, Real Works, etc.) titles
    coverUrl = `http://www.km-produce.com/img/title1/${imagePrefix}-${imageSuffix}.jpg`;
    trailer480pUrl = `https://dl0.supermm.jp/unsecure/600/sample/${imagePrefix.toUpperCase()}-${imageSuffix}.mp4`;

    // TODO: Put them as null instead
    trailer360pUrl = trailer480pUrl;
    trailer720pUrl = trailer480pUrl;
    trailer1080pUrl = trailer480pUrl;
  } else if (['ABP', 'CPDE', 'FIV', 'GETS', 'KKJ', 'MGT', 'SGA', 'TEM', 'YRH'].includes(idPrefix)) {
    // Prestige titles
    let studioPrefix = 'prestige';

    if (idPrefix === 'TEM' || idPrefix === 'KKJ') {
      // Magic prefix
      studioPrefix = 'magic';
    } else if (idPrefix === 'GETS') {
      // Gets prefix
      studioPrefix = 'gets';
    } else if (idPrefix === 'CPDE') {
      // Saikyou Zokusei prefix
      studioPrefix = 'saikyouzokusei';
    }
    // a5999f552580fedcb7e9f5682bcf08a5
    coverUrl = `http://www.prestige-av.com/images/corner/goods/${studioPrefix}/${imagePrefix}/${imageSuffix}/pb_e_${imagePrefix}-${imageSuffix}.jpg`;
    trailer480pUrl = `http://www.prestige-av.com/sample_movie/${imagePrefix.toUpperCase()}-${imageSuffix}.mp4`;
    trailer360pUrl = trailer480pUrl;
    trailer720pUrl = trailer480pUrl;
    trailer1080pUrl = trailer480pUrl;
  } else if (isAliceJapanMovie(idPrefix)) {
    // TODO: Build the frame and send it to the link, so we can fetch the image/trailer at runtime
  } else if (isR18Movie(idPrefix)) {
    const imageId = `${imagePrefix}${imageSuffix}`;
    const trailerId = `${trailerPrefix}${trailerSuffix}`;
    const firstLetter = trailerPrefix.substr(0, 1).toLowerCase();
    const subTitle = trailerPrefix.substr(0, 3).toLowerCase();
    coverUrl = `http://pics.dmm.co.jp/digital/video/${imageId}/${imageId}pl.jpg`;
    trailer360pUrl = `http://cc3001.dmm.co.jp/litevideo/freepv/${firstLetter}/${subTitle}/${trailerId}/${trailerId}_sm_w.mp4`;
    trailer480pUrl = `http://cc3001.dmm.co.jp/litevideo/freepv/${firstLetter}/${subTitle}/${trailerId}/${trailerId}_dm_w.mp4`;
    trailer720pUrl = `http://cc3001.dmm.co.jp/litevideo/freepv/${firstLetter}/${subTitle}/${trailerId}/${trailerId}_dmb_w.mp4`;
    trailer1080pUrl = trailer720pUrl;
  }

  return {
    longTitle,
    shortTitle,
    idPrefix,
    idSuffix,
    magnetLink,
    torrentLink,
    size,
    uploadDate,
    seeds,
    leechs,
    completedDownloads,
    coverUrl,
    trailer360pUrl,
    trailer480pUrl,
    trailer720pUrl,
    trailer1080pUrl,
  };
}

function fetchSukeibeiAsync(): ThunkAction {
  return async (dispatch) => {
    try {
      const htmlPage = await fetchHtml(sukeibeiUrl);
      const links = parseSukeibeiPage(htmlPage);
      dispatch({ type: 'FETCHED_SUKEIBEI_LINKS', links });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'FETCH_SUKEIBEI_LINKS_FAILED', error });
    }
  };
}

export default fetchSukeibeiAsync;
