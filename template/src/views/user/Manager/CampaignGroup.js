import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react'; 
import {Link, useNavigate} from 'react-router-dom'; 
import { API_PATH } from 'config';
import $ from 'jquery'; 
import { useLinkedIn } from 'react-linkedin-login-oauth2'; 
import { gridSpacing } from 'store/constant'; 
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import CampaignIcon from '@mui/icons-material/Campaign';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import { Circles,TailSpin,ThreeDots } from  'react-loader-spinner';
const axios = require('axios');
import moment from 'moment';

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
    Tab
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
    //console.log('comparator',comparator)
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
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

// ==============================|| CUSTOMER LIST ||============================== //

const UserCampaignGroup = () => {
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
    const { customers } = useSelector((state) => state.customer);
    React.useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);

    setTimeout(function () { 
        $('.css-a8rsnn-MuiButtonBase-root-MuiTableSortLabel-root').css("width", "130px"); 
    }, 1000);
    
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
                const newSelectedId = rows.map((n) => n.id);
                setSelected(newSelectedId);
            }
            const newSelectedId = rows.map((n) => n.id);
            // Update ids
            let selected_campaign_group = newSelectedId.join(',');  
            if(selected_campaign_group != ''){
                selectCampaignGroupData(`/user/campaign/${selected_campaign_group}`);
            } 
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        } 
        let selected_campaign_group = newSelected.join(',');  
        if(selected_campaign_group != ''){
            selectCampaignGroupData(`/user/campaign/${selected_campaign_group}`);
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

    const navigate = useNavigate();
    const [campaignGroup,campaignGroupData] = useState([{
        name : 'loading..'
    }]);
    const [fixCampaignGroup,fixCampaignGroupData] = useState([{}]);
    const [selectCampaignGroup,selectCampaignGroupData] = useState('/user/campaign-group');
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [pending, setPending] = React.useState(false);
    const [filter, setFilter] = useState('');  

    var today = new Date(); 
    let startDate = moment().subtract(29, 'days').format('MM/DD/YYYY') 
    let today_date = moment().subtract(0, 'days').format('MM/DD/YYYY') 
    const [currentDate, setCurrentDate] = useState((localStorage.getItem('current_date'))?localStorage.getItem('current_date'):today_date);
    const [previousDate, setPreviousDate] = useState((localStorage.getItem('previous_date'))?localStorage.getItem('previous_date'):startDate);  

    let default_start_date = previousDate.trim().replaceAll("/", "@");
    let default_end_date = currentDate.trim().replaceAll("/", "@");
    let search_date_range = `${default_start_date}_${default_end_date}`;
    const [defaultDateRange, setDefaultDateRange] = React.useState(search_date_range);

    const onRowClicked = (cg_id, event) => { 
        navigate(`/user/campaign/${cg_id}`); 
    };

    // $("#check_all").on("click",function(){ 
    //     $('input:checkbox').not(this).prop('checked', this.checked);
    //     if(!this.checked){
    //         selectCampaignGroupData(`/user`);
    //     }else{ 
    //         var a_selected_account = [];
    //         var count = -1;
    //         $('input[type=checkbox]').each(function(){
    //             if(this.checked){ 
    //                 count++; 
    //                 if(count>0){  
    //                     a_selected_account[count-1] = $(this).val();
    //                 } 
    //             }
    //         });  
    //         let selected_account = a_selected_account.join(','); 
    //         selectCampaignGroupData(`/user/campaign/${selected_account}`);
    //     }
    // });

    const handleRowSelected = React.useCallback(state => { 
        let row_data = state.selectedRows;
        var a_selected_campaign_group = [];
        var count = -1;
        row_data.forEach(function(item){
            count++;
            a_selected_campaign_group[count] = item.id;
        });
        let selected_campaign_group = a_selected_campaign_group.join(',');  
        if(selected_campaign_group != ''){
            selectCampaignGroupData(`/user/campaign/${selected_campaign_group}`);
        }
	}, []);
    
    const searchName = (e) => {
        let search_data = e.target.value; 
        setSearch(search_data)
        setPending(true);
        const filteredItems = fixCampaignGroup.filter(
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
        //let campaign_group_id = window.location.href.split('=').pop(); 
        let campaign_group_id = localStorage.getItem('select_account');
        //console.log(`${API_PATH}/api/linkedin/campaignGroup/${campaign_group_id}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`)
        axios.get(`${API_PATH}/api/linkedin/campaignGroup/${campaign_group_id}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
            console.log('__response__',response.data)
            //campaignGroupData(response.data.elements);  
            const filteredItems = response.data.elements.filter(
                item => item.status && item.status.toLowerCase().includes(filter_data.toLowerCase()),
            ); 
            if(filter_data !=  ''){
                fixCampaignGroupData(filteredItems);
                setRows(filteredItems); 
            }else{
                fixCampaignGroupData(response.data.elements);
                setRows(response.data.elements);
            }  
            const timeout = setTimeout(() => { 
                setPending(false);
            }, 1000); 
            return () => clearTimeout(timeout); 
        });
    }; 
     
    //$('.input_date').on('change',function(){  
    function handleCallback(start, end, label) { 
        let is_search_val_exist = $('.search_name').val()
        setPending(true);  
        $('.filter_status_data').val('');
        let search_date_range = $('.input_date').val(); 
        //console.log(search_date_range);
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
            getData(search_date_range,is_search_val_exist);
        } 
    };
 
    const getData = async (search_date_range='',is_search_val_exist='') => {
        //localStorage.setItem('select_account',509030941)
        if(search_date_range === ''){
            search_date_range = defaultDateRange;
        }
        let filter_data = filter; 
        //let campaign_group_id = window.location.href.split('=').pop(); 
        let campaign_group_id = localStorage.getItem('select_account'); 
        localStorage.setItem('user_selected_account_for_utm',campaign_group_id);  
  
        await axios.get(`${API_PATH}/api/linkedin/campaignGroup/${campaign_group_id}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
            //console.log(response.data.elements)

            if(is_search_val_exist !== ''){
                let search_data = is_search_val_exist; 
                const filteredItems = fixCampaignGroup.filter(
                    item => item.name && item.name.toLowerCase().includes(search_data.toLowerCase()),
                );
                setRows(filteredItems); 
                fixCampaignGroupData(response.data.elements);
            }else{
                setRows(response.data.elements); 
                fixCampaignGroupData(response.data.elements);
                $('.filter_status_data').val('');
            }
 
            // Add campaign group id in clickable link
            var a_campaign_group_account = [];
            var count = -1;
            response.data.elements.forEach(function(item){
                count++;
                a_campaign_group_account[count] = item.id;
            });
            let selected_campaign_group = a_campaign_group_account.join(','); 
            selectCampaignGroupData(`/user/campaign/${selected_campaign_group}`);

            const timeout = setTimeout(() => { 
                setPending(false);
            }, 1000);
            return () => clearTimeout(timeout);
        });
    }  
    useEffect(()=>{   
        getData();
    },[]);  

    function titleCase(str) {
        if(str != undefined && str != ''){
            return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
        }
    }
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

                    {/* <Tab component={Link} to="/user/account" icon={<ManageAccountsIcon sx={{ fontSize: '1.3rem' }} />} label='Account' /> */}
                    <Tab component={Link} to="#" disabled icon={<Diversity2Icon sx={{ fontSize: '1.3rem' }} />} label='Campaign Group' />
                    <Tab component={Link} to={selectCampaignGroup} icon={<CampaignIcon sx={{ fontSize: '1.3rem' }} />} label='Campaign' />
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
                                    { 
                                    rows != "undefined" && stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            /** Make sure no display bugs if row isn't an OrderData object */
                                            if (typeof row === 'number') return null;
                                            const isItemSelected = isSelected(row.id);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            
                                            row.cpm = (row.impressions)?parseFloat(((row.costInLocalCurrency/(row.impressions/1000))).toFixed(2))??'-':0;
                                            row.ctr = (row.clicks)?((row.clicks/row.impressions)*100).toFixed(2)+'%'??'-':0;
                                            row.cpc = (row.costInLocalCurrency)?parseFloat((row.costInLocalCurrency/row.clicks).toFixed(2))??'-':0;
                                            row.cost = (row.externalWebsiteConversions)?parseInt(Math.round(row.costInLocalCurrency/row.externalWebsiteConversions))??'-':'0';
                                            row.costPerLead  =  (row.oneClickLeads)?(row.costInLocalCurrency/row.oneClickLeads).toFixed(2)??'-':0
                                               
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
                                                    <TableCell>{titleCase(row.status)}</TableCell>
                                                    <TableCell>${(row.costInLocalCurrency)?Math.round(row.costInLocalCurrency).toLocaleString("en-US"):0??'-'}</TableCell>
                                                    <TableCell>{(row.impressions)?row.impressions.toLocaleString("en-US"):'0'}</TableCell>
                                                    <TableCell>{(row.clicks)?row.clicks.toLocaleString("en-US"):0}</TableCell>
                                                    <TableCell>{row.ctr}</TableCell>
                                                    <TableCell>${row.cpm } </TableCell>
                                                    <TableCell>${row.cpc}</TableCell>
                                                    <TableCell>${row.cost.toLocaleString("en-US")}</TableCell>
                                                    <TableCell>{row.oneClickLeads??'-'}</TableCell>
                                                    <TableCell>{row.costPerLead}</TableCell>
                                                   
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

export default UserCampaignGroup;