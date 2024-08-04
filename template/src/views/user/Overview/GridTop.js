// material-ui
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { API_PATH } from 'config';
import $ from 'jquery'; 
import { Button, Grid, Stack, TextField } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
const axios = require('axios');
// import { DataGrid,  } from '@material-ui/data-grid';
// import { DataGrid } from '@mui/x-data-grid';

const columns = [ 
    { field: 'id', headerName: 'S.No ', width: 120, sortable: false },
    { field: 'adtypes', headerName: 'Ad types', width: 150, align:'left',headerAlign: 'left', sortable: false },
    { field: 'spend', headerName: 'Spend', width: 220, align:'center',headerAlign: 'center', sortable: false },
    { field: 'impressions', headerName: 'Impressions', width: 220, align:'center',headerAlign: 'center', sortable: false },
    { field: 'clicks', headerName: 'Clicks', width: 220, align:'center',headerAlign: 'center', sortable: false },
    { field: 'ctr', headerName: 'CTR', width: 220, align:'center',headerAlign: 'center', sortable: false },
    // { field: 'leads', headerName: 'Leads', width: 220, align:'center',headerAlign: 'center', sortable: false },
    { field: 'result', headerName: 'Result', width: 220, align:'center',headerAlign: 'center', sortable: false },
    { field: 'costperresult', headerName: 'Cost per result', width: 220, align:'center',headerAlign: 'center', sortable: false }
];

function MyExportButton() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function TableDataGrid(props) {
    //console.log(props)
    const theme = useTheme();
    const [adsAccount,adsAccountData] = useState([]);
    const [loading, setLoading] = React.useState(true)

    useEffect(()=>{ 
        setLoading(true)
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
        //axios.get(`${API_PATH}/api/user/userAccountDetail/${id}-for_user`).then((response) => { 
        //console.log(`${API_PATH}/api/linkedin/adsType/${localStorage.getItem('select_account')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`)
        await axios.get(`${API_PATH}/api/linkedin/adsType/${localStorage.getItem('select_account')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
            //var account_data = []
            var rows = [];  
            var count = -1;

            setLoading(false)
            console.log('response.data____',response.data)
            for(var get_val in response.data){
                count++; 
                if( count<5  ){
                    var getval = '';
                    if(get_val == 'creative_ads'){
                        getval = 'Single Image';
                    }else if(get_val == 'spotlight_ads'){
                        getval = 'Spotlight';
                    }else if(get_val == 'mail_ads'){
                        getval = 'InMail';
                    }else{
                        getval = get_val;
                    }
                    rows[count] = { 
                        id: count+1,
                        adtypes: getval,
                        spend: '$'+response.data[get_val].spend.toLocaleString("en-US"),
                        impressions: response.data[get_val].impression.toLocaleString("en-US"),
                        clicks: response.data[get_val].clicks.toLocaleString("en-US"),
                        ctr: ((response.data[get_val].clicks/response.data[get_val].impression)*100).toFixed(2)+' %',
                        // leads: response.data[get_val].leads,
                        result: response.data[get_val].result,
                        costperresult: (response.data[get_val].result)?(response.data[get_val].spend/response.data[get_val].result).toLocaleString("en-US"):0
                    };
                }
            }  
            adsAccountData(rows); 
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        });
    }; 
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
            rows={adsAccount} columns={columns} pageSize={5} rowsPerPageOptions={[5]} loading={loading}
            components={{
              Toolbar: MyExportButton,
            }}
            /> 
        </Box>
    );
}
