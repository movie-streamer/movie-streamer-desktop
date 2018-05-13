/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import fetchSukeibeiAsync from './fetchSukeibeiAsync';
import sukeibeiPageSample from './page-samples/sukeibeiPageSample';

const mockStore = configureMockStore([thunk]);

describe('fetchSukeibeiAsync', () => {
  test('fetches Sukeibei and returns torrent links', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() => (
      new Promise((resolve) => {
        resolve({
          ok: true,
          text: () => sukeibeiPageSample,
        });
      })
    ));

    const store = mockStore({});

    await store.dispatch(fetchSukeibeiAsync());

    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(1);
    expect(expectedActions).toMatchSnapshot();
  });
});
