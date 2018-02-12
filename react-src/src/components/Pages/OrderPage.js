import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import OrderTable from '../TABLE/OrderTable';
import ModalUser from '../ModalUser/ModalUser';

export default class OrderPage extends Component{
    constructor(...args){
        super(...args);
        this.state = {
            orders : [],
        }
       this.fetchOrders =  this.fetchOrders.bind(this);
       this.server = process.env.REACT_APP_API_URL || '';
    }

    componentDidMount(){
        this.fetchOrders();
    }

    // Fetch data from the back-end
    fetchOrders() {
        axios.get(`${this.server}/api/orders/`)
        .then((response) => {
          this.setState({ orders: response.data });
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
                      headerTitle='Place an Order'
                      buttonTriggerTitle='Add New'
                      buttonSubmitTitle='Add'
                      buttonColor='green'
                      onAdd={this.handleAdd}
                      server={this.server}
                      socket={this.socket}
                      type="OrderForm"
                  />
                  <OrderTable orders={this.state.orders} />
              </Container>
          </div>
      )
  }
}