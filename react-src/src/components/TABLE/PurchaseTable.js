import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import ModalUser from '../ModalUser/ModalUser';
import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

export default class PurchaseTable extends Component {

  render() {
    let purchases = this.props.purchases;
    purchases = purchases.map((purchase) => 
      <Table.Row key={purchase._id}>
        <Table.Cell>{purchase.fishName}</Table.Cell>
        <Table.Cell>{purchase.supplierName}</Table.Cell>
        <Table.Cell>{purchase.weight}</Table.Cell>
        <Table.Cell>{purchase.actualWeight}</Table.Cell>
        <Table.Cell>{purchase.rate}</Table.Cell>
        <Table.Cell>{purchase.price}</Table.Cell>
        <Table.Cell>{purchase.date}</Table.Cell>
        <Table.Cell>
          <ModalUser
            headerTitle='Edit Record'
            buttonTriggerTitle='Edit'
            buttonSubmitTitle='Save'
            buttonColor='blue'
            ID={purchase._id}
            onUpdate={this.props.onUpdate}
            server={this.props.server}
            socket={this.props.socket}
            type="PurchaseForm"
          />
          <ModalConfirmDelete
            headerTitle='Delete Purchase Record'
            buttonTriggerTitle='Delete'
            buttonColor='red'
            entity={purchase}
            entityName="purchases"
            onDelete={this.props.onDelete}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Table.Cell>
      </Table.Row>
    );

    // Make every new user appear on top of the list
    purchases =  [...purchases].reverse();

    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Fish Name</Table.HeaderCell>
            <Table.HeaderCell>Seller Name</Table.HeaderCell>
            <Table.HeaderCell>Weight</Table.HeaderCell>
            <Table.HeaderCell>Actual Weight</Table.HeaderCell>
            <Table.HeaderCell>Rate</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {purchases}
        </Table.Body>
      </Table>
    );
  }
}