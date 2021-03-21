import React from 'react';
import './test.css';
import Chart from './displayChart.jsx'


export default class test extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            priseInfo : {"time":{"updated":"Mar 21, 2021 04:07:00 UTC","updatedISO":"2021-03-21T04:07:00+00:00","updateduk":"Mar 21, 2021 at 04:07 GMT"},"disclaimer":"This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org","chartName":"Bitcoin","bpi":{"USD":{"code":"USD","symbol":"&#36;","rate":"57,792.5376","description":"United States Dollar","rate_float":57792.5376},"GBP":{"code":"GBP","symbol":"&pound;","rate":"41,667.3216","description":"British Pound Sterling","rate_float":41667.3216},"EUR":{"code":"EUR","symbol":"&euro;","rate":"48,376.1105","description":"Euro","rate_float":48376.1105}}},
            selectValue : "USD",
            chartInfo : "",
        }
    }

    dateFormatChange = (date = new Date()) => {
        return date.toISOString().split('T')[0] ;
    }

    componentDidMount() {
        fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
          .then(res => res.json())
          .then(
            (result) => {
                console.log("Responce",result.chartName)
              this.setState({
                priseInfo : result
              });
            },
            (error) => {
                console.log(error);
                let mockData = {"time":{"updated":"Mar 21, 2021 04:07:00 UTC","updatedISO":"2021-03-21T04:07:00+00:00","updateduk":"Mar 21, 2021 at 04:07 GMT"},"disclaimer":"This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org","chartName":"Bitcoin","bpi":{"USD":{"code":"USD","symbol":"&#36;","rate":"57,792.5376","description":"United States Dollar","rate_float":57792.5376},"GBP":{"code":"GBP","symbol":"&pound;","rate":"41,667.3216","description":"British Pound Sterling","rate_float":41667.3216},"EUR":{"code":"EUR","symbol":"&euro;","rate":"48,376.1105","description":"Euro","rate_float":48376.1105}}}
                this.setState({priseInfo : mockData})
            }
          )
          this.getChartData("USD");
      }

      getChartData =(country) => {
        var today = new Date()
        var priorDate = new Date(new Date().setDate(new Date().getDate() - 30));
        console.log("Dates",today,priorDate,today.toISOString().split('T')[0])
        fetch("https://api.coindesk.com/v1/bpi/historical/close.json?currency="+country+"&start="+this.dateFormatChange(priorDate)+"&end="+this.dateFormatChange())
          .then(res => res.json())
          .then(
            (result) => {
                console.log("Responce",result)
              this.setState({
                chartInfo : result.bpi
              });
            },
            (error) => {
                console.log(error);
            }
          )
      }

      handleDropdownChange = (e) => {
        this.setState({ selectValue: e.target.value });
        this.getChartData(e.target.value)
      }

      getCurrency = () => {
          let selectedDropDown = this.state.selectValue ? this.state.selectValue : "" ;
          let {bpi} = this.state.priseInfo ? this.state.priseInfo : "";
          let amount = ""
           if(bpi !== undefined && bpi !== ""){
                for(const key in bpi){
                    if(key === selectedDropDown){
                        amount = bpi[key].rate
                    }
                }
           }
          return(
              <span class="amount">{amount+" "+selectedDropDown}</span>
          )
      }


    render(){
        let labels = this.state.chartInfo ? Object.keys(this.state.chartInfo) : "";
        let dataForChart = this.state.chartInfo ? Object.values(this.state.chartInfo) : "";
        return(
        <div style={{padding:"75px 45px" , }}>
            <span style={{fontSize:"35px",fontStyle:"#595959"}}>Currency Convertor</span>
            <div className = "flex-container">
                <div style={{flexBasis:"650px",padding : "50px"}}>
                    <span>1 BitCoin equals:</span>
                    <br></br>
                    <select id="dropdown" style={{padding:"6px",borderRadius: "9px"}} onChange={this.handleDropdownChange}>
                        <option value="USD">United States Dollar</option>
                        <option value="GBP">British Pound Sterling</option>
                        <option value="EUR">Euro</option>
                    </select>
                    <br></br>
                    {this.state.priseInfo && this.getCurrency()}
                </div>
                <div style={{flexBasis:"650px"}}>
                    {<Chart labels={labels}
                            chartData = {dataForChart}>
                    </Chart>}
                </div>
            </div>
        </div>
        )
    }
}