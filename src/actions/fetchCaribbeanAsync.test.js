/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import fetchCaribbeanAsync from './fetchCaribbeanAsync';

const mockStore = configureMockStore([thunk]);

jest.mock('./fetchHtml');

describe('fetchCaribbeanAsync', () => {
  test('fetches Sukeibei and returns Caribbean torrent links', async () => {
    const store = mockStore({});

    await store.dispatch(fetchCaribbeanAsync());

    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(1);
    expect(expectedActions).toMatchSnapshot();
  });
});
