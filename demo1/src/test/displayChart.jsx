import React, { Component } from 'react'
import Chart from "chart.js";
import './test.css'
let myLineChart;

export default class LineGraph extends Component {
    constructor(props){
        super(props);
        this.state = {
            chartData : "",
        }
    }
    chartRef = React.createRef();
    
    componentDidMount() {
        this.setState({chartData : this.props.chartData})
        this.getChartInfo();
    }

    getChartInfo = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        if (typeof myLineChart !== "undefined") myLineChart.destroy();
        myLineChart = new Chart(myChartRef, {
            type: "line",
            data: {
                labels: this.props.labels,
                datasets: [
                    {
                        label: "Currency",
                        data: this.state.chartData,
                    }
                ]
            },
            options: {
                //Customize chart options
            }
        });
    }

    shouldComponentUpdate(nextProps) { 
        if (nextProps.chartData !== this.props.chartData) {
            this.setState({chartData : nextProps.chartData},this.getChartInfo)
          return true; 
        } else { 
          return false; 
        } 
    } 

    render() {
        return (
            <div >
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                    className="chart"
                />
            </div>
        )
    }
}