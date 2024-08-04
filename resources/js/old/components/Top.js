import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

function Top() {
    if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
        var url = 'http://127.0.0.1:8000';
    }else{
        var url = 'http://127.0.0.1:8000';
    } 

    const [buttonDisable,buttonDisableData] = useState(true);
    const checkPasswordValidation = (e)=>{
        const old_password = $('#old_password').val(); 
        const new_password = $('#new_password').val();  
        if( old_password != '' && new_password != ''){
            buttonDisableData(false);
        }else{
            buttonDisableData(true)
        }
    }
    const checkProfileValidation = (e)=>{
        const first_name = $('#first_name').val(); 
        const last_name = $('#last_name').val();  
        const user_email = $('#user_email').val();  
        if( first_name != '' && last_name != '' && user_email != '' ){
            buttonDisableData(false);
        }else{
            buttonDisableData(true)
        }
    }
    const submitPasswordData = (e)=>{ 
        e.preventDefault();
        const id = $('#id').val();  
        const new_password = $('#new_password').val(); 
        const old_password = $('#old_password').val(); 
        const sendData = { 
            'old_password' : old_password,
            'new_password' : new_password
        }   
        axios.put(`${url}/api/change-password/${id}`, sendData).then((response) => {  
            if(response.status == 200){  
                toast(`${response.data.msg}`) 
            }
        }).catch((error)=> {   
            toast('Technical issue.')
        }); 
        $('#change_password').trigger("reset");
    }

    const submitProfileData = (e)=>{ 
        e.preventDefault();
        const id = $('#id').val(); 
        const first_name = $('#first_name').val(); 
        const last_name = $('#last_name').val(); 
        const user_email = $('#user_email').val(); 

        const sendData = {
            'first_name' : first_name,
            'last_name' : last_name,
            'user_email' : user_email
        } 
        axios.put(`${url}/api/change-profile/${id}`, sendData).then((response) => {
            if(response.status == 200){  
                toast(`${response.data.msg}`) 
            }
        }).catch((error)=> {   
            toast('Technical issue.')
        }); 
        $('#change_password').trigger("reset");
    }

    const fetchData = async () => {  
        let id = $('#id').val();  
        axios.get(`${url}/api/user/${id}`).then((response) => { 
            if(response.status == 200){  
                $('#first_name').val(response.data.first_name); 
                $('#last_name').val(response.data.last_name); 
                $('#user_email').val(response.data.user_email); 
                
                if( response.data.first_name != '' && response.data.last_name != '' && response.data.user_email != '' ){
                    buttonDisableData(false);
                }else{
                    buttonDisableData(true)
                }
            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.'); 
            $('#errorMsg').slideDown(1000);
        });
    }; 
    useEffect(()=>{  
        fetchData();  
    },[]); 

    return (
        <>  
        <nav id="sidebar">
            <div className="sidebar-header">
                <h3>Admin Area</h3>
            </div>
            <ul className="list-unstyled components">
                <p>
                    Welcome
                    <br /> 
                    <span className="badge badge-primary"> Neel </span>
                </p> 
                <li>
                    <Link to="/admin/role"><i className="fas fa-database"></i> &nbsp; Add Role</Link>
                </li>
                <li>
                    <Link to="/admin/user"><i className="fas fa-user"></i> &nbsp; Add User</Link>
                </li>
            </ul>
        </nav>
        <div className="content admin-header">
            <div className="custom_container">
                <div className="row">
                    <div className="col-md-12">
                        <nav className="navbar navbar-expand-lg navbar-light custom_header_nav">
                            <a className="navbar-brand" href="#">
                            <img src="assets/images/logob.png"  alt="" />  
                            </a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon" />
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                <li className="nav-item notification">
                                    <a className="nav-link" href="#"><i className="fal fa-bell"></i><span className="bell_noti"></span><span>Notification</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="logout_a" data-bs-toggle="collapse" href="#logout_dropdown" role="button" aria-expanded="false" aria-controls="logout_dropdown">
                                            <img src="https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659651_960_720.png" /><span>John Doe</span>
                                    </a>
                                    <div className="collapse" id="logout_dropdown">
                                    <ul>
                                        <li><a href="" data-bs-toggle="modal"  data-bs-target="#utm_password_modal">Change Password</a></li>
                                        <li><a href="" data-bs-toggle="modal" data-bs-target="#utm_profile_modal">Edit Profile</a></li>
                                        <li><Link to="/">Logout</Link></li>
                                    </ul>
                                    </div>
                                </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div> 
        <div className="modal custom_modal fade" id="utm_password_modal" tabIndex="-1" role="dialog" aria-labelledby="utm_modalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <form action="" method="POST" id="change_password" onSubmit={submitPasswordData} autoComplete="OFF">
                        <div className="modal-header">
                            <h5 className="modal-title" id="utm_modalTitle"> Change Password</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <span className="text-danger custom-star">*</span>
                                <div className="col-md-12">
                                    <input type="password" className="input_cus" placeholder="Old Password" name="" id="old_password" onChange={checkPasswordValidation}/> 
                                </div>
                                <span className="text-danger custom-star">*</span>
                                <div className="col-md-12">
                                    <input type="password" className="input_cus" placeholder="New Password" name="" id="new_password" onChange={checkPasswordValidation}/> 
                                </div>
                                
                                {/* <div className="col-md-12">
                                    <select className="input_cus" id="is_active" onChange={checkPasswordValidation}>
                                        <option value="">Select status</option>
                                        <option value="1">Active</option>
                                        <option value="0">Deactive</option>
                                    </select>
                                </div> */}
                            </div> 
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="para_save_outer"> 
                                        <button href="#" className="utm_btn" data-bs-dismiss="modal" disabled={buttonDisable}>Submit</button>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" id="id"  value="1"/>
                        </div>
                    </form>
                </div>
            </div>
        </div> 

        <div className="modal custom_modal fade" id="utm_profile_modal" tabIndex="-1" role="dialog" aria-labelledby="utm_modalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <form action="" method="POST" id="change_password" onSubmit={submitProfileData} autoComplete="OFF">
                        <div className="modal-header">
                            <h5 className="modal-title" id="utm_modalTitle"> Edit Profile</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6">
                                        <input type="text" className="input_cus" placeholder="First Name" name="" id="first_name" onChange={checkProfileValidation}/> 
                                    </div> 
                                    <div className="col-md-6">
                                        <input type="text" className="input_cus" placeholder="Last Name" name="" id="last_name" onChange={checkProfileValidation}/> 
                                    </div> 
                                    <div className="col-md-12">
                                        <input type="text" className="input_cus" placeholder="Email" name="" id="user_email" onChange={checkProfileValidation}/> 
                                    </div> 
                                </div> 
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="para_save_outer"> 
                                        <button href="#" className="utm_btn" data-bs-dismiss="modal" disabled={buttonDisable}>Submit</button>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" id="id"  value="1"/>
                        </div>
                    </form>
                </div>
            </div>
        </div> 
        </>
    );
}

export default Top;