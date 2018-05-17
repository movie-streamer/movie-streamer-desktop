/* @flow */

import sukeibeiPageSample from '../page-samples/sukeibeiPageSample';
import sukeibeiCaribbeanPageSample from '../page-samples/sukeibeiCaribbeanPageSample';
import sukeibeiTokyoPageSample from '../page-samples/sukeibeiTokyoPageSample';
import sukeibeiKnightsVisualPageSample from '../page-samples/sukeibeiKnightsVisualPageSample';
import { sukeibeiUrl } from '../fetchSukeibeiAsync';
import { caribbeanUrl } from '../fetchCaribbeanAsync';
import { tokyoUrl } from '../fetchTokyoAsync';
import { knightsVisualUrl } from '../fetchKnightsVisualAsync';

async function fetchHtml(url: string): Promise<{ body: string }> {
  return new Promise((resolve, reject) => {
    if (url === caribbeanUrl) {
      resolve(sukeibeiCaribbeanPageSample);
    } else if (url === sukeibeiUrl) {
      resolve(sukeibeiPageSample);
    } else if (url === tokyoUrl) {
      resolve(sukeibeiTokyoPageSample);
    } else if (url === knightsVisualUrl) {
      resolve(sukeibeiKnightsVisualPageSample);
    } else {
      reject(Error(`Url not found in fetchHtml mock: ${url}`));
    }
  });
}

export default fetchHtml;
