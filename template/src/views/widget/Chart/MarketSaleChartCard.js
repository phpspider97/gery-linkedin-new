import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Box, Typography } from '@mui/material';

// third party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { IconBrandFacebook, IconBrandYoutube, IconBrandTwitter } from '@tabler/icons';
import { API_PATH } from 'config';
import $ from 'jquery';  
const axios = require('axios');
import { Circles,TailSpin,ThreeDots } from  'react-loader-spinner'

// ===========================|| MARKET SHARE CHART CARD ||=========================== //

const MarketChartCard = (props) => { 
    //console.log('chartData',props)
    const theme = useTheme();

    const [adsAccount,adsAccountData] = useState(props.chartData);
    const [spendDate,spendDateData] = useState([]);
    const [daySpend,daySpendData] = useState([]);
    const [loading, setLoading] = React.useState(true)
    const [amountSpend, amountSpendData] = React.useState(0)
    const [isLoaderDisplay, setIsLoaderDisplay] = useState(true);
    useEffect(()=>{ 
        setIsLoaderDisplay(true)
        selectAdsAccound(props)
    },[props]);
    const selectAdsAccound = async (props)=>{ 
        let id = localStorage.getItem('user_token'); 
        if(props.date_range){
            var search_date_range = props.date_range; 
        }else{
            var search_date_range = ''; 
        }    
        let filter_data = '';     

        //await axios.get(`${API_PATH}/api/linkedin/account/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
        //console.log(`${API_PATH}/api/linkedin/adsPerforming/${localStorage.getItem('select_account')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`)

        await axios.get(`${API_PATH}/api/linkedin/accountSpend/${localStorage.getItem('select_account')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
            console.log('response',response) 
            var spend_date = []
            var day_spend = []
            var total_day_spend = []
            for(var get_val in response.data){  
                var today = new Date(get_val); 
                var date = get_val.split('-')[2]
                var month = today.toLocaleString('default', { month: 'short' }); 
                spend_date.push(`${date} ${month}`)
                day_spend.push(Math.round(response.data[get_val]))
                total_day_spend.push(Math.round(response.data[get_val]))
                //console.log('asd__',response.data[get_val].toLocaleString('en-US'))
            }   
            var y_max = Math.max(...day_spend);
            var y_min = Math.min(...day_spend);            
            //console.log('day_spend',day_spend)
            var total_amount = 0;
            for (var i in total_day_spend) {
                total_amount +=  total_day_spend[i];
            }

            amountSpendData(total_amount)  
            
            var newChartData = {
                height: 300,
                type: 'area', 
                options: {
                    chart: {
                        id: 'market-sale-chart',
                        toolbar: {
                            show: true
                        },
                        zoom: {
                            enabled: true 
                        },
                        sparkline: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 2
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.5,
                            opacityTo: 0,
                            stops: [0, 80, 100]
                        }
                    },
                    legend: {
                        show: false
                    },
                    yaxis: {
                        // min: y_min,
                        // max: y_max,
                        // categories: ['1000', '3000', '5000', '7000', '9000'],
                        labels: {
                            show: true
                        }
                    },
                    xaxis: {
                        categories: spend_date,
                        //range: 7,
                        labels: {
                            show: true
                        }
                    },
                    tooltip: {
                        custom: function({series, seriesIndex, dataPointIndex, w}) {
                            return '<div class="arrow_box">' +
                            '<span>Spend : $' + series[seriesIndex][dataPointIndex].toLocaleString("en-US") + '</span>' +
                            '</div>'
                        }
                    }
                },
                series: [
                    {
                        name: 'Spend',
                        data: day_spend
                    }
                ]
            }; 
            //console.log('newChartData',newChartData)
            adsAccountData(newChartData);
            setIsLoaderDisplay(false)

        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        });
    }  
    return (
        <MainCard sx={{ '&>div': { p: 1, pb: '0px !important' } }}>
            <Box sx={{ p: 3 }}>
                <Grid container direction="column" spacing={3}>
                    <Grid item container spacing={1} alignItems="center">
                        <Grid item>
                            <Typography variant="h3">Amount Spend</Typography>
                        </Grid>
                        <Grid item xs zeroMinWidth />
                        <Grid item>
                            <AttachMoneyIcon fontSize="large" color="success" />
                        </Grid>
                        <Grid item>
                            <Typography variant="h3">{(amountSpend)?amountSpend.toLocaleString("en-US"):0}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={{ mt: -2.5, fontWeight: 400 }} color="inherit" variant="h5">
                            Account spend by day
                        </Typography>
                    </Grid>
                    <Grid item container justifyContent="space-around" alignItems="center" spacing={3}>
                        {/* <Grid item>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item>
                                    <Typography
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            color: theme.palette.secondary.main,
                                            borderRadius: '12px',
                                            padding: 1,
                                            bgcolor:
                                                theme.palette.mode === 'dark'
                                                    ? theme.palette.background.default
                                                    : theme.palette.secondary.light
                                        }}
                                    >
                                        <IconBrandFacebook stroke={1.5} />
                                    </Typography>
                                </Grid>
                                <Grid item sm zeroMinWidth>
                                    <Typography variant="h4">+45.36%</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item>
                                    <Typography
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            color: theme.palette.primary.main,
                                            borderRadius: '12px',
                                            padding: 1,
                                            backgroundColor:
                                                theme.palette.mode === 'dark'
                                                    ? theme.palette.background.default
                                                    : theme.palette.primary.light
                                        }}
                                    >
                                        <IconBrandTwitter stroke={1.5} />
                                    </Typography>
                                </Grid>
                                <Grid item sm zeroMinWidth>
                                    <Typography variant="h4">- 50.69%</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item>
                                    <Typography
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            color: theme.palette.error.main,
                                            borderRadius: '12px',
                                            padding: 1,
                                            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#ffe9e9'
                                        }}
                                    >
                                        <IconBrandYoutube stroke={2} />
                                    </Typography>
                                </Grid>
                                <Grid item sm zeroMinWidth>
                                    <Typography variant="h4">+ 16.85%</Typography>
                                </Grid>
                            </Grid>
                        </Grid> */}
                        <Grid item xs zeroMinWidth />
                    </Grid>
                </Grid>
            </Box>
            {
                isLoaderDisplay?
                    <ThreeDots color="#00BFFF" height={60} width={60} />
                 :''
            }  
            <Chart {...adsAccount} />
        </MainCard>
    );
};

MarketChartCard.propTypes = {
    chartData: PropTypes.object
};

export default MarketChartCard;
