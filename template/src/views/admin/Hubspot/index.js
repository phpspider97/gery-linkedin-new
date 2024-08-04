import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react'; 
import {Link, useNavigate} from 'react-router-dom'; 
import { useParams } from 'react-router-dom';
import { API_PATH } from 'config';
import $ from 'jquery';  
import { gridSpacing } from 'store/constant'; 
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css'; 
import { Circles,TailSpin,ThreeDots } from  'react-loader-spinner';
const axios = require('axios');
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/ArrowDownward";

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
    Button
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
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
// project imports 
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import { getCustomers } from 'store/slices/customer';

// assets 
import SearchIcon from '@mui/icons-material/Search'; 
 
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
    console.log('stabilizedThis__',stabilizedThis)
    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const columns = [
    {
        id: 1,
        name: "Linkedin spend",
        selector: (row) => row.linkedin_spend??'0',
        sortable: true,
        reorder: true
    },
    {
        id: 2,
        name: "Linkedin impression",
        selector: (row) => row.linkedin_impression??'0',
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
    },
    {
        id: 3,
        name: "Linkedin click",
        selector: (row) => row.linkedin_click??'0',
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
    },
    {
        id: 4,
        name: "Total Linkedin spend",
        selector: (row) => row.total_linkedin_spend??'0',
        sortable: true,
        reorder: true
    },
    {
        id: 5,
        name: "Total Linkedin impression",
        selector: (row) => row.total_linkedin_impression??'0',
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
    },
    {
        id: 6,
        name: "Total Linkedin click",
        selector: (row) => row.total_linkedin_click??'0',
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
    },
    {
      id: 7,
      name: "Created At",
      selector: (row) => new Date(row.created_at).toUTCString()??'-',
      sortable: true,
      reorder: true,
      style:{ textAlign: 'left', width:'600px'}
    }
];

