import React, { Component } from 'react';
import { Message, Button, Form, Select } from 'semantic-ui-react';
import axios from 'axios';

const categoryOptions = [
  { key: 'm', text: 'Large', value: 'L' },
  { key: 'f', text: 'Medium', value: 'M' },
  { key: 'o', text: 'Small', value: 'S' }
]

class FishTypeForm extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      name: '',
      category: '',
      stock: 0,
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // Fill in the form with the appropriate data if user id is provided
    if (this.props.ID) {
      axios.get(`${this.props.server}/api/fishtypes/${this.props.ID}`)
      .then((response) => {
        this.setState({
          name: response.data.name,
          category: response.data.category,
          stock: response.data.stock,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleSelectChange(e, data) {
    this.setState({ category: data.value });
  }

  handleSubmit(e) {
    // Prevent browser refresh
    e.preventDefault();

    const fishType = {
      name: this.state.name,
      category: this.state.category,
      stock: this.state.stock,
    }

    // Acknowledge that if the user id is provided, we're updating via PUT
    // Otherwise, we're creating a new data via POST
    const method = this.props.ID ? 'put' : 'post';
    const params = this.props.ID ? this.props.ID : '';

    axios({
      method: method,
      responseType: 'json',
      url: `${this.props.server}/api/fishtypes/${params}`,
      data: fishType
    })
    .then((response) => {
      this.setState({
        formClassName: 'success',
        formSuccessMessage: response.data.msg
      });

      if (!this.props.ID) {
        this.setState({
          name: '',
          category: '',
          stock: 0,
        });
        this.props.onAdd(response.data.result);
        this.props.socket.emit('add', response.data.result);
      }
      else {
        this.props.onUpdate(response.data.result);
        this.props.socket.emit('update', response.data.result);
      }
      
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.data) {
          this.setState({
            formClassName: 'warning',
            formErrorMessage: err.response.data.msg
          });
        }
      }
      else {
        this.setState({
          formClassName: 'warning',
          formErrorMessage: 'Something went wrong. ' + err
        });
      }
    });
  }

  render() {

    const formClassName = this.state.formClassName;
    const formSuccessMessage = this.state.formSuccessMessage;
    const formErrorMessage = this.state.formErrorMessage;

    return (
      <Form className={formClassName} onSubmit={this.handleSubmit}>
        <Form.Input
          label='Name'
          type='text'
          placeholder='ILISH'
          name='name'
          maxLength='40'
          required
          value={this.state.name}
          onChange={this.handleInputChange}
        />
        <Form.Group widths='equal'>
          <Form.Field
            control={Select}
            label='Category'
            options={categoryOptions}
            placeholder='Big'
            value={this.state.category}
            onChange={this.handleSelectChange}
          />
          <Form.Input
            label='Stock'
            type='number'
            placeholder='40kg'
            min={0}
            max={1000000}
            name='stock'
            value={this.state.stock}
            onChange={this.handleInputChange}
          />
        </Form.Group>
        <Message
          success
          color='green'
          header='Nice one! Click outside to close the dialog'
          content={formSuccessMessage}
        />
        <Message
          warning
          color='yellow'
          header='Woah!'
          content={formErrorMessage}
        />
        <Button color={this.props.buttonColor} floated='right'>{this.props.buttonSubmitTitle}</Button>
        <br /><br /> {/* Yikes! Deal with Semantic UI React! */}
      </Form>
    );
  }
}

export default FishTypeForm;
