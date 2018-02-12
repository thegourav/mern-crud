import React, { Component } from 'react';
import  {PieChart, Pie, Legend, Tooltip, Cell}  from  'recharts';
import axios from 'axios';

export default class ReportsPage extends Component {
    constructor(...args){
        super(...args);
        this.state = {
            fishStock : []
        };
        this.fetchFishStocks =  this.fetchFishStocks.bind(this);
        this.server = process.env.REACT_APP_API_URL || '';
    }

    componentDidMount(){
        this.fetchFishStocks();
    }

    fetchFishStocks(){
        axios.get(`${this.server}/api/fishtypes/`)
        .then((response) => {
            const fishStock = response.data.map((data) => {
                return {
                    name: data.name,
                    value: data.stock,
                    id: data._id,
                };
            })
          this.setState({ fishStock });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    render () {
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
        return (
        <div>
        <h1> Current Stock </h1> 
          <PieChart width={800} height={400}>
          <Pie isAnimationActive={false} data={this.state.fishStock} dataKey="value" cx={200} cy={200}
           outerRadius={80} fill="#8884d8" label>
            	{
          	this.state.fishStock.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                } 
          </Pie>
          <Tooltip/>
         </PieChart>
        </div> 
      );
    }
}

