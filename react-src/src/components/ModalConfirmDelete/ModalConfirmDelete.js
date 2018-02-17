import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import axios from 'axios';

import FaTrash from 'react-icons/lib/fa/trash-o';

class ModalConfirmDelete extends Component {

  constructor(props) {
    super(props);

    this.state ={
      modalOpen: false,
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOpen = e => this.setState({ modalOpen: true });
  handleClose = e => this.setState({ modalOpen: false });

  handleSubmit(e) {

    let params = e.target.getAttribute('data-ID');
    const entityName = this.props.entityName;

    axios({
      method: 'delete',
      responseType: 'json',
      url: `${this.props.server}/api/${entityName}/${params}`,
    })
    .then((response) => {
      this.handleClose();
      this.props.onDelete(response.data.result);
      this.props.socket.emit('delete', response.data.result);
    })
    .catch((err) => {
      this.handleClose();
      throw err;
    });
  }

  render() {
    const entity = this.props.entity;
    const entityName = this.props.entityName;
    let name = "";

    if(entity && entityName === 'fishTypes')
        name = entity.name;
    else if (entity && (entityName === 'purchases' || entityName === 'orders'))    
        name = entity.fishName;
    return (
      <Modal
        trigger={<FaTrash onClick={this.handleOpen}
        color={this.props.buttonColor}
        style={ {fontSize: '22px'}}
        />}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        dimmer='inverted'
        size='tiny'
      >
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete <strong>{name}</strong>?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleSubmit} data-ID={this.props.entity._id} color='red'>Yes</Button>
          <Button onClick={this.handleClose} color='black'>No</Button>
          </Modal.Actions>
      </Modal>
    );
  }
}

export default ModalConfirmDelete;
