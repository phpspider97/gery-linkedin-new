import PropTypes from 'prop-types';
//import * as React from 'react';
import React, { useEffect, useState } from 'react';
 
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    CardContent,
    Checkbox,
    Fab,
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
    Typography
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

// project imports
import AddData from './AddData';
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';
import { getProducts } from 'store/slices/customer';

// assets 
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import PrintIcon from '@mui/icons-material/PrintTwoTone';
import FileCopyIcon from '@mui/icons-material/FileCopyTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/AddTwoTone';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const axios = require('axios'); 
import { API_PATH } from 'config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

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
    return stabilizedThis.map((el) => el[0]);
}

// table header options
const headCells = [
    {
        id: 'id',
        numeric: true,
        label: 'S.No',
        align: 'left'
    },
    {
        id: 'staff',
        numeric: false,
        label: 'Staff User',
        align: 'left'
    },
    {
        id: 'role',
        numeric: false,
        label: 'Role',
        align: 'left'
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status',
        align: 'left'
    },
    {
        id: 'action',
        numeric: true,
        label: 'Action',
        align: 'center'
    }
];

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, theme, selected }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
 
    return (
        <TableHead>
            <TableRow>
                {/* <TableCell padding="checkbox" sx={{ pl: 3 }}>
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts'
                        }}
                    />
                </TableCell> */}
                {numSelected > 0 && (
                    <TableCell padding="none" colSpan={7}>
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
                                direction={orderBy === headCell.id ? order : 'desc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell?.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                {/* {numSelected <= 0 && (
                    <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
                        <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
                            Action
                        </Typography>
                    </TableCell>
                )} */}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    theme: PropTypes.object,
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
                {numSelected} Selected
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
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        )}
    </Toolbar>
);

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};
 
const ProductList = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    // show a right sidebar when clicked on new product
    const [open, setOpen] = React.useState(false);
    const handleClickOpenDialog = (id=0) => {
        //buttonTextData('Update');
        //buttonDisableData(false); 
        if(id != 0){  
            axios.get(`${API_PATH}/api/staff/${id}`).then((response) => {  
                if(response.status == 200){    
                    $('#role_id').val(response.data.id);
                    $('#user_role').val(response.data.role); 
                    $('#is_active').val(response.data.is_active);

                    $(`.user_role_permission`).prop('checked', false); 
                    $.each(response.data.permission_data, function(key,val){        
                        $(`#permission_${val.permission_id}`).prop('checked', true);     
                    }); 
                    console.log('response.data',response.data)
                    // for remove validation    
                    //setValue("user_role", response.data.role )
                    //setValue("is_active", response.data.is_active ) 
                    setStaffData(response.data) 
                }
            }).catch((error)=> {  
                $('#errorText').text('Data not get.'); 
                $('#errorMsg').slideDown(1000);
            }); 
        }else{
            setStaffData([]) 
        }
        setOpen(true);
    };
    const handleCloseDialog = () => { 
        fetchData()
        setOpen(false); 
    };

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState('');
    const [staffData, setStaffData] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const { products } = useSelector((state) => state.customer); 
    const [user,userData] = useState(''); 
    const [userPagination,userPaginationData] = useState('');
    const [operation,operationData] = useState('Add');
    const [buttonText,buttonTextData] = useState('Add');
    const [buttonDisable,buttonDisableData] = useState(false);
    const [sidebarDisplay,setSidebarDisplay] = useState('inActive');

    React.useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);
    React.useEffect(() => {
        setRows(products);
    }, [products]);

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || ''); 
        if (newString) {
            const newRows = rows.filter((row) => {
                let matches = true;

                const properties = ['first_name','last_name'];
                let containsQuery = false;

                properties.forEach((property) => {
                    console.log(row)
                    if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });

                if (!containsQuery) {
                    matches = false;
                }
                return matches;
            });
            setRows(newRows);
        } else { 
            setRows(staffData);
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
                const newSelectedId = rows.map((n) => n.role);
                setSelected(newSelectedId);
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

    const deleteRole = (id)=>{  
        let is_confirm = confirm('Are you sure you want to delete this staff user?');
        if(is_confirm){ 
            axios.delete(`${API_PATH}/api/user-role/${id}`).then((response) => { 
                if(response.status == 200){ 
                    //$(`#row_${id}`).css("background-color", "#f8d7da").slideUp(500); 
                    toast.success('User role deleted successfully!!')
                    fetchData()
                }
            }).catch((error)=> {  
                $('#errorText').text('Your credential not correct.'); 
                $('#errorMsg').slideDown(1000);
            }); 
        }
    }

    const fetchData = async () => {  
        const userRes = await axios.get(`${API_PATH}/api/staff`);  
        setRows(userRes.data) 
        setStaffData(userRes.data) 
        // const roleRes = await axios.get(`${API_PATH}/api/user-role`); 
        // staffData(roleRes.data);
    }; 
    useEffect(()=>{ 
        fetchData(); 
        operationData('');
    },[]);   
    return (
        <MainCard title="Staff List" content={false}>
            <ToastContainer autoClose={2000} />
            <CardContent>
                <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                )
                            }}
                            onChange={handleSearch}
                            placeholder="Search Staff"
                            value={search}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                        {/* <Tooltip title="Copy">
                            <IconButton size="large">
                                <FileCopyIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Print">
                            <IconButton size="large">
                                <PrintIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Filter">
                            <IconButton size="large">
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip> */}

                        {/* product add & dialog */}
                        <Tooltip title="Add Staff">
                            <Fab
                                color="primary"
                                size="small" 
                                className="custom_button_neel"
                                onClick={()=>{handleClickOpenDialog(0)}}
                                sx={{ boxShadow: 'none', ml: 1, width: 82, height: 62, minHeight: 52 }}
                            >
                                <AddIcon fontSize="small" /> Add Staff 
                            </Fab>
                        </Tooltip>
                        <AddData open={open} getStaffData={staffData} handleCloseDialog={handleCloseDialog} />
                    </Grid>
                </Grid>
            </CardContent>

            {/* table */}
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                        theme={theme}
                        selected={selected}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                /** Make sure no display bugs if row isn't an OrderData object */
                                if (typeof row === 'number') return null;
                                const isItemSelected = isSelected(row.role);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow>  
                                        <TableCell align="left">{index+1}</TableCell>
                                        <TableCell align="left">{row.first_name} {row.last_name}</TableCell>
                                        <TableCell align="left">{row.role}</TableCell>
                                        <TableCell align="left">{(row.is_active == 1)?'Active':'Inactive'}</TableCell> 
                                        <TableCell align="center" sx={{ pr: 3 }}>
                                            <IconButton size="large" onClick={()=>{handleClickOpenDialog(row.id)}}>
                                                <EditIcon sx={{ fontSize: '1.3rem' }} />
                                            </IconButton>
                                            <IconButton size="large" onClick={()=>{deleteRole(row.id)}} id={row.id}>
                                                <DeleteIcon sx={{ fontSize: '1.3rem' }}  />
                                            </IconButton>
                                        </TableCell>
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
    );
};

export default ProductList;