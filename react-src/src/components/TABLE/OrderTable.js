import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import ModalUser from '../ModalUser/ModalUser';
import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

export default class OrderTable extends Component {

  render() {
    let orders = this.props.orders;
    orders = orders.map((order) => 
      <Table.Row key={order._id}>
        <Table.Cell>{order.fishName}</Table.Cell>
        <Table.Cell>{order.customerName}</Table.Cell>
        <Table.Cell>{order.weight}</Table.Cell>
        <Table.Cell>{order.rate}</Table.Cell>
        <Table.Cell>{order.price}</Table.Cell>
        <Table.Cell>{order.date}</Table.Cell>
        <Table.Cell>
          <ModalUser
            headerTitle='Edit User'
            buttonTriggerTitle='Edit'
            buttonSubmitTitle='Save'
            buttonColor='blue'
            ID={order._id}
            onUpdate={this.props.onUpdate}
            server={this.props.server}
            socket={this.props.socket}
            type="OrderForm"
          />
          <ModalConfirmDelete
            headerTitle='Delete Order Record'
            buttonTriggerTitle='Delete'
            buttonColor='red'
            entity={order}
            entityName="orders"
            onDelete={this.props.onDelete}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Table.Cell>
      </Table.Row>
    );

    // Make every new user appear on top of the list
    orders =  [...orders].reverse();

    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Fish Name</Table.HeaderCell>
            <Table.HeaderCell>Customer Name</Table.HeaderCell>
            <Table.HeaderCell>Weight</Table.HeaderCell>
            <Table.HeaderCell>Rate</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orders}
        </Table.Body>
      </Table>
    );
  }
}