import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react'; 
import {Link, useNavigate} from 'react-router-dom'; 
import { API_PATH } from 'config'; 
import { useLinkedIn } from 'react-linkedin-login-oauth2'; 
const axios = require('axios');
import moment from 'moment';
import { gridSpacing } from 'store/constant'; 
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import CampaignIcon from '@mui/icons-material/Campaign';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Circles,TailSpin,ThreeDots } from  'react-loader-spinner'
import { useForm } from 'react-hook-form'; 

// material-ui
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
    Modal,
    Button,
    Divider
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

// material-ui
//import { Button, CardContent, CardActions, Divider, Grid, IconButton, Modal, Typography, TextField,Box } from '@mui/material';
 

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

// project imports
import Chip from 'ui-component/extended/Chip';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import { getCustomers } from 'store/slices/customer';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import PrintIcon from '@mui/icons-material/PrintTwoTone';
import FileCopyIcon from '@mui/icons-material/FileCopyTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import CloseIcon from '@mui/icons-material/Close';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}
// table sort
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const getComparator = (order, orderBy) =>
    order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(array, comparator) {
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis?.map((el) => el[0]);
}

const headCells = [
    {
        id: "name",
        label: "Campaign Group Name",
        width: "200px"
    },
    {
        id: "status",
        label: "Status"
    },
    {
        id: "costInLocalCurrency",
        label: "Spend"
    },
    {
        id: "impressions",
        label: "Impressions"
    },
    {
        id: "clicks",
        label: "Clicks"
    },

    {
        id: "ctr",
        label: "Average CTR"
    },
    {
        id: "cpm",
        label: "Average CPM",
    },
    {
        id: "cpc",
        label: "Average CPC"
    },
    {
        id: "cost",
        label: "Conversion Cost"
    },
    {
        id: "oneClickLeads",
        label: "Leads"
    },
    {
        id: "costPerLead",
        label: "Cost Per Lead"
    }
];

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, selected }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" sx={{ pl: 3 }}>
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts'
                        }}
                    />
                </TableCell>
                {/* {numSelected > 0 && (
                    <TableCell padding="none" colSpan={6}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                    </TableCell>
                )} */}
                {numSelected >= 0 &&
                    headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    selected: PropTypes.array,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

// ==============================|| TABLE HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }) => (
    <Toolbar
        sx={{
            p: 0,
            pl: 1,
            pr: 1,
            ...(numSelected > 0 && {
                color: (theme) => theme.palette.secondary.main
            })
        }}
    >
        {numSelected > 0 ? (
            <Typography color="inherit" variant="h4">
                {/* {numSelected} Selected */}
            </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
                Nutrition
            </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {numSelected > 0 && (
            <Tooltip title="Delete">
                <IconButton size="large">
                    {/* <DeleteIcon fontSize="small" /> */}
                </IconButton>
            </Tooltip>
        )}
    </Toolbar>
);

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};
 
const Ads = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [value, setGetValue] = useState(0);
    const handleChange = (event, newValue) => {
        setGetValue(newValue);
    };
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState('');
    const [rows, setRows] = React.useState([{
        ads_name : 'loading..'
    }]);
    const [isDisabled, setIsDisabled] = React.useState(true); 
    const [textParameter, setTextParameter] = React.useState('UTM parameters'); 
    const { customers } = useSelector((state) => state.customer);
    const [totalCreativeAds, setTotalCreativeAds] = useState(0);
    const [utmCreative, setUtmCreative] = useState(0);
    const [utmCreativeName, setUtmCreativeName] = useState('');
    const [selectcreative,selectcreativeData] = useState('/user/creative'); 

    setTimeout(function () { 
        $('.css-a8rsnn-MuiButtonBase-root-MuiTableSortLabel-root').css("width", "120px"); 
    }, 1000);
    
    // React.useEffect(() => {
    //     dispatch(getCustomers());
    // }, [dispatch]);
    // React.useEffect(() => {
    //     setRows(customers);
    // }, [customers]);
    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                let matches = true;

                const properties = ['name', 'email', 'location', 'orders'];
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
            //setRows(newRows);
        } else {
            //setRows(customers);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            if (selected.length > 0) {
                setSelected([]);
            } else {
                const newSelectedId = rows.map((n) => `${n.id}_${n.ads_name}`);
                setSelected(newSelectedId);
            }
            const newSelectedId = rows.map((n) => n.id);
            const newSelectedName = rows.map((n) => n.ads_name);
            // Update ids
            let selected_creative_id = newSelectedId.join(', ');      
            let selected_creative_name = newSelectedName.join(', ');    
            //console.log('selected_creative_id',selected_creative_id)  
            //console.log('selected_creative_name',selected_creative_name)  
            setUtmCreative(selected_creative_id);
            setUtmCreativeName(selected_creative_name);
            setTotalCreativeAds(newSelectedId.length);
            // let selected_campaign_group = newSelectedId.join(',');  
            // if(selected_campaign_group != ''){
            //     selectCampaignData(`/user/creative/all`);
            // } 

            return;
        }
        setUtmCreative([]);
        setUtmCreativeName([]);
        setTotalCreativeAds(0);
        setSelected([]);
    };

    const handleClick = (event, id, name) => { 
        //console.log('name',id)
        const selectedIndex = selected.indexOf(id);
        //console.log('selectedIndex',id)
        let newSelected = []; 

        if (selectedIndex === -1) {

            newSelected = newSelected.concat(selected, id); 
           //console.log('nameAds__',newSelected)
           // storeAdsName.push(nameAds[nameAds.length - 1])
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }  


        setSelected(newSelected);

        var a_selected_creative_id = [];
        var a_selected_creative_name = [];
        var count = -1;
        //console.log('newSelected',newSelected)
        newSelected.forEach(function(item){
            count++;
            
            // a_selected_campaign_group[count] = item.id;
            // a_selected_campaign_name[count] = item.name;
            // setTotalCampaign(count+1);
            let ads_id = item.split('_')[0]
            let ads_name = item.split('_')[1]
            //console.log('item',ads_name)
            a_selected_creative_id[count] = ads_id;
            a_selected_creative_name[count] = (ads_name)?ads_name:ads_id;
            setTotalCreativeAds(count+1);
        });

        // console.log('a_selected_creative_id',a_selected_creative_id)
        // console.log('a_selected_creative_name',a_selected_creative_name)


        // For ads 
        // setTotalCampaignAds(0)
        // setTotalCampaign(0)
        // setTotalCreativeAds(0) 

        //let row_data = state.selectedRows;
        

        //let selected_creative_group = newSelected.join(',');  
        //let selected_creative_name = a_selected_creative_name.join(', ');
        //let selected_creative_name = nameAds.join(',');   
        //console.log('selected_creative_name',storeAdsName)
        //setTotalCreativeAds(selected_creative_group.length)
        let selected_creative_id = a_selected_creative_id.join(', ');      
        let selected_creative_name = a_selected_creative_name.join(', ');      
        setUtmCreative(selected_creative_id);
        setUtmCreativeName(selected_creative_name);

        //selectcreativeData(`/user/creative/${selected_creative_group}`);

        // let selected_campaign_group = a_selected_campaign_group.join(',');  
        // let selected_campaign_name = a_selected_campaign_name.join(', '); 
         
        // setUtmCampaign(selected_campaign_group);
        // setUtmCampaignName(selected_campaign_name);
        // if(selected_campaign_group != ''){
        //     localStorage.setItem('selected_campaign_id',selected_campaign_group) 
        //     selectCampaignData(`/user/creative/all`);
        // }
 
        // axios.get(`${API_PATH}/api/linkedin/totalCampaignAds/${selected_campaign_group}-${localStorage.getItem('user_token')}`).then((response) => {
        //     setTotalCampaignAds(response.data.elements.length); 
        // });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const [modalStyle] = React.useState(getModalStyle);
     
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const handleOpen = () => { 
        setOpen(true);
        setOpen2(false);
    };
    const handleOpen2 = () => {
        setOpen2(true);
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    // Neel Code  

    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm();
    setTimeout(function () { 
        $('.lnndaO').css("width", "130px"); 
    }, 1000); 
    const navigate = useNavigate();
    const [fixCampaign,fixCampaignData] = useState([{}]);
    const [campaign,campaignData] = useState([{
        name : 'loading..'
    }]);
    const [utmParameter,utmParameterData] = useState([{
        utm_name : 'loading..'
    }]); 
    const [selectCampaign,selectCampaignData] = useState('/user'); 
    const [selectedRows, setSelectedRows] = React.useState([]); 
    const [pending, setPending] = React.useState(false);
    const [count, setCount] = useState(1);
    const [parameterCount, setParameterCount] = useState(1);
    const [utmCampaign, setUtmCampaign] = useState(0);
    const [utmCampaignName, setUtmCampaignName] = useState('');
    const [totalCampaignAds, setTotalCampaignAds] = useState(0);
    const [totalCampaign, setTotalCampaign] = useState(0);
    const [isAnyUpdate, setIsAnyUpdate] = useState('no');
    const [isAnyForceUpdate, setIsAnyForceUpdate] = useState(0);
    const [selectedAccount, setselectedAccount] = useState(localStorage.getItem('user_linkedin_account_id'));
    const [selectedRedirectAccount, setSelectedRedirectAccount] = useState(localStorage.getItem('user_selected_account_for_utm'));
    const [defaultValue, setDefaultValue] = useState(''); 
    const [isLoaderDisplay, setIsLoaderDisplay] = useState(false); 
    const [selectedDateRange, selectedDateRangeData] = useState(''); 
    const [selectStatus, selectStatusData] = useState(''); 
    const [isExecute, isExecuteData] = useState('true'); 
    const [remainingAds, remainingAdsData] = useState(0); 
    const [fixCreative, fixCreativeData] = useState([{}]);
    const [creative,creativeData] = useState([{
        name : 'loading..'
    }]);  
    const [userSelectedCampaign, setUserSelectedCampaign] = useState(localStorage.getItem('user_selected_campaign_id'));

    var today = new Date(); 
    let startDate = moment().subtract(29, 'days').format('MM/DD/YYYY') 
    let today_date = moment().subtract(0, 'days').format('MM/DD/YYYY') 
    const [currentDate, setCurrentDate] = useState((localStorage.getItem('current_date'))?localStorage.getItem('current_date'):today_date);
    const [previousDate, setPreviousDate] = useState((localStorage.getItem('previous_date'))?localStorage.getItem('previous_date'):startDate); 

    let default_start_date = previousDate.trim().replaceAll("/", "@");
    let default_end_date = currentDate.trim().replaceAll("/", "@");
    let search_date_range = `${default_start_date}_${default_end_date}`;
    const [defaultDateRange, setDefaultDateRange] = React.useState(search_date_range);
     
    $('.utm_parameter').on('keyup',function() {
        this.value = this.value.replace(/\s/g,'_');
    });
    $(document).on('keyup','.utm_custom_value', function(e){ 
        this.value = this.value.replace(/\s/g,'_');
    });
    const onRowClicked = (camaign_id, event) => { 
        navigate(`/user/creative/${camaign_id}`); 
    };

    const handleRowSelected = React.useCallback(state => { 
        setTotalCampaignAds(0)
        setTotalCampaign(0)

        let row_data = state.selectedRows;
        var a_selected_campaign_group = [];
        var a_selected_campaign_name = [];
        var count = -1;
        row_data.forEach(function(item){
            count++;
            a_selected_campaign_group[count] = item.id;
            a_selected_campaign_name[count] = item.name;
            setTotalCampaign(count+1);
        });
        let selected_campaign_group = a_selected_campaign_group.join(',');  
        let selected_campaign_name = a_selected_campaign_name.join(', '); 
         
        setUtmCampaign(selected_campaign_group);
        setUtmCampaignName(selected_campaign_name);
        if(selected_campaign_group != ''){
            localStorage.setItem('selected_campaign_id',selected_campaign_group)
            //selectCampaignData(`/user/creative/${selected_campaign_group}`);
            selectCampaignData(`/user/creative/all`);
        }
 
        axios.get(`${API_PATH}/api/linkedin/totalCampaignAds/${selected_campaign_group}-${localStorage.getItem('user_token')}`).then((response) => {
            setTotalCampaignAds(response.data.elements.length); 
        });

	}, []);
    
    const searchName = (e) => { 
        let search_data = e.target.value; 
        setSearch(search_data)
        setPending(true);  
        const filteredItems = fixCreative.filter( 
            item => 
            //console.log( (item.ads_name)?item.ads_name.toLowerCase():item.id.toString().toLowerCase() )
            item.id && item.ads_name.toLowerCase().includes(search_data.toLowerCase()),
        );
        if( search_data !=  ''){
            setRows(filteredItems);
            setPending(false); 
        }else{
            getData();
        }
    }; 
  
    const searchStatus = (e) => {
        let filter_data = e.target.value; 
        setPending(true); 
        selectStatusData(filter_data); 
        let search_date_range = defaultDateRange; 
        let campaign_group_id = window.location.href.split('/').pop(); 
        if(campaign_group_id === 'all'){
            campaign_group_id = localStorage.getItem('selected_campaign_id')
        } 
        //console.log(`/api/linkedin/creative/${campaign_group_id}-${localStorage.getItem('user_token')}-${search_date_range}--`)
        axios.get(`${API_PATH}/api/linkedin/creative/${campaign_group_id}-${localStorage.getItem('user_token')}-${search_date_range}--`).then((response) => {
            //creativeData(response.data.elements); 
            //console.log(response.data.elements);  
            const filteredItems = response.data.elements.filter(
                item => item.status && item.status.toLowerCase().includes(filter_data.toLowerCase()),
            ); 
            //console.log(filteredItems);
            if(filter_data !=  ''){
                setRows(filteredItems); 
            }else{ 
                setRows(response.data.elements); 
            }  
            const timeout = setTimeout(() => { 
                setPending(false);
            }, 1000); 
            return () => clearTimeout(timeout); 
        });
    }; 

    //$('.applyBtn').on('click',function(){
    //$('.input_date').on('change',function(){
    function handleCallback(start, end, label) {
        let is_search_val_exist = $('.search_name').val()
        setPending(true);
        $('.filter_status_data').val('');
        selectStatusData('');
        let search_date_range = $('.input_date').val(); 
        let modify_search_data = search_date_range.split('-');
        setPreviousDate(modify_search_data[0]) 
        setCurrentDate(modify_search_data[1]) 
        localStorage.setItem('current_date',modify_search_data[1])
        localStorage.setItem('previous_date',modify_search_data[0])
        let start_date = modify_search_data[0].trim().replaceAll("/", "@");
        let end_date = modify_search_data[1].trim().replaceAll("/", "@");
        search_date_range = `${start_date}_${end_date}`;
        if(search_date_range == ''){
            getData();
        }else{
            setDefaultDateRange(search_date_range)
            getData(search_date_range,'-',is_search_val_exist);
        } 
    };

    // $('.filterStatus').on('change',function(){
    //     let filter_data = $(this).val();  
    //     if(filter_data == ''){ 
    //         getData();
    //     }else{
    //         setPending(true);
    //         getData('',filter_data); 
    //     } 
    // });
    const addMore = ()=>{
        let new_parameterCount = parameterCount+1; 
        var html = '';
            html    =   `<div class="col-md-12 row mt-2 hide_retrieve_parameter" id="add_parameter_div_${new_parameterCount}">
                            <div class="col-md-4">
                                <input type="text" name="parameter_name[@0|insert@]" class="form-control utm_parameter input_cus" id="parameter_input_1" placeholder="Parameter name"  />
                            </div>
                            <div class="col-md-4">
                                <select class="form-control form-select add_update_field input_cus" id='${new_parameterCount}' onChange="addUpdateField(event)">
                                    <option selected value="">Select Variable</option>
                                    <option value="account_name">Account name</option>
                                    <option value="account_id">Account ID</option>
                                    <option value="campaign_name">Campaign name</option>
                                    <option value="campaign_id">Campaign ID</option>
                                    <option value="creative_name">Creative name</option>
                                    <option value="ad_id">Ad ID</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            <div class="col-md-4 parameter_value_${new_parameterCount}"></div>
                            <i class="fal fa-trash-alt delete_parameter parameter_delete_custom" id='${new_parameterCount}'></i>
                        </div>`;
            // html = `<div class="col-sm-3 my-1 col-md-12 mt-3" id="add_parameter_div_${new_parameterCount}"> 
            //             <div class="input-group">
            //                 <div class="input-group-prepend">
            //                     <div class="input-group-text">utm_</div>
            //                 </div>
            //                 <input type="text" name="parameter_name[@0|insert@]" class="form-control utm_parameter" placeholder="parameter, value" id='parameter_input_${new_parameterCount}'/>
            //                 <div class="input-group-append bg-danger">
            //                     <div class="input-group-text text-white bg-danger delete_parameter show-cursor" id='${new_parameterCount}' > X</div>
            //                 </div>
            //             </div>
            //         </div>`; 
            if($('#add_more').length == 0){ 
                $('#retrieve_parameter').after('<div id="add_more"></div>');
            }
        $("#add_more").append(html);
    setParameterCount(new_parameterCount)
    } 
    
    const updateUtmParameter = ()=>{  
        $('.utm_update_loader').show();
        let utm_creative_id = $('#utm_creative_id').val();
        let selected_utm = $('input[name="apply_utm"]:checked').val();
       
        const send_data = {
            'utm_creative_id' : utm_creative_id,
            'selected_utm' : selected_utm,
            'user_token' : localStorage.getItem('user_token')
        }
        //console.log(JSON.stringify(send_data));
        axios.post(`${API_PATH}/api/linkedin/updateCreativeUtm`,send_data).then((response) => {
            setBasicModal(false)
            setBasicModal2(false)
            let total_time = (totalCreativeAds*7/60).toFixed(2);
            let approx_time = Math.floor(total_time) +'-'+ Math.ceil(total_time); 
            toast(`Total ${totalCreativeAds} ads parameter effected. It takes ${approx_time} minutes to update in linkedin platform.`)
            //setIsAnyUpdate('yes');
            $('.utm_update_loader').hide();
            $("[data-bs-dismiss=modal]").trigger({ type: "click" });
            var count = 0;
            const update_interval = setInterval(function(){ 
                //console.log(`/api/getAdsUpdated/${localStorage.getItem('user_token')}`)
                axios.get(`${API_PATH}/api/getCreativeUpdated/${localStorage.getItem('user_token')}`).then((response) => { 
                    count += 1;  
                    //console.log(count)
                    if(count == 1){
                        $('#ads_update').show();
                        localStorage.setItem('total_update_ads',response.data.pending_ads);
                        $("#ads_update").html(`<b>0 / ${response.data.pending_ads}</b> ads are updated.`)
                    }else{ 
                        $("#ads_update").html(`
                        <b>${localStorage.getItem('total_update_ads') - response.data.pending_ads} / ${localStorage.getItem('total_update_ads')}</b> ads are updated.`)
                        setIsAnyForceUpdate(`${localStorage.getItem('total_update_ads') - response.data.pending_ads}`);
                        setIsAnyUpdate('yes');
                    } 
                    if(response.data.display_error){ 
                        toast(`${response.data.display_error}`)
                    }
                    if( (localStorage.getItem('total_update_ads') - response.data.pending_ads) == localStorage.getItem('total_update_ads') ){
                        stopInterval();
                    }
                }); 
            }, 6000);
            function stopInterval(){
                clearInterval(update_interval);
                $('#ads_update').hide();
            }

        });
    }
    const addUtmParameter = ()=>{ 
        let campaign_id = utmCampaign; 
        var a_utm_parameter = []; 
        var a_utm_value = []; 
        var a_utm_field = []; 
        var a_combine_value = []; 
        let utm_name_id = $('#utm_name_id').val();
        let utm_name = $('#utm_name').val();
        // $('.utm_parameter').each(function(k,v){ 
        //     var add_operation = v.name.split('@')[1];
        //     a_utm_parameter[k] = add_operation+'|'+$(this).val(); 
        // });

        $('.utm_parameter').each(function(k,v){ 
            //console.log(v.name);
            var add_operation = v.name.split('@')[1]; 
            a_utm_parameter[k] = add_operation+'|'+$(this).val(); 
        });
        //console.log(a_utm_parameter);
        $('.utm_value').each(function(k,v){ 
           // console.log($(this).val()); 
            a_utm_value[k] =  $(this).val(); 
        });
        $('.add_update_field').each(function(k,v){  
            a_utm_field[k] = $(this).val(); 
        }); 
        for(let key in a_utm_parameter){
            a_combine_value[key] = `${a_utm_parameter[key]}#${a_utm_field[key]}#${a_utm_value[key]}`
        }

        if(campaign_id == ''){
            campaign_id = 1;
        }
        let send_data = {
            utm_name_id : utm_name_id,
            utm_name : utm_name,
            campaign_id : campaign_id,
            account_id : localStorage.getItem('user_selected_account_for_utm'),
            creative_id : 0, 
            a_utm_parameter : a_combine_value,
            //a_utm_parameter : a_utm_parameter,
            user_token : localStorage.getItem('user_token')
        };
        //console.log(send_data)
        //console.log(JSON.stringify(send_data));
        axios.post(`${API_PATH}/api/user/utmParameter`,send_data).then((response) => {
            //console.log('Insert'); 
            $('#add_more').remove();
            toast(response.data.msg)
            getUtmData();
            $(".open_main_utm").trigger({ type: "click" });

            // toast(response.data.msg)
            // setTimeout(location.reload(),3000);
        });
    } 
    
    $(".delete_parameter").on("click",function(e){ 
         
        $(`#add_parameter_div_${e.target.id}`).remove(); 

        // delete parameter display
        var utm_parameter_value = [];
        var utm_parameter_count = -1;
        $('.utm_parameter').each(function(k,v){ 
            if($(this).val() !== ''){
                utm_parameter_count++; 
                utm_parameter_value[utm_parameter_count] = $(this).val();
            }
        });
    
        var utm_value = [];
        var value_count = -1;
        $('.utm_value').each(function(k,v){ 
            if($(this).val() !== ''){ 
                value_count++;  
                utm_value[utm_parameter_value[value_count]] = $(this).val();
            }
        });  
        var code_string = '';
        var add_count = 0
        for(let para_key in utm_value){
            add_count++
            if(add_count == 1){
                code_string += `${para_key}=${utm_value[para_key]}`
            }else{
                code_string += `&${para_key}=${utm_value[para_key]}`
            }
        }
        
        $('.sample_parameter_code').val(`?${code_string}`);
    });
    //$('.applyBtn').on('click',function(){ 
    // $('.input_date').on('change',function(){
    //     setPending(true);
    //     let search_date_range = $('.input_date').val(); 
    //     let modify_search_data = search_date_range.split('-');
    //     let start_date = modify_search_data[0].trim().replaceAll("/", "@");
    //     let end_date = modify_search_data[1].trim().replaceAll("/", "@");
    //     search_date_range = `${start_date}_${end_date}`;
    //     if(search_date_range == ''){
    //         getData();
    //     }else{
    //         getData(search_date_range);
    //     } 
    // });
    // $('.date_to').on('change',function(){
    //     let start_date = $('.date_from').val().replaceAll("-", "@"); 
    //     let end_date = $('.date_to').val().replaceAll("-", "@");  
    //     let search_date_range = `${start_date}_${end_date}`;
    //     if(search_date_range == ''){
    //         getData();
    //     }else{
    //         getData(search_date_range);
    //     } 
    // });
    const selectUtm = (e)=>{  
        //buttonTextData('Update');
        //buttonDisableData(false);
        let id = parseInt(e.target.id); 
        $('#utm_name_id').val(id);
        //console.log(`/api/user/utm/${id}`); 
        axios.get(`${API_PATH}/api/user/utm/${id}`).then((response) => { 
            if(response.status == 200){
                var html = '';
                $("#retrieve_parameter").empty();
                $('.parameter_div').remove();
                $('#retrieve_parameter').show(); 
                $('.hide_retrieve_parameter').empty();

                for (var parameter_id in response.data[0].parameter) {
                    let paramter_key = response.data[0].parameter[parameter_id].split(',')[0]
                    let paramter_field = response.data[0].parameter[parameter_id].split(',')[1]
                    let paramter_value = response.data[0].parameter[parameter_id].split(',')[2]
                    html += `<div class="col-md-12 row mt-2 hide_retrieve_parameter" id="edit_parameter_div_${parameter_id}">
                        <div class="col-md-4">
                            <input type="text" name="parameter_name[@${parameter_id}|update@]" class="form-control utm_parameter input_cus" id="parameter_input_1" placeholder="Parameter name" value="${paramter_key}" />
                        </div>
                        <div class="col-md-4">
                            <select class="form-control form-select add_update_field input_cus" id='${parameter_id}' onChange="addUpdateField(event)">
                                <option selected value="">Select Variable</option>
                                <option value="account_name" ${paramter_field=='account_name'?'selected':''}>Account name</option>
                                <option value="account_id" ${paramter_field=='account_id'?'selected':''}>Account ID</option>
                                <option value="campaign_name" ${paramter_field=='campaign_name'?'selected':''}>Campaign name</option>
                                <option value="campaign_id" ${paramter_field=='campaign_id'?'selected':''}>Campaign ID</option>
                                <option value="creative_name" ${paramter_field=='creative_name'?'selected':''}>Creative name</option>
                                <option value="ad_id" ${paramter_field=='ad_id'?'selected':''}>Ad ID</option>
                                <option value="custom" ${paramter_field=='custom'?'selected':''}>Custom</option>
                            </select>
                        </div> 
                        <div class="col-md-4 parameter_value_${parameter_id}">
                            <input type="text" class="form-control utm_value input_cus" value='${paramter_value}' ${paramter_field !== 'custom' ? 'readonly' : ''} />
                        </div>
                        <i class="fal fa-trash-alt delete_added_parameter parameter_delete_custom" id=${parameter_id}></i>
                    </div>`
                    // html += `<div class="col-sm-3 my-1 col-md-12 mt-3 parameter_div" id="edit_parameter_div_${parameter_id}"> 
                    //             <div class="input-group">
                    //                 <div class="input-group-prepend">
                    //                     <div class="input-group-text">utm_</div>
                    //                 </div>
                    //                 <input type="text" class="form-control utm_parameter" placeholder="parameter, value" name="parameter_name[@${parameter_id}|update@]" value="${response.data[0].parameter[parameter_id]}"/>
                    //                 <div class="input-group-append bg-danger">
                    //                     <div class="input-group-text text-white bg-danger delete_added_parameter show-cursor" id='${parameter_id}' >X</div>
                    //                 </div>
                    //             </div>
                    //         </div>`; 
                }
                 
                $("#retrieve_parameter").append(html); 
                $('#utm_id').val(response.data[0].id);   
                $('#utm_name').val(response.data[0].utm_name);
                setValue("utm_name", response.data[0].utm_name)  
                $('#utm_parameter').val(response.data[0].parameter); 
                
                $('.delete_added_parameter').on('click', function(e) { 
                    let is_confirm = confirm('Are you sure you want to delete this parameter?'); 
                    if(is_confirm === true){
                        let id = e.target.id; 
                        axios.delete(`${API_PATH}/api/user/utmParameter/${id}`).then((response) => {
                            if(response.status == 200){ 
                                 
                                $(`#edit_parameter_div_${e.target.id}`).remove(); 
                                toast(response.data.msg)
                                var utm_parameter_value = [];
                                var utm_parameter_count = -1;
                                $('.utm_parameter').each(function(k,v){ 
                                    if($(this).val() !== ''){
                                        utm_parameter_count++; 
                                        utm_parameter_value[utm_parameter_count] = $(this).val();
                                    }
                                });
                            
                                var utm_value = [];
                                var value_count = -1;
                                $('.utm_value').each(function(k,v){ 
                                    if($(this).val() !== ''){ 
                                        value_count++;  
                                        utm_value[utm_parameter_value[value_count]] = $(this).val();
                                    }
                                });  
                                var code_string = '';
                                var add_count = 0
                                for(let para_key in utm_value){
                                    add_count++
                                    if(add_count == 1){
                                        code_string += `${para_key}=${utm_value[para_key]}`
                                    }else{
                                        code_string += `&${para_key}=${utm_value[para_key]}`
                                    }
                                }
                                
                                $('.sample_parameter_code').val(`?${code_string}`);
                            }
                        }).catch((error)=> {  
                            $('#errorText').text('Some technical issue.'); 
                            $('#errorMsg').slideDown(1000);
                        }); 
                    }
                }); 
 
                // display parameter data on key up
                $('.utm_parameter').on('keyup', function(e){  
                    var utm_parameter_value = [];
                    var utm_parameter_count = -1;
                    $('.utm_parameter').each(function(k,v){ 
                        if($(this).val() !== ''){
                            utm_parameter_count++; 
                            utm_parameter_value[utm_parameter_count] = $(this).val();
                        }
                    });
                
                    var utm_value = [];
                    var value_count = -1;
                    $('.utm_value').each(function(k,v){ 
                        if($(this).val() !== ''){ 
                            value_count++;  
                            utm_value[utm_parameter_value[value_count]] = $(this).val();
                        }
                    });  
                    var code_string = '';
                    var add_count = 0
                    for(let para_key in utm_value){
                        add_count++
                        if(add_count == 1){
                            code_string += `${para_key}=${utm_value[para_key]}`
                        }else{
                            code_string += `&${para_key}=${utm_value[para_key]}`
                        }
                    }
                    
                    $('.sample_parameter_code').val(`?${code_string}`);
                });

                // display parameter data on first time
                var utm_parameter_value = [];
                var utm_parameter_count = -1;
                $('.utm_parameter').each(function(k,v){ 
                    if($(this).val() !== ''){
                        utm_parameter_count++; 
                        utm_parameter_value[utm_parameter_count] = $(this).val();
                    }
                });
            
                var utm_value = [];
                var value_count = -1;
                $('.utm_value').each(function(k,v){ 
                    if($(this).val() !== ''){ 
                        value_count++;  
                        utm_value[utm_parameter_value[value_count]] = $(this).val();
                    }
                });  
                var code_string = '';
                var add_count = 0
                for(let para_key in utm_value){
                    add_count++
                    if(add_count == 1){
                        code_string += `${para_key}=${utm_value[para_key]}`
                    }else{
                        code_string += `&${para_key}=${utm_value[para_key]}`
                    }
                }
                
                $('.sample_parameter_code').val(`?${code_string}`);

            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.'); 
            $('#errorMsg').slideDown(1000);
        }); 
    }
    //$('.utm_parameter').on('keyup', function(e){  
    $(document).on('keyup change','.utm_value, .utm_parameter', function(e){  
        var utm_parameter_value = [];
        var utm_parameter_count = -1;
        $('.utm_parameter').each(function(k,v){ 
            if($(this).val() !== ''){
                utm_parameter_count++; 
                utm_parameter_value[utm_parameter_count] = $(this).val();
            }
        });
       //console.log(utm_parameter_value);
        var utm_value = [];
        var value_count = -1;
        $('.utm_value').each(function(k,v){ 
            if($(this).val() !== ''){ 
                value_count++;  
                if(utm_parameter_value[value_count] != undefined){
                    utm_value[utm_parameter_value[value_count]] = $(this).val();
                }
            }
        });  
        var code_string = '';
        var add_count = 0
 
        for(let para_key in utm_value){
            add_count++
            if(add_count == 1){
                code_string += `${para_key}=${utm_value[para_key]}`
            }else{
                code_string += `&${para_key}=${utm_value[para_key]}`
            }
        }
         
        $('.sample_parameter_code').val(`?${code_string}`);
    });
    const deleteUtmName = (e)=>{ 
        let is_confirm = confirm('Are you sure you want to delete this UTM?');
        if(is_confirm){ 
            let id = e.target.id; 
            axios.delete(`${API_PATH}/api/user/utmName/${id}`).then((response) => { 
                if(response.status == 200){
                    $(`#row_${id}`).css("background-color", "#f8d7da").slideUp(500); 
                    toast(response.data.msg)
                }
            }).catch((error)=> {  
                $('#errorText').text('Some technical issue.'); 
                $('#errorMsg').slideDown(1000);
            }); 
        }else{
            return false;
        }
    }
    async function getUtmData(){
        let campaign_id = window.location.href.split('/').pop(); 
        if(campaign_id === 'all'){
            campaign_id = localStorage.getItem('selected_campaign_id')
        } 
        let account_id_for_utm = localStorage.getItem('user_selected_account_for_utm'); 

        await axios.get(`${API_PATH}/api/user/utmParameter/${account_id_for_utm}-${localStorage.getItem('user_token')}`).then((utm_response) => {  
            utmParameterData(utm_response.data); 
        }); 
    }
    async function getData(search_date_range='',filter_data='',is_search_val_exist=''){
        if(search_date_range === ''){
            search_date_range = defaultDateRange;
        }
        if(filter_data === ''){
            filter_data = selectStatus;
        }
        let creative_id = window.location.href.split('/').pop();
        if(creative_id === 'all'){
            creative_id = localStorage.getItem('selected_campaign_id')
        }  
        setUtmCampaign(creative_id);
        console.log(`${API_PATH}/api/linkedin/creative/${creative_id}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`);  
        await axios.get(`${API_PATH}/api/linkedin/creative/${creative_id}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
            //console.log(response.data.elements)
            if(is_search_val_exist !== ''){
                let search_data = is_search_val_exist; 
                const filteredItems = fixCreative.filter(
                    item => item.ads_name && item.ads_name.toLowerCase().includes(search_data.toLowerCase()),
                );
                setRows(filteredItems); 
                fixCreativeData(response.data.elements);
            }else{ 
                // if(response.data.elements == undefined){ 
                if(window.location.pathname == "/user/creative/all"){  
                    setRows([{ads_name: 'Ads record is too high. Please adjust the campaign selection. '}]);
                }else if(response.data.elements == undefined){  
                    setRows([{ads_name: 'Ads record is too high. Please adjust the campaign selection. '}]);
                }else{ 
                    setRows(response.data.elements);
                }
                //setRows(response.data.elements); 
                fixCreativeData(response.data.elements);
            }

            // creativeData(response.data.elements); 
            // fixCreativeData(response.data.elements); 
            
            const timeout = setTimeout(() => { 
                setPending(false);
            }, 1000); 
            return () => clearTimeout(timeout);
             
        });
    }

    window.addUpdateField = function(e){ 
        setIsLoaderDisplay('true'); 
        let variable_div_id = e.target.id; 
        let variable_for = e.target.value; 
 
        if(variable_for == 'account_name'){
            $(`.parameter_value_${variable_div_id}`).empty(); 
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value account_name input_cus" value="" disabled />`
            const timeout = setTimeout(() => { 
                setIsLoaderDisplay(false);
                $(`.parameter_value_${variable_div_id}`).append(html); 
                $('.utm_value').val('{{account_name}}').trigger("change");
            }, 1000);  
            return () => clearTimeout(timeout); 
           
        }
        if(variable_for == 'account_id'){
            $(`.parameter_value_${variable_div_id}`).empty();
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value account_id input_cus" value="" disabled />`
            const timeout = setTimeout(() => { 
                setIsLoaderDisplay(false);
                $(`.parameter_value_${variable_div_id}`).append(html); 
                $('.account_id').val('{{account_id}}').trigger("change");
            }, 1000);  
            return () => clearTimeout(timeout);
 
        }
        if(variable_for == 'campaign_name'){
            $(`.parameter_value_${variable_div_id}`).empty(); 
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value campaign_name input_cus" value="" disabled />`
            const timeout = setTimeout(() => { 
                setIsLoaderDisplay(false);
                $(`.parameter_value_${variable_div_id}`).append(html); 
                $('.campaign_name').val('{{campaign_name}}').trigger("change");
            }, 1000);  
            return () => clearTimeout(timeout);
 
        }
        if(variable_for == 'campaign_id'){
            $(`.parameter_value_${variable_div_id}`).empty();
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value campaign_id input_cus" value="" disabled />`
            const timeout = setTimeout(() => { 
                setIsLoaderDisplay(false);
                $(`.parameter_value_${variable_div_id}`).append(html); 
                $('.campaign_id').val('{{campaign_id}}').trigger("change");
            }, 1000);  
            return () => clearTimeout(timeout);
 
        }
        if(variable_for == 'creative_name'){
            $(`.parameter_value_${variable_div_id}`).empty();
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value creative_name input_cus" value="" disabled />`
            const timeout = setTimeout(() => { 
                setIsLoaderDisplay(false);
                $(`.parameter_value_${variable_div_id}`).append(html); 
                $('.creative_name').val('{{creative_name}}').trigger("change");
            }, 1000);  
            return () => clearTimeout(timeout);
 
        }
        if(variable_for == 'ad_id'){ 
            $(`.parameter_value_${variable_div_id}`).empty();
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value ad_id input_cus" value="" disabled />`
            const timeout = setTimeout(() => { 
                setIsLoaderDisplay(false);
                $(`.parameter_value_${variable_div_id}`).append(html); 
                $('.ad_id').val('{{ad_id}}').trigger("change");
            }, 1000);  
            return () => clearTimeout(timeout);
 
        }
        if(variable_for == 'custom'){
            $(`.parameter_value_${variable_div_id}`).empty();   
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value utm_custom_value input_cus" id="parameter_input_1" placeholder="Parameter value"  />`    
            const timeout = setTimeout(() => { 
                    setIsLoaderDisplay(false);
                    $(`.parameter_value_${variable_div_id}`).append(html);
                }, 1000); 
                return () => clearTimeout(timeout); 
        }
    };

    useEffect(()=>{   
        getData();
        getUtmData();
    },[]); 
    //console.log(creative.length)
    const resetData = ()=>{ 
        //buttonTextData('Add');
        $('#utm_name_id').val('');
        $('#utm_name').val('');
        $('.sample_parameter_code').val('');
        $('.utm_parameter').val('');
        $('.hide_retrieve_parameter').show();
        $('#retrieve_parameter').empty(); 
    }
    const viewUtmReset = ()=>{
        $('.hide_retrieve_parameter').find('input:text').val('');
        $('.add_update_field').val('');
        $('.add_more').empty();
        $('.sample_parameter_code').val('');
    } 
    
    const [basicModal, setBasicModal] = useState(false);
    const [basicModal2, setBasicModal2] = useState(false);
    const toggleShow = () => { 
        setBasicModal(!basicModal);
        setBasicModal2(basicModal);
    }
    const toggleShow2 = () => {
        setBasicModal(basicModal2);
        setBasicModal2(!basicModal2);
    }
    const closeModalOne = () => {
        setBasicModal(false);
    }
    const closeModalTwo = () => {
        setBasicModal2(false);
    }
    function titleCase(str) { 
        if(str != undefined && str != ''){
            return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
        }
    }
    //console.log('rows',rows)
    return (
        <MainCard> 
            <ToastContainer autoClose={2000} />
            <MDBModal className='utm_modal' show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>UTM List</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={closeModalOne}>x</MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody> 
                        {/* <div className="modal-body"> */}
                            <div className="row">
                            <div className="container col-md-12 text-wrap">
                                 <span style={{fontSize:'13px'}}><b>Note :</b> Select to desired custom UTM logic, and click "Apply UTM"<br />
                                    Selected creative : <b>{(utmCreativeName)?utmCreativeName:"Please select at least one campaign"} </b><br />
                                    Total Ads : <b>{totalCreativeAds} </b></span>
                                    <input type="hidden" id='utm_creative_id' value={utmCreative} />
                                </div>
                                <div className="col-md-12">
                                    <div className="para_save_outer pull-right">
                                        <button className="utm_btn selectCampaign" data-bs-toggle="modal" data-bs-target="#utm_modal" onClick={() => {
                                            toggleShow2();
                                            resetData();
                                        }}>Create new UTM logic</button>
                                       <button class="utm_btn" onClick={updateUtmParameter} disabled={ utmParameter.length == 0 ? true : utmCreativeName === '' ? true : false} >Apply UTM</button>  
                                    </div>
                                </div> 
                                <div className="col-md-12 utm_update_loader" style={{display:'none'}}>
                                    <div className='text-center mx-auto' style={{ paddingLeft:'50%'}}>
                                        <ThreeDots color="#00BFFF" height={60} width={60}/>
                                    </div>
                                </div> 
                                <div className="col-md-12">
                                    <div className="table_main_outer">
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                <tr>
                                                    <th scope="col">
                                                    Sr. No.
                                                    </th>
                                                    <th scope="col">UTM Name</th> 
                                                    <th scope="col">Select</th> 
                                                    <th scope="col">Action</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                (utmParameter.length>0)?
                                                utmParameter.map((parameter_data,key)=>{ 
                                                return (
                                                <tr id={`row_${parameter_data.id}`} key={`${parameter_data?.id}`}>
                                                    <td>{key+1}</td>
                                                    <td>
                                                    { parameter_data.utm_name }
                                                    </td>
                                                    <td>
                                                        {/* <input type="radio" name="apply_utm" value={parameter_data.id} defaultChecked />  */}
                                                        <label className="containerradio">
                                                        <input type="radio" name="apply_utm" value={parameter_data.id} defaultChecked />
                                                        <span className="checkmark"></span>
                                                        </label>
                                                    </td>
                                                    <td>
                                                    <div className="list_td">
                                                        <a onClick={(e)=>{
                                                            toggleShow2();
                                                            selectUtm(e);
                                                            }}><i className="fal fa-pen" id={parameter_data.id}></i></a> 
                                                        <a onClick={deleteUtmName}><i className="fal fa-trash-alt" id={parameter_data.id}></i></a>
                                                    </div>
                                                    </td>
                                                </tr> 
                                                ) 
                                                })
                                                :
                                                <tr className="alert alert-alert col-md-12 text-center wating_color">
                                                    <td colSpan="4" className="wating_text">
                                                        No record.
                                                    </td>
                                                </tr>
                                                } 
                                                </tbody>
                                            </table>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        {/* </div> */}
                                 
                    </MDBModalBody>

                    {/* <MDBModalFooter>
                    <MDBBtn color='secondary' onClick={toggleShow}>
                        Close
                    </MDBBtn>
                    <MDBBtn>Save changes</MDBBtn>
                    </MDBModalFooter> */}
                </MDBModalContent>
                </MDBModalDialog>
            </MDBModal> 

            <MDBModal className='utm_modal' show={basicModal2} setShow={setBasicModal2} tabIndex='-1'>
                <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Add/Edit UTM Wizard</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={closeModalTwo}>x</MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                        {/* <div className="modal-body"> */}
                            <form action="" method="POST" onSubmit={handleSubmit(addUtmParameter)} autoComplete="OFF" noValidate>
                                <div className="row" id='parameter_form'> 
                                    <div className="col-md-12">
                                        <input type="text" className="input_cus" placeholder="UTM Logic Name" name="" id="utm_name" {...register('utm_name', { required: true })}/>
                                        {errors.utm_name && <p className="custom-error-messager">UTM name is required.</p>}
                                    </div>  

                                    {isLoaderDisplay? 
                                        <div className="col-md-12 parameter_loader" style={{ paddingLeft:'80%'}}>
                                            <ThreeDots color="#00BFFF" height={40} width={40} /> 
                                        </div> 
                                        :''
                                    }
                                    <div className="col-sm-3 my-1 col-md-12 row hide_retrieve_parameter" id="add_parameter_div_1">
                                        <div className="col-md-4">
                                            <input type="text" name="parameter_name[@0|insert@]" className="form-control utm_parameter input_cus" id="parameter_input_1" placeholder="Parameter name" 
                                            defaultValue="" 
                                            required/> 
                                        </div>
                                        <div className="col-md-4">
                                            <select className="form-control form-select add_update_field input_cus" id="1" name="add_update_field" onChange={addUpdateField} required defaultValue={defaultValue}>
                                                <option value="">Select Variable</option>
                                                <option value="account_name" >Account name</option>
                                                <option value="account_id">Account ID</option>
                                                <option value="campaign_name">Campaign name</option>
                                                <option value="campaign_id">Campaign ID</option>
                                                <option value="creative_name">Creative name</option>
                                                <option value="ad_id">Ad ID</option>
                                                <option value="custom">Custom</option>
                                            </select>
                                        </div>
                                        <div className='col-md-4 parameter_value_1'>  
                                            <input type='hidden' value='' className='utm_value input_cus' />
                                        </div>
                                        <i className="fal fa-trash-alt delete_parameter parameter_delete_custom" id='1'></i>
                                    </div> 
                                    <div id="retrieve_parameter"></div> 
                                    <div id="add_more"></div>

                                    <div className="col-sm-3 mt-3 col-md-12">  
                                        <textarea type="text" name="dasd" className="form-control sample_parameter_code input_cus" placeholder="Sample parameter code" defaultValue={textParameter} disabled/> 
                                    </div>  
                                </div>
                                
                                <div className="row">
                                    <input type="hidden" id="utm_name_id" />
                                    <div className="col-md-12">
                                        <div className="para_save_outer">
                                        <button type="button" className="utm_btn selectcampaign" onClick={addMore}><i className="fal fa-plus"></i>Add Parameter</button>
                                        <button type="submit" className="utm_btn" >Save</button>
                                        <button type="button" className="utm_btn open_main_utm" onClick={toggleShow}>View UTM</button>
                                        </div>
                                    </div>
                                </div> 
                            </form>     
                        {/* </div> */}
                    </MDBModalBody>

                    {/* <MDBModalFooter>
                    <MDBBtn color='secondary' onClick={toggleShow2}>
                        Close
                    </MDBBtn>
                    <MDBBtn>Save changes</MDBBtn>
                    </MDBModalFooter> */}
                </MDBModalContent>
                </MDBModalDialog>
            </MDBModal> 
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={5}>
                    <Tabs
                        value={2}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                        aria-label="simple tabs example"
                        variant="scrollable"
                        sx={{
                            mb: 3,
                            '& a': {
                                minHeight: 'auto',
                                minWidth: 10,
                                py: 1.5,
                                px: 1,
                                mr: 2.25,
                                color: theme.palette.grey[600],
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            '& a.Mui-selected': {
                                color: theme.palette.primary.main
                            },
                            '& .MuiTabs-indicator': {
                                bottom: 2
                            },
                            '& a > svg': {
                                marginBottom: '0px !important',
                                mr: 1.25
                            }
                        }}
                    >
                        {/* {tabsOption.map((tab, index) => (
                             <Tab key={index} component={Link} to="#" icon={tab.icon} label={tab.label} {...a11yProps(index)} />
                        ))} */}

                    {/* <Tab component={Link} to="/user/account" icon={<ManageAccountsIcon sx={{ fontSize: '1.3rem' }} />} label='Account' /> */}
                    <Tab component={Link} to={`/user/campaign-group?account=${selectedRedirectAccount}`} icon={<Diversity2Icon sx={{ fontSize: '1.3rem' }} />} label='Campaign Group' />
                    <Tab component={Link} to={`/user/campaign/${userSelectedCampaign}`}  icon={<CampaignIcon sx={{ fontSize: '1.3rem' }} />} label='Campaign' />
                    <Tab component={Link} to={selectCampaign} icon={<FontDownloadIcon sx={{ fontSize: '1.3rem' }} />} disabled={isDisabled} label='Ads' />
                    {/* <Tab icon={<FontDownloadIcon sx={{ fontSize: '1.3rem' }} />} disabled={isDisabled} label='UTM wizard' onClick={handleOpen} /> */}
                    </Tabs>
                    </Grid> 
                    {window.location.pathname == "/user/creative/all" ? null:
                    <Grid item xs={12} md={3} mt={1}>
                        <div className='wizard_div1'> 
                            <span variant="contained" type="button" className="open_account open_account_wigard" onClick={toggleShow}> 
                                <Button variant="contained">UTM wizard</Button> 
                            </span>    
                        </div>
                    </Grid>
}
                    <Grid item xs={12} md={4}>
                        <div className='wizard_div'>
                            <DateRangePicker initialSettings={{ startDate: previousDate, endDate: currentDate }} onCallback={handleCallback}>
                                <input type="text" className="input_date" />
                            </DateRangePicker>    
                        </div>
                    </Grid>
                    {/* <Grid item xs={12} md={6}>
                        <div className='wizard_div'>
                        <DateRangePicker initialSettings={{ startDate: previousDate, endDate: currentDate }}>
                            <input type="text" className="input_date" />
                        </DateRangePicker>
                        <div className='wizard_div1'> 
                            <span variant="contained" type="button" className="open_account open_account_wigard" onClick={toggleShow}> 
                                <Button variant="contained">UTM wizard</Button> 
                            </span>    
                        </div> 
                        </div>
                    </Grid> */}
                    </Grid>
            
                    {window.location.pathname == "/user/creative/all" ? "No Campaign Selected" :

                  
                    <MainCard content={false}>
                        <CardContent>
                            <Grid container justifyContent="space-between" alignItems="center" spacing={2}> 
                                <Grid item xs={12} md={3}>
                                <select className="custom_select_box filter_status_data" onChange={searchStatus} defaultValue={''}>
                                    <option value="">Select Status</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="ARCHIVED">Archived</option>
                                    <option value="CANCELED">Canceled</option>
                                    {/* <option value="COMPLETED">Completed</option> */}
                                    <option value="DRAFT">Draft</option>
                                    <option value="PAUSED">Paused</option>
                                </select>
                                </Grid>
                                <Grid item xs={12} md={3}>  
                                    {/* <DateRangePicker initialSettings={{ startDate: previousDate, endDate: currentDate }}>
                                        <input type="text" className="input_date" />
                                    </DateRangePicker>  */}
                                    <div className="ads_update_design design_ads" id="ads_update" style={{ display:'none'}}>3 Ads updated</div>
                                </Grid>
                                <Grid item xs={12} md={3} sm={12} sx={{ textAlign: 'right' }}>
                                    <TextField
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon fontSize="small" />
                                                </InputAdornment>
                                            )
                                        }}
                                        onChange={searchName}
                                        placeholder="Search"
                                        value={search}
                                        size="small"
                                    /> 

                                </Grid> 
                            </Grid>
                        </CardContent>
                        { pending == true? 
                            <Grid className="loader_outer">
                                <Grid className="loader_manual">  
                                    <ThreeDots className="three_dot" color="#00BFFF" align="center" height={60} width={60} />
                                </Grid> 
                            </Grid> :'' 
                        }                
                        {/* table */}
                        <TableContainer>
                            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                                <EnhancedTableHead
                                    theme={theme}
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={(rows == undefined)?0:rows.length}
                                    selected={selected}
                                />
                                <TableBody> 
                                    { 
                                    rows != undefined && stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            /** Make sure no display bugs if row isn't an OrderData object */
                                            if (typeof row === 'number') return null;
                                            const isItemSelected = isSelected(`${row.id}_${row.ads_name}`);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            row.cpm = (row.impressions)?parseFloat(((row.costInLocalCurrency/(row.impressions/1000))).toFixed(2))??'-':0;
                                            row.ctr = (row.clicks)?((row.clicks/row.impressions)*100).toFixed(2)+'%'??'-':'0';
                                            row.cpc = (row.costInLocalCurrency)?parseFloat((row.costInLocalCurrency/row.clicks).toFixed(2))??'-':0;
                                            row.cost = (row.externalWebsiteConversions)?parseInt(Math.round(row.costInLocalCurrency/row.externalWebsiteConversions))??'-':'0';
                                            row.costPerLead  =  (row.oneClickLeads)?(row.costInLocalCurrency/row.oneClickLeads).toFixed(2)??'-':0
                                            row.costInLocalCurrency = (row.costInLocalCurrency)?parseInt(Math.round(row.costInLocalCurrency).toLocaleString("en-US")):0??'-'
                                             
                                            console.log('11',typeof row.costInLocalCurrency )
                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={index}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={(event) => handleClick(event, `${row.id}_${row.ads_name}`)}>
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            inputProps={{
                                                                'aria-labelledby': labelId
                                                            }}
                                                        />
                                                    </TableCell> 

                                                    <TableCell className="row_click">{(row.ads_name)?row.ads_name:row.id}</TableCell>
                                                    <TableCell>{titleCase(row.status)}</TableCell>
                                                    <TableCell>${row.costInLocalCurrency}</TableCell>
                                                    <TableCell>{(row.impressions)?row.impressions.toLocaleString("en-US"):'0'}</TableCell>
                                                    <TableCell>{(row.clicks)?row.clicks.toLocaleString("en-US"):''}</TableCell>
                                                    <TableCell>{row.ctr}</TableCell>
                                                    <TableCell>${row.cpm } </TableCell>
                                                    <TableCell>${row.cpc}</TableCell>
                                                    <TableCell>${row.cost.toLocaleString("en-US")}</TableCell>
                                                    <TableCell>{row.oneClickLeads??'-'}</TableCell>
                                                    <TableCell>{row.costPerLead}</TableCell>

                                                    {/* <TableCell className="row_click" onClick={()=>{onRowClicked(row.id)}}>{(row.ads_name)?row.ads_name:row.id}</TableCell>
                                                    <TableCell>{titleCase(row.status)}</TableCell>
                                                    <TableCell>{(row.costInLocalCurrency)?`$`+Math.round(row.costInLocalCurrency).toLocaleString("en-US"):0??'-'}</TableCell>
                                                    <TableCell>{(row.impressions)?row.impressions.toLocaleString("en-US"):0}</TableCell>
                                                    <TableCell>{(row.clicks)?row.clicks.toLocaleString("en-US"):0}</TableCell>
                                                    <TableCell>{(row.clicks)?((row.clicks/row.impressions)*100).toFixed(2)+'%'??'-':0}</TableCell>
                                                    <TableCell>{(row.costInLocalCurrency)?'$'+((row.costInLocalCurrency/(row.impressions/1000))).toFixed(2)??'-':0}</TableCell>
                                                    <TableCell>{(row.costInLocalCurrency)?'$'+(row.costInLocalCurrency/row.clicks).toFixed(2)??'-':0}</TableCell>
                                                    <TableCell>{(row.externalWebsiteConversions)?'$'+Math.round(row.costInLocalCurrency/row.externalWebsiteConversions).toLocaleString("en-US")??'-':0}</TableCell>
                                                    <TableCell>{row.oneClickLeads??'-'}</TableCell>
                                                    <TableCell>{(row.oneClickLeads)?(row.costInLocalCurrency/row.oneClickLeads).toFixed(2)??'-':0}</TableCell> */}
                                                   
                                                </TableRow>
                                            );
                                        })
                                    }
 
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: 53 * emptyRows
                                            }}
                                        >
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        { rows=="undefined"?
                            <Grid className="loader_outer">
                                <Grid className="loader_manual">  
                                    <ThreeDots className="three_dot" color="#00BFFF" align="center" height={60} width={60} />
                                </Grid> 
                            </Grid> :'' 
                        }

                        {/* table pagination */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows?.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </MainCard>
                    }
                {/* </Grid>
            </Grid>  */}
            
        </MainCard>
    );
};

export default Ads;