// material-ui
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { API_PATH } from 'config';
import $ from 'jquery'; 
import { Button, Grid, Stack, TextField, InputAdornment } from '@mui/material';
const axios = require('axios');
// import { DataGrid,  } from '@material-ui/data-grid';
import { DataGrid } from '@mui/x-data-grid';
import {useNavigate} from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'accountName', headerName: 'Account Name', width: 250 },
    { field: 'accountID', headerName: 'Account ID', width: 250 },
];
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// table data
const rows = [
    { id: 1, accountName: 'No data'},
];

// ==============================|| TABLE - BASIC DATA GRID ||============================== //

export default function TableDataGrid() {
    const navigate = useNavigate();
    const theme = useTheme();true
    const [search, setSearch] = React.useState('');
    const [adsAccount,adsAccountData] = useState([]);
    const [isLoading,isLoadingData] = useState(true);
    const [rows, setRows] = React.useState([]);

    useEffect(()=>{ 
        selectAdsAccound()
    },[]);
    // React.useEffect(() => {
    //     setRows(products);
    // }, [products]);
    const handleOnCellClick = (data_info)=>{
        let select_account_id = data_info.row.accountID
        let select_account_name = data_info.row.accountName
        localStorage.setItem('select_account',select_account_id) 
        localStorage.setItem('select_account_name',select_account_name) 
        toast.success(`Account selected successfully.`)
        navigate('overview')
    }
    const selectAdsAccound = ()=>{ 
        let id = localStorage.getItem('user_token');
        //console.log(`/api/user/userAccountDetail/${id}-for_user`);   
        axios.get(`${API_PATH}/api/user/userAccountDetail/${id}-for_user`).then((response) => { 
            //var account_data = []
            var rows = [];
            response?.data?.map((account_data,key)=>{
                //console.log('account_data.account_name',account_data.account_name)
                //account_data.push({AccountName : account_data.account_name})
                //console.log('account_data',account_data)
                rows[key] = {
                    id: key+1,
                    accountName: account_data.account_name,
                    accountID: account_data.account_id
                };
            }) 
            isLoadingData(false)
            adsAccountData(rows); 
            setRows(rows)
 
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        });
    }; 
    
    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const adsAccountUpdate = adsAccount.filter((row) => {
                let matches = true;

                const properties = ['accountName'];
                let containsQuery = false;

                properties.forEach((property) => {
                    if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });

                if (!containsQuery) {
                    matches = false;
                }
                return matches;
            }); 
            adsAccountData(adsAccountUpdate);
        }else{ 
            adsAccountData(rows);
        }
    };

    return (
        <>
        <ToastContainer autoClose={2000} />
        <Grid container justifyContent="space-between" alignItems="right" mt={1} mr={2} spacing={2}> 
            <Grid item xs={12} sm={12} alignItems="right" className="search_input">
                <TextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        )
                    }}
                    onChange={handleSearch}
                    placeholder="Search account"
                    value={search}
                    size="small"
                    
                />
            </Grid>
        </Grid> 
        <Box
            sx={{
                height: 520,
                width: '100%',
                '& .MuiDataGrid-root': {
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                    },
                    '& .MuiDataGrid-columnsContainer': {
                        color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                    },
                    '& .MuiDataGrid-columnSeparator': {
                        color: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                    }
                }
            }}
        >
            <DataGrid  
                columnVisibilityModel={{ 
                    accountID: false
                }}
                rows={adsAccount} columns={columns} loading={isLoading} pageSize={10} rowsPerPageOptions={[10]} onCellClick={(e)=>{handleOnCellClick(e) } }    
                getCellClassName={(params) => { 
                    return params.row.accountID == localStorage.getItem('select_account')  ? 'selected_account mouse_pointer' : 'mouse_pointer';
                }} 
            />  
        </Box>
        </>
    );
}
