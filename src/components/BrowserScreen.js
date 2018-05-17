/* @flow */

import React from 'react';
import { Paper, Tabs, Tab } from 'material-ui';

import SukeibeiBrowserScreen from './browsers/SukeibeiBrowserScreen';
import CaribbeanBrowserScreen from './browsers/CaribbeanBrowserScreen';
import TokyoBrowserScreen from './browsers/TokyoBrowserScreen';
import KnightsVisualBrowserScreen from './browsers/KnightsVisualBrowserScreen';

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
            <Tab label="Sukeibei" />
            <Tab label="Knights Visual" />
            <Tab label="Caribbean" />
            <Tab label="Tokyo Hot" />
          </Tabs>
        </Paper>

        {this.state.tabIndex === 0 && <SukeibeiBrowserScreen />}
        {this.state.tabIndex === 1 && <KnightsVisualBrowserScreen />}
        {this.state.tabIndex === 2 && <CaribbeanBrowserScreen />}
        {this.state.tabIndex === 3 && <TokyoBrowserScreen />}
      </div>
    );
  }
}

export default BrowserScreen;
