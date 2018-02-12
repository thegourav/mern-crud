import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';

import TableUser from '../TableUser/TableUser';
import ModalUser from '../ModalUser/ModalUser';

import FishPage from '../Pages/FishPage';
import PurchasePage from '../Pages/PurchasePage';
import OrderPage from '../Pages/OrderPage';
import ReportsPage from '../Pages/ReportsPage';


import logo from '../../logo.svg';
import shirts from '../../shirts.png';
import './App.css';

import { Tab } from 'semantic-ui-react';

const panes = [
  { menuItem: 'Fish Types', render: () => <Tab.Pane attached={false}><FishPage /></Tab.Pane> },
  { menuItem: 'Buy', render: () => <Tab.Pane attached={false}><PurchasePage /></Tab.Pane> },
  { menuItem: 'Sell', render: () => <Tab.Pane attached={false}><OrderPage /></Tab.Pane> },
  { menuItem: 'Reports', render: () => <Tab.Pane attached={false}><ReportsPage /></Tab.Pane> },
];

class App extends Component {

  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || '';
    this.socket = io.connect(this.server);

    this.state = {
      users: [],
      online: 0
    }

    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleUserAdded = this.handleUserAdded.bind(this);
    this.handleUserUpdated = this.handleUserUpdated.bind(this);
    this.handleUserDeleted = this.handleUserDeleted.bind(this);
  }

  // Place socket.io code inside here
  componentDidMount() {
    this.socket.on('visitor enters', data => this.setState({ online: data }));
    this.socket.on('visitor exits', data => this.setState({ online: data }));
    this.socket.on('add', data => this.handleUserAdded(data));
    this.socket.on('update', data => this.handleUserUpdated(data));
    this.socket.on('delete', data => this.handleUserDeleted(data));
  }

  // Fetch data from the back-end
  fetchUsers() {
    axios.get(`${this.server}/api/users/`)
    .then((response) => {
      this.setState({ users: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleUserAdded(user) {
    let users = this.state.users.slice();
    users.push(user);
    this.setState({ users: users });
  }

  handleUserUpdated(user) {
    let users = this.state.users.slice();
    for (let i = 0, n = users.length; i < n; i++) {
      if (users[i]._id === user._id) {
        users[i].name = user.name;
        users[i].email = user.email;
        users[i].age = user.age;
        users[i].gender = user.gender;
        break; // Stop this loop, we found it!
      }
    }
    this.setState({ users: users });
  }

  handleUserDeleted(user) {
    let users = this.state.users.slice();
    users = users.filter(u => { return u._id !== user._id; });
    this.setState({ users: users });
  }

  render() {

    let online = this.state.online;
    let verb = (online <= 1) ? 'is' : 'are'; // linking verb, if you'd prefer
    let noun = (online <= 1) ? 'person' : 'people';

    return (
      <div>
        <div className='App'>
          <div className='App-header'>
          <h1> Welcome to Fish Mart </h1>
          </div>
        </div>
        <Container>
          <Tab menu={{ secondary: true, pointing: true }} panes={panes} onTabChange={this.onTabChange} />
        </Container>   
        <br/>
      </div>
    );
  }
}

export default App;
