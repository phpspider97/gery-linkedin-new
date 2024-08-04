import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, useLocation} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
import $ from 'jquery'; 
import { useForm } from 'react-hook-form'; 

function Registration() {
    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm();
    const navigate = useNavigate();

    const [admin,AdminData] = useState('');
    const [account,accountData] = useState('');
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const submitData = (e)=>{  
        const first_name = $('#first_name').val();
        const last_name = $('#last_name').val();
        const user_email = $('#user_email').val();
        const user_password = $('#user_password').val(); 
        const sendData = {
            'first_name' : first_name,
            'last_name' : last_name,
            'user_email' : user_email,
            'user_password' : user_password
        } 
        //console.log(JSON.stringify(sendData)) 
        axios.post(`/api/register`, sendData).then((response) => { 
            if(response.data.status == 'success'){ 
                localStorage.setItem('user_token', response.data.token); 
                localStorage.setItem('user_name', response.data.user_name); 
                localStorage.setItem('user_linkedin_account_id', '');
                toast(`Welcome ${response.data.user_name}.`);
                navigate(`/${response.data.redirect}`);
            }else{
                toast(`${response.data.msg}`)
            }
        }).catch( (error)=> { 
            toast('Your given credential not correct.');
        });
        $('#registerForm').trigger("reset");
    }
 
   //console.log(account);
    return (
        <div>
            <section className="login_outer">
                <div className="container">
                    <div className="row">
                        
                        <div className="col-md-12"> 
                            <div className="login_inner">
                               
                                <div className="login_title">Registration</div>
                                <form action="" method="POST" id="registerForm" onSubmit={handleSubmit(submitData)} autoComplete="OFF">
                                    <div className="alert alert-danger alert-dismissible fade show mt-5" id="errorMsg" style={{display:'none',fontSize:'17px'}}> 
                                        <span id="errorText"></span>
                                        {/* <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button> */}
                                    </div>
                                    <div className="col-md-12 text-wrap mb-4">
                                        <span style={{fontSize:'13px'}}><b>&nbsp;&nbsp;&nbsp;&nbsp;Note :</b> Email must be same as use in LinkedIn account.</span>
                                    </div>
                                    
                                    <div className="login_inputs">
                                        <input className="custom_input col-md-6" type="text" placeholder="First name" name="" id="first_name" />
                                        
                                        <input className="custom_input" type="text" placeholder="Last name" name="" id="last_name" />

                                        <input className="custom_input" type="email" placeholder="johndoe@mail.com" name="" id="user_email" {...register('user_email', { required: true })}/>
                                        {errors.user_email && <p className="custom-login-error-messager">Login email is required.</p>}
                                        {/* <input className="custom_input" type="password" placeholder="**********" name="" id="user_password" {...register('user_password', { required: true })}/> */}
                                        <input className="custom_input" type="password" placeholder="**********" name="" id="user_password" {...register('user_password', { required: 'Password is required.', minLength: {
                                                value: 8,
                                                message: "Password must have at least 8 characters"
                                            } })}/> 
                                        {errors.user_password && <p className="custom-error-messager">{errors.user_password.message}</p>}
                                              
                                        <button className="login_btn">Register</button>

                                        <Link to='/' className="login_btn mt-5">Login</Link>
  
                                    </div>
                                </form> 
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
export default Registration;