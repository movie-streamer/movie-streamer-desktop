/* @flow */

import DomParser from 'dom-parser';

import fetchHtml from './fetchHtml';
import type { SukeibeiLink, ThunkAction } from './types';

export const sukeibeiUrl = 'https://sukebei.nyaa.si/?q=&f=0&c=2_0&s=seeders&o=desc';

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
      if (titleMatch[2] === 'ABP') {
        titleMatch[2] = 'TKTABP';
      } else if (titleMatch[2] === 'SGA') {
        titleMatch[2] = 'SHASGA';
      }

      const shortTitle = `${titleMatch[2]}-${titleMatch[3]}`;
      let coverUrl = '';
      let trailer360pUrl = '';
      let trailer480pUrl = '';
      let trailer720pUrl = '';
      let trailer1080pUrl = '';

      if (titleMatch[2] === 'MDB'
          || titleMatch[2] === 'BAZX'
          || titleMatch[2] === 'SUPA'
          || titleMatch[2] === 'MDTM'
          || titleMatch[2] === 'XRW') {
        // KM Produce (Bazooka, Super Shiroto, Media Station, Real Works, etc.) titles
        coverUrl = `http://www.km-produce.com/img/title1/${shortTitle.toLowerCase()}.jpg`;
        trailer480pUrl = `https://dl0.supermm.jp/unsecure/600/sample/${shortTitle}.mp4`;

        // TODO: Put them as null instead
        trailer360pUrl = trailer480pUrl;
        trailer720pUrl = trailer480pUrl;
        trailer1080pUrl = trailer480pUrl;
      } else if (titleMatch[2] === 'SCOP' || titleMatch[2] === 'SCPX') {
        const imageTitle = `${titleMatch[2].toLowerCase()}00${titleMatch[3]}`;
        const trailerTitle = `${titleMatch[2].toLowerCase()}${titleMatch[3]}`;
        // Scoop titles
        coverUrl = `http://pics.r18.com/digital/video/h_565${imageTitle}/h_565${imageTitle}pl.jpg`;
        trailer360pUrl = `http://awspv3001.r18.com/litevideo/freepv/8/84s/84${trailerTitle}/84${trailerTitle}_sm_w.mp4`;
        trailer480pUrl = `http://awspv3001.r18.com/litevideo/freepv/8/84s/84${trailerTitle}/84${trailerTitle}_dm_w.mp4`;
        trailer720pUrl = `http://awspv3001.r18.com/litevideo/freepv/8/84s/84${trailerTitle}/84${trailerTitle}_dmb_w.mp4`;
        trailer1080pUrl = trailer720pUrl;
      } else if (titleMatch[2] === 'FIV'
          || titleMatch[2] === 'TKTABP'
          || titleMatch[2] === 'YRH'
          || titleMatch[2] === 'SHASGA'
          || titleMatch[2] === 'MGT'
          || titleMatch[2] === 'TEM'
          || titleMatch[2] === 'KKJ'
          || titleMatch[2] === 'GETS'
          || titleMatch[2] === 'CPDE') {
        // Prestige titles
        let prefix = 'prestige';

        if (titleMatch[2] === 'TEM' || titleMatch[2] === 'KKJ') {
          // Magic prefix
          prefix = 'magic';
        } else if (titleMatch[2] === 'GETS') {
          // Gets prefix
          prefix = 'gets';
        } else if (titleMatch[2] === 'CPDE') {
          // Saikyou Zokusei prefix
          prefix = 'saikyouzokusei';
        }

        coverUrl = `http://www.prestige-av.com/images/corner/goods/${prefix}/${titleMatch[2].toLowerCase()}/${titleMatch[3]}/pb_e_${shortTitle.toLowerCase()}.jpg`;
        trailer480pUrl = `http://www.prestige-av.com/sample_movie/${shortTitle}.mp4`;
        trailer360pUrl = trailer480pUrl;
        trailer720pUrl = trailer480pUrl;
        trailer1080pUrl = trailer480pUrl;
      } else if (titleMatch[2] === 'MIAE') {
        // Moodyz
        const imageTitle = `${titleMatch[2].toLowerCase()}${titleMatch[3]}`;
        const trailerTitle = `${titleMatch[2].toLowerCase()}00${titleMatch[3]}`;
        coverUrl = `https://www.moodyz.com/contents/works/${imageTitle}/${imageTitle}pl.jpg`;
        trailer360pUrl = `http://cc3001.dmm.co.jp/litevideo/freepv/m/mia/${trailerTitle}/${trailerTitle}_sm_w.mp4`;
        trailer480pUrl = `http://cc3001.dmm.co.jp/litevideo/freepv/m/mia/${trailerTitle}/${trailerTitle}_dm_w.mp4`;
        trailer720pUrl = `http://cc3001.dmm.co.jp/litevideo/freepv/m/mia/${trailerTitle}/${trailerTitle}_dmb_w.mp4`;
        trailer1080pUrl = trailer720pUrl;
      } else if (titleMatch[2] === 'DOHI') {
        // Office K's
        const imageTitle = `${titleMatch[2].toLowerCase()}00${titleMatch[3]}`;
        const trailerTitle = `${titleMatch[2].toLowerCase()}${titleMatch[3]}`;
        coverUrl = `http://pics.r18.com/digital/video/36${imageTitle}/36${imageTitle}pl.jpg`;
        trailer360pUrl = `http://awspv3001.r18.com/litevideo/freepv/h/h_1/h_139${trailerTitle}/h_139${trailerTitle}_sm_w.mp4`;
        trailer480pUrl = `http://awspv3001.r18.com/litevideo/freepv/h/h_1/h_139${trailerTitle}/h_139${trailerTitle}_dm_w.mp4`;
        trailer720pUrl = `http://awspv3001.r18.com/litevideo/freepv/h/h_1/h_139${trailerTitle}/h_139${trailerTitle}_dmb_w.mp4`;
        trailer1080pUrl = trailer720pUrl;
      } else if (titleMatch[2] === 'NKKD' // JET Eizo
          || titleMatch[2] === 'NDRA' // JET Eizo
          || titleMatch[2] === 'NGOD' // JET Eizo
          || titleMatch[2] === 'SSNI' // S1 style
          || titleMatch[2] === 'ADN' // Attackers
          || titleMatch[2] === 'JUFD' // Fitch
          || titleMatch[2] === 'KTKZ' // Kitixx/Mousouzoku
          || titleMatch[2] === 'KTKL' // Kitixx/Mousouzoku
          || titleMatch[2] === 'IPX' // Idea Pocket
          || titleMatch[2] === 'KAWD' // Kawaii
          || titleMatch[2] === 'URMC') { // Unfinished
        // JET Eizo, S1 Style, Attackers, Fitch, Unfinished
        const imageTitle = `${titleMatch[2].toLowerCase()}00${titleMatch[3]}`;
        const firstLetter = titleMatch[2].substr(0, 1).toLowerCase();
        const subTitle = titleMatch[2].substr(0, 3).toLowerCase();
        coverUrl = `http://pics.r18.com/digital/video/${imageTitle}/${imageTitle}pl.jpg`;
        trailer360pUrl = `http://awspv3001.r18.com/litevideo/freepv/${firstLetter}/${subTitle}/${imageTitle}/${imageTitle}_sm_w.mp4`;
        trailer480pUrl = `http://awspv3001.r18.com/litevideo/freepv/${firstLetter}/${subTitle}/${imageTitle}/${imageTitle}_dm_w.mp4`;
        trailer720pUrl = `http://awspv3001.r18.com/litevideo/freepv/${firstLetter}/${subTitle}/${imageTitle}/${imageTitle}_dmb_w.mp4`;
        trailer1080pUrl = trailer720pUrl;
      } else if (titleMatch[2] === 'HUNTA') {
        // Hunter
        const imageTitle = `${titleMatch[2].toLowerCase()}00${titleMatch[3]}`;
        const trailerTitle = `${titleMatch[2].toLowerCase()}${titleMatch[3]}`;
        const firstLetter = titleMatch[2].substr(0, 1).toLowerCase();
        const subTitle = titleMatch[2].substr(0, 3).toLowerCase();
        coverUrl = `http://pics.r18.com/digital/video/${imageTitle}/${imageTitle}pl.jpg`;
        trailer360pUrl = `http://awspv3001.r18.com/litevideo/freepv/${firstLetter}/${subTitle}/${trailerTitle}/${trailerTitle}_sm_w.mp4`;
        trailer480pUrl = `http://awspv3001.r18.com/litevideo/freepv/${firstLetter}/${subTitle}/${trailerTitle}/${trailerTitle}_dm_w.mp4`;
        trailer720pUrl = `http://awspv3001.r18.com/litevideo/freepv/${firstLetter}/${subTitle}/${trailerTitle}/${trailerTitle}_dmb_w.mp4`;
        trailer1080pUrl = trailer720pUrl;
      } else if (titleMatch[2] === 'AMBI') {
        const imageTitle = `${titleMatch[2].toLowerCase()}00${titleMatch[3]}`;
        const trailerTitle = `${titleMatch[2].toLowerCase()}${titleMatch[3]}`;
        coverUrl = `http://pics.r18.com/digital/video/h_237${imageTitle}/h_237${imageTitle}pl.jpg`;
        trailer360pUrl = `http://awspv3001.r18.com/litevideo/freepv/h/h_2/h_237${trailerTitle}/h_237${trailerTitle}_sm_w.mp4`;
        trailer480pUrl = `http://awspv3001.r18.com/litevideo/freepv/h/h_2/h_237${trailerTitle}/h_237${trailerTitle}_dm_w.mp4`;
        trailer720pUrl = `http://awspv3001.r18.com/litevideo/freepv/h/h_2/h_237${trailerTitle}/h_237${trailerTitle}_dmb_w.mp4`;
        trailer1080pUrl = trailer720pUrl;
      }

      links.push({
        longTitle: titleString,
        shortTitle,
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
      });
    }

    return links;
  }, []);
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
