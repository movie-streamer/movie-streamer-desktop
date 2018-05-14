/* @flow */

import type { Client, File, Torrent } from './types';

const WebTorrent = window.require('webtorrent');

const client: Client = new WebTorrent();

client.on('error', (err) => {
  console.error(`Torrent client error: ${err}`);
});

client.on('torrent', (torrent) => {
  console.warn(`Torrent ready: ${torrent.infoHash}`);
});

function getMovieFile(torrent: Torrent): ?File {
  let movieFile: ?File = null;

  torrent.files.forEach((file) => {
    if (!movieFile || file.length > movieFile.length) {
      movieFile = file;
    }
  });

  return movieFile;
}

export async function downloadMagnetTorrent(magnetURI: string, videoElement: any): Promise<File> {
  return new Promise((resolve, reject) => {
    const oldTorrent: ?Torrent = client.get(magnetURI);

    if (oldTorrent) {
      const oldMovieFile = getMovieFile(oldTorrent);

      if (oldMovieFile) {
        /* eslint-disable no-underscore-dangle */
        oldTorrent.wires = Object.keys(oldTorrent._peers).map(addr => oldTorrent._peers[addr].wire);
        /* eslint-enable no-underscore-dangle */

        oldTorrent.resume();
        oldMovieFile.renderTo(videoElement);
        resolve(oldMovieFile);
      } else {
        reject(Error('No compatible files found in the torrent'));
      }

      return;
    }

    client.add(magnetURI, (torrent) => {
      let movieFile: ?File = null;

      torrent.files.forEach((file) => {
        if (!movieFile || file.length > movieFile.length) {
          movieFile = file;
        }
      });

      if (movieFile) {
        torrent.on('download', () => {
          // console.warn(`Progress: ${torrent.progress}`);
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

export function pauseMagnetTorrent(magnetURI: string) {
  const torrent = client.get(magnetURI);

  if (torrent) {
    torrent.pause();
    torrent.wires = [];
  }
}