const headCells = [
    {
        id: "linkedinaccount",
        label: "Linkedin Account",
    },
    {
        id: "linkedinaccountid",
        label: "Linkedin Account ID"
    },
    {
        id: "hubspotaccount",
        label: "Hubspot Account"
    },
    {
        id: "hubspotaccountid",
        label: "Hubspot Account ID"
    },
    {
        id: "action",
        label: "Action"
    },
     
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
                    {/* <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts'
                        }}
                    /> */}
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

const UserHubspotData = () => { 
    const { userID } = useParams(); 
    const theme = useTheme();
    const dispatch = useDispatch();

    const [value, setValue] = useState(0);
     
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState('');
    const [rows, setRows] = React.useState('undefined'); 
    const [fullParameterUpdate,fullParameterUpdateData] = useState([{
        utm_name : 'loading..'
    }]);
    const [basicModal, setBasicModal] = useState(false);
    React.useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);

    setTimeout(function () { 
        //$('.css-a8rsnn-MuiButtonBase-root-MuiTableSortLabel-root').css("width", "130px"); 
    }, 1000);
     

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
    let startDate = moment().subtract(7, 'days').format('MM/DD/YYYY') 
    let today_date = moment().subtract(0, 'days').format('MM/DD/YYYY') 
    const [currentDate, setCurrentDate] = useState((localStorage.getItem('current_date'))?localStorage.getItem('current_date'):today_date);
    const [previousDate, setPreviousDate] = useState((localStorage.getItem('previous_date'))?localStorage.getItem('previous_date'):startDate);  

    let default_start_date = previousDate.trim().replaceAll("/", "@");
    let default_end_date = currentDate.trim().replaceAll("/", "@");
    let search_date_range = `${default_start_date}_${default_end_date}`;
    const [defaultDateRange, setDefaultDateRange] = React.useState(search_date_range);
  
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
      
    function handleCallback(start, end, label) { 
        setTimeout(() => {
            let search_date_range = $('.input_date').val();  
            let modify_search_data = search_date_range.split('-'); 
            setPreviousDate(modify_search_data[0]) 
            setCurrentDate(modify_search_data[1]) 
            localStorage.setItem('current_date',modify_search_data[1])
            localStorage.setItem('previous_date',modify_search_data[0]) 
        }, 1000);
    };
 
    const getData = async (search_date_range='',is_search_val_exist='') => { 
        if(search_date_range === ''){
            search_date_range = defaultDateRange;
        }   
        await axios.get(`${API_PATH}/api/hubspot/isUserLinkWithHub/${userID}`).then((response) => { 
            setRows(response.data.data)
        });
    }  
    useEffect(()=>{   
        getData();
    },[]);  
    const closeModalOne = () => {
        setBasicModal(false);
    } 
    const manualSync = async (accountData) => {  
        const data = {
            data:accountData,
            selected_date:`${previousDate.trim()}_${currentDate.trim()}`
        }
        await axios.post(`${API_PATH}/api/hubspot/manualLinkedinSyncHubspot`,data).then((response) => {
            if(response.status == 200){  
                toast.success(response.data) 
            }
        });
    }
    const hubspotAnalytics = (id)=>{   
        setBasicModal(true)  
        axios.get(`${API_PATH}/api/hubspot/isUserLinkWithHubCronData/${id}`).then((response) => { 
            console.log('response__',response.data)    
            fullParameterUpdateData(response.data.data);
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        });  
    }
    return (
        <MainCard>  
            <ToastContainer autoClose={2000} />
            <MainCard content={false}>
                <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center" spacing={2}> 
                        
                        <Grid item xs={12} md={6}> 
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
                        <Grid item xs={12} md={6} sm={12} sx={{ textAlign: 'right' }}> 
                            <div className='wizard_div wizard_onlyinput'>
                                <DateRangePicker initialSettings={{ startDate: previousDate, endDate: currentDate }} onCallback={handleCallback}>
                                    <input type="text" className="input_date" />
                                </DateRangePicker>  
                            </div>   
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
                                    if (typeof row === 'number') return null;
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    //row.linkedin_account_name;
                                        
                                    return (
                                        <TableRow
                                            hover
                                            //role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={index}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={(event) => handleClick(event, row.id)}>
                                                {/* <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId
                                                    }}
                                                /> */}
                                            </TableCell>  
                                            <TableCell>{row.linkedin_account_name}</TableCell>
                                            <TableCell>{row.linkedin_accont_id}</TableCell>
                                            <TableCell>{row.hubspot_account_name}</TableCell>
                                            <TableCell>{row.hubspot_accont_id}</TableCell>
                                            <TableCell>
                                                <Button variant="outlined" onClick={()=>manualSync(row)}>
                                                    Manual Synch
                                                </Button>
                                                <IconButton size="large" id={row.id} sx={{marginLeft:'10px'}} onClick={()=>{hubspotAnalytics(row.user_id)}}> 
                                                    <i className="fas fa-analytics text-success" style={{ fontSize: '1.3rem' }}></i> 
                                                </IconButton> 
                                            </TableCell>
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

            <MDBModal className='utm_modal' show={basicModal} setShow={setBasicModal} tabIndex='-1'>
            <MDBModalDialog>
            <MDBModalContent>
            <MDBModalHeader>
            <MDBModalTitle>User sync detail list</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={closeModalOne}>x</MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>  
            <div className="row"> 
                <div className="col-md-12 mt-1"> 
                    <div className="table-responsive"> 
                        <DataTable
                            title="Sync detail"
                            columns={columns}
                            data={fullParameterUpdate}
                            defaultSortFieldId={1}
                            //sortIcon={<SortIcon />}
                            pagination 
                            progressPending={pending}
                            progressComponent={<ThreeDots color="#00BFFF" height={60} width={60} />}
                        /> 
                    </div>
                </div>
            </div>  
        </MDBModalBody> 
        </MDBModalContent>
        </MDBModalDialog>
        </MDBModal> 

        </MainCard>
    );
};

export default UserHubspotData;