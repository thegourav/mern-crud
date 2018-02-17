import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import FishPage from '../Pages/FishPage';
import PurchasePage from '../Pages/PurchasePage';
import OrderPage from '../Pages/OrderPage';
import ReportsPage from '../Pages/ReportsPage';
import logo from '../../logo.svg';

import FaUser from 'react-icons/lib/fa/user';

import './App.css';

import { Tab } from 'semantic-ui-react';

const panes = [
  { menuItem: 'Fish Types', render: () => <Tab.Pane attached={false}><FishPage /></Tab.Pane> },
  { menuItem: 'Buy', render: () => <Tab.Pane attached={false}><PurchasePage /></Tab.Pane> },
  { menuItem: 'Sell', render: () => <Tab.Pane attached={false}><OrderPage /></Tab.Pane> },
  { menuItem: 'Reports', render: () => <Tab.Pane attached={false}><ReportsPage /></Tab.Pane> },
];

class App extends Component {
  render() {
    return (
      <div>
        <div className='App'>
          <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <div className="title"><span> Welcome to Fish Mart </span></div>
          <div className="welcome"><span> <FaUser color='#fff' style={{fontSize:'20px',marginBottom:'3px'}} /> Welcome User </span></div>
          </div>
        </div>
        <Container>
          <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        </Container>   
        <br/>
      </div>
    );
  }
}

export default App;
