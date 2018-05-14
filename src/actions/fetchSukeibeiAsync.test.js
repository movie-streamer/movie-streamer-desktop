/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import fetchSukeibeiAsync from './fetchSukeibeiAsync';

const mockStore = configureMockStore([thunk]);

jest.mock('./fetchHtml');

describe('fetchSukeibeiAsync', () => {
  test('fetches Sukeibei and returns torrent links', async () => {
    const store = mockStore({});

    await store.dispatch(fetchSukeibeiAsync());

    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(1);
    expect(expectedActions).toMatchSnapshot();
  });
});
