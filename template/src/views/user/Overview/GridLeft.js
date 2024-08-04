// material-ui
import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import './index.css'
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { API_PATH } from 'config';
import $ from 'jquery'; 
import { Button, Grid, Stack, TextField } from '@mui/material';
const axios = require('axios');



// const columns = [ 
//     { field: 'id', headerName: 'S.No ', width: 200, sortable: false },
//     { field: 'adtypes', headerName: 'Top 10 performing ads', width: 300, align:'left', headerAlign: 'left', sortable: false },
//     { field: 'spend', headerName: 'Spend', width: 150, align:'center',headerAlign: 'center', sortable: false },
//     { field: 'impressions', headerName: 'Impressions', width: 150, align:'center',headerAlign: 'center', sortable: false },
//     { field: 'clicks', headerName: 'clicks', width: 150, align:'center',headerAlign: 'center', sortable: false },
//     { field: 'ctr', headerName: 'CTR', width: 150, align:'center',headerAlign: 'center', sortable: false }, 
//     { field: 'results', headerName: 'Results', width: 150, align:'center',headerAlign: 'center', sortable: false }, 
//     { field: 'costperresult', headerName: 'Cost per result', width: 150, align:'center',headerAlign: 'center', sortable: false }, 
// ];

const columns = [ 
    { field: 'id', headerName: 'S.No ', width: 120, sortable: false },
    { field: 'adtypes', headerName: 'Top 10 performing ads', width: 250, align:'left',headerAlign: 'left', sortable: true },
    { field: 'spend', headerName: 'Spend', width: 220, align:'center',headerAlign: 'center', sortable: true },
    { field: 'impressions', headerName: 'Impressions', width: 220, align:'center',headerAlign: 'center', sortable: true },
    { field: 'clicks', headerName: 'Clicks', width: 190, align:'center',headerAlign: 'center', sortable: true },
    { field: 'ctr', headerName: 'CTR', width: 180, align:'center',headerAlign: 'center', sortable: true },
    { field: 'results', headerName: 'Results', width: 220, align:'center',headerAlign: 'center', sortable: true },
    { field: 'costperresult', headerName: 'Cost per result', width: 220, align:'center',headerAlign: 'center', sortable: true }
];

function MyExportButton() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function TableDataGrid(props) {
    const theme = useTheme();
    const [adsAccount,adsAccountData] = useState({});
    const [loading, setLoading] = React.useState(true)
    useEffect(()=>{ 
        setLoading(true)
        selectAdsAccound(props)  
        adsAccountData({})
    },[props]);
    const selectAdsAccound = async (props)=>{ 
        let id = localStorage.getItem('user_token'); 
        if(props.date_range){
            var search_date_range = props.date_range; 
        }else{
            var search_date_range = ''; 
        }    
        if(props.ads_type){
            var filter_data = props.ads_type; 
        }else{
            var filter_data = ''; 
        }     

        //console.log(`${API_PATH}/api/linkedin/adsPerforming/${localStorage.getItem('select_account')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`)

        await axios.get(`${API_PATH}/api/linkedin/adsPerforming/${localStorage.getItem('select_account')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
             
            //var account_data = []
            
            var rows = []; 
            console.log('start array',rows)
            var count = -1;
            console.log('response.data',response.data)
            if(response.data && response.data.length != 'undefined'){
                for(var get_val in response.data){
                    if(get_val != 'NA'){
                        count++; 
                        if( count<10  ){
                            console.log('ads_type__', typeof response.data[get_val].spend)
                            rows[count] = { 
                                id: count+1,
                                adtypes: get_val,
                                spend: '$'+ response.data[get_val].spend.toLocaleString("en-US"),
                                impressions: response.data[get_val].impression.toLocaleString("en-US"),
                                clicks: response.data[get_val].clicks.toLocaleString("en-US"),
                                ctr: ((response.data[get_val].clicks/response.data[get_val].impression)*100).toFixed(2)+' %',
                                results: response.data[get_val].result,
                                costperresult: (response.data[get_val].result)? ( '$'+Math.round(response.data[get_val].spend/response.data[get_val].result)).toLocaleString("en-US"):0
                            };
                        }
                    }
                }  
            } 
            setLoading(false)
            adsAccountData(rows); 
 
        }).catch((error)=> {  
            setLoading(false)
            $('#errorText').text('Data not get.');  
            
        });
    }
    //console.log('adsAccount',adsAccount)
    return (
        <Box
            sx={{
                height: 350,
                width: '100%',
                '& .MuiDataGrid-root': {
                    //border: 'none',
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
            <DataGrid className='custom_overviewtable' 
                columnVisibilityModel={{ 
                    id: false
                }} 
                checkboxSelection
                rows={adsAccount} hideFooter={true} columns={columns} pageSize={10} rowsPerPageOptions={[10]} loading={loading} 
                components={{
                  Toolbar: MyExportButton,
                }}

                /> 
        </Box>
    );
}
