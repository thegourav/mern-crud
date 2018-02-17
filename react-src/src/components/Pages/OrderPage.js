import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import OrderTable from '../TABLE/OrderTable';
import ModalUser from '../ModalUser/ModalUser';
import io from 'socket.io-client';

export default class OrderPage extends Component{
    constructor(...args){
        super(...args);
        this.state = {
            orders : [],
        }
       this.fetchOrders =  this.fetchOrders.bind(this);
       this.server = process.env.REACT_APP_API_URL || '';
       this.socket = io.connect(this.server);

       this.handleAdd = this.handleAdd.bind(this);
       this.handleUpdate = this.handleUpdate.bind(this);
       this.handleDelete = this.handleDelete.bind(this);
    }
    handleAdd(order) {
        let orders = this.state.orders.slice();
        orders.push(order);
        this.setState({ orders });
      }
    
      handleUpdate(order) {
        let orders = this.state.orders.slice();
        for (let i = 0, n = orders.length; i < n; i++) {
          if (orders[i]._id === order._id) {
            orders[i]._fishTypeID = order._fishTypeID;
            orders[i].fishName = order.fishName;
            orders[i].customerName = order.customerName;
            orders[i].weight = order.weight;
            orders[i].rate = order.rate;
            orders[i].price = order.price;
            break; // Stop this loop, we found it!
          }
        }
        this.setState({ orders });
      }
    
      handleDelete(order) {
        let orders = this.state.orders.slice();
        orders = orders.filter(u => { return u._id !== order._id; });
        this.setState({ orders });
      }

    componentDidMount(){
        this.fetchOrders();
        this.socket.on('add', data => this.handleAdd(data));
        this.socket.on('update', data => this.handleUpdate(data));
        this.socket.on('delete', data => this.handleDelete(data));
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
                  <OrderTable
                   orders={this.state.orders} 
                   server={this.server}
                   socket={this.socket}
                   onUpdate={this.handleUpdate}
                   onDelete={this.handleDelete}/>
              </Container>
          </div>
      )
  }
}