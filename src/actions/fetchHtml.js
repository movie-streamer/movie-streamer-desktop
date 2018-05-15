/* @flow */

const got = window.require('got');

async function fetchHtml(url: string) {
  return (await got(url)).body;
}

export default fetchHtml;
