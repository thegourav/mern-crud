import React, { Component } from 'react';
import { Message, Button, Form, Select } from 'semantic-ui-react';
import axios from 'axios';

class PurchaseForm extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      _fishTypeID: '',
      fishName: '',
      supplierName: '',
      weight: 0,
      actualWeight: 0,
      rate: 0,
      price: 0,
      fishTypeList: [],
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    axios.get(`${this.props.server}/api/fishtypes/`).then((response) => {
        const fishTypeList = response.data.map((item) => {
          return {
            key: item._id,
            text: item.name,
            value: item._id,
          };
        });
        this.setState({fishTypeList})
    });
  }

  componentWillMount() {
    // Fill in the form with the appropriate data if user id is provided
    if (this.props.ID) {
      axios.get(`${this.props.server}/api/purchases/${this.props.ID}`)
      .then((response) => {
        this.setState({
          _fishTypeID: response.data._fishTypeID,
          fishName: response.data.fishName,
          supplierName: response.data.supplierName,
          weight: response.data.weight,
          actualWeight: response.data.actualWeight,
          rate: response.data.rate,
          price: response.data.price,
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

    if(name === 'weight'){
      this.setState({ 'actualWeight': (Math.round(value * .95)) });
    }
    if(name === 'rate'){
      this.setState({ 'price': (Math.round(value * this.state.actualWeight)) });
    }

    this.setState({ [name]: value });
  }

  handleSelectChange(e, data) {
    const fishType = this.state.fishTypeList.filter(d => d.key === data.value);
    this.setState({ _fishTypeID: data.value, fishName: fishType[0].text, });
  }

  handleSubmit(e) {
    // Prevent browser refresh
    e.preventDefault();

    const purchase = {
      _fishTypeID: this.state._fishTypeID,
      fishName: this.state.fishName,
      supplierName: this.state.supplierName,
      weight: this.state.weight,
      actualWeight: this.state.actualWeight,
      rate: this.state.rate,
      price: this.state.price,
    }

    // Acknowledge that if the user id is provided, we're updating via PUT
    // Otherwise, we're creating a new data via POST
    const method = this.props.ID ? 'put' : 'post';
    const params = this.props.ID ? this.props.ID : '';

    axios({
      method: method,
      responseType: 'json',
      url: `${this.props.server}/api/purchases/${params}`,
      data: purchase
    })
    .then((response) => {
      this.setState({
        formClassName: 'success',
        formSuccessMessage: response.data.msg
      });

      if (!this.props.ID) {
        this.setState({
          _fishTypeID: this.state._fishTypeID,
          fishName: this.state.fishName,
          supplierName: this.state.supplierName,
          weight: this.state.weight,
          actualWeight: this.state.actualWeight,
          rate: this.state.rate,
          price: this.state.price,
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
        <Form.Group widths='equal'>
          <Form.Field
            control={Select}
            label='Fish Types'
            options={this.state.fishTypeList}
            placeholder='Select a fish type'
            value={this.state._fishTypeID}
            onChange={this.handleSelectChange}
          />
          <Form.Input
            label='Supplier Name'
            type='input'
            placeholder='Supplier Name'
            min={0}
            max={1000000}
            name='supplierName'
            value={this.state.supplierName}
            onChange={this.handleInputChange}
          />
        </Form.Group>
        <Form.Group widths='equal'>
        <Form.Input
            label='Weight'
            type='number'
            placeholder='40kg'
            min={0}
            max={1000000}
            name='weight'
            value={this.state.weight}
            onChange={this.handleInputChange}
          />
        <Form.Input
            label='Actual Weight'
            type='input'
            placeholder='40kg'
            min={0}
            max={1000000}
            name='actualWeight'
            value={this.state.actualWeight}
            onChange={this.handleInputChange}
          />
        </Form.Group>
        <Form.Group widths='equal'>
        <Form.Input
            label='Rate'
            type='input'
            placeholder='500/kg'
            min={0}
            max={1000000}
            name='rate'
            value={this.state.rate}
            onChange={this.handleInputChange}
          />
          <Form.Input
            label='Price'
            type='input'
            name='price'
            value={this.state.price}
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

export default PurchaseForm;
