import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react'; 
import {Link, useNavigate} from 'react-router-dom'; 
import { API_PATH } from 'config';
import $ from 'jquery'; 
import { useLinkedIn } from 'react-linkedin-login-oauth2'; 
const axios = require('axios');
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { gridSpacing } from 'store/constant'; 
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import CampaignIcon from '@mui/icons-material/Campaign';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import { Circles,TailSpin,ThreeDots } from  'react-loader-spinner'

// material-ui
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
    MenuItem
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

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
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    console.log('stabilizedThis.map((el) => el[0])',stabilizedThis.map((el) => el[0]))
    return stabilizedThis.map((el) => el[0]);
}

// tabs option
const tabsOption = [
    {
        label: 'Account',
        icon: <ManageAccountsIcon sx={{ fontSize: '1.3rem' }} />
    },
    {
        label: 'Campaign Group',
        icon: <Diversity2Icon sx={{ fontSize: '1.3rem' }} />
    },
    {
        label: 'Campaign',
        icon: <CampaignIcon sx={{ fontSize: '1.3rem' }} />
    },
    {
        label: 'Ads',
        icon: <FontDownloadIcon sx={{ fontSize: '1.3rem' }} />
    }
];

// table header options
const headCellsOld = [
    {
        id: 'name',
        numeric: false,
        label: 'Customer Name',
        align: 'left'
    },
    {
        id: 'location',
        numeric: true,
        label: 'Location',
        align: 'left'
    },
    {
        id: 'orders',
        numeric: true,
        label: 'Orders',
        align: 'right'
    },
    {
        id: 'date',
        numeric: true,
        label: 'Registered',
        align: 'center'
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status1',
        align: 'center'
    }
];

