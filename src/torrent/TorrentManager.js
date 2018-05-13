/* @flow */

import type { Client, File } from './types';

const WebTorrent = window.require('webtorrent');

const client: Client = new WebTorrent();

client.on('error', (err) => {
  console.error(`Torrent client error: ${err}`);
});

client.on('torrent', (torrent) => {
  console.warn(`Torrent ready: ${torrent.infoHash}`);
});

async function downloadMagnetTorrent(magnetURI: string, videoElement: any): Promise<File> {
  return new Promise((resolve, reject) => {
    client.add(magnetURI, (torrent) => {
      console.warn('Client is downloading');
      console.warn(torrent.infoHash);

      let movieFile: ?File = null;

      torrent.files.forEach((file) => {
        if (!movieFile || file.length > movieFile.length) {
          movieFile = file;
        }
      });

      if (movieFile) {
        torrent.on('download', () => {
          console.warn(`Progress: ${torrent.progress}`);
          // console.warn(`Downloaded: ${torrent.downloaded}`);
          // console.warn(`Download speed: ${torrent.downloadSpeed}`);
          // console.warn(`Upload speed: ${torrent.uploadSpeed}`);
        });

        movieFile.renderTo(videoElement);

        resolve(movieFile);
      } else {
        reject(Error('No compatible file found in the torrent'));
      }
    });
  });
}

export default downloadMagnetTorrent;
