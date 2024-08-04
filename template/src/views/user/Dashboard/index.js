import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {Link, useNavigate} from 'react-router-dom'; 
import $ from 'jquery';
import { API_PATH } from 'config';
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
const axios = require('axios');

import UserCountCard from 'ui-component/cards/UserCountCard';

import { gridSpacing } from 'store/constant';

import AccountCircleTwoTone from '@mui/icons-material/AccountCircleTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';

// ===========================|| WIDGET STATISTICS ||=========================== //

const WidgetStatistics = () => {
    const theme = useTheme();

    const [userCount,userCountData] = useState('1');
    const [loginLevel,loginLevelData] = useState('1');
    const [sidebarDisplay,setSidebarDisplay] = useState('inActive');
    
    const openSidebar = ()=>{
        if(sidebarDisplay === 'inActive'){
            setSidebarDisplay('active');
        }else{
            setSidebarDisplay('inActive');
        } 
    }

    useEffect(()=>{  
        loginLevelData(localStorage.getItem('login_level'));
        async function getData(){
            const userRes = await axios.get(`${API_PATH}/api/user`); 
            console.log('userRes',userRes)
            userCountData(userRes.data.length);
        }
        getData();
    },[]);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={4}>
                <UserCountCard
                    primary="User Count"
                    secondary={userCount}
                    iconPrimary={AccountCircleTwoTone}
                    color={theme.palette.secondary.main}
                />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
                <Link to='staff'>
                    <UserCountCard
                    primary="Add Staff"
                    secondary="1K"
                    iconPrimary={DescriptionTwoToneIcon}
                    color={theme.palette.primary.dark}
                    />
                </Link>
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
                <Link to='user'>
                    <UserCountCard
                        primary="Add User"
                        secondary="5,678"
                        iconPrimary={EmojiEventsTwoToneIcon}
                        color={theme.palette.success.dark}
                    />
                </Link>
            </Grid> 
        </Grid>
    );
};

export default WidgetStatistics;
