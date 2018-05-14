/* @flow */

import sukeibeiCaribbeanPageSample from '../page-samples/sukeibeiCaribbeanPageSample';
import sukeibeiPageSample from '../page-samples/sukeibeiPageSample';
import { caribbeanUrl } from '../fetchCaribbeanAsync';
import { sukeibeiUrl } from '../fetchSukeibeiAsync';

async function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (url === caribbeanUrl) {
      resolve(sukeibeiCaribbeanPageSample);
    } else if (url === sukeibeiUrl) {
      resolve(sukeibeiPageSample);
    } else {
      reject(Error(`Url not found in fetchHtml mock: ${url}`));
    }
  });
}

export default fetchHtml;