const headCells = [
    {
       id: "name",
       label: "Account", 
       numeric: false, 
       align: 'left'
    },
    {
      id: "status",
      label: "Status",
      selector: (row) => row.status,
      sortable: true,
      reorder: true
    },
    {
        id: "costInLocalCurrency",
        label: "Spend",
        selector: (row) => (row.costInLocalCurrency)?parseInt(Math.round(row.costInLocalCurrency)):0??'-',
        cell: (row) => (row.costInLocalCurrency)?`$`+Math.round(row.costInLocalCurrency).toLocaleString("en-US"):0??'-',
        sortable: true,
        reorder: true,
         style:{ textAlign: 'left'}
      },
      {
          id: "impressions",
          label: "Impressions",
          selector: (row) => (row.impressions)?row.impressions:0,
          cell: (row) => (row.impressions)?row.impressions.toLocaleString("en-US"):0,
          sortable: true, 
          reorder: true, 
          style:{ textAlign: 'left'}
      },
      {
          id: "clicks",
          label: "Clicks",
          selector: (row) => (row.clicks)?row.clicks:0,
          cell: (row) => (row.clicks)?row.clicks.toLocaleString("en-US"):0,
          sortable: true, 
          reorder: true,
          style:{ textAlign: 'left'}
      },
  
      {
          id: "ctr",
          label: "Average CTR",
          selector: (row) =>  (row.clicks)?((row.clicks/row.impressions)*100).toFixed(2)??'-':0,
          cell: (row) =>  (row.clicks)?((row.clicks/row.impressions)*100).toFixed(2)+'%'??'-':0,
          sortable: true, 
          reorder: true,
          style:{ textAlign: 'left'}
        },
        {
          id: "cpm",
          label: "Average CPM",
          selector: (row) => (row.costInLocalCurrency)?((row.costInLocalCurrency/(row.impressions/1000))).toFixed(2)??'-':0,
          cell: (row) => (row.costInLocalCurrency)?'$'+((row.costInLocalCurrency/(row.impressions/1000))).toFixed(2)??'-':0,
          sortable: true, 
          reorder: true,
          style:{ textAlign: 'left'}
        },
        {
          id: "average",
          label: "Average CPC",
          selector: (row) => (row.costInLocalCurrency)?(row.costInLocalCurrency/row.clicks).toFixed(2)??'-':0,
          cell: (row) => (row.costInLocalCurrency)?'$'+(row.costInLocalCurrency/row.clicks).toFixed(2)??'-':0,
          sortable: true, 
          reorder: true,
          style:{ textAlign: 'left'}
      },
      {
        id: "conversion",
        label: "Conversion Cost",
        selector: (row) => (row.externalWebsiteConversions)?Math.round(row.costInLocalCurrency/row.externalWebsiteConversions)??'-':0,
        cell: (row) => (row.externalWebsiteConversions)?'$'+Math.round(row.costInLocalCurrency/row.externalWebsiteConversions).toLocaleString("en-US")??'-':0,
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
      },
      {
        id: "oneClickLeads",
        label: "Leads",
        selector: (row) => row.oneClickLeads??'-',
        sortable: true, 
        reorder: true,
        style:{ textAlign: 'left'}
      },
      {
        id: "cost",
        label: "Cost Per Lead",
        selector: (row) => (row.oneClickLeads)?(row.costInLocalCurrency/row.oneClickLeads).toFixed(2)??'-':0,
        cell: (row) => (row.oneClickLeads)?'$'+(row.costInLocalCurrency/row.oneClickLeads).toFixed(2)??'-':0,
        sortable: true, 
        reorder: true,
        style:{ textAlign: 'left'}
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
                {numSelected > 0 && (
                    <TableCell padding="none" colSpan={17}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                    </TableCell>
                )}
                {numSelected <= 0 &&
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

// ==============================|| CUSTOMER LIST ||============================== //

const AccountList = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState('');
    const [rows, setRows] = React.useState('undefined'); 
    const [isDisabled, setIsDisabled] = React.useState(true); 
    const { customers } = useSelector((state) => state.customer);
    React.useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);
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
            if(selected.length > 0) {
                setSelected([]); 
            }else{
                const newSelectedId = rows.map((n) => n.id);
                setSelected(newSelectedId);
            }

            const newSelectedId = rows.map((n) => n.id);
            // Update ids
            let selected_campaign_group = newSelectedId.join(',');  
            if(selected_campaign_group != ''){
                selectAccountData(`/user/campaign-group?account=${selected_campaign_group}`);
            } 
            return;
        } 
        setSelected([]);
    };

    const handleClick = (event, name) => { 
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name); 
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        let selected_campaign_group = newSelected.join(',');  
        if(selected_campaign_group != ''){
            selectAccountData(`/user/campaign-group?account=${selected_campaign_group}`);
        } 
        setSelected(newSelected);
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

    // Neel Code
    setTimeout(function () { 
        $('.lnndaO').css("width", "130px"); 
    }, 1000);

    const navigate = useNavigate();
    const [account,accountData] = useState([]); 
    const [fixAccount,fixAccountData] = useState([]); 
    const [selectAccount,selectAccountData] = useState('/user/campaign-group?account=0'); 
    const [selectedRows, setSelectedRows] = React.useState([]); 
    const [pending, setPending] = React.useState(false);

    var today = new Date(); 
    let startDate = moment().subtract(29, 'days').format('MM/DD/YYYY') 
    let today_date = moment().subtract(0, 'days').format('MM/DD/YYYY') 
    const [currentDate, setCurrentDate] = useState((localStorage.getItem('current_date'))?localStorage.getItem('current_date'):today_date);
    const [previousDate, setPreviousDate] = useState((localStorage.getItem('previous_date'))?localStorage.getItem('previous_date'):startDate); 

    let default_start_date = previousDate.trim().replaceAll("/", "@");
    let default_end_date = currentDate.trim().replaceAll("/", "@");
    let search_date_range = `${default_start_date}_${default_end_date}`;
    const [defaultDateRange, setDefaultDateRange] = React.useState(search_date_range);

    const onRowClicked = (account_id, event) => { 
        navigate(`/user/campaign-group?account=${account_id}`); 
    };

    // const handleChange = () => {
    //     var a_selected_account = [];
    //     var count = -1;
    //     $('input[type=checkbox]').each(function(e){
    //         console.log($(this).val());
    //         if(this.checked){ 
    //             count++;
    //             if(count>0){ 
    //                 a_selected_account[count-1] = $(this).val(); 
    //             }
    //         } 
    //     }); 
    //     let selected_account = a_selected_account.join(','); 
    //     selectAccountData(`/user/campaign-group?account=${selected_account}`);
    // };

    const handleRowSelected = React.useCallback(state => { 
        let row_data = state.selectedRows;
        var a_selected_account = [];
        var count = -1;
        row_data.forEach(function(item){
            count++;
            a_selected_account[count] = item.id;
        });
        let selected_account = a_selected_account.join(','); 
        if(selected_account != ''){ 
            selectAccountData(`/user/campaign-group?account=${selected_account}`);
        }
	}, []);

    const searchName = (e) => { 
        let search_data = e.target.value;  
        setSearch(search_data)
        setPending(true);
        const filteredItems = fixAccount.filter(
            item => item.name && item.name.toLowerCase().includes(search_data.toLowerCase()),
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
        let search_date_range = defaultDateRange;
        axios.get(`${API_PATH}/api/linkedin/account/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
            //accountData(response.data.elements);  
            const filteredItems = response.data.elements.filter(
                item => item.status && item.status.toLowerCase().includes(filter_data.toLowerCase()),
            ); 
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
    $('.input_date').on('change',function(){ 
        setPending(true);
        $('.filter_status_data').val('');
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
            getData(search_date_range);
        } 
    });
 
    const getData = async (search_date_range='',filter_data='') => {
        if(search_date_range === ''){
            search_date_range = defaultDateRange;
        } 
        await axios.get(`${API_PATH}/api/linkedin/account/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
            setRows(response.data.elements);
            fixAccountData(response.data.elements);
            
            // Add account id in clickable link
            if(response.data.elements != undefined){
                var a_selected_account = [];
                var count = -1;
                response.data.elements.forEach(function(item){
                    count++;
                    a_selected_account[count] = item.id;
                });
                let selected_account = a_selected_account.join(',');  
                selectAccountData(`/user/campaign-group?account=${selected_account}`);
                setIsDisabled(false)
            }
            const timeout = setTimeout(() => { 
                setPending(false);
            }, 1000); 
            return () => clearTimeout(timeout);

            // if(response.data.length == 0 || response.data.length == undefined){
            //     $('.wating_text').text('No record.');
            //     $('.wating_color').removeClass('alert-success');
            //     $('.wating_color').addClass('alert-danger');
            // }
        });
    } 
    useEffect(()=>{   
        getData(); 

        let current_url = window.location.href;
        let code_state = current_url.split('?')[1];
        $('#login_loader_div').hide();
        if(code_state !== undefined){ 
            let redirect_url = 'http://localhost:3000/user'; 
            //let redirect_url = 'https://www.pipelight.io/user';
            let user_id = localStorage.getItem('user_token'); 
            //console.log(`/api/linkedin/createAccount?${code_state}&redirect_url=${redirect_url}&user_id=${user_id}`);
            $('#login_loader_div').show();
            $('#dashboard_div').hide();
            
            axios.post(`${API_PATH}/api/linkedin/createAccount?${code_state}&redirect_url=${redirect_url}&user_id=${user_id}`).then((response) => { 
                //console.log(response);
                if(response.data.status == 'success'){ 
                    localStorage.setItem('user_token', response.data.token); 
                    localStorage.setItem('user_name', response.data.user_name);
                    localStorage.setItem('user_linkedin_account_id', response.data.linkedin_id);
                    //setCode(""); 
                    toast(`Your account update.`); 
                    window.opener.location.href=`/${response.data.redirect}`;
                    self.close();
                    
                    navigate(`/${response.data.redirect}`);
                }else{
                    toast(`${response.data.msg}`)
                }
            }).catch( (error)=> {   
                toast('Tehnical issue.');
            });
           //setRows(accountRes.data);
        }

    },[]); 

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6}>
                    <Tabs
                        value={0}
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
                        <Tab component={Link} to="#" icon={<ManageAccountsIcon sx={{ fontSize: '1.3rem' }} />} label='Account' disabled />
                        <Tab component={Link} to={selectAccount} icon={<Diversity2Icon sx={{ fontSize: '1.3rem' }} />} label='Campaign Group' disabled={isDisabled} />
                        <Tab component={Link} to="#" icon={<CampaignIcon sx={{ fontSize: '1.3rem' }} />} disabled label='Campaign' />
                        <Tab component={Link} to="#" icon={<FontDownloadIcon sx={{ fontSize: '1.3rem' }} />} disabled label='Ads' />
                        
                    </Tabs>
                    </Grid> 
                    <Grid item xs={12} md={6}>
                        <div className='wizard_div wizard_onlyinput'>
                        <DateRangePicker initialSettings={{ startDate: previousDate, endDate: currentDate }} onCallback={handleCallback}>
                            <input type="text" className="input_date" />
                        </DateRangePicker>  
                        </div>
                    </Grid>
                    </Grid>
                    <MainCard content={false}>
                        <CardContent> 
                            
                            <Grid container justifyContent="space-between" alignItems="center" spacing={2}> 
                                <Grid item xs={12} md={3}>
                                <select className="custom_select_box filter_status_data" onChange={searchStatus} defaultValue={''}>
                                    <option value="">Select Status</option>
                                    <option value="ACTIVE">Active</option>
                                    {/* <option value="ARCHIVED">Archived</option> */}
                                    <option value="CANCELED">Canceled</option>
                                    <option value="DRAFT">Draft</option>
                                    {/* <option value="PAUSED">Paused</option> */}
                                </select>
                                    {/* <TextField
                                        id="outlined-select-currency"
                                        className="different_class"
                                        select
                                        fullWidth
                                        label="Select Status" 
                                        onChange={searchStatus}
                                    > 
                                            <MenuItem key="1" value="ACTIVE">Active</MenuItem> 
                                            <MenuItem key="3" value="CANCELED">Canceled</MenuItem> 
                                            <MenuItem key="3" value="DRAFT">Draft</MenuItem> 
                                    </TextField> */}
                                </Grid>
                                <Grid item xs={12} md={3}>  
                                    {/* <DateRangePicker initialSettings={{ startDate: previousDate, endDate: currentDate }}>
                                        <input type="text" className="input_date" />
                                    </DateRangePicker>  */}
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
                                    rowCount={rows.length}
                                    selected={selected}
                                />
                                <TableBody>
                                    { rows != "undefined" && stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            /** Make sure no display bugs if row isn't an OrderData object */
                                            if (typeof row === 'number') return null;
                                            const isItemSelected = isSelected(row.id);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={index}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={(event) => handleClick(event, row.id)}>
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            inputProps={{
                                                                'aria-labelledby': labelId
                                                            }}
                                                        />
                                                    </TableCell> 
                                                    <TableCell className="row_click" onClick={()=>{onRowClicked(row.id)}}>{row.name}</TableCell>
                                                    <TableCell>{row.status}</TableCell>
                                                    <TableCell align="right">{(row.costInLocalCurrency)?`$`+Math.round(row.costInLocalCurrency).toLocaleString("en-US"):0??'-'}</TableCell>
                                                    <TableCell align="center">{(row.impressions)?row.impressions.toLocaleString("en-US"):0}</TableCell>
                                                    <TableCell align="center">{(row.clicks)?row.clicks.toLocaleString("en-US"):0}</TableCell>
                                                    <TableCell align="center">{(row.clicks)?((row.clicks/row.impressions)*100).toFixed(2)+'%'??'-':0}</TableCell>
                                                    <TableCell align="center">{(row.costInLocalCurrency)?'$'+((row.costInLocalCurrency/(row.impressions/1000))).toFixed(2)??'-':0}</TableCell>
                                                    <TableCell align="center">{(row.costInLocalCurrency)?'$'+(row.costInLocalCurrency/row.clicks).toFixed(2)??'-':0}</TableCell>
                                                    <TableCell align="center">{(row.externalWebsiteConversions)?'$'+Math.round(row.costInLocalCurrency/row.externalWebsiteConversions).toLocaleString("en-US")??'-':0}</TableCell>
                                                    <TableCell align="center">{row.oneClickLeads??'-'}</TableCell>
                                                    <TableCell align="center">{(row.oneClickLeads)?(row.costInLocalCurrency/row.oneClickLeads).toFixed(2)??'-':0}</TableCell>
                                                    {/* <TableCell align="center">
                                                        {row.status === 1 && <Chip label="Complete" size="small" chipcolor="success" />}
                                                        {row.status === 2 && <Chip label="Processing" size="small" chipcolor="orange" />}
                                                        {row.status === 3 && <Chip label="Confirm" size="small" chipcolor="primary" />}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ pr: 3 }}>
                                                        <IconButton color="primary" size="large">
                                                            <VisibilityTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                        </IconButton>
                                                        <IconButton color="secondary" size="large">
                                                            <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                        </IconButton>
                                                    </TableCell> */}
                                                </TableRow>
                                            );
                                        })}
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
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </MainCard>
                {/* </Grid>
            </Grid> */}
        </MainCard>
    );
};

export default AccountList;