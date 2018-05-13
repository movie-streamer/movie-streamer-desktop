/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import fetchCaribbeanAsync from './fetchCaribbeanAsync';
import sukeibeiCaribbeanPageSample from './page-samples/sukeibeiCaribbeanPageSample';

const mockStore = configureMockStore([thunk]);

describe('fetchCaribbeanAsync', () => {
  test('fetches Sukeibei and returns Caribbean torrent links', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() => (
      new Promise((resolve) => {
        resolve({
          ok: true,
          text: () => sukeibeiCaribbeanPageSample,
        });
      })
    ));

    const store = mockStore({});

    await store.dispatch(fetchCaribbeanAsync());

    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(1);
    expect(expectedActions).toMatchSnapshot();
  });
});
