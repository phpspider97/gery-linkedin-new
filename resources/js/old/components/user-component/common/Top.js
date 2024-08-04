import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
import $ from 'jquery'; 
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
import { useForm } from 'react-hook-form';
import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png"; 
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"; 
import { Circles,TailSpin,ThreeDots } from  'react-loader-spinner'
import SortIcon from "@material-ui/icons/ArrowDownward";
import DataTable from "react-data-table-component";

const columns = [
    {
      id: 1,
      name: "UTM",
      selector: (row) => row.utm_name??'-',
      sortable: true,
      reorder: true
    },
    {
        id: 2,
        name: "Effected Ads ID",
        selector: (row) => row.ads_id??'-',
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
    },
    {
      id: 3,
      name: "Created At",
      selector: (row) => new Date(row.created_at).toUTCString()??'-',
      sortable: true,
      reorder: true,
      style:{ textAlign: 'left', width:'500px'}
    }
];

function Top(props) {
    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm(); 
    const { register: register2, formState: { errors: errors2 },  handleSubmit: handleSubmit2,  } = useForm();
 
    const [userName,userNameData] = useState(localStorage.getItem('user_name'));
    const [userImage,userImageData] = useState((localStorage.getItem('user_image') != '')?localStorage.getItem('user_image'):'https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659651_960_720.png');
    const [image,imageData] = useState("");
    const [adsAccount,adsAccountData] = useState("");
    const [parameterUpdate,parameterUpdateData] = useState('');
    const [fullParameterUpdate,fullParameterUpdateData] = useState([{
        utm_name : 'loading..'
    }]);
    const [pending, setPending] = React.useState(true);
    const [unreadUpdate, unreadUpdateData] = useState('0');
    
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

    const submitAdsAccountData = ()=>{ 
        const id = localStorage.getItem('user_token');
        var selected_account_id = []
        var count = -1;
        var user_ads_account = $('input[name="user_ads_account"]:checked').each(function(){
            count++;
            selected_account_id[count] = parseInt(this.value);
        }); 
        //console.log(selected_account_id);
        const sendData = {
            'user_id' : id, 
            'user_ads_account' : selected_account_id 
        }      
        //console.log(JSON.stringify(sendData));
        axios.post(`/api/user/userAccountDetail`, sendData).then((response) => {  
            if(response.data.status == 'success'){
                toast(`${response.data.msg}`)  
                if( selected_account_id != ''){
                    var store_account_id = selected_account_id.join(',');
                } 
                localStorage.setItem('user_linkedin_account_id', store_account_id);
                //Hide modal
                location.reload();
                $("[data-bs-dismiss=modal]").trigger({ type: "click" });
            }else{
                toast(`${response.data.msg}`)
            }
 
        }).catch((error)=> {   
            toast('Technical issue.')
        }); 
        $('#ads_account').trigger("reset");
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

        axios.post(`/api/change-profile`, joinData).then((response) => {
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
 

    const selectAdsAccound = ()=>{ 
        let id = localStorage.getItem('user_token');
        //console.log(`/api/user/userAccountDetail/${id}-for_user`);   
        axios.get(`/api/user/userAccountDetail/${id}-for_user`).then((response) => { 
            //console.log(response.data);
            adsAccountData(response.data); 
            $.each(response.data, function(key,val){ 
                //console.log(val);   
                if(val.is_active == 1){    
                    $(`#ads_account_${val.account_id}`).prop('checked', true);     
                }else{
                    $(`#ads_account_${val.account_id}`).prop('checked', false); 
                }
            });
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        });
    }; 

    const { linkedInLogin } = useLinkedIn({
        clientId: "783v0rokori887",
        //clientId: "783v0rokori887",
        //redirectUri: `http://localhost:3000/user`,
        redirectUri: `https://www.pipelight.io/user`,
        onSuccess: (code) => {
            //console.log('12');
          setCode(code);
          setErrorMessage("");
        },
        scope: "r_emailaddress r_liteprofile r_ads_reporting rw_ads r_ads w_organization_social r_organization_social w_member_social r_basicprofile r_organization_admin rw_organization_admin r_1st_connections_size",
        onError: (error) => { 
            console.log(error)
          setCode("");
          setErrorMessage(error.errorMessage);
        },
    });
    const updateUnread = ()=>{ 
        let id = localStorage.getItem('user_token'); 
        axios.get(`/api/user/updateUnread/${id}`).then((response) => { 
            if(response.status == 200){     
                $('.update_count').hide();
            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        });   
    }

    async function getFullUtmUpdate(force_update_count){  
        //console.log('1jhghhj');
        let id = localStorage.getItem('user_token'); 
        await axios.get(`/api/user/getUtmUpdate/${id}-full`).then((response) => { 
            if(response.status == 200){     
                fullParameterUpdateData(response.data); 
                const timeout = setTimeout(() => { 
                    setPending(false);
                }, 2000); 
                return () => clearTimeout(timeout);
            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        });   
        //console.log(`/api/user/getUnreadUpdate/${id}`)
        const getUnreadUpdate = await axios.get(`/api/user/getUnreadUpdate/${id}`);
        //console.log('inside -'+force_update_count)
        if(force_update_count == '' || force_update_count == undefined || force_update_count == 0){ 
            unreadUpdateData(getUnreadUpdate.data); 
        }else{ 
            unreadUpdateData(props.setIsAnyForceUpdate); 
        }
        //unreadUpdateData(props.setIsAnyForceUpdate)
    }
    async function getPartialUtmUpdate(){   
        let id = localStorage.getItem('user_token');   
        await axios.get(`/api/user/getUtmUpdate/${id}-limit`).then((response) => { 
            if(response.status == 200){   
                parameterUpdateData(response.data); 
            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        }); 
    }
    // if(props.setIsAnyUpdate == 'yes'){
    //     $('.update_count').show();
    // }
    useEffect(()=>{  
        $('.update_count').show();  
        getPartialUtmUpdate();

        if(props.setIsAnyForceUpdate > 0){ 
            getFullUtmUpdate(props.setIsAnyForceUpdate);  
        }else{ 
            getFullUtmUpdate(0); 
        }

    },[props.setIsAnyForceUpdate]); 
    //console.log(`force update --- ${unreadUpdate}`)
    //console.log(`bottom Which data ${props.setIsAnyForceUpdate}`)
    // if(props.setIsAnyUpdate == 'yes'){
    //     console.log('done.')
    //     getFullUtmUpdate();
    // }  

    //console.log(props.setIsAnyUpdate)
    return (
        <>  
            <header>
                <div className="custom_container">
                    <div className="row" >
                        <div className="col-md-12">
                            <nav className="navbar navbar-expand-lg navbar-light custom_header_nav"> 
                                <a className="navbar-brand" href="https://www.pipelight.io/user">
                                    <img src="https://www.pipelight.io/images/site_logo.png" style={{width:'160px',height:'35px'}} alt="site logo" /> 
                                </a>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon" />
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav mr-auto">
                                        <li className="nav-item notification">
                                            <a className="logout_a" data-bs-toggle="collapse" href="#notification_dropdown" role="button" aria-expanded="false" aria-controls="notification_dropdown" onClick={updateUnread}>
                                                { unreadUpdate>0  &&  
                                                    <div className="update_count">{unreadUpdate}</div> 
                                                } 
                                                <i className="fal fa-bell"></i>
                                                {/* { unreadUpdate>0 &&
                                                <span className="bell_noti text-white">
                                                    <span className="text-white notification_text" style={{fontSize:'10px',vAlign:'middle'}}> {unreadUpdate} </span>
                                                </span> 
                                                } */}
                                                <span>Notification</span>
                                            </a>
                                            <div className="collapse" id="notification_dropdown">
                                                <div className="table-responsive">
                                                    <div className="utm_update_data"> 
                                                        <table className="table table-striped table-bodered">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col"> #</th>
                                                                    <th scope="col"> UTM</th>
                                                                    <th scope="col">Effected Ads</th>  
                                                                </tr>
                                                            </thead>
                                                            <tbody> 
                                                                {
                                                                (parameterUpdate.length != '')?
                                                                parameterUpdate.map( (parameterUpdateData,key)=>{ 
                                                                return (
                                                                    <tr key={key}>
                                                                        <td>{key+1}</td>
                                                                        <td>{parameterUpdateData.utm_name}</td>
                                                                        <td>{parameterUpdateData.total_ads_effect}</td> 
                                                                    </tr>
                                                                    
                                                                    )}): <tr><td colSpan='3'>No update.</td></tr>
                                                                }  
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <table className="table table-striped table-bodered">
                                                        <thead>
                                                            <tr className="notification_view_all show-cursor utm_update_data_footer">
                                                                <td colSpan="4" className="text-white text-center" data-bs-toggle="modal" data-bs-target="#utm_update_modal">
                                                                    View in detail
                                                                </td> 
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </div>
                                            </div>
                                        </li>
                                    
                                        <li className="nav-item">
                                            <a className="logout_a" data-bs-toggle="collapse" href="#logout_dropdown" role="button" aria-expanded="false" aria-controls="logout_dropdown">
                                                <img src={userImage}/><span>{userName}</span>
                                            </a>
                                            <div className="collapse" id="logout_dropdown">
                                                <ul>
                                                    <li><a href="" data-bs-toggle="modal"  data-bs-target="#utm_ads_modal" onClick={selectAdsAccound}>Ads Account</a></li>
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
            <div className="modal custom_modal fade model_div" id="utm_update_modal" tabIndex="-2" role="dialog" aria-labelledby="utm_modalTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content"> 
                        <div className="modal-header">
                            <h5 className="modal-title" id="utm_modalTitle"> UTM update list</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row"> 
                                <div className="col-md-12 mt-1">  
                                    <div className="table-responsive"> 
                                    <DataTable
                                        title=""
                                        columns={columns}
                                        data={fullParameterUpdate}
                                        defaultSortFieldId={1}
                                        sortIcon={<SortIcon />}
                                        pagination 
                                        progressPending={pending}
                                        progressComponent={<ThreeDots color="#00BFFF" height={60} width={60} />}
                                    /> 
                                    </div>
                                </div>
                            </div>  
                        </div> 
                    </div>
                </div>
            </div> 
            <div className="modal custom_modal fade model_div" id="utm_ads_modal" tabIndex="-2" role="dialog" aria-labelledby="utm_modalTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content"> 
                        <div className="modal-header">
                            <h5 className="modal-title" id="utm_modalTitle"> Ads Account List</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row"> 
                                <div className="col-md-12 mt-1">  
                                    <div className="row">
                                        <div className="col-md-6 mt-2">
                                            <strong>Select Ads Account</strong>
                                        </div> 
                                        <div className="col-md-6">
                                            <button className="bg-success custom-button-sync pull-right mb-3" onClick={linkedInLogin}>SYNC Account</button> 
                                        </div> 
                                        <hr />
                                    {
                                        (adsAccount.length>0)?
                                        adsAccount.map( (adsAccountData,key)=>{ 
                                        return (
                                            <div className={`form-check form-check-inline border p-2 text-left mt-1 ${adsAccountData.is_delete == 1 ?'alert alert-danger':''}`} key={key}> 
                                                <label className="form-check-label" for={`ads_account_${adsAccountData.account_id}`} style={{ marginLeft:'1.1em' }}>
                                                    { (adsAccountData.account_name)?adsAccountData.account_name:adsAccountData.account_id }
                                                </label> 

                                                <input className="form-check-input user_ads_account" type="checkbox" id={`ads_account_${adsAccountData.account_id}`} value={ adsAccountData.account_id } name="user_ads_account" style={{ marginLeft:'1.5em' }}  
                                                disabled={ adsAccountData.is_delete === 1 ? true : false}
                                                />
                                            </div>
                                        )}): <span>No Account.</span>
                                    } 
                                    </div>
                                </div>
                            </div> 
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="para_save_outer"> 
                                        <button className="utm_btn" onClick={submitAdsAccountData}>Submit</button>
                                    </div>
                                </div>
                            </div> 
                        </div> 
                    </div>
                </div>
            </div> 
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
                                            <input type="file" className="input_cus" name="image" id="image" onChange={(e)=>handleChange(e.target.files)} accept="image/*"/> 
                                            {  userImage && <img src={userImage} style={{ height:'80px',width:'80px'}}/> }
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
        </>
    );
}

export default Top;