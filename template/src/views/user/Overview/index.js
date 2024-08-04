import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'; 

import $ from 'jquery'; 
import { API_PATH } from 'config';
const axios = require('axios');
import { useLinkedIn } from "react-linkedin-login-oauth2";
import GridTop from './GridTop';
import GridLeft from './GridLeft';
import GridRight from './GridRight';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import MarketSaleChartCard from '../../widget/Chart/MarketSaleChartCard';
import chartData from '../../widget/Chart/chart-data';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import useConfig from 'hooks/useConfig';
import moment from 'moment';

import { Button, CardContent, CardActions, Divider, Grid, IconButton, Modal, Typography, TextField,Box } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard'; 

const lineChartOptions = {
    chart: {
        height: 350,
        type: 'line',
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight'
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    }
};

export default function SimpleModal() {
    const navigate = useNavigate(); 
    if(localStorage.getItem('select_account') == null){
        navigate(`/user`); 
    }
    const theme = useTheme();
    const { navType } = useConfig();
    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const secondary = theme.palette.secondary.main;

    const [series] = useState([
        {
            name: 'Desktops',
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
    ]);
    const [options, setOptions] = useState(lineChartOptions);
    const [selectDate, setSelectDate] = useState('');
    var today = new Date(); 
    let startDate = moment().subtract(29, 'days').format('MM/DD/YYYY') 
    let today_date = moment().subtract(0, 'days').format('MM/DD/YYYY') 
    const [currentDate, setCurrentDate] = useState(today_date);
    const [previousDate, setPreviousDate] = useState(startDate); 
    const [adsType, setAdsType] = useState('all'); 
    const [accountSelectName, setAccountSelectName] = useState(localStorage.getItem('select_account_name')); 

    React.useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [secondary],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: navType === 'dark' ? darkLight + 20 : grey200
            },
            tooltip: {
                theme: navType === 'dark' ? 'dark' : 'light'
            }
        }));
    }, [navType, primary, darkLight, grey200, secondary]);

    function handleCallback(start, end, label) {  
        let start_date_update = moment(start._d).format('MM-DD-YYYY')
        let end_date_update = moment(end._d).format('MM-DD-YYYY') 
        let start_date = start_date_update.trim().replaceAll("-", "@");
        let end_date = end_date_update.trim().replaceAll("-", "@");
        let search_date_range = `${start_date}_${end_date}`;
        //console.log('search_date_range',search_date_range)
        setSelectDate(search_date_range)   
    };
    function selectAdsType(e){ 
        setAdsType(e.target.value);
    }

    //console.log('selectDate',selectDate)
    return (
        <Grid container justifyContent="flex-end">
            <Grid item xs={6} lg={6} sm={6} className="grid_custom"> 
                <h3><b> {accountSelectName?accountSelectName:'No account selected'}</b></h3>
            </Grid> 
            <Grid item xs={6} lg={6} sm={6} className="grid_custom"> 
                <div className='wizard_div date_calendar'>
                    <DateRangePicker initialSettings={{ startDate: previousDate, endDate: currentDate }} onCallback={handleCallback}>
                        <input type="text" className="input_date" defaultValue=''  />
                    </DateRangePicker>    
                </div>
            </Grid> 
            <Grid item xs={12} lg={12} sm={12} className="grid_custom"> 
                <MainCard  content={false} > 
                    <CardContent>
                    <GridTop date_range={selectDate}/>
                    </CardContent> 
                </MainCard>
            </Grid> 
            <br /> <br /> <br />
            <Grid item xs={12} lg={12} sm={12} className="grid_custom"> 
                <MainCard  content={false} > 
                    <div id="chart">
                        {/* <ReactApexChart options={options} series={series} type="line" height={190} /> */}
                        <MarketSaleChartCard chartData={chartData.MarketChartCardData} date_range={selectDate}/>
                    </div>
                </MainCard>    
            </Grid> 
            <br /> <br /> <br />
            
            <Grid item xs={12} lg={12} sm={12} className="grid_custom"> 
                <div className="grid_left_Select">
                    <select class="form-control form-select add_update_field input_cus" onChange={selectAdsType}>
                        <option selected value="all">Select Ads Type</option>
                        <option value="com.linkedin.ads.SponsoredUpdateLeadAds">Lead Generation ads</option>
                        <option value="com.linkedin.ads.FollowCompanyCreativeVariablesV2">Follow ads</option>
                        <option value="com.linkedin.ads.JobsCreativeVariablesV2">Job ads</option>
                        <option value="com.linkedin.ads.TextAdCreativeVariables">Text ads</option>
                        <option value="com.linkedin.ads.SpotlightCreativeVariablesV2">Spotlight ads</option>
                        <option value="com.linkedin.ads.SponsoredInMailCreativeVariables">InMail ads</option>
                        <option value="com.linkedin.ads.SponsoredVideoCreativeVariables">Video ads</option>
                        <option value="com.linkedin.ads.SponsoredUpdateCarouselCreativeVariables">Carousel ads</option>
                        <option value="com.linkedin.ads.SponsoredUpdateCreativeVariables">Sponsored image ads</option>
                    </select>
                </div>
            </Grid>
            <Grid item xs={12} lg={12} sm={12} className="grid_custom"> 
                <MainCard  content={false} > 
                   <CardContent>
                     <GridLeft date_range={selectDate} ads_type={adsType} />
                   </CardContent>
                </MainCard>
            </Grid> 
            <Grid item xs={12} lg={12} sm={12} className="grid_custom"> 
                <MainCard  content={false} > 
                  <CardContent>
                    <GridRight date_range={selectDate} ads_type={adsType} />
                  </CardContent>
                </MainCard>
            </Grid> 
        </Grid>
    );
    
}