import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import ModalUser from '../ModalUser/ModalUser';
import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

const getColor = (stock) => {
  if (stock < 20)
    return {color:'red',fontSize:'15px',};
  else if (stock >= 20 && stock < 500 )
    return {color:'green'};
  else if (stock > 500)
    return {color: '#fbbd08'};    
}

export default class TableFishType extends Component {

  render() {
    let fishTypes = this.props.fishTypes;
    fishTypes = fishTypes.map((fishType) => 
      <Table.Row key={fishType._id}>
        <Table.Cell>{fishType.name}</Table.Cell>
        <Table.Cell>{fishType.category}</Table.Cell>
        <Table.Cell style={getColor(fishType.stock)}>{fishType.stock}</Table.Cell>
        <Table.Cell>
          <ModalUser
            headerTitle='Edit Fish Type'
            buttonTriggerTitle='Edit'
            buttonSubmitTitle='Save'
            buttonColor='blue'
            ID={fishType._id}
            onUpdate={this.props.onUpdate}
            server={this.props.server}
            socket={this.props.socket}
            type="FishTypeForm"
          />
          <ModalConfirmDelete
            headerTitle='Delete Fish Type'
            buttonTriggerTitle='Delete'
            buttonColor='red'
            entity={fishType}
            entityName="fishTypes"
            onDelete={this.props.onDelete}
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
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fishTypes}
        </Table.Body>
      </Table>
    );
  }
}