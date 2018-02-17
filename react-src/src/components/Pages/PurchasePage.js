import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import PurchaseTable from '../TABLE/PurchaseTable';
import ModalUser from '../ModalUser/ModalUser';
import io from 'socket.io-client';

export default class PurchasePage extends Component{
    constructor(...args){
        super(...args);
        this.state = {
            purchases : [],
        }
       this.fetchPurchases =  this.fetchPurchases.bind(this);
       this.server = process.env.REACT_APP_API_URL || '';
       this.socket = io.connect(this.server);

       this.handleAdd = this.handleAdd.bind(this);
       this.handleUpdate = this.handleUpdate.bind(this);
       this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount(){
        this.fetchPurchases();
        this.socket.on('add', data => this.handleAdd(data));
        this.socket.on('update', data => this.handleUpdate(data));
        this.socket.on('delete', data => this.handleDelete(data));  
    }
    handleAdd(purchase) {
        let purchases = this.state.purchases.slice();
        purchases.push(purchase);
        this.setState({ purchases });
      }
    
      handleUpdate(purchase) {
        let purchases = this.state.purchases.slice();
        for (let i = 0, n = purchases.length; i < n; i++) {
          if (purchases[i]._id === purchase._id) {
            purchases[i]._fishTypeID = purchase._fishTypeID;
            purchases[i].fishName = purchase.fishName;
            purchases[i].supplierName = purchase.supplierName;
            purchases[i].weight = purchase.weight;
            purchases[i].actualWeight = purchase.actualWeight;
            purchases[i].rate = purchase.rate;
            purchases[i].price = purchase.price;
            break; // Stop this loop, we found it!
          }
        }
        this.setState({ purchases });
      }
    
      handleDelete(purchase) {
        let purchases = this.state.purchases.slice();
        purchases = purchases.filter(u => { return u._id !== purchase._id; });
        this.setState({ purchases });
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
                      type="PurchaseForm"
                      onAdd={this.handleAdd}
                      server={this.server}
                      socket={this.socket}
                  />
                  <PurchaseTable
                   purchases={this.state.purchases}
                   server={this.server}
                   socket={this.socket}
                   onUpdate={this.handleUpdate}
                   onDelete={this.handleDelete} />
              </Container>
          </div>
      )
  }
}