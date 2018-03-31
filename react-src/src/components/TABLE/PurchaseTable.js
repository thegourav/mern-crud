import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import ModalUser from '../ModalUser/ModalUser';
import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

import Export from '../Print/Export';

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
            L10={this.props.L10}
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
          <Export divName='purchase' />
        </Table.Cell>
      </Table.Row>
    );

    // Make every new user appear on top of the list
    purchases =  [...purchases].reverse();

    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{this.props.L10.FishName} </Table.HeaderCell>
            <Table.HeaderCell>{this.props.L10.SellerName}</Table.HeaderCell>
            <Table.HeaderCell>{this.props.L10.Weight}</Table.HeaderCell>
            <Table.HeaderCell>{this.props.L10.ActualWeight}</Table.HeaderCell>
            <Table.HeaderCell>{this.props.L10.Rate}</Table.HeaderCell>
            <Table.HeaderCell>{this.props.L10.Price}</Table.HeaderCell>
            <Table.HeaderCell>{this.props.L10.Date}</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {purchases}
        </Table.Body>
      </Table>
    );
  }
}