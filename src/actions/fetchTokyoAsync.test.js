/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import fetchTokyoAsync from './fetchTokyoAsync';

const mockStore = configureMockStore([thunk]);

jest.mock('./fetchHtml');

describe('fetchTokyoAsync', () => {
  test('fetches Sukeibei and returns Tokyo-Hot torrent links', async () => {
    const store = mockStore({});

    await store.dispatch(fetchTokyoAsync());

    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(1);
    expect(expectedActions).toMatchSnapshot();
  });
});
