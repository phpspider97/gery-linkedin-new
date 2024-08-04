// material-ui
import React, { useEffect, useState } from 'react'; 
import { useTheme, styled } from '@mui/material/styles';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
  } from 'mdb-react-ui-kit';

import { Circles,TailSpin,ThreeDots } from  'react-loader-spinner'
//import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"; 
import SortIcon from "@material-ui/icons/ArrowDownward";

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons';
import User1 from 'assets/images/users/user-round.svg'; 


// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 16,
    '&:hover': {
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));
const axios = require('axios'); 
import { API_PATH } from 'config';
import DataTable from "react-data-table-component";

const columns = [
    {
      id: 1,
      name: "UTM",
      selector: (row) => row.utm_name??'-',
      sortable: true,
      reorder: true
    },
    {
        id: 2,
        name: "Effected Ads ID",
        selector: (row) => row.ads_id??'-',
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
    },
    {
      id: 3,
      name: "Created At",
      selector: (row) => new Date(row.created_at).toUTCString()??'-',
      sortable: true,
      reorder: true,
      style:{ textAlign: 'left', width:'500px'}
    }
];

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = (props) => {
    const theme = useTheme();
    const [parameterUpdate,parameterUpdateData] = useState('');
    const [unreadUpdate, unreadUpdateData] = useState('0');
    const [fullParameterUpdate,fullParameterUpdateData] = useState([{
        utm_name : 'loading..'
    }]);
    const [pending, setPending] = React.useState(true);

    async function getPartialUtmUpdate(){
        let id = localStorage.getItem('user_token');   
        // console.log('1____',`${API_PATH}/api/user/getUtmUpdate/${id}-limit`)
        await axios.get(`${API_PATH}/api/user/getUtmUpdate/${id}-limit`).then((response) => {  
            if(response.status == 200){ 
                setPending(false); 
                parameterUpdateData(response.data); 
            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        }); 
    }

    async function getFullUtmUpdate(force_update_count){  
        //console.log('1jhghhj');
        let id = localStorage.getItem('user_token'); 
        await axios.get(`${API_PATH}/api/user/getUtmUpdate/${id}-full`).then((response) => { 
            if(response.status == 200){     
                fullParameterUpdateData(response.data); 
                const timeout = setTimeout(() => { 
                    setPending(false);
                }, 2000); 
                return () => clearTimeout(timeout);
            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        });    
        const getUnreadUpdate = await axios.get(`${API_PATH}/api/user/getUnreadUpdate/${id}`); 
        if(force_update_count == '' || force_update_count == undefined || force_update_count == 0){ 
            unreadUpdateData(getUnreadUpdate.data); 
        }else{ 
            unreadUpdateData(props.setIsAnyForceUpdate); 
        }
    }

    useEffect(()=>{  
       // console.log('abc')
        $('.update_count').show();  
        getPartialUtmUpdate();
        // getFullUtmUpdate(0);
        // if(props.setIsAnyForceUpdate > 0){ 
        //     getFullUtmUpdate(props.setIsAnyForceUpdate);  
        // }else{ 
        //     getFullUtmUpdate(0); 
        // }

    },[]);
    // props.setIsAnyForceUpdate
    const chipSX = {
        height: 24,
        padding: '0 6px'
    };
    const chipErrorSX = {
        ...chipSX,
        color: theme.palette.orange.dark,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light,
        marginRight: '5px'
    };

    const chipWarningSX = {
        ...chipSX,
        color: theme.palette.warning.dark,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light
    };

    const chipSuccessSX = {
        ...chipSX,
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light,
        height: 28
    };
    // const [basicModal, setBasicModal] = useState(true);
    // const [basicModal2, setBasicModal2] = useState(false);
    // const toggleShow = () => { 
    //     setBasicModal(!basicModal);
    //     setBasicModal2(basicModal);
    // }
    // const toggleShow2 = () => {
    //     setBasicModal(basicModal2);
    //     setBasicModal2(!basicModal2);
    // }

    return (
        <>
        <List
            sx={{
                width: '100%',
                maxWidth: 330,
                py: 0,
                borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    maxWidth: 300
                },
                '& .MuiListItemSecondaryAction-root': {
                    top: 22
                },
                '& .MuiDivider-root': {
                    my: 0
                },
                '& .list-container': {
                    pl: 7
                }
            }}
        >
            <ListItemWrapper>
                <Grid item>
                    <Stack direction="row" spacing={2}>
                        <Typography variant="subtitle1">All Notification</Typography>
                        <Chip
                            size="small"
                            label={unreadUpdate}
                            sx={{
                                color: theme.palette.background.default,
                                bgcolor: theme.palette.warning.dark
                            }}
                        />
                    </Stack>
                </Grid>
                <div className="collapse" id="notification_dropdown">
                <div className="table_main_outer table_noti">
                                        <div className="table-responsive">
                                        {/* <DataTable
                                            title=""
                                            columns={columns}
                                            data={fullParameterUpdate}
                                            defaultSortFieldId={1}
                                            sortIcon={<SortIcon />}
                                            pagination 
                                            progressPending={pending}
                                            progressComponent={<ThreeDots color="#00BFFF" height={60} width={60} />}
                                        /> */}
                                        <table className="table">
                                                <thead>
                                                <tr>
                                                    <th scope="col"> #</th>
                                                    <th scope="col"> UTM</th>
                                                    <th scope="col">Effected Ads</th>  
                                                </tr>
                                                </thead>
                                                <tbody> 
                                                {pending? 
                                                    <td colspan='3' align="center"><ThreeDots color="#00BFFF" height={60} width={60} /></td>:''
                                                    } 
                                                    {
                                                    (parameterUpdate.length != '')?
                                                    parameterUpdate.map( (parameterUpdateData,key)=>{ 
                                                    return (
                                                        <tr key={key}>
                                                            <td>{key+1}</td>
                                                            <td>{parameterUpdateData.utm_name}</td>
                                                            <td>{parameterUpdateData.total_ads_effect}</td> 
                                                        </tr>
                                                        
                                                        )}): <tr><td colSpan='3'>No update.</td></tr>
                                                    }  
                                                </tbody>
                                            </table>
                                            <Divider /> 
                                            {/* <table className="table table-striped table-bodered mt-4">
                                                <thead>
                                                    <tr className="notification_view_all show-cursor utm_update_data_footer">
                                                        <td colSpan="4" className="text-white text-center">
                                                            <a href="" data-bs-toggle="modal" data-bs-target="#utm_update_modal11" onClick={() => {
                                                                toggleShow2();
                                                                resetData();
                                                            }}>View in details</a>
                                                        </td> 
                                                    </tr>
                                                </thead>
                                            </table> */}
                                        </div> 
                                    </div>
                    {/* <div className="table-responsive">
                        <div className="utm_update_data"> 
                            <table className="table table-striped table-bodered">
                                <thead>
                                    <tr>
                                        <th scope="col"> #</th>
                                        <th scope="col"> UTM</th>
                                        <th scope="col">Effected Ads</th>  
                                    </tr>
                                </thead>
                                <tbody> 
                                    {
                                    (parameterUpdate.length != '')?
                                    parameterUpdate.map( (parameterUpdateData,key)=>{ 
                                    return (
                                        <tr key={key}>
                                            <td>{key+1}</td>
                                            <td>{parameterUpdateData.utm_name}</td>
                                            <td>{parameterUpdateData.total_ads_effect}</td> 
                                        </tr>
                                        
                                        )}): <tr><td colSpan='3'>No update.</td></tr>
                                    }  
                                </tbody>
                            </table>
                        </div>
                        <Divider /> 
                        <table className="table table-striped table-bodered mt-4">
                            <thead>
                                <tr className="notification_view_all show-cursor utm_update_data_footer">
                                    <td colSpan="4" className="text-white text-center">
                                        <a href="" data-bs-toggle="modal" data-bs-target="#utm_update_modal11" onClick={() => {
                                            toggleShow2();
                                            resetData();
                                        }}>View in details</a>
                                    </td> 
                                </tr>
                            </thead>
                        </table>
                    </div> */}
                </div>
            </ListItemWrapper>
            <Divider />
        </List>
        {/* <MDBModal className='utm_update_modal11' show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>UTM update list</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={toggleShow}>x</MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody> 
                                <div className="row">
                                <div className="col-md-12">
                                    <div className="table_main_outer">
                                        <div className="table-responsive">
                                        <DataTable
                                            title=""
                                            columns={columns}
                                            data={fullParameterUpdate}
                                            defaultSortFieldId={1}
                                            sortIcon={<SortIcon />}
                                            pagination 
                                            progressPending={pending}
                                            progressComponent={<ThreeDots color="#00BFFF" height={60} width={60} />}
                                        />
                                        </div> 
                                    </div>
                                </div>
                            </div>                                
                    </MDBModalBody>
                </MDBModalContent>
                </MDBModalDialog>
            </MDBModal> */}
        {/* <div className="modal custom_modal fade model_div" id="utm_update_modal" tabIndex="-2" role="dialog" aria-labelledby="utm_modalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content"> 
                    <div className="modal-header">
                        <h5 className="modal-title" id="utm_modalTitle"> UTM update list</h5>
                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="row"> 
                            <div className="col-md-12 mt-1">  
                                <div className="table-responsive"> 
                                <DataTable
                                    title=""
                                    columns={columns}
                                    data={fullParameterUpdate}
                                    defaultSortFieldId={1}
                                    sortIcon={<SortIcon />}
                                    pagination 
                                    progressPending={pending}
                                    progressComponent={<ThreeDots color="#00BFFF" height={60} width={60} />}
                                /> 
                                </div>
                            </div>
                        </div>  
                    </div> 
                </div>
            </div>
        </div>  */}
    </>
    );
};

export default NotificationList;
