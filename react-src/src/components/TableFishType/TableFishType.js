import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import ModalUser from '../ModalUser/ModalUser';
import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

export default class TableFishType extends Component {

  render() {
    let fishTypes = this.props.fishTypes;
    const user = {};

    fishTypes = fishTypes.map((fishType) => 
      <Table.Row key={fishType._id}>
        <Table.Cell>{fishType.name}</Table.Cell>
        <Table.Cell>{fishType.category}</Table.Cell>
        <Table.Cell>{fishType.stock}</Table.Cell>
        <Table.Cell>
          <ModalUser
            headerTitle='Edit User'
            buttonTriggerTitle='Edit'
            buttonSubmitTitle='Save'
            buttonColor='blue'
            userID={user._id}
            onUserUpdated={this.props.onUserUpdated}
            server={this.props.server}
            socket={this.props.socket}
          />
          <ModalConfirmDelete
            headerTitle='Delete User'
            buttonTriggerTitle='Delete'
            buttonColor='black'
            user={user}
            onUserDeleted={this.props.onUserDeleted}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Table.Cell>
      </Table.Row>
    );

    // Make every new user appear on top of the list
    fishTypes =  [...fishTypes].reverse();

    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Category</Table.HeaderCell>
            <Table.HeaderCell>Stock</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fishTypes}
        </Table.Body>
      </Table>
    );
  }
}