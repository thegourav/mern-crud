import React, { Component } from 'react';
import  {PieChart, Pie, Legend, Tooltip, Cell}  from  'recharts';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid} from  'recharts';
import axios from 'axios';

const data = [
    {name: 'JAN', purchase: 40000, sales: 50000},
    {name: 'FEB', purchase: 30000, sales: 13980},
    {name: 'MAR', purchase: 20000, sales: 98000},
    {name: 'APR', purchase: 27800, sales: 39080},
    {name: 'MAY', purchase: 18900, sales: 48000},
    {name: 'JUNE', purchase: 23900, sales: 38000},
];

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
            <div className="report_main" style = {{display: 'flex',alignItems: 'center' }}>
                <div className="current-stock" style = {{width:'50%'}}>
                    <h1> Current Stock </h1>
                    <PieChart width={800} height={400}>
                        <Pie isAnimationActive={false} data={this.state.fishStock} dataKey="value" cx={200} cy={200}
                            outerRadius={80} fill="#8884d8" label>
                            {
                                this.state.fishStock.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)
                            }
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>

                <div className="barchart">
                    <h1> Purchase/Sales per Month </h1>
                    <BarChart width={600} height={300} data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="purchase" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="purchase" fill="#8884d8" />
                        <Bar dataKey="sales" fill="#82ca9d" />
                    </BarChart>
                </div>
            </div>
      );
    }
}

