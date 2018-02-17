import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import TableFishType from '../TableFishType/TableFishType';
import ModalUser from '../ModalUser/ModalUser';
import io from 'socket.io-client';

import Export from '../Print/Export';

export default class FishPage extends Component{
    constructor(...args){
        super(...args);
        this.state = {
            fishTypes : [],
        }
        this.server = process.env.REACT_APP_API_URL || '';
        this.socket = io.connect(this.server);

        this.handleAdd = this.handleAdd.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.fetchFishTypes = this.fetchFishTypes.bind(this);
    }

    handleAdd(fishType) {
        let fishTypes = this.state.fishTypes.slice();
        fishTypes.push(fishType);
        this.setState({ fishTypes:fishTypes });
      }
    
      handleUpdate(fishType) {
        let fishTypes = this.state.fishTypes.slice();
        for (let i = 0, n = fishTypes.length; i < n; i++) {
          if (fishTypes[i]._id === fishType._id) {
            fishTypes[i].name = fishType.name;
            fishTypes[i].category = fishType.category;
            fishTypes[i].stock = fishType.stock;
            break; // Stop this loop, we found it!
          }
        }
        this.setState({ fishTypes: fishTypes });
      }
    
      handleDelete(fishType) {
        let fishTypes = this.state.fishTypes.slice();
        fishTypes = fishTypes.filter(u => { return u._id !== fishType._id; });
        this.setState({ fishTypes:fishTypes });
      }

    componentDidMount(){
        this.fetchFishTypes();
        this.socket.on('add', data => this.handleAdd(data));
        this.socket.on('update', data => this.handleUpdate(data));
        this.socket.on('delete', data => this.handleDelete(data));   
    }
  // Fetch data from the back-end
  fetchFishTypes() {
    axios.get(`${this.server}/api/fishtypes/`)
    .then((response) => {
      this.setState({ fishTypes: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
  }
  render(){
      const floatRight = {
          float: 'right',
      }
      const floatLeft = {
        float: 'left',
    }
      return(
          <div id="fishPage">
              <Container>
                <div>
                <ModalUser
                      headerTitle='Add Fish Type'
                      buttonTriggerTitle='Add New'
                      buttonSubmitTitle='Add'
                      buttonColor='green'
                      onAdd={this.handleAdd}
                      server={this.server}
                      socket={this.socket}
                      type="FishTypeForm"
                      style={floatLeft}
                  />
                    <Export style={floatRight} />
                </div>
                  <TableFishType 
                    fishTypes={this.state.fishTypes}
                    server={this.server}
                    socket={this.socket}
                    onUpdate={this.handleUpdate}
                    onDelete={this.handleDelete}
                     />
              </Container>
          </div>
      )
  }
}