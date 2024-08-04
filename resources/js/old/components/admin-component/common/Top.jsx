import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
import { useForm } from 'react-hook-form';

function Top() { 

    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm(); 
    const { register: register2, formState: { errors: errors2 },  handleSubmit: handleSubmit2,  } = useForm();
 
    const [userName,userNameData] = useState(localStorage.getItem('user_name'));
    const [userImage,userImageData] = useState((localStorage.getItem('user_image'))?localStorage.getItem('user_image'):'https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659651_960_720.png');
    const [image,imageData] = useState("");

    const submitPasswordDataTop = ()=>{  
         
        const id = localStorage.getItem('user_token');  
        const new_password = $('#new_password').val(); 
        const old_password = $('#old_password').val(); 
        const sendData = { 
            'old_password' : old_password,
            'new_password' : new_password
        }   
        axios.put(`/api/change-password/${id}`, sendData).then((response) => {  
            if(response.data.status == 'success'){  
                toast(`${response.data.msg}`) 
                 //Hide modal
                 $(".model_div").removeClass('show');
                 $(".model_div").addClass('hide');
                 $( ".modal-backdrop" ).remove();
                 $( ".custom_modal" ).hide();
            }else{
                toast(`${response.data.msg}`)
            }
 
        }).catch((error)=> {   
            toast('Technical issue.')
        }); 
        $('#change_password').trigger("reset");
    }

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
        // const sendData = {
        //     'first_name' : first_name_top,
        //     'last_name' : last_name_top,
        //     'user_email' : user_email_top
        // }   

        // console.log(image);
        const joinData = new FormData();
        joinData.append("image", image);
        joinData.append("id", id);
        joinData.append("first_name", first_name_top);
        joinData.append("last_name", last_name_top);
        joinData.append("user_email", user_email_top);
        
        axios.post(`/api/change-profile`, joinData).then((response) => {
            //console.log(response);
            if(response.status == 200){  
                toast(`${response.data.msg}`) 
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
            toast('Technical issue.')
        }); 
        $('#change_password').trigger("reset");
    }

    const selectUser = ()=>{ 
        let id = localStorage.getItem('user_token');   
        axios.get(`/api/login-user-data/${id}`).then((response) => { 
            if(response.status == 200){  
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
    // useEffect(()=>{  
    //     //fetchData();  
    // },[]); 
    //console.log(userImage);
    return (
        <>  
        <header>
            <div className="custom_container">
                <div className="row" >
                    <div className="col-md-12">
                        <nav className="navbar navbar-expand-lg navbar-light custom_header_nav">
                            <a className="navbar-brand" href="https://www.pipelight.io/admin">
                                <img src="https://www.pipelight.io/images/site_logo.png" style={{width:'160px',height:'35px'}} alt="site logo" /> 
                            </a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon" />
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                    {/* <li className="nav-item notification">
                                        <a className="nav-link" href="#"><i className="fal fa-bell"></i><span className="bell_noti"></span><span>Notification</span></a>
                                    </li> */}
                                    <li className="nav-item">
                                        {/* <a className="logout_a" data-bs-toggle="collapse" href="#logout_dropdown" role="button" aria-expanded="false" aria-controls="logout_dropdown"> */}
                                        <a className="logout_a" data-bs-toggle="collapse" data-bs-target="#logout_dropdown" aria-expanded="true" aria-controls="logout_dropdown">
                                            <img src={userImage}/><span>{userName}</span>
                                        </a>
                                        <div className="collapse" id="logout_dropdown">
                                            <ul>
                                                <li><a href="" data-bs-toggle="modal"  data-bs-target="#utm_password_modal">Change Password</a></li>
                                                <li><a href="" data-bs-toggle="modal" data-bs-target="#utm_profile_modal" onClick={selectUser}>Edit Profile</a></li>
                                                <li><Link to="/logout">Logout</Link></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
        
        <div className="modal custom_modal fade model_div" id="utm_password_modal" tabIndex="-2" role="dialog" aria-labelledby="utm_modalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <form action="" method="POST" id="change_password" onSubmit={handleSubmit2(submitPasswordDataTop)} autoComplete="OFF">
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
                                    <input type="password" className="input_cus" placeholder="Old Password" name="" id="old_password" {...register2('old_password', { required: true })} /> 
                                    {errors2.old_password && <p className="custom-error-messager">Old password is required.</p>}
                                </div>
                                <span className="text-danger custom-star">*</span>
                                <div className="col-md-12">
                                    <input type="password" className="input_cus" placeholder="New Password" name="" id="new_password" {...register2('new_password', { required: true })} /> 
                                    {errors2.new_password && <p className="custom-error-messager">New password is required.</p>}
                                </div>
                            </div> 
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="para_save_outer"> 
                                        <button className="utm_btn">Submit</button>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </form>
                </div>
            </div>
        </div> 
       
        <div className="modal custom_modal fade model_div" id="utm_profile_modal" tabIndex="-1" role="dialog" aria-labelledby="utm_modalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <form action="" method="POST" onSubmit={handleSubmit(submitProfileData)} autoComplete="OFF" encType="multipart/form-data">
                        <div className="modal-header">
                            <h5 className="modal-title" id="utm_modalTitle"> Edit Profile</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6">
                                        <input type="text" className="input_cus" placeholder="First Name" name="" id="first_name_top" {...register('first_name_top', { required: true })} /> 
                                        {errors.first_name_top && <p className="custom-error-messager">First name is required.</p>}
                                    </div> 
                                    <div className="col-md-6">
                                        <input type="text" className="input_cus" placeholder="Last Name" name="" id="last_name_top" {...register('last_name_top', { required: true })} /> 
                                        {errors.last_name_top && <p className="custom-error-messager">Last name is required.</p>}
                                    </div> 
                                    <div className="col-md-12">
                                        <input type="text" className="input_cus" placeholder="Email" name="" id="user_email_top" {...register('user_email_top', { required: true })} /> 
                                        {errors.user_email_top && <p className="custom-error-messager">Email is required.</p>}
                                    </div> 
                                    <div className="col-md-12">
                                        <span>Profile picture</span>
                                        <input type="file" className="input_cus profile_image" name="image" id="image" onChange={(e)=>handleChange(e.target.files)} accept="image/*"/> 
                                        {  userImage && <img src={userImage} style={{ height:'80px',width:'80px'}}/> }
                                    </div> 
                                </div> 
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="para_save_outer"> 
                                        <button type="submit" className="utm_btn">Submit</button>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </form>
                </div>
            </div>
        </div> 
        </>
    );
}

export default Top;