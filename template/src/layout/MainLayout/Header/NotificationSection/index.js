import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Button,
    CardActions,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    Paper,
    Popper,
    Stack,
    TextField,
    Typography,
    useMediaQuery
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

import { API_PATH } from 'config';
import $ from 'jquery';  


// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';
import { Circles,TailSpin,ThreeDots } from  'react-loader-spinner'

// assets
import { IconBell } from '@tabler/icons';

const axios = require('axios');

// notification status options
const status = [
    {
        value: 'all',
        label: 'All Notification'
    },
    {
        value: 'new',
        label: 'New'
    },
    {
        value: 'unread',
        label: 'Unread'
    },
    {
        value: 'other',
        label: 'Other'
    }
];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = (props) => {
    let is_admin = window.location.href.split('/')[3]

    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [pending, setPending] = useState(true);
    const [unreadUpdate, unreadUpdateData] = useState('0');
    const [isNotificationVisible, setIsNotificationVisible] = useState(true);

    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);
    useEffect(() => {
        if(is_admin == 'admin'){
            setIsNotificationVisible(false)
        }
    }, []);

    const [fullParameterUpdate,fullParameterUpdateData] = useState([{
        utm_name : 'loading..'
    }]);
    const updateUnread = ()=>{ 
        let id = localStorage.getItem('user_token'); 
        axios.get(`${API_PATH}/api/user/updateUnread/${id}`).then((response) => { 
            if(response.status == 200){
                $('.new_noti').hide();     
                $('.update_count').hide();
            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        });   
    }
    async function getFullUtmUpdate(force_update_count){  
        //console.log('1jhghhj');
        let id = localStorage.getItem('user_token'); 
        //console.log(`${API_PATH}/api/user/getUtmUpdate/${id}-full`)
        await axios.get(`${API_PATH}/api/user/getUtmUpdate/${id}-full`).then((response) => { 
            if(response.status == 200){ 
                //setBasicModal(true);
                //console.log('response.data',response.data)    
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
        //for notification red icon        
        console.log(`${API_PATH}/api/user/getUnreadUpdate/${id}`);
        console.log(getUnreadUpdate.data);
            if (getUnreadUpdate.data>0) {
                $('.new_noti').show();
            }
        //for notification red icon 
        if(force_update_count == '' || force_update_count == undefined || force_update_count == 0){ 
            unreadUpdateData(getUnreadUpdate.data); 
        }else{ 
            unreadUpdateData(props.setIsAnyForceUpdate); 
        }
    }

    useEffect(()=>{   
        if(props.setIsAnyForceUpdate > 0){ 
            getFullUtmUpdate(props.setIsAnyForceUpdate);  
        }else{ 
            getFullUtmUpdate(0); 
        }

    },[]);
    //props.setIsAnyForceUpdate
    const handleChange = (event) => setValue(event?.target.value);

    const [basicModal, setBasicModal] = useState(false); 
    const toggleShow = () => { 
        setBasicModal(!basicModal); 
    } 
    const openModalNew = () =>{ 
        setBasicModal(true);
        updateUnread()
    }
    return (
        <>
            {isNotificationVisible?
            <Box
                sx={{
                    ml: 2,
                    mr: 3,
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: 'all .2s ease-in-out',
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                        color: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
                        '&[aria-controls="menu-list-grow"],&:hover': {
                            background: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
                            color: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.secondary.light
                        }
                    }}
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    color="inherit"
                >
                    <IconBell stroke={1.5} size="20px" /><span className='new_noti'></span>
                </Avatar>
            </Box>
            :''}
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [matchesXs ? 5 : 0, 20]
                        }
                    }
                ]}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Grid container direction="column" spacing={2}>
                                            {/* <Grid item xs={12}>
                                                <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}> */}
                                                    {/* <Grid item>
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
                                                    </Grid> */}
                                                    {/* <Grid item>
                                                        <Typography component={Link} to="#" variant="subtitle2" color="primary">
                                                            Mark as all read
                                                        </Typography>
                                                    </Grid> */}
                                                {/* </Grid>
                                            </Grid> */}
                                            <Grid item xs={12}>
                                                <PerfectScrollbar
                                                    style={{
                                                        height: '100%',
                                                        maxHeight: 'calc(100vh - 205px)',
                                                        overflowX: 'hidden'
                                                    }}
                                                > 
                                                    <NotificationList/>
                                                </PerfectScrollbar>
                                            </Grid>
                                        </Grid>
                                        <Divider />
                                        <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                                            <Button size="small" disableElevation onClick={()=>{openModalNew()}}>
                                                View All
                                            </Button>
                                        </CardActions>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
            <MDBModal className='utm_modal' show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>UTM Update List</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={toggleShow}>x</MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody> 
                                <div className="row">
                                <div className="col-md-12">
                                    <div className="table_main_outer">
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
                                                        <th scope="col"> UTM </th>
                                                        <th scope="col">Effected Ads ID</th>  
                                                        <th scope="col">Created At</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                   {pending?<ThreeDots color="#00BFFF" height={60} width={60} />:''} 
                                                {
                                                (fullParameterUpdate.length != '')?
                                                fullParameterUpdate.map( (parameterUpdateData,key)=>{ 
                                                return (
                                                    <tr key={key}>
                                                        <td>{key+1}</td>
                                                        <td>{parameterUpdateData.ads_id}</td>
                                                        <td>{parameterUpdateData.created_at}</td> 
                                                    </tr>
                                                    
                                                    )}): <tr><td colSpan='3'>No update.</td></tr>
                                                }  
                                                </tbody>
                                            </table>
                                        </div> 
                                    </div>
                                </div>
                            </div>                                
                    </MDBModalBody>
                </MDBModalContent>
                </MDBModalDialog>
            </MDBModal> 
        </>
    );
};

export default NotificationSection;
