/* @flow */

const electron = window.require('electron');
const { net } = electron.remote;

async function fetchHtml(url: string): Promise<string> {
  const request = net.request(url);

  return new Promise((resolve, reject) => {
    request.on('response', (response) => {
      console.warn('RESPONSE');
      console.warn(response.statusCode);
      if (response.statusCode !== 200) {
        reject(Error(`Error ${response.statusCode}`));
      }
      let htmlPage = '';

      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        htmlPage += chunk;
      });

      response.on('end', () => {
        resolve(htmlPage);
      });
    });

    request.on('error', (error) => {
      reject(Error(error));
    });

    request.end();
  });
}

export default fetchHtml;
