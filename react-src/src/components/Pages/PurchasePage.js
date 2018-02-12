import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import PurchaseTable from '../TABLE/PurchaseTable';
import ModalUser from '../ModalUser/ModalUser';

export default class PurchasePage extends Component{
    constructor(...args){
        super(...args);
        this.state = {
            purchases : [],
        }
       this.fetchPurchases =  this.fetchPurchases.bind(this);
       this.server = process.env.REACT_APP_API_URL || '';
    }

    componentDidMount(){
        this.fetchPurchases();
    }

  // Fetch data from the back-end
  fetchPurchases() {
    axios.get(`${this.server}/api/purchases/`)
    .then((response) => {
      this.setState({ purchases: response.data });
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
                      headerTitle='Buy fish'
                      buttonTriggerTitle='Add New'
                      buttonSubmitTitle='Add'
                      buttonColor='green'
                      onAdd={this.handleAdd}
                      server={this.server}
                      socket={this.socket}
                      type="PurchaseForm"
                  />
                  <PurchaseTable purchases={this.state.purchases} />
              </Container>
          </div>
      )
  }
}