/* @flow */

// Reference: https://webtorrent.io/docs

/* eslint-disable no-use-before-define */
export type WritableStream = {
  writableHighWaterMark: number,
  writableLength: number,
  once: (event: 'drain', callback: () => void) => void,
  cork: () => void,
  uncork: () => void,
  write: (chunk: Buffer, encoding?: string, callback?: () => void) => boolean,
  destroy: (error?: Error) => WritableStream,
  end: (chunk?: Buffer, encoding?: string, callback?: () => void) => WritableStream,
  setDefaultEncoding: (encoding: string) => WritableStream,
  on: ((event: 'close', callback: () => void) => void)
    & ((event: 'error', callback: (error: Error) => void) => void)
    & ((event: 'finish', callback: () => void) => void)
    & ((event: 'pipe', callback: (src: ReadableStream) => void) => void)
    & ((event: 'unpipe', callback: (src: ReadableStream) => void) => void),
};
/* eslint-enable no-use-before-define */

export type ReadableStream = {
  readableHighWaterMark: number,
  readableLength: number,
  destroy: (error?: Error) => ReadableStream,
  isPaused: () => boolean,
  pause: () => ReadableStream,
  resume: () => ReadableStream,
  pipe: (destination: WritableStream, opts?: {end: boolean}) => WritableStream,
  unpipe: (destination?: WritableStream) => ReadableStream,
  read: (size?: number) => Buffer,
  setEncoding: (encoding: string) => ReadableStream,
  unshift: (chunk: Buffer) => void,
  on: ((event: 'close', callback: () => void) => void)
    & ((event: 'data', callback: (chunk: Buffer) => void) => void)
    & ((event: 'end', callback: () => void) => void)
    & ((event: 'error', callback: (error: Error) => void) => void)
    & ((event: 'readable', callback: () => void) => void),
};

export type File = {
  name: string,
  path: string,
  length: number, // File length
  downloaded: number, // Total verified bytes received
  progress: number, // Download progress (0-1)
  select: () => void, // Select the file for download at a lower priority
  deselect: () => void, // Deselect the file for download
  createReadStream: (opts?: {start: number, end: number}) => ReadableStream,
  getBuffer: (callback: (err: Error, buffer: Buffer) => void) => void,
  appendTo: (rootElem: string, opts?: {
    autoplay?: boolean,
    muted?: boolean,
    controls?: boolean,
    maxBlobLength?: number,
  }, callback?: (err: Error, elem: string) => void) => void,
  renderTo: (elem: string, opts?: {
    autoplay?: boolean,
    muted?: boolean,
    controls?: boolean,
    maxBlobLength?: number,
  }, callback?: (err: Error, elem: string) => void) => void,
  getBlob: (callback: (err: Error, blob: Blob) => void) => void,
  getBlobURL: (callback: (err: Error, url: string) => void) => void,
};

/* eslint-disable no-use-before-define */
export type Peer = {
  addr: string,
  conn: any, // TODO: Make Socket type
  connectTimeout: number,
  connected: boolean,
  destroyed: boolean,
  handshakeTimeout: number,
  id: string,
  retries: number,
  sentHandshake: boolean,
  swarm: Torrent,
  timeout: ?number,
  type: string,
  wire: any, // TODO: Make Wire type
};
/* eslint-enable no-use-before-define */

export type Torrent = {
  infoHash: string,
  magnetURI: string,
  torrentFile: Buffer,
  torrentFileBlobURL: string,
  files: File[],
  timeRemaining: number, // In milliseconds
  received: number, // Total bytes received from peers
  downloaded: number, // Total verified bytes received from peers
  uploaded: number, // Total bytes uploaded to peers
  downloadSpeed: number, // In bytes/sec
  uploadSpeed: number, // In bytes/sec
  progress: number, // Download progress (0-1)
  ratio: number, // Uploaded/Downloaded
  numPeers: number,
  path: string,
  wires: any[],
  _peers: { [key: string]: Peer },
  destroy: (callback?: () => void) => void,
  addPeer: (peer: string) => void,
  removePeer: (peer: string) => void,
  addWebSeed: (url: string) => void,
  select: (start: number, end: number, priority?: number, callback?: () => void) => void,
  deselect: (start: number, end: number, priority: number) => void,
  critical: (start: number, end: number) => void,
  pause: () => void,
  resume: () => void,
  createServer: (opts?: {
    origin?: string,
    hostname?: string,
  }) => any, // TODO: Make type for http.Server (see http.createServer)
  on: ((event: 'infoHash', callback: () => void) => void)
    & ((event: 'metadata', callback: () => void) => void)
    & ((event: 'ready', callback: () => void) => void)
    & ((event: 'warning', callback: (err: string) => void) => void)
    & ((event: 'error', callback: (err: string) => void) => void)
    & ((event: 'done', callback: () => void) => void)
    & ((event: 'download', callback: (bytes?: number) => void) => void)
    & ((event: 'upload', callback: (bytes: number) => void) => void)
    & ((event: 'wire', callback: (wire: any, addr: string) => void) => void) // TODO: Make Wire type
    & ((event: 'noPeers', callback: (announceType: 'tracker' | 'dht') => void) => void),
};

export type Client = {
  add: ((torrentId: string | Buffer, opts: {
    announce: string[],
    getAnnounceOpts: () => void,
    maxWebConns: number,
    path: string,
    store: () => void, // TODO: Implement https://www.npmjs.com/package/abstract-chunk-store
  }, onTorrent?: (torrent: Torrent) => void) => void)
    & ((torrentId: string | Buffer, onTorrent?: (torrent: Torrent) => void) => void),
  seed: (intput: string | ReadableStream | Buffer) => void,
  on: ((event: 'torrent', callback: (torrent: Torrent) => void) => void)
    & ((event: 'error', callback: (err: string) => void) => void),
  remove: (torrentId: string | Buffer, callback?: (err: string) => void) => void,
  destroy: (callback?: (err: string) => void) => void,
  get: (torrentId: string | Buffer) => ?Torrent,
  torrents: Torrent[],
  downloadSpeed: number, // Bytes/sec
  uploadSpeed: number, // Bytes/sec
  progress: number, // Download progress for all active torrents (0-1)
  ratio: number, // Uploaded / Downloaded
};
