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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
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
        value: ' ',
        label: 'Select status'
    },
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
 
const AddData = ({ open, handleCloseDialog, getRoleData }) => {
 
    const theme = useTheme();
    // handle category change dropdown
    const [roleStatusValue, setRoleStatusValue] = useState(0);
    const [permissionValue, setPermissionValue] = useState([]);
    const handleSelectChange = (status_val) => {  
        setRoleStatusValue(status_val);
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

    useEffect(() => {
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
    const [operation,operationData] = useState('Add');
    const [buttonText,buttonTextData] = useState('Add');
    const [buttonDisable,buttonDisableData] = useState(false);
    const [user_role,user_roleData] = useState('asdadad');
    const [sidebarDisplay,setSidebarDisplay] = useState('inActive');
    const [checked,setChecked] = useState(undefined);
  
    const openSidebar = ()=>{
        if(sidebarDisplay === 'inActive'){
            setSidebarDisplay('active');
        }else{
            setSidebarDisplay('inActive');
        } 
    }

    const submitData = (e)=>{ 
        const id = $('#role_id').val(); 
        const user_role = $('#user_role').val(); 
        const is_active = e.is_active;  

        var user_role_permission = $('input[type=checkbox]:checked').map(function(_, el) {
            return $(el).val();
        }).get();  
        const sendData = {
            'user_role' : user_role,
            'user_role_permission' : user_role_permission,
            'is_active' : is_active,
            'user_token' : localStorage.getItem('user_token')
        }      
           
        if(id){
            axios.put(`${API_PATH}/api/user-role/${id}`, sendData).then((response) => { 
                if(response.status == 200){   
                    toast.success(response.data.msg); 
                    //Hide modal
                    handleCloseDialog(); 
                    //$("[data-bs-dismiss=modal]").trigger({ type: "click" });
                }
            }).catch((error)=> {  
                toast.error('Technical issue.')
            }); 
        }else{
            axios.post(`${API_PATH}/api/user-role`, sendData).then((response) => { 
                if(response.status == 200){
                    //navigate(`/admin/role`);
                    toast.success(response.data.msg); 
                    
                    //Hide modal 
                    handleCloseDialog();
                    $("[data-bs-dismiss=modal]").trigger({ type: "click" });
                }
            }).catch((error)=> {   
                toast.error('Technical issue.')  
            }); 
        }
        operationData('Update');
        $('#user_role_form').trigger("reset");
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
        setValue("user_role", getRoleData.role)  
        setRoleStatusValue(getRoleData.is_active) 
        $('#role_id').val(getRoleData.id);
        var a_permission_id = [] 
        getRoleData.permission_data?.map((p_id,p_k)=>{ 
            a_permission_id.push(p_id.permission_id)
        }) 
        $.each(getRoleData.permission_data, function(key,val){       
            $(`#permission_${val.permission_id}`).prop('checked', true);     
        }); 
        setPermissionValue(a_permission_id)  
    }, [getRoleData]); 

      
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
                    <DialogTitle>Add Role</DialogTitle>
                    <form action="" method="POST" id="user_role_form" onSubmit={handleSubmit(submitData)} autoComplete="OFF">
                    <DialogContent style={{height:'610px'}}>
                        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Add Role*" defaultValue="" id="user_role" {...register('user_role', { required: true })}/>
                                {errors.user_role && <p className="custom-error-messager">Add role is required.</p>}
                            </Grid>
                            {/* <Grid item xs={12}>
                                <TextField
                                    id="outlined-basic2"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Enter Product Name"
                                    defaultValue="Fundamentally redesigned and engineered The Apple Watch display yet."
                                />
                            </Grid> */}
                            <Grid item xs={12}>
                                <TextField
                                    // id="standard-select-roleStatusValue"
                                    select
                                    label="Select Status*"
                                    value={(roleStatusValue !== undefined)?roleStatusValue:0}
                                    //defaultValue={(roleStatusValue != undefined)?roleStatusValue:' '}
                                    fullWidth 
                                    {...register('is_active', { required: true })}
                                >
                                    {roleStatus.map((option) => (
                                        <MenuItem onClick={e => { handleSelectChange(option.value) } }  key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                { errors.is_active && <p className="custom-error-messager">Role status is required.</p>}
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                            {/* <Typography variant="subtitle1" align="left">
                                                Add Permission*
                                            </Typography> */}
                                            <Grid container spacing={gridSpacing}>
                                                        <Grid item xs={12} md={12}>
                                                            <SubCard title="Add Permission">
                                                                <Grid container spacing={1}>
                                                            {
                                                            (rolePermission.length)?
                                                            rolePermission.map( (permissionData,key)=>{  
                                                               var is_checked = (permissionValue?.includes(permissionData.id))?true:false   
                                                            return ( 
                                                                <Grid item>
                                                                    <Checkbox 
                                                                    checked={is_checked}
                                                                    //defaultChecked={is_checked}
                                                                    //onClick={(e)=> changeValue(e)}
                                                                    onChange={handleSelectedExperts}
                                                                    color="primary" id={`permission_${permissionData.id}`} value={ permissionData.id }
                                                                    name="user_role_permission[]" className="user_role_permission"/>
                                                                             
                                                                    <label className="form-check-label" htmlFor={`permission_${permissionData.id}`} >{ permissionData.permission }</label>
                                                                </Grid> 
                                                            )}):''
                                                        }
                                                    </Grid>
                                                </SubCard>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" align="left">
                                            Product Images*
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div>
                                            <TextField type="file" id="file-upload" fullWidth label="Enter SKU" sx={{ display: 'none' }} />
                                            <InputLabel
                                                htmlFor="file-upload"
                                                sx={{
                                                    background: theme.palette.background.default,
                                                    py: 3.75,
                                                    px: 0,
                                                    textAlign: 'center',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    mb: 3,
                                                    '& > svg': {
                                                        verticalAlign: 'sub',
                                                        mr: 0.5
                                                    }
                                                }}
                                            >
                                                <CloudUploadIcon /> Drop file here to upload
                                            </InputLabel>
                                        </div>
                                        <Grid container spacing={1}>
                                            <Grid item>
                                                <ImageWrapper>
                                                    <CardMedia component="img" image={Product1} title="Product" />
                                                </ImageWrapper>
                                            </Grid>
                                            <Grid item>
                                                <ImageWrapper>
                                                    <CardMedia component="img" image={Product2} title="Product" />
                                                </ImageWrapper>
                                            </Grid>
                                            <Grid item>
                                                <ImageWrapper>
                                                    <CardMedia component="img" image={Product3} title="Product" />
                                                </ImageWrapper>
                                            </Grid>
                                            <Grid item>
                                                <ImageWrapper>
                                                    <CardMedia component="img" image={Product4} title="Product" />
                                                    <CircularProgress
                                                        variant="determinate"
                                                        value={progress}
                                                        color="secondary"
                                                        sx={{
                                                            position: 'absolute',
                                                            left: '0',
                                                            top: '0',
                                                            background: 'rgba(255, 255, 255, .8)',
                                                            width: '100% !important',
                                                            height: '100% !important',
                                                            p: 1.5
                                                        }}
                                                    />
                                                </ImageWrapper>
                                            </Grid>
                                            <Grid item>
                                                <ImageWrapper>
                                                    <Fab color="secondary" size="small">
                                                        <CloseIcon />
                                                    </Fab>
                                                </ImageWrapper>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" align="left">
                                            Tags
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div>
                                            <Select
                                                id="demo-multiple-chip"
                                                multiple
                                                fullWidth
                                                value={personName}
                                                onChange={handleTagSelectChange}
                                                input={<Input id="select-multiple-chip" />}
                                                renderValue={(selected) => (
                                                    <div>
                                                        {typeof selected !== 'string' &&
                                                            selected.map((value) => <Chip key={value} label={value} />)}
                                                    </div>
                                                )}
                                                MenuProps={MenuProps}
                                            >
                                                {tagNames.map((name) => (
                                                    <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid> */}
                        </Grid>
                        <br/><br/><br/>        
                        <DialogActions>
                            <AnimateButton>
                                <Button type="submit" variant="contained">Add Role</Button>
                                <input type="hidden" id="role_id" /> 
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
    getRoleData : PropTypes.array
};

export default AddData;