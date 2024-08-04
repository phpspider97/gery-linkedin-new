import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, useLocation} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
import $ from 'jquery'; 
import { useForm } from 'react-hook-form';

function ChangeForgotPassword() {
    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm();
    const navigate = useNavigate();

    const [admin,AdminData] = useState('');
    const submitData = (e)=>{  
        const id = $('#id').val();  
        const new_password = $('#new_password').val();  
        const sendData = {
            'id' : id,
            'new_password' : new_password
        }  
        //console.log(sendData);
        axios.put(`/api/change-forgot-password`, sendData).then((response) => { 
            if(response.data.status == 'success'){ 
                toast(`${response.data.msg}`); 
                navigate(`/`);
            }else{
                toast(`${response.data.msg}`);
            }
        }).catch( (error)=> { 
            toast('Some technical issue.');
        });
        $('#forgotPasswordForm').trigger("reset");
    }
    useEffect(()=>{  
      $('#id').val(window.location.href.split('/').pop()); 
    },[]); 
    

    return (
      <section className="login_outer">
        <div className="container">
          <div className="row" >
            <div className="col-md-12">
              <div className="login_inner">
                <div className="login_title">Change Password</div>
                <form action="" method="POST" id="forgotPasswordForm" onSubmit={handleSubmit(submitData)} autoComplete="OFF">
                    <div className="login_inputs">
                      <input className="custom_input" type="password" placeholder="Add your new password" name="" id="new_password" {...register('new_password', { required: true })}/>
                      {errors.new_password && <p className="custom-login-error-messager">New password is required.</p>}
                      <input type="hidden" id="id"/>
                    <button className="login_btn">New Password</button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}
export default ChangeForgotPassword;