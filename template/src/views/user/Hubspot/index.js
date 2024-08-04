import React, { useEffect, useState } from 'react';  
import {useNavigate} from 'react-router-dom';  
import { gridSpacing } from 'store/constant';  
import 'bootstrap-daterangepicker/daterangepicker.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { ThreeDots } from  'react-loader-spinner';
const axios = require('axios'); 
import DataTable from "react-data-table-component";
import { useLocation } from 'react-router-dom';
import { API_PATH } from 'config';
import Account from '../Account'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

import { useTheme } from '@mui/material/styles';
import {
    Box,
    CardContent,
    Checkbox,
    Grid,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    Tabs,
    Tab,
    Button
} from '@mui/material';  
// project imports 
import MainCard from 'ui-component/cards/MainCard'; 
import DeleteIcon from '@mui/icons-material/Delete';
const columns = [
    {
        id: 1,
        name: "Hubspot Domain",
        selector: (row) => row.properties.domain,
        sortable: true,
        reorder: true,
        wrap: true, 
    },
    {
        id: 2,
        name: "Total Clicks",
        selector: (row) => row.properties.total_linkedin_click,
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
    },
    {
        id: 3,
        name: "Total Impressions",
        selector: (row) => row.properties.total_linkedin_impression,
        cell: (row) => row.properties.total_linkedin_impression,
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
    },
    {
        id: 3,
        name: "Total Spend",
        selector: (row) => row.properties?.total_linkedin_spend,
        cell: (row) => parseFloat(row.properties?.total_linkedin_spend).toFixed(2),
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
      },
    
];

