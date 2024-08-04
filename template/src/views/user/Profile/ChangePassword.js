// material-ui
import { useTheme } from '@mui/material/styles';
import { Alert, AlertTitle, Button, Grid, TextField } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery'; 
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { API_PATH } from 'config';
const axios = require('axios'); 

const ChangePassword = () => {
    const theme = useTheme();
    const { register: register2, formState: { errors: errors2 },  handleSubmit: handleSubmit2,  } = useForm();

    const submitPasswordDataTop = ()=>{   
        const id = localStorage.getItem('user_token');  
        const new_password = $('#new_password').val(); 
        const old_password = $('#old_password').val(); 
        const sendData = { 
            'old_password' : old_password,
            'new_password' : new_password
        }   
        axios.put(`${API_PATH}/api/change-password/${id}`, sendData).then((response) => {  
            if(response.data.status == 'success'){  
                toast.success(`${response.data.msg}`) 
                 //Hide modal
                 $(".model_div").removeClass('show');
                 $(".model_div").addClass('hide');
                 $( ".modal-backdrop" ).remove();
                 $( ".custom_modal" ).hide();
            }else{
                toast.success(`${response.data.msg}`)
            }
 
        }).catch((error)=> {   
            toast.error('Technical issue.')
        }); 
        $('#change_password').trigger("reset");
    }

    return (
        <Grid container spacing={gridSpacing}>
            <ToastContainer autoClose={2000} />
            {/* <Grid item xs={12}>
                <Alert severity="warning" variant="outlined" sx={{ borderColor: 'warning.dark' }}>
                    <AlertTitle>Alert!</AlertTitle>
                    Your Password will expire in every 3 months. So change it periodically.
                    <strong> Do not share your password</strong>
                </Alert>
            </Grid> */}
            <Grid item xs={12}>
                <SubCard title="Change Password">
                    <form action="" method="POST" id="change_password" onSubmit={handleSubmit2(submitPasswordDataTop)} autoComplete="OFF"> 
                        <Grid container spacing={gridSpacing} sx={{ mb: 1.75 }}>
                            <Grid item xs={12} md={12}>
                                <TextField type="password" fullWidth label="Old Password" id="old_password" {...register2('old_password', { required: true })} />
                                {errors2.old_password && <p className="custom-error-messager">Old password is required.</p>}
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField type="password" fullWidth label="New Password" id="new_password" {...register2('new_password', { required: true })}/>
                                {errors2.new_password && <p className="custom-error-messager">New password is required.</p>}
                            </Grid>
                        </Grid>
                        <Grid spacing={2} container justifyContent="flex-end" sx={{ mt: 3 }}>
                            <Grid item>
                                <AnimateButton>
                                    <Button type="submit" variant="contained">Change Password</Button>
                                </AnimateButton>
                            </Grid>
                            {/* <Grid item>
                                <Button sx={{ color: theme.palette.error.main }}>Clear</Button>
                            </Grid> */}
                        </Grid>
                    </form>
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default ChangePassword;
