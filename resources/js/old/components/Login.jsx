import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, useLocation} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
import $ from 'jquery'; 
import { useForm } from 'react-hook-form';
import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png"; 
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Circles } from  'react-loader-spinner'

 

function Login() {

    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm();
    const navigate = useNavigate();

    const [admin,AdminData] = useState('');
    const [account,accountData] = useState('');
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userImage,userImageData] = useState('https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659651_960_720.png');


    const submitData = (e)=>{  
        const user_email = $('#user_email').val();
        const user_password = $('#user_password').val(); 
        const sendData = {
            'user_email' : user_email,
            'user_password' : user_password
        } 
        //console.log(JSON.stringify(sendData)) 
        axios.post(`/api/login`, sendData).then((response) => { 
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
                toast(`Welcome ${response.data.user_name}.`);
                navigate(`/${response.data.redirect}`);
            }else{
                toast(`${response.data.msg}`)
            }
        }).catch( (error)=> { 
            toast('Technical issue.');
        });
        $('#loginForm').trigger("reset");
    }
    
    const { linkedInLogin } = useLinkedIn({
        clientId: "783v0rokori887",
        //clientId: "783v0rokori887",
        //redirectUri: `http://localhost:3000`,
        redirectUri: `https://www.pipelight.io`,
        onSuccess: (code) => {  
          setCode(code);
          setErrorMessage("");
        },  
        scope: "r_emailaddress r_liteprofile r_ads_reporting rw_ads r_ads w_organization_social r_organization_social w_member_social r_basicprofile r_organization_admin rw_organization_admin r_1st_connections_size",
        onError: (error) => { 
          setCode("");
          setErrorMessage(error.errorMessage);
        },
    }); 

    useEffect(()=>{  
        let current_url = window.location.href;
        let code_state = current_url.split('?')[1];
        $('#login_loader_div').hide();
        if(code_state !== undefined){
            //setCode("");
            //console.log(`/api/linkedin/createAccount?${code_state}`);
            $('#login_loader_div').show(); 
            $('#login_div').hide(); 
            axios.post(`/api/linkedin/createAccount?${code_state}`).then((response) => { 
                //console.log(response);
                if(response.data.status == 'success'){ 
                    localStorage.setItem('user_token', response.data.token); 
                    localStorage.setItem('user_name', response.data.user_name);
                    localStorage.setItem('user_linkedin_account_id', response.data.linkedin_id);
                    setCode(""); 
                    toast(`Welcome ${response.data.user_name}.`); 
                    window.opener.location.href=`/${response.data.redirect}`;
                    self.close();
                    
                    navigate(`/${response.data.redirect}`);
                }else{
                    toast(`${response.data.msg}`)
                }
            }).catch( (error)=> {  
                toast('Tehnical issue.');
            });
           // accountData(accountRes.data);
        }
    },[]);
  
    return ( 
        <>
        <div className='text-center mt-5 mx-auto' id='login_loader_div' style={{ paddingLeft:'40%',paddingTop:'25%'}}>
            <Circles height="100" width="100" color='grey' align="center" ariaLabel='loading' />
        </div>
        <div id="login_div">
            <section className="login_outer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="login_inner">
                                <div className="login_title">Login</div>
                                <form action="" method="POST" id="loginForm" onSubmit={handleSubmit(submitData)}>
                                    <div className="alert alert-danger alert-dismissible fade show mt-5" id="errorMsg" style={{display:'none',fontSize:'17px'}}> 
                                        <span id="errorText"></span>
                                        {/* <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button> */}
                                    </div>
                                    <div className="login_inputs">
                                       
                                        <input className="custom_input" type="email" placeholder="johndoe@mail.com" name="" id="user_email" {...register('user_email', { required: true })}/>
                                        {errors.user_email && <p className="custom-login-error-messager">Login email is required.</p>}
                                        <input className="custom_input" type="password" placeholder="**********" name="" id="user_password" {...register('user_password', { required: true })}/>
                                        {errors.user_password && <p className="custom-login-error-messager">Login password is required.</p>}
                                         
                                        <button className="login_btn">Login</button>
                                        
                                    </div>
                                </form> 
                                <button className="login_btn mt-2" onClick={linkedInLogin}>
                                    Login with <i class="fab fa-linkedin-in bg-dark p-2 rounded"></i>
                                    
                                </button>

                                <Link to='/registration' className="login_btn mt-5">Registration</Link>

                                {/* <img
                                    onClick={linkedInLogin}
                                    src={linkedin}
                                    className="mt-5 mx-auto text-center"
                                    alt="Log in with Linked In"
                                    style={{ maxWidth: "100%", cursor: "pointer" }}
                                /> */}
                                
                                <Link className="forgot_password" to="/forgot-password">Forgot Password </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        </>
    );
}
export default Login;