const Index = () => { 
    const navigate = useNavigate();
    const query = useQuery();
    const hubspotCode = query.get('code');
    const [accountName, setAccountName] = useState(localStorage.getItem('select_account_name'))
    const [data, setData] = useState([])
    const [code, setCode] = useState(hubspotCode)
    const [isConnected,setIsConnected] = useState(false)
    const [loading,setLoading] = useState(false)
    const [accountModal,setAccountModal] = useState(false)

    const syncWithHubSpot = () => { 
        let client_id = '161315b1-1e34-410a-8b51-8c5bdc52b755';
        let redirect_uri = `https://www.pipelight.io/user/hubspot-token`; 
        let authorization_url = `https://app-eu1.hubspot.com/oauth/authorize?client_id=161315b1-1e34-410a-8b51-8c5bdc52b755&redirect_uri=https://www.pipelight.io/user/hubspot-token&scope=crm.schemas.companies.write%20crm.objects.marketing_events.read%20oauth%20crm.objects.companies.write%20crm.objects.companies.read&optional_scope=behavioral_events.event_definitions.read_write%20crm.objects.marketing_events.write`; 

        window.location.href = authorization_url
        
    }
    useEffect(()=>{
        if(code != null && code != ''){ 
            setLoading(true)
            const data = {
                code,
                select_account: localStorage.getItem('select_account'),
                linkedin_account_name: localStorage.getItem('select_account_name')
            } 
            axios.post(`${API_PATH}/api/hubspot/getAccessToken`,data).then((response) => {   
                if(response.data.status == 'success'){ 
                    setCode('') 
                    toast(`${response.data.msg}.`); 
                    setLoading(false) 
                    navigate(`/user/hubspot-token`);
                }else{
                    alert(`${response.data.msg}`)
                    setLoading(false)
                }
            }).catch( (error)=> {  
                alert('Tehnical issue.'+error.message);
                setLoading(false)
            });
        }
    },[code])  
    const getAndSyncHubspotData = () => {
        let select_account = localStorage.getItem('select_account')
        axios.get(`${API_PATH}/api/hubspot/getHubspotData/${select_account}`).then((response) => {
            if(response.data.status == 'success'){ 
                setData(response.data.data)
            }else{
                alert(`${response.data.msg}`)
                setLoading(false)
            }
        }).catch( (error)=> {  
            alert('Tehnical issue.'+error.message);
            setLoading(false)
        });
    }
    useEffect(()=>{
        setLoading(true)
        const data = {
            select_account: localStorage.getItem('select_account')
        } 
        axios.post(`${API_PATH}/api/hubspot/isAccountLinkWithHub`,data).then((response) => {  
            if(response.data.status == 'success'){ 
                if(response.data.data.length>0){ 
                    setIsConnected(true) 
                    getAndSyncHubspotData()
                }else{
                    setIsConnected(false)
                }
                setLoading(false)
            }else{
                alert(`${response.data.msg}`)
                setLoading(false)
            }
        }).catch( (error)=> {  
            alert('Tehnical issue.'+error.message);
            setLoading(false)
        });
    },[accountName])
    const deleteSyncAccount = () =>{
        if (confirm("Are you sure to unsync this account?")) {
            setLoading(true)
            const selectedAccount = localStorage.getItem('select_account')
            axios.delete(`${API_PATH}/api/hubspot/deleteLinkedAccount/${selectedAccount}`).then((response) => { 
                if(response.data.status == 'success'){  
                    setIsConnected(false) 
                    setLoading(false) 
                    setData([]) 
                }else{
                    alert(`${response.data.msg}`)
                    setLoading(false)
                }
            }).catch( (error)=> {  
                alert('Tehnical issue.'+error.message);
                setLoading(false)
            });
        }
    }   
    const openAccountModel = () => { 
        setAccountName(localStorage.getItem('select_account_name'))
    }
    const ClickToOpenAccountModel = () => {  
        setAccountModal(!accountModal) 
    }
    const logout = () => {
        localStorage.clear()
        navigate('/')
    }
    return (
        <MainCard sx={{  
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width:'100%'
        }}>
            <Account isCustomOpen={accountModal} isReload={openAccountModel}/>
            <ToastContainer autoClose={2000} /> 
            <MainCard content={false} sx={{marginTop:'20px',width:'700px',padding:'50px'}}> 
                <Grid item xs={12} md={12} sx={{marginLeft:'40px'}}> 
                    {loading?<ThreeDots color="#00BFFF" height={60} width={60} />:
                        isConnected?
                        <>
                            
                            <Button 
                                sx={{background:'#ff7a59',color:'white',width:'90%'}}
                                variant="contained" 
                                disabled={true}
                                title="Unsync this account from hubspot."
                            > 
                            Your Account Sync with {accountName}
                            </Button>
                            <DeleteIcon title="For connect another account delete this." onClick={()=>{deleteSyncAccount()}} sx={{cursor:'pointer',fontSize:'26px',marginLeft:'10px',color:'#cd1a1af2',position:'absolute'}}/>
                        </>
                        :
                        <Button 
                            sx={{background:'#ff7a59',color:'white',width:'90%'}}
                            variant="contained"
                            onClick={()=>syncWithHubSpot()} 
                        > 
                            Click to Sync ({accountName}) account with hubspot 
                        </Button>
                    }
                    <br /><br />
                        <Button  
                            variant="contained"
                            color={'primary'}
                            onClick={()=>ClickToOpenAccountModel()} 
                            sx={{width:'45%'}}
                        > 
                            Select Account 
                        </Button>
                        <Button  
                            variant="contained"
                            color={'primary'}
                            onClick={()=>logout()} 
                            sx={{marginLeft:'2px',width:'45%'}}
                        > 
                            Logout 
                        </Button>  
            </Grid> 
            </MainCard> 
            <MainCard content={false} sx={{marginTop:'20px',display:'none'}}>  
                <DataTable
                    title=""
                    columns={columns}
                    data={data}
                    defaultSortFieldId={1} 
                    pagination 
                    progressComponent={<ThreeDots color="#00BFFF" height={60} width={60} />}
                /> 
            </MainCard> 
        </MainCard>
    );
};

export default Index;