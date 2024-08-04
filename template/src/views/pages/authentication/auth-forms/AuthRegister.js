import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_PATH } from 'config';
// material-ui
const axios = require('axios');
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useAuth from 'hooks/useAuth';
import useConfig from 'hooks/useConfig';
import useScriptRef from 'hooks/useScriptRef';
import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useForm } from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import { strengthColor, strengthIndicatorNumFunc } from 'utils/password-strength';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseRegister = ({ ...others }) => {
    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm();
    const navigate = useNavigate();
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { borderRadius } = useConfig();
    const [showPassword, setShowPassword] = React.useState(false);
    const [checked, setChecked] = React.useState(true);
    const [userImage,userImageData] = useState('https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659651_960_720.png');

    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState();
    const { firebaseRegister, firebaseGoogleSignIn } = useAuth();

    const googleHandler = async () => {
        try {
            await firebaseGoogleSignIn();
        } catch (err) {
            console.error(err);
        }
    };

    const submitData = (e)=>{  
        const user_email = e.user_email;
        const user_password = e.user_password; 
        const sendData = {
            'user_email' : user_email,
            'user_password' : user_password
        } 
        //console.log(JSON.stringify(sendData)) 
        axios.post(`${API_PATH}/api/login`, sendData).then((response) => { 
            if(response.data.status == 'success'){ 
                localStorage.setItem('user_token', response.data.token); 
                localStorage.setItem('user_name', response.data.user_name); 
                localStorage.setItem('user_linkedin_account_id', response.data.linkedin_id); 
                localStorage.setItem('login_level', response.data.login_level); 
                 
                if(response.data.image){
                    localStorage.setItem('user_image', `${response.data.image}`)
                    userImageData(`${response.data.image}`)
                }
                 
                toast.success(`Welcome ${response.data.user_name}.`); 
                window.location.href = `/${response.data.redirect}`
                //navigate(`/${response.data.redirect}`); 
            }else{
                toast.error(`${response.data.msg}`)
            }
        }).catch( (error)=> { 
            toast.error('Technical issue.');
        });
        $('#loginForm').trigger("reset");
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicatorNumFunc(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    return (
        <>
            <ToastContainer autoClose={2000} />
            <Grid container direction="column" justifyContent="center" spacing={2}>
                {/* <Grid item xs={12}>
                    <AnimateButton>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={googleHandler}
                            size="large"
                            sx={{
                                color: 'grey.700',
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : theme.palette.grey[100]
                            }}
                        >
                            <Box sx={{ display: 'flex', mr: { xs: 1, sm: 2, width: 20 } }}>
                                <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                            </Box>
                            Sign up with Google
                        </Button>
                    </AnimateButton>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                        <Button
                            variant="outlined"
                            sx={{
                                cursor: 'unset',
                                m: 2,
                                py: 0.5,
                                px: 7,
                                borderColor:
                                    theme.palette.mode === 'dark'
                                        ? `${theme.palette.dark.light + 20} !important`
                                        : `${theme.palette.grey[100]} !important`,
                                color: `${theme.palette.grey[900]} !important`,
                                fontWeight: 500,
                                borderRadius: `${borderRadius}px`
                            }}
                            disableRipple
                            disabled
                        >
                            OR
                        </Button>
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                </Grid>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Sign up with Email address</Typography>
                    </Box>
                </Grid> */}
            </Grid>

             
            <form noValidate action="" method="POST" id="loginForm" onSubmit={handleSubmit(submitData)}>
                {/* <Grid container spacing={matchDownSM ? 0 : 2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            margin="normal"
                            name="fname"
                            type="text"
                            defaultValue=""
                            sx={{ ...theme.typography.customInput }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            margin="normal"
                            name="lname"
                            type="text"
                            defaultValue=""
                            sx={{ ...theme.typography.customInput }}
                        />
                    </Grid>
                </Grid> */}
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-email-register"
                        type="email" 
                        name="email"  
                        inputProps={{}}  
                        {...register('user_email', { required: true })}
                    />
                    {errors.user_email && <p className="custom-login-error-messager">Login email is required.</p>}
                </FormControl>

                <FormControl
                    fullWidth 
                    sx={{ ...theme.typography.customInput }}
                >
                    <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password-register"
                        type={showPassword ? 'text' : 'password'} 
                        name="password"
                        label="Password" 
                        onChange={(e) => {
                            handleChange(e);
                            changePassword(e.target.value);
                        }} 
                        {...register('user_password', { required: true })}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    size="large"
                                >
                                    {/* {showPassword ? <Visibility /> : <VisibilityOff />} */}
                                </IconButton>
                            </InputAdornment>
                        }
                        inputProps={{}}
                    />
                    {/* {touched.password && errors.password && (
                        <FormHelperText error id="standard-weight-helper-text-password-register">
                            {errors.password}
                        </FormHelperText>
                    )} */}
                </FormControl>

                {/* {strength !== 0 && (
                    <FormControl fullWidth>
                        <Box sx={{ mb: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Box
                                        style={{ backgroundColor: level?.color }}
                                        sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1" fontSize="0.75rem">
                                        {level?.label}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </FormControl>
                )} */}

                {/* <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={(event) => setChecked(event.target.checked)}
                                    name="checked"
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="subtitle1">
                                    Agree with &nbsp;
                                    <Typography variant="subtitle1" component={Link} to="#">
                                        Terms & Condition.
                                    </Typography>
                                </Typography>
                            }
                        />
                    </Grid>
                </Grid> */}
                {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                )}

                <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                        <Button
                            disableElevation 
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="secondary"
                        >
                            Login
                        </Button>
                    </AnimateButton>
                </Box>
            </form> 
        </>
    );
};

export default FirebaseRegister;
