import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import $ from 'jquery'; 
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import { API_PATH } from 'config';
const axios = require('axios');

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

// import {toast} from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// toast.configure()

// material-ui
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
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
 
// project imports
import useConfig from 'hooks/useConfig';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton'; 

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Google from 'assets/images/icons/icons8-linkedin-circled.svg';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ loginProp, ...others }) => { 
    const query = useQuery();
    const getSrcValue = query.get('src');

    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { borderRadius } = useConfig();
    const [checked, setChecked] = React.useState(true); 
   
    const { firebaseEmailPasswordSignIn, firebaseGoogleSignIn } = useAuth();
    const googleHandler = async () => {
        try {
            await firebaseGoogleSignIn();
        } catch (err) {
            console.error(err);
        }
    };
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // ============================|| MY CODE @NEEl.B ||============================ //
    const navigate = useNavigate();

    const [admin,AdminData] = useState('');
    const [account,accountData] = useState('');
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userImage,userImageData] = useState('https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659651_960_720.png');


    const { linkedInLogin } = useLinkedIn({
        //clientId: '866zhrf4r68gyo',
        clientId: "783v0rokori887",
        //redirectUri: `http://localhost:7069/login`,
        // redirectUri: `http://linkedin-api2.itechnolabs.tech:7069/login`,
        redirectUri: `http://localhost:3000/login`,
        //redirectUri: `https://www.pipelight.io/login`,
        onSuccess: (code) => {  
          setCode(code);
          setErrorMessage('');
        },  
        scope: 'r_emailaddress r_liteprofile r_ads_reporting rw_ads r_ads w_organization_social r_organization_social w_member_social r_basicprofile r_organization_admin rw_organization_admin r_1st_connections_size',
        onError: (error) => { 
          setCode('');
          setErrorMessage(error.errorMessage);
        },
    }); 

    useEffect(()=>{  
        let current_url = window.location.href;
        let code_state = current_url.split('?')[1];

        let isCodeExist = query.get('code');

        $('#login_loader_div').hide();
        if(code_state !== undefined && isCodeExist !== null){ 
            //setCode("");
            //console.log(`/api/linkedin/createAccount?${code_state}`);
            $('#login_loader_div').show(); 
            $('#login_div').hide();  
            axios.post(`${API_PATH}/api/linkedin/createAccount?${code_state}`).then((response) => { 
                
                if(response.data.status == 'success'){ 
                    localStorage.setItem('user_token', response.data.token); 
                    localStorage.setItem('user_name', response.data.user_name);
                    localStorage.setItem('user_linkedin_account_id', response.data.linkedin_id);
                    setCode(""); 
                    //toast(`Welcome ${response.data.user_name}.`); 
                    if(localStorage.getItem('visabili') == 'true'){ 
                        window.opener.location.href=`/user/hubspot`
                        self.close()
                        navigate(`/user/hubspot`)
                        return
                    }
                    window.opener.location.href=`/${response.data.redirect}`;
                    self.close(); 
                    navigate(`/${response.data.redirect}`);
                }else{
                    alert(`${response.data.msg}`)
                }
            }).catch( (error)=> {  
                alert('Tehnical issue.'+error.message);
            });
           // accountData(accountRes.data);
        }
    },[]);

    useEffect(()=>{  
        if(getSrcValue == 'visabili'){
            localStorage.setItem('visabili',true)
        }
    },[getSrcValue])
    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}> 
                <Grid item xs={4} className="button_cols">
                    <AnimateButton>
                        <Button
                            disableElevation
                            width="100px"
                            onClick={linkedInLogin}
                            size="large"
                            className="signinBtnss"
                            variant="outlined"  
                            sx={{
                                color: '#2b2929',
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100] ,
                                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : '#a686de',
                                ml: '100px' 
                                
                            }}
                        >
                            <Box sx={{ display: 'flex', mr: { xs: 1, sm: 2, width: 20 } }}>
                                <img src={Google} alt="google" width={26} height={26} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                            </Box>
                            Sign in with LinkedIn
                        </Button>
                    </AnimateButton>
                </Grid>
                {/* <Grid item xs={12}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex'
                        }}
                    >
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
                </Grid> */}
                {/* <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Sign in with Email address</Typography>
                    </Box>
                </Grid> */}
            </Grid>

            { <Formik
                initialValues={{
                    email: 'info@codedthemes.com',
                    password: '123456',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try { 
                        const user_email = values.email;
                        const user_password = values.password; 
                        const sendData = {
                            'user_email' : user_email,
                            'user_password' : user_password
                        }  
                        axios.post(`${API_PATH}/api/login`, sendData).then((response) => { 
                            //console.log(response);
                            if(response.data.status == 'success'){ 
                                localStorage.setItem('user_token', response.data.token); 
                                localStorage.setItem('user_name', response.data.user_name); 
                                localStorage.setItem('user_linkedin_account_id', response.data.linkedin_id); 
                                localStorage.setItem('login_level', response.data.login_level); 
                                if(response.data.image){
                                    localStorage.setItem('user_image', `${response.data.image}`)
                                    userImageData(`${response.data.image}`)
                                }
                                alert(`Welcome ${response.data.user_name}.`);
                                navigate(`/${response.data.redirect}`);
                            }else{
                                alert(`${response.data.msg}`)
                            }
                        }).catch( (error)=> { 
                            alert('Technical issue.');
                        });
                        $('#loginForm').trigger("reset");
                        return    
                        await firebaseEmailPasswordSignIn(values.email, values.password).then(
                            () => {
                                // WARNING: do not set any formik state here as formik might be already destroyed here. You may get following error by doing so.
                                // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
                                // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
                                // github issue: https://github.com/formium/formik/issues/2430
                            },
                            (err) => {
                                if (scriptedRef.current) {
                                    setStatus({ success: false });
                                    setErrors({ submit: err.message });
                                    setSubmitting(false);
                                }
                            }
                        );
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        {/* <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address / Username"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl> */}

                        {/* <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl> */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            /> */}
                            {/* <Typography
                                variant="subtitle1"
                                component={Link}
                                to={
                                    loginProp
                                        ? `/pages/forgot-password/forgot-password${loginProp}`
                                        : '/pages/forgot-password/forgot-password3'
                                }
                                color="secondary"
                                sx={{ textDecoration: 'none' }}
                            >
                                Forgot Password?
                            </Typography> */}
                        </Stack>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        {/* <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Sign in
                                </Button>
                            </AnimateButton>
                        </Box> */}
                    </form>
                )}
            </Formik> }
        </>
    );
};

FirebaseLogin.propTypes = {
    loginProp: PropTypes.number
};

export default FirebaseLogin;
