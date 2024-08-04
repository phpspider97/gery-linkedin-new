import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, useLocation} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
import $ from 'jquery'; 
import { useForm } from 'react-hook-form';

function ForgotPassword() {
    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm();
    const navigate = useNavigate();

    const [admin,AdminData] = useState('');
    const submitData = (e)=>{  
        const user_email = $('#user_email').val();  
        const sendData = {
            'user_email' : user_email
        }  
        axios.post(`/api/forgot-password`, sendData).then((response) => { 
            if(response.data.status == 'success'){ 
                toast(`${response.data.msg}`); 
            }else{
                toast(`${response.data.msg}`);
            }
        }).catch( (error)=> { 
            toast('Some technical issue.');
        });
        $('#forgotPasswordForm').trigger("reset");
    }

    return (
      <section className="login_outer">
        <div className="container">
          <div className="row" >
            <div className="col-md-12">
              <div className="login_inner">
                <div className="login_title">Forgot Password</div>
                <form action="" method="POST" id="forgotPasswordForm" onSubmit={handleSubmit(submitData)} autoComplete="OFF">
                    <div className="login_inputs">
                    <input className="custom_input" type="text" placeholder="johndoe@mail.com" name="" id="user_email" {...register('user_email', { required: true })}/>
                    {errors.user_email && <p className="custom-login-error-messager">Login email is required.</p>}
                    <button className="login_btn">Forgot Password</button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}
export default ForgotPassword;