import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
import $ from 'jquery';  
import Top from "./common/Top";
import Menu from "./common/Menu";
import Bottom from "./common/Bottom";
import Pagination from "react-js-pagination";
import { useForm } from 'react-hook-form';

function AddStaff() {
    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm();
    // const password = useRef({});
    // password.current = watch("password", "");

    const navigate = useNavigate();
 
    const [user,userData] = useState('');
    const [role,roleData] = useState('');
    const [userPagination,userPaginationData] = useState('');
    const [operation,operationData] = useState('Add');
    const [buttonText,buttonTextData] = useState('Add');
    const [buttonDisable,buttonDisableData] = useState(false);
    const [sidebarDisplay,setSidebarDisplay] = useState('inActive');
 
    const openSidebar = ()=>{
        if(sidebarDisplay === 'inActive'){
            setSidebarDisplay('active');
        }else{
            setSidebarDisplay('inActive');
        } 
    }

    const deleteRole = (e)=>{ 
        let is_confirm = confirm('Are you sure you want to delete this staff user?');
        if(is_confirm){
            let id = e.target.id; 
            axios.delete(`/api/staff/${id}`).then((response) => { 
                if(response.status == 200){ 
                    $(`#row_${id}`).css("background-color", "#f8d7da").slideUp(500); 
                    toast('Staff member deleted.')
                }
            }).catch((error)=> {  
                $('#errorText').text('Your credential not correct.'); 
                $('#errorMsg').slideDown(1000);
            }); 
        }
    }

    const selectUser = (e)=>{ 
        buttonTextData('Update');
        buttonDisableData(false);
        let id = parseInt(e.target.id); 
        //console.log(`/api/staff/${id}`); 
        axios.get(`/api/staff/${id}`).then((response) => { 
            if(response.status == 200){  
                $('#user_id').val(response.data.id); 
                $('#first_name').val(response.data.first_name); 
                $('#last_name').val(response.data.last_name); 
                $('#user_email').val(response.data.user_email); 
                $('#user_password').val(response.data.user_password); 
                $('#user_role').val(response.data.role_id); 
                $('#user_status').val(response.data.is_active); 
                $('#linkedin_id').val(response.data.linkedin_id); 

                // for remove validation    
                setValue("first_name", response.data.first_name )
                setValue("last_name", response.data.last_name )
                setValue("user_email", response.data.user_email )
                setValue("user_password", response.data.user_password )
                setValue("user_role", response.data.role_id )
                setValue("user_status", response.data.is_active )
                setValue("linkedin_id", response.data.linkedin_id )
            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.'); 
            $('#errorMsg').slideDown(1000);
        }); 
        
    }

    const submitData = ()=>{  
        const id = $('#user_id').val(); 
        const first_name = $('#first_name').val(); 
        const last_name = $('#last_name').val(); 
        const user_email = $('#user_email').val(); 
        const user_password = $('#user_password').val(); 
        const role_id = $('#user_role').val(); 
        const is_active = $('#user_status').val();  

        const sendData = {
            'first_name' : first_name,
            'last_name' : last_name,
            'user_email' : user_email,
            'user_password' : user_password,
            'role_id' : role_id,
            'is_active' : is_active, 
            'user_token' : localStorage.getItem('user_token')
        }  
        // console.log(`/api/staff/${id}`);
        // console.log(JSON.stringify(sendData));
        if(id){ 
            axios.put(`/api/staff/${id}`, sendData).then((response) => { 
                if(response.status == 200){  
                    toast(`${response.data.msg}`)  
                    //Hide modal
                    $("[data-bs-dismiss=modal]").trigger({ type: "click" });
                }
            }).catch((error)=> {  
                toast('Technical issue.')
            }); 
        }else{
            axios.post(`/api/staff`, sendData).then((response) => { 
                if(response.status == 200){  
                    toast(`${response.data.msg}`) 

                    //Hide modal
                    $("[data-bs-dismiss=modal]").trigger({ type: "click" });
                }
            }).catch((error)=> {  
                toast('Technical issue.')  
            }); 
        }
        operationData('Update');
        $('#user_form').trigger("reset");
    }
    
    const searchData = (e) => {
        var search_data = e.currentTarget.value?e.currentTarget.value:0;  
        async function getData(){
            const userRes =  await axios.get(`/api/staff/search/${search_data}`);
            userData(userRes.data); 
            
            if(userRes.data.length == 0){
                $('.wating_text').text('No record.');
                $('.wating_color').removeClass('alert-success');
                $('.wating_color').addClass('alert-danger');
            }
        }
        getData(); 
    };

    const fetchData = async (pageNumber = 1) => {
        const userRes = await axios.get(`/api/staff?page=${pageNumber}&record_count=10`); 
        userData(userRes.data.data);

        const userPaginationRes = await axios.get(`/api/staff?page=${pageNumber}&record_count=10`); 
        userPaginationData(userPaginationRes.data); 

        const roleRes = await axios.get(`/api/user-role`); 
        roleData(roleRes.data);

        if(user.length==0){
            $('.wating_text').text('No record.');
            $('.wating_color').removeClass('alert-success');
            $('.wating_color').addClass('alert-danger');
        }
        
    }; 
    useEffect(()=>{  
        fetchData(); 
        operationData(''); 
    },[operation]);  
    
    const resetData = ()=>{
        buttonTextData('Add');
        $('#user_id').val('');
        $('#user_form').trigger("reset");
    } 
    return (
        <> 
        <Top />
        <div className="wrapper">
            <Menu is_display={sidebarDisplay} />
            <div id="content">
                <div className="sidebar_btn" onClick={openSidebar}>
                    <button type="button" id="sidebarCollapse" className="btn btn-info">
                        <i className="fas fa-align-left"></i>
                    </button>
                </div>
                <div className="dashboard_title">
                Staff
                </div>
                <section>
                    <div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="select_campaign">
                                    <div className="select_campaignleft">
                                        <input className="search_input" type="text" placeholder="Search user" id="role_search" onChange={searchData} />
                                        {/* <input className="input_date" type="date" name="" /> */}
                                    </div>
                                    <div className="select_campaignright">
                                        <a href="#" className="utm_btn" data-bs-toggle="modal" data-bs-target="#utm_modal" onClick={resetData}>Add Staff</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12"> 
                                <div className="table_main_outer">
                                    <div className="table-responsive"> 
                                        <table className="table table-bordered">
                                            <thead className="bg-dark text-white">
                                            <tr>
                                                <th scope="col"> Sr. No.</th>
                                                <th scope="col">Staff User</th>
                                                <th scope="col">Role</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody> 
                                            {
                                                (user.length)?
                                                user.map((user_data,key)=>{ 
                                                return (
                                                    <tr id={`row_${user_data.id}`} key={`${user_data?.id}`}>
                                                        <td>{
                                                            (userPagination.current_page-1) * 10+key+1
                                                         }</td>
                                                        <td>  { user_data.first_name } { user_data.last_name } </td>
                                                        <td>{ user_data.role }</td>
                                                        <td>{ (user_data.is_active)?'Active':'Inactive' }</td>
                                                        <td>
                                                        <div className="list_td">
                                                            <a href="#" data-bs-target="#utm_modal" data-bs-toggle="modal" onClick={selectUser}>
                                                                <i className="fas fa-edit" id={user_data.id}></i>
                                                            </a> &nbsp;
                                                            <a href="#" onClick={deleteRole}>
                                                                <i className="fas fa-trash-alt text-danger" id={user_data.id}></i>
                                                            </a>
                                                        </div>
                                                        </td>
                                                    </tr>
                                                    )
                                                    })
                                                    :
                                                    <tr className="alert alert-success col-md-12 text-center wating_color">
                                                        <td colSpan="5" className="wating_text">
                                                            Loading...
                                                        </td>
                                                    </tr>
                                                } 
                                            
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-12 text-center">
                                        <Pagination
                                                activePage={userPagination?.current_page ? userPagination?.current_page : 0}
                                                itemsCountPerPage={userPagination?.per_page ? userPagination?.per_page : 0 }
                                                totalItemsCount={userPagination?.total ? userPagination?.total : 0}
                                                onChange={(pageNumber) => {
                                                    fetchData(pageNumber)
                                                }}
                                                pageRangeDisplayed={8}
                                                // itemclassName=""
                                                // linkclassName=""
                                                // firstPageText="F"
                                                // lastPageText="L"
                                            />
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
        

                <div className="modal custom_modal fade model_div" id="utm_modal" tabIndex="-1" role="dialog" aria-labelledby="utm_modalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <form action="" method="POST" id="user_form" onSubmit={handleSubmit(submitData)} autoComplete="OFF">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="utm_modalTitle">{buttonText} Staff</h5>
                                    <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">  
                                        <div className="col-md-6">
                                            <input type="text" className="input_cus" placeholder="First Name" name="" id="first_name" {...register('first_name', { required: true })}/> 
                                            {errors.first_name && <p className="custom-error-messager">First name is required.</p>}
                                        </div> 
                                        <div className="col-md-6">
                                            <input type="text" className="input_cus" placeholder="Last Name" name="" id="last_name" {...register('last_name', { required: true })}/> 
                                            {errors.last_name && <p className="custom-error-messager">Last name is required.</p>}
                                        </div> 
                                        <div className="col-md-6">
                                            <input type="email" className="input_cus" placeholder="Email" name="" id="user_email" {...register('user_email', { required: true })}/> 
                                            {errors.user_email && <p className="custom-error-messager">Email is required.</p>}
                                        </div> 
                                        <div className="col-md-6">
                                            <input type="password" className="input_cus" placeholder="Password" name="" id="user_password" {...register('user_password', { required: 'Password is required.', minLength: {
                                                value: 8,
                                                message: "Password must have at least 8 characters"
                                            } })}/> 
                                            {errors.user_password && <p className="custom-error-messager">{errors.user_password.message}</p>}
                                        </div>
                                        
                                        {/* <div className="col-md-12">
                                            <input type="test" className="input_cus" placeholder="Linkedin Account ID" name="" id="linkedin_id" {...register('linkedin_id', { required: true })}/> 
                                            {errors.linkedin_id && <p className="custom-error-messager">Linkedin Account id is required.</p>}
                                        </div>  */}
                                        {/* <span className="text-danger custom-star">*</span> */}
                                        <div className="col-md-6">
                                            <select className="input_cus" id="user_role" {...register('user_role', { required: true })}>
                                                <option value="">Select Role</option>
                                                {
                                                (role.length)?
                                                role.map( (data,key)=>{ 
                                                return (
                                                    <option value={ data.id } key={key}>{ data.role }</option>
                                                )}):
                                                    <option value="0">No role added</option>
                                                }
                                            </select>
                                            {errors.user_role && <p className="custom-error-messager">User role is required.</p>}
                                        </div>
                                        {/* <span className="text-danger custom-star">*</span> */}
                                        <div className="col-md-6">
                                            <select className="input_cus" id="user_status" {...register('user_status', { required: true })}>
                                                <option value="">Select Status</option>
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                            {errors.user_status && <p className="custom-error-messager">User status is required.</p>}
                                        </div>
                                    </div> 

                                    <input type="hidden" id="user_id" />
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="para_save_outer"> 
                                                <button href="#" className="utm_btn" disabled={buttonDisable}>{buttonText} Staff</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div> 
            </div> 
        </div> 
        <Bottom />
    </>
    );
}
export default AddStaff;