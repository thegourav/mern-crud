import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import TableFishType from '../TableFishType/TableFishType';
import ModalUser from '../ModalUser/ModalUser';

export default class FishPage extends Component{
    constructor(...args){
        super(...args);
        this.state = {
            fishTypes : [],
        }
       this.fetchFishTypes =  this.fetchFishTypes.bind(this);
       this.server = process.env.REACT_APP_API_URL || '';
    }

    componentDidMount(){
        this.fetchFishTypes();
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
      return(
          <div>
              <Container>
                  <ModalUser
                      headerTitle='Add Fish Type'
                      buttonTriggerTitle='Add New'
                      buttonSubmitTitle='Add'
                      buttonColor='green'
                      onAdd={this.handleAdd}
                      server={this.server}
                      socket={this.socket}
                      type="FishTypeForm"
                  />
                  <TableFishType fishTypes={this.state.fishTypes} />
              </Container>
          </div>
      )
  }
}