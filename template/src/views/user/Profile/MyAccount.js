import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Divider, FormControlLabel, Grid, IconButton, MenuItem, Switch, TextField, Typography } from '@mui/material';
 
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant'; 
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery'; 
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { API_PATH } from 'config';
const axios = require('axios');

const deviceStateSX = {
    display: 'inline-flex',
    alignItems: 'center',
    '& >svg': {
        width: 12,
        height: 12,
        mr: 0.5
    }
};

const MyAccount = () => {
    const theme = useTheme();

    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm(); 
    const { register: register2, formState: { errors: errors2 },  handleSubmit: handleSubmit2,  } = useForm();
    
    const [userName,userNameData] = useState(localStorage.getItem('user_name'));
    const [userImage,userImageData] = useState((localStorage.getItem('user_image') != '' && localStorage.getItem('user_image') != null )?localStorage.getItem('user_image'):'https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659651_960_720.png');
    const [image,imageData] = useState("");
    const [adsAccount,adsAccountData] = useState("");
    const [parameterUpdate,parameterUpdateData] = useState('');
    const [fullParameterUpdate,fullParameterUpdateData] = useState([{
        utm_name : 'loading..'
    }]);
    const [pending, setPending] = React.useState(true);
    const [unreadUpdate, unreadUpdateData] = useState('0');

    const [currency, setCurrency] = useState('Washington');
    const handleChange1 = (event) => {
        setCurrency(event.target.value);
    };

    const handleChange = (file) => { 
        var fname = file[0].name;
        var re = /(\.jpg|\.jpeg|\.png)$/i;
        if (!re.exec(fname)) {
            alert("File extension not supported. You must use .png, .jpeg or .jpg");
            $('.profile_image').val('');
        }else{
            imageData(file[0])
        } 
    } 

    const submitProfileData = ()=>{ 
        const id = localStorage.getItem('user_token'); 
        const first_name_top = $('#first_name_top').val(); 
        const last_name_top = $('#last_name_top').val(); 
        const user_email_top = $('#user_email_top').val(); 

        const sendData = {
            'id':id,
            'first_name' : first_name_top,
            'last_name' : last_name_top,
            'user_email' : user_email_top
        }   
        const joinData = new FormData();
        joinData.append("image", image);
        joinData.append("id", id);
        joinData.append("first_name", first_name_top);
        joinData.append("last_name", last_name_top);
        joinData.append("user_email", user_email_top);

        axios.post(`${API_PATH}/api/change-profile`, joinData).then((response) => {
            if(response.status == 200){  
                toast.success(`${response.data.msg}`) 

                //Set user name  - state change
                localStorage.setItem('user_name', `${first_name_top} ${last_name_top}`)
                userNameData(`${first_name_top} ${last_name_top}`) 

                if(response.data.image){
                    localStorage.setItem('user_image', `${response.data.image}`)
                    userImageData(`${response.data.image}`)
                }

                //Hide modal
                $(".model_div").removeClass('show');
                $(".model_div").addClass('hide');
                $( ".modal-backdrop" ).remove();
                $( ".custom_modal" ).hide();
            }

        }).catch((error)=> {   
            toast.error('Technical issue.')
        });  
    }

    const selectUser = ()=>{ 
        let id = localStorage.getItem('user_token');   
        axios.get(`${API_PATH}/api/login-user-data/${id}`).then((response) => { 
            if(response.status == 200){  
                console.log('response',response)
                $('#first_name_top').val(response.data.first_name); 
                $('#last_name_top').val(response.data.last_name_); 
                $('#user_email_top').val(response.data.user_email); 
                
                // for remove validation    
                setValue("first_name_top", response.data.first_name )
                setValue("last_name_top", response.data.last_name )
                setValue("user_email_top", response.data.user_email )
            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        });
    }; 

    useEffect(()=>{  
        selectUser();
    },[]); 

    const [experience, setExperience] = useState('Startup');
    const handleChange2 = (event) => {
        setExperience(event.target.value);
    };

    const [state1, setState1] = useState({
        checkedB: false
    });
    const [state2, setState2] = useState({
        checkedB: false
    });
    const [state3, setState3] = useState({
        checkedB: true
    });
    const handleSwitchChange1 = (event) => {
        setState1({ ...state1, [event.target.name]: event.target.checked });
    };
    const handleSwitchChange2 = (event) => {
        setState2({ ...state2, [event.target.name]: event.target.checked });
    };
    const handleSwitchChange3 = (event) => {
        setState3({ ...state3, [event.target.name]: event.target.checked });
    }; 
    return (
        <Grid container spacing={gridSpacing}>
            <ToastContainer autoClose={2000} />
            <Grid item xs={12}>
                <SubCard title="General Settings">
                    <form action="" method="POST" noValidate autoComplete="off" onSubmit={handleSubmit(submitProfileData)} encType="multipart/form-data">
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    //id="outlined-basic5"
                                    fullWidth
                                    label="First Name" 
                                    defaultValue=" "
                                    id="first_name_top" {...register('first_name_top', { required: true })}
                                />
                                {errors.first_name_top && <p className="custom-error-messager">First name is required.</p>}
                            </Grid> 
                            <Grid item xs={12} md={6}>
                                <TextField
                                    //id="outlined-basic5"
                                    fullWidth
                                    label="Last Name" 
                                    defaultValue=" "
                                    id="last_name_top" {...register('last_name_top', { required: true })}
                                />
                                {errors.last_name_top && <p className="custom-error-messager">Last name is required.</p>}
                            </Grid> 
                            <Grid item xs={12} md={12}>
                                <TextField
                                    //id="outlined-basic5"
                                    fullWidth
                                    label="Email" 
                                    defaultValue=" "
                                    id="user_email_top" {...register('user_email_top', { required: true })}
                                />
                                {errors.user_email_top && <p className="custom-error-messager">Email is required.</p>}
                            </Grid>  
                            <Grid item xs={12} md={12}>
                                <span><b>Profile Picture</b></span><br /><br />
                                <input type="file" className="input_cus" name="image" id="image" onChange={(e)=>handleChange(e.target.files)} accept="image/*"/> <br /><br />
                                {  userImage && <img src={userImage} style={{ height:'80px',width:'80px'}}/> }
                            </Grid> 
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{ mt: 2 }} />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 3 }}>
                            <Grid spacing={2} container justifyContent="flex-end">
                                <Grid item>
                                    <AnimateButton>
                                        <Button type="submit" variant="contained">Update Profile</Button>
                                    </AnimateButton>
                                </Grid>
                                {/* <Grid item>
                                    <Button sx={{ color: theme.palette.error.main }}>Clear</Button>
                                </Grid> */}
                            </Grid>
                        </Grid>
                    </form>
                </SubCard>
            </Grid> 
        </Grid>
    );
};

export default MyAccount;
