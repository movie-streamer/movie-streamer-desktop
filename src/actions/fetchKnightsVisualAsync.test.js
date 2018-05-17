/* @flow */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import fetchKnightsVisualAsync from './fetchKnightsVisualAsync';

const mockStore = configureMockStore([thunk]);

jest.mock('./fetchHtml');

describe('fetchKnightsVisualAsync', () => {
  test('fetches Sukeibei and returns Knights Visual torrent links', async () => {
    const store = mockStore({});

    await store.dispatch(fetchKnightsVisualAsync());

    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(1);
    expect(expectedActions).toMatchSnapshot();
  });
});
