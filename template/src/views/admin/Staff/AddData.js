import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Button,
    CardMedia,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Slide,
    TextField,
    Typography,
    Checkbox
} from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

import Product1 from 'assets/images/widget/prod1.jpg';
import Product2 from 'assets/images/widget/prod2.jpg';
import Product3 from 'assets/images/widget/prod3.jpg';
import Product4 from 'assets/images/widget/prod4.jpg';

import {useNavigate} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery'; 
import { useForm } from 'react-hook-form';
import { API_PATH } from 'config';
const axios = require('axios'); 

// styles
const ImageWrapper = styled('div')(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '4px',
    cursor: 'pointer',
    width: 55,
    height: 55,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.background.default,
    '& > svg': {
        verticalAlign: 'sub',
        marginRight: 6
    }
}));

// product category options
const roleStatus = [
    {
        value: 1,
        label: 'Active'
    },
    {
        value: 0,
        label: 'Inactive'
    }
];

// animation
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    },
    chip: {
        margin: 2
    }
};

function getStyles(name, personName, theme) {
    return {
        fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
    };
}
 
const AddData = ({ open, handleCloseDialog, getStaffData }) => {
     
    const theme = useTheme();
    // handle category change dropdown
    const [roleStatusValue, setRoleStatusValue] = useState(0);
    const [roleValue, setRoleValue] = useState(0);
    const [permissionValue, setPermissionValue] = useState([]);
    const handleSelectChange = (status_val) => {  
        setRoleStatusValue(status_val);
    };
    const handleRoleSelectChange = (status_val) => {  
        setRoleValue(status_val);
    };
    // set image upload progress
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(() => {});
    useEffect(() => {
        progressRef.current = () => {
            if (progress > 100) {
                setProgress(0);
            } else {
                const diff = Math.random() * 10;
                setProgress(progress + diff);
            }
        };
    });

    const fetchRoleData = async () => {  
        const roleRes = await axios.get(`${API_PATH}/api/user-role`); 
        roleData(roleRes.data);
    }; 

    useEffect(() => {
        fetchRoleData(); 
        const timer = setInterval(() => {
            progressRef.current();
        }, 500);

        return () => {
            clearInterval(timer);
        };  

    }, []);

    // handle tag select
    const [personName, setPersonName] = useState([]);
    const handleTagSelectChange = (event) => {
        setPersonName(event?.target.value);
    };

    // Neel code
    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm();

    const navigate = useNavigate();
    
    const [role,roleData] = useState('');
    const [rolePermission,rolePermissionData] = useState([
        {id:1, permission:'Display'},
        {id:2, permission:'Create'},
        {id:3, permission:'Edit'},
        {id:4, permission:'Delete'},
    ]);
    const [rolePagination,rolePaginationData] = useState('');  
    const [user_role,user_roleData] = useState('asdadad'); 
    const [checked,setChecked] = useState(undefined);

    const [user,userData] = useState(''); 
    const [userPagination,userPaginationData] = useState('');
    const [operation,operationData] = useState('Add');
    const [buttonText,buttonTextData] = useState('Add');
    const [buttonDisable,buttonDisableData] = useState(false);
    const [sidebarDisplay,setSidebarDisplay] = useState('inActive');

  
    const openSidebar = ()=>{
        if(sidebarDisplay === 'inActive'){
            setSidebarDisplay('active');
        }else{
            setSidebarDisplay('inActive');
        } 
    }

    // if(getStaffData.id != 'undefined'){
    //     console.log('111')
    //     setValue("user_password", '         ') 
    // } 
    const submitData = (e)=>{ 
        const id = $('#user_id').val(); 
        const first_name = $('#first_name').val(); 
        const last_name = $('#last_name').val(); 
        const user_email = $('#user_email').val(); 
        const user_password = $('#user_password').val(); 
        //const user_role_data = $('#user_role').val(); 
        const role_id = e.user_role;
        const is_active = e.user_status;   
        // console.log('role_id',user_role_data)
        // if(role_id == 0){
        //     toast('User role is required.')
        //     return
        // }
        const sendData = {
            'first_name' : first_name,
            'last_name' : last_name,
            'user_email' : user_email,
            'user_password' : user_password,
            'role_id' : role_id,
            'is_active' : is_active, 
            'user_token' : localStorage.getItem('user_token')
        }  
        //console.log('sendData',sendData) 
        if(id){ 
            axios.put(`${API_PATH}/api/staff/${id}`, sendData).then((response) => { 
                if(response.status == 200){  
                    toast(`${response.data.msg}`)  
                    //Hide modal
                    handleCloseDialog();
                    $("[data-bs-dismiss=modal]").trigger({ type: "click" });
                }
            }).catch((error)=> {  
                toast('Technical issue.')
            }); 
        }else{
            axios.post(`${API_PATH}/api/staff`, sendData).then((response) => { 
                if(response.status == 200){  
                    toast(`${response.data.msg}`) 
                    handleCloseDialog();
                    //Hide modal
                    $("[data-bs-dismiss=modal]").trigger({ type: "click" });
                }
            }).catch((error)=> {  
                toast('Technical issue.')  
            }); 
        }
        operationData('Update');
        $('#user_form').trigger("reset");
    }
    
    const searchData = (e) => {
        var search_data = e.currentTarget.value?e.currentTarget.value:0;  
        async function getData(){
            const roleRes =  await axios.get(`${API_PATH}/api/user-role/search/${search_data}`);
            roleData(roleRes.data); 
            
            if(roleRes.data.length == 0){
                $('.wating_text').text('No record.');
                $('.wating_color').removeClass('alert-success');
                $('.wating_color').addClass('alert-danger');
            }
        }
        getData(); 
    };
 
    const resetData = ()=>{
        buttonTextData('Add');
        $('#role_id').val('');
        $('#user_role_form').trigger("reset");
    } 
    const changeValue = (e)=>{
        //alert(e.target.checked)
        $(`#permission_3`).prop('checked', true);   
        //setChecked(e.target.checked)
    }

    React.useEffect(() => {   
        $('#user_id').val(getStaffData.id); 
        setValue("first_name", getStaffData.first_name)  
        setValue("last_name", getStaffData.last_name)  
        setValue("user_email", getStaffData.user_email)  
        setValue("user_role", getStaffData.role_id)  
        setValue("user_status", getStaffData.is_active)  

        if(getStaffData.user_password == undefined){
            setValue("user_password", '')
        }else{
            setValue("user_password", '         ') 
        }
         
        //setRoleStatusValue(getStaffData.is_active) 
        //setRoleValue(getStaffData.role_id)  
    }, [getStaffData]); 

      
    const handleSelectedExperts = e => { 
        let clonedExpertArr = [...permissionValue];
        if(e.target.checked === true) {
          clonedExpertArr.push(+e.target.value);
          setPermissionValue(clonedExpertArr);
        }else{
          let filtered = permissionValue.filter(expert => {
            return expert !== +e.target.value;
          });
    
          clonedExpertArr = filtered;
          setPermissionValue(clonedExpertArr);
        }
    }; 
   // console.log('roleValue',roleValue)
    return (
        <>
        <ToastContainer autoClose={2000} />
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            sx={{
                '&>div:nth-of-type(3)': {
                    justifyContent: 'flex-end',
                    '&>div': {
                        m: 0,
                        borderRadius: '0px',
                        maxWidth: 550,
                        maxHeight: '100%'
                    }
                }
            }}
        >
            {open && (
                <>
                    <DialogTitle>Add Staff</DialogTitle>
                    <form action="" method="POST" id="user_role_form" onSubmit={handleSubmit(submitData)} autoComplete="OFF">
                    <DialogContent style={{height:'610px'}}>
                        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="First Name*" defaultValue=" " id="first_name" {...register('first_name', { required: true })}/>
                                {errors.first_name && <p className="custom-error-messager">First name is required.</p>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Last Name*" defaultValue=" " id="last_name" {...register('last_name', { required: true })}/>
                                {errors.last_name && <p className="custom-error-messager">Last name is required.</p>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email*" defaultValue=" " id="user_email" {...register('user_email', { required: true })}/>
                                {errors.user_email && <p className="custom-error-messager">Email is required.</p>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField type="password" fullWidth label="Password*" defaultValue="" id="user_password" {...register('user_password', { required: 'Password is required.', minLength: {
                                    value: 8,
                                    message: "Password must have at least 8 characters"
                                } })}/>
                                {errors.user_password && <p className="custom-error-messager">{errors.user_password.message}</p>}
                            </Grid> 
                            {/*  <Grid item xs={12}>
                               <TextField
                                    // id="standard-select-roleStatusValue"
                                    select
                                    label="Select Role*"
                                    value={(roleValue == undefined)?'':roleValue}
                                    //defaultValue={(roleStatusValue != undefined)?roleStatusValue:' '}
                                    fullWidth 
                                    id="user_role" 
                                    {...register('user_role', { required: true })}
                                    // inputProps={register('user_role', {
                                    //     required: true,
                                    //   })}  
                                >
                                    <MenuItem key='11111' value='0'>
                                            Select Role {roleValue}
                                    </MenuItem> 
                                    {
                                        (role.length)?
                                        role.map( (data,key)=>{ 
                                        return (
                                        <MenuItem onClick={e => { handleRoleSelectChange(data.id) } }  key={data.id} value={data.id}>
                                            {data.role}
                                        </MenuItem>
                                        )}):''
                                        // <MenuItem key='121' value='0'>
                                        //     No role added
                                        // </MenuItem> 
                                    }
                                </TextField>
                                {errors.user_role && <p className="custom-error-messager">User role is required.</p>} 
                            </Grid>*/}

                            <Grid item xs={12}>
                                    <select className="input_cus form-control" id="user_role" {...register('user_role', { required: true })}>
                                        <option value="">Select Role</option>
                                        {
                                        (role.length)?
                                        role.map( (data,key)=>{ 
                                        return (
                                            <option value={ data.id } key={key}>{ data.role }</option>
                                        )}):
                                            <option value="0">No role added</option>
                                        }
                                    </select>
                                    {errors.user_role && <p className="custom-error-messager">User role is required.</p>}

                                {/* <TextField 
                                    select
                                    label="Select Status*"
                                    value={(roleStatusValue !== undefined)?roleStatusValue:0} 
                                    fullWidth 
                                    id="user_status" 
                                    {...register('user_status', { required: true })}
                                >
                                    <MenuItem key='11111' value="0">
                                        Select Status
                                    </MenuItem> 
                                    {roleStatus.map((option) => (
                                        <MenuItem onClick={e => { handleSelectChange(option.value) } }  key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                { errors.is_active && <p className="custom-error-messager">Status is required.</p>} */}
                            </Grid> 
                            <Grid item xs={12}>
                                <select className="input_cus" id="user_status" {...register('user_status', { required: true })}>
                                    <option value="">Select Status</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                                {errors.user_status && <p className="custom-error-messager">User status is required.</p>}
                            </Grid> 
                        </Grid>
                        <br/><br/> 
                        <DialogActions>
                            <AnimateButton>
                                <Button type="submit" variant="contained">Add Staff</Button>
                                <input type="hidden" id="user_id" /> 
                            </AnimateButton>
                            <Button variant="text" color="error" className="close_dialog" onClick={handleCloseDialog}>
                                Close
                            </Button>
                        </DialogActions>
                    </DialogContent>
                    </form>
                </>
            )}
        </Dialog>
        </>
    );
};

AddData.propTypes = {
    open: PropTypes.bool,
    handleCloseDialog: PropTypes.func,
    getStaffData : PropTypes.array
};

export default AddData;