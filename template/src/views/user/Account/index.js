import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import $ from 'jquery'; 
import { API_PATH } from 'config';
const axios = require('axios');
import { useLinkedIn } from "react-linkedin-login-oauth2";
import GridTable from './GridTable'; 

// material-ui
import { Button, CardContent, CardActions, Divider, Grid, IconButton, Modal, Typography, TextField,Box } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SearchIcon from '@mui/icons-material/Search';
// assets
import CloseIcon from '@mui/icons-material/Close';

// generate random
function rand() {
    return Math.round(Math.random() * 20) - 10;
}

// modal position
function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`
    };
}



// ==============================|| SIMPLE MODAL ||============================== //

export default function SimpleModal({isCustomOpen,isReload}) {
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
     
    useEffect(()=>{  
        //$('button').trigger('click');
        $(".open_account").trigger({ type: "click" });
        //selectAdsAccound()
    },[]);

    useEffect(()=>{   
        $(".open_account").trigger({ type: "click" }); 
    },[isCustomOpen]);

    
    const submitAdsAccountData = ()=>{ 
        const id = localStorage.getItem('user_token');
        var selected_account_id = []
        var count = -1;
        var user_ads_account = $('input[name="user_ads_account"]:checked').each(function(){
            count++;
            selected_account_id[count] = parseInt(this.value);
        }); 
        //console.log(selected_account_id);
        const sendData = {
            'user_id' : id, 
            'user_ads_account' : selected_account_id 
        }      
        //console.log(JSON.stringify(sendData));
        axios.post(`/api/user/userAccountDetail`, sendData).then((response) => {  
            if(response.data.status == 'success'){
                toast(`${response.data.msg}`)  
                if( selected_account_id != ''){
                    var store_account_id = selected_account_id.join(',');
                } 
                localStorage.setItem('user_linkedin_account_id', store_account_id);
                //Hide modal
                location.reload();
                $("[data-bs-dismiss=modal]").trigger({ type: "click" });
            }else{
                toast(`${response.data.msg}`)
            }
 
        }).catch((error)=> {   
            toast('Technical issue.')
        }); 
        $('#ads_account').trigger("reset");
    }
     
    const { linkedInLogin } = useLinkedIn({
        clientId: "783v0rokori887",
        //clientId: "783v0rokori887",
        redirectUri: `http://localhost:3000/user`,
        //redirectUri: `https://www.pipelight.io/user`,
        onSuccess: (code) => {
            //console.log('12');
          setCode(code);
          setErrorMessage("");
        },
        scope: "r_emailaddress r_liteprofile r_ads_reporting rw_ads r_ads w_organization_social r_organization_social w_member_social r_basicprofile r_organization_admin rw_organization_admin r_1st_connections_size",
        onError: (error) => { 
            console.log(error)
          setCode("");
          setErrorMessage(error.errorMessage);
        },
    }); 

    const Body = React.forwardRef(({ modalStyle, handleClose }, ref) => (
        <div ref={ref}  tabIndex={-1}>
            <MainCard 
                sx={{
                    position: 'absolute',
                    width: { xs: 480, lg: 450 },
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                title="Choose an ad account"
                content={false}
                secondary={
                    <IconButton onClick={handleClose} size="large">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <Grid item xs={12}> 
                                {/* table data grid */}
                                <GridTable isReload={isReload} handleClose={handleClose} /> 
                    </Grid>
                    {/* <Typography variant="body1">Ads Account List</Typography> */}
                    <Typography variant="body2m" sx={{ mt: 1 }}> 
                        <br />
                        {/* <Grid item xs={12}>
                            <Button variant="contained" type="submit">Submit </Button> &nbsp;
                            <Button variant="contained" type="submit">SYNC Account </Button>
                        </Grid>  */}
                    </Typography>
                </CardContent>
                <Divider /> 
            </MainCard>
        </div>
    ));
    
    Body.propTypes = {
        modalStyle: PropTypes.object,
        handleClose: PropTypes.func
    };

    return (
        <Grid container justifyContent="flex-end">
            <span variant="contained" type="button" className="open_account" onClick={handleOpen}>
                 
            </span>
            <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                <Body modalStyle={modalStyle} handleClose={handleClose} />
            </Modal>
        </Grid>
    );

    
}