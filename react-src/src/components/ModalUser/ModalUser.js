import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import FormUser from '../FormUser/FormUser';
import FishTypeForm from '../FormUser/FishTypeForm';
import PurchaseForm from '../FormUser/PurchaseForm';
import OrderForm from '../FormUser/OrderForm';

import FaEdit from 'react-icons/lib/fa/edit';

class ModalUser extends Component {

  getProperForm(type){
    if(type === 'FishTypeForm')
    return (<FishTypeForm
    buttonSubmitTitle={this.props.buttonSubmitTitle}
    buttonColor={this.props.buttonColor}
    ID={this.props.ID}
    onAdd={this.props.onAdd}
    onUpdate={this.props.onUpdate}
    server={this.props.server}
    socket={this.props.socket}
    />)
    if(type === 'PurchaseForm')
    return (<PurchaseForm
    buttonSubmitTitle={this.props.buttonSubmitTitle}
    buttonColor={this.props.buttonColor}
    ID={this.props.ID}
    onAdd={this.props.onAdd}
    onUpdate={this.props.onUpdate}
    server={this.props.server}
    socket={this.props.socket}
    />)
    if(type === 'OrderForm')
    return (<OrderForm
    buttonSubmitTitle={this.props.buttonSubmitTitle}
    buttonColor={this.props.buttonColor}
    ID={this.props.ID}
    onAdd={this.props.onAdd}
    onUpdate={this.props.onUpdate}
    server={this.props.server}
    socket={this.props.socket}
    />)
    else
    return (<FormUser
    buttonSubmitTitle={this.props.buttonSubmitTitle}
    buttonColor={this.props.buttonColor}
    userID={this.props.userID}
    onUserAdded={this.props.onUserAdded}
    onUserUpdated={this.props.onUserUpdated}
    server={this.props.server}
    socket={this.props.socket}
  />)
  }

  render() {
    const type = this.props.type;
    const formData = this.getProperForm(type);
    const btnStyle = {
      fontSize:'25px',
      marginRight: '12px',
    };
    return (
      <Modal
        trigger={<FaEdit color={this.props.buttonColor} style={btnStyle}></FaEdit>}
        dimmer='inverted'
        size='tiny'
        closeIcon='close'
      >
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
          {formData}
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalUser;
