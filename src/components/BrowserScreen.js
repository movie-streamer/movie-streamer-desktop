/* @flow */

import React from 'react';
import { Paper, Tabs, Tab } from 'material-ui';

import CaribbeanBrowserScreen from './browsers/CaribbeanBrowserScreen';
import SukeibeiBrowserScreen from './browsers/SukeibeiBrowserScreen';

type State = {
  tabIndex: number,
};

class BrowserScreen extends React.Component<{}, State> {
  handleTabChange: (newTabIndex: number) => void;

  constructor() {
    super();

    this.state = {
      tabIndex: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(event: any, newTabIndex: number) {
    this.setState({ tabIndex: newTabIndex });
  }

  render() {
    return (
      <div>
        <Paper>
          <Tabs
            value={this.state.tabIndex}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Caribbean" />
            <Tab label="Sukeibei" />
          </Tabs>
        </Paper>

        {this.state.tabIndex === 0 && <CaribbeanBrowserScreen />}
        {this.state.tabIndex === 1 && <SukeibeiBrowserScreen />}
      </div>
    );
  }
}

export default BrowserScreen;
