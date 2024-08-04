import React, { useEffect, useState } from 'react';
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

function User() {
    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm();
    const navigate = useNavigate();
 
    const [user,userData] = useState('');
    const [userPermission,userPermissionData] = useState('');
    const [role,roleData] = useState('');
    const [userPagination,userPaginationData] = useState('');
    const [operation,operationData] = useState('Add');
    const [buttonText,buttonTextData] = useState('Add');
    const [buttonDisable,buttonDisableData] = useState(false);
    const [pending, setPending] =  useState(true);

    const [isRead,isReadData] = useState(true); 
    const [isCreate,isCreateData] = useState(true); 
    const [isEdit,isEditData] = useState(true); 
    const [isDelete,isDeleteData] = useState(true); 
    const [fullParameterUpdate,fullParameterUpdateData] = useState([{
        utm_name : 'loading..'
    }]);
    const [parameterUpdate,parameterUpdateData] = useState('');
    const [totalEffectedAds,totalEffectedAdsData] = useState(0);
    const [allEffectedAds,allEffectedAdsData] = useState(0);
    const [allUserCount,allUserCountData] = useState(0);

    const [tagData, setTagData] = useState([]);
    const removeTagData = indexToRemove => {
        setTagData([...tagData.filter((_, index) => index !== indexToRemove)]);
    };

    const [sidebarDisplay,setSidebarDisplay] = useState('inActive');
 
    const openSidebar = ()=>{
        if(sidebarDisplay === 'inActive'){
            setSidebarDisplay('active');
        }else{
            setSidebarDisplay('inActive');
        } 
    }

    const addTagData = event => {
        if (event.target.value !== '') {
            let account_id = event.target.value.replace(',', '');
            setTagData([...tagData, account_id]);
            event.target.value = '';
        }
    }; 
    
    const deleteRole = (e)=>{ 
        let is_confirm = confirm('Are you sure you want to delete this user?');
        if(is_confirm){
            let id = e.target.id; 
            axios.delete(`/api/user/${id}`).then((response) => { 
                if(response.status == 200){ 
                    $(`#row_${id}`).css("background-color", "#f8d7da").slideUp(500); 
                    toast('User deleted successfully!!')
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
        axios.get(`/api/user/${id}`).then((response) => { 
            //console.log(response);
            if(response.status == 200){  
                setTagData(response.data.ads_account_data);
                $('#user_id').val(response.data.id); 
                $('#campaign_group').val(response.data.campaign_group); 
                $('#first_name').val(response.data.first_name); 
                $('#last_name').val(response.data.last_name); 
                $('#user_email').val(response.data.user_email); 
                $('#user_password').val(response.data.user_password); 
                $('#user_role').val(response.data.role_id); 
                $('#user_status').val(response.data.is_active); 
                //$('#linkedin_id').val(response.data.ads_account_data.join(',')); 
                $('#is_sync').val(response.data.is_sync); 
                if(response.data.is_link){
                    $('#is_link').prop('checked', true);
                }else{
                    $('#is_link').prop('checked', false);
                }

                // for remove validation    
                setValue("campaign_group", response.data.campaign_group )
                setValue("first_name", response.data.first_name )
                setValue("last_name", response.data.last_name )
                setValue("user_email", response.data.user_email )
                setValue("user_password", response.data.user_password )
                setValue("user_role", response.data.role_id )
                setValue("user_status", response.data.is_active )
                setValue("linkedin_id", response.data.ads_account_data.join(',') )
            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.'); 
            $('#errorMsg').slideDown(1000);
        }); 
        
    }

    const submitData = ()=>{  
        const id = $('#user_id').val(); 
        const campaign_group = $('#campaign_group').val(); 
        const first_name = $('#first_name').val(); 
        const last_name = $('#last_name').val(); 
        const user_email = $('#user_email').val(); 
        const user_password = $('#user_password').val(); 
        const role_id = $('#user_role').val(); 
        const is_active = $('#user_status').val(); 
        //const linkedin_id = $('.tag-title').text(); 
        const is_sync = $('#is_sync').val(); 
        //const is_link = $('#is_link')[0].checked;

        var a_linkedin_id = [];
        var count = -1;
        $('.tag-title').each(function(){
            count++;
            a_linkedin_id[count] = $(this).text();
        })
        if(a_linkedin_id){
           var linkedin_id = a_linkedin_id.join(',');
        } 

        const sendData = {
            'campaign_group' : campaign_group,
            'first_name' : first_name,
            'last_name' : last_name,
            'user_email' : user_email,
            'user_password' : user_password,
            'role_id' : role_id,
            'is_active' : is_active,
            'linkedin_id' : linkedin_id,
            'is_sync' : is_sync,
            //'is_link' : is_link,
            'user_token' : localStorage.getItem('user_token')
        }

        //console.log(`/api/user/${id}`);
        //console.log(JSON.stringify(sendData));
        if(id){ 
            axios.put(`/api/user/${id}`, sendData).then((response) => { 
                if(response.status == 200){  
                    toast(`${response.data.msg}`)  
                   //Hide modal
                   $("[data-bs-dismiss=modal]").trigger({ type: "click" });
                }
            }).catch((error)=> {  
                toast('Technical issue.')
            }); 
        }else{
            axios.post(`/api/user`, sendData).then((response) => { 
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
            const userRes =  await axios.get(`/api/user/search/${search_data}`);
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
        let login_level = localStorage.getItem('login_level');
        let user_token = localStorage.getItem('user_token');

        const userRes = await axios.get(`/api/user?page=${pageNumber}&record_count=10`); 
        userData(userRes.data.data); 
        //console.log(`/api/user/totalAffectedAds/all-data`);
        const affectedAds = await axios.get(`/api/user/totalAffectedAds/all-data`);
        //console.log(affectedAds.data); 
        allEffectedAdsData(affectedAds.data.total_parameter); 
        allUserCountData(affectedAds.data.total_user);

        if(login_level == 3){ 
            const userPermission = await axios.get(`/api/getPermission?login_level=${login_level}&user_token=${user_token}`);  
            userPermissionData(userPermission.data);
            //console.log(userPermission.data)
            //Set permission in state 
            if(!userPermission.data.includes(1)){ 
                isReadData(false)
            }
            if(!userPermission.data.includes(2)){ 
                isCreateData(false)
            }
            if(!userPermission.data.includes(3)){ 
                isEditData(false);
            }
            if(!userPermission.data.includes(4)){ 
                isDeleteData(false);
            }
        }
 
        const userPaginationRes = await axios.get(`/api/user?page=${pageNumber}&record_count=10`); 
        userPaginationData(userPaginationRes.data); 

        const roleRes = await axios.get(`/api/user-role`); 
        roleData(roleRes.data);

        // if(roleRes.data.data.length<2){ 
        //     $('.pagination').hide();
        // }else{
        //     $('.pagination').show();
        // }
        if(user.length==0){
            $('.wating_text').text('No record.');
            $('.wating_color').removeClass('alert-success');
            $('.wating_color').addClass('alert-danger');
        }
        
    }; 
    const utmAnalytics = (e)=>{    
        let id = e.target.id; 
        axios.get(`/api/user/getUtmUpdate/${id}-full-admin`).then((response) => { 
            //console.log(response);
            //if(response.status == 200){     
                fullParameterUpdateData(response.data); 
                const timeout = setTimeout(() => {
                    setPending(false);
                }, 2000); 
                return () => clearTimeout(timeout);
            //}
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        });  
        axios.get(`/api/user/getUtmUpdate/${id}-limit-admin`).then((response) => { 
            //console.log(response);
            //if(response.status == 200){   
                //console.log(response.data);
                parameterUpdateData(response.data); 
                const totalEffectedAds = response.data.reduce((accumulator, object) => {
                    return accumulator + object.total_ads_effect;
                }, 0);
                totalEffectedAdsData(totalEffectedAds)
            //}
        }).catch((error)=> {  
            $('#errorText').text('Data not get.');  
        }); 
    }
    
    useEffect(()=>{    
        fetchData(); 
        operationData('');  
    },[operation]);  
    
    const resetData = ()=>{
        buttonTextData('Add');
        $('#user_id').val('');
        setValue("first_name", '' )
        setValue("campaign_group", '' )
        setValue("first_name", '' )
        setValue("last_name", '' )
        setValue("user_email", '' )
        setValue("user_password", '' ) 
        setValue("user_status", '')
        setValue("linkedin_id", '' )
        $('#user_form').trigger("reset");
        setTagData([]);
    }
    //console.log(fullParameterUpdate);
 
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
                User
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
                                    <div className="select_campaignleft mx-auto">
                                         <strong>Total User</strong> : {allUserCount}
                                    </div>
                                    <div className="select_campaignleft mx-auto">
                                    <strong>Total affected ads</strong> : {allEffectedAds}
                                    </div>
                                    <div className={`select_campaignright ${isCreate?'show_permission':'hide_permission'} `}>
                                        <a href="#" className="utm_btn" data-bs-toggle="modal" data-bs-target="#utm_modal" onClick={resetData}>Add User {isCreate}</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`row ${isRead?'show_permission':'hide_permission'} `}>
                            
                            <div className="col-md-12"> 
                                <div className="table_main_outer">
                                    <div className="table-responsive"> 
                                        <table className="table table-bordered">
                                            <thead className="bg-dark text-white">
                                            <tr>
                                                <th scope="col"> Sr. No</th>
                                                <th scope="col">User</th>
                                                {/* <th scope="col">Role</th> */}
                                                <th scope="col">Status</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                
                                            {
                                                (user.length)?
                                                user.map((user_data,key)=>{ 
                                                return (
                                                    <tr id={`row_${user_data.id}`} key={user_data?.id}>
                                                        <td>{
                                                            (userPagination.current_page-1) * 10+key+1
                                                         }</td>
                                                        <td>  { user_data.first_name } { user_data.last_name } </td>
                                                        {/* <td>{ user_data.user_role }</td> */}
                                                        <td>{ (user_data.is_active)?'Active':'Inactive' }</td>
                                                        <td>
                                                        <div className="list_td">
                                                            <div className={` ${isEdit?'show_permission':'hide_permission'} `}>
                                                                <a href="#" data-bs-target="#utm_modal" data-bs-toggle="modal" onClick={selectUser} >
                                                                    <i className="fas fa-edit" id={user_data.id}></i>
                                                                </a>
                                                            </div> &nbsp;
                                                            <div className={` ${isDelete?'show_permission':'hide_permission'} `}>
                                                                <a href="#" onClick={deleteRole} >
                                                                    <i className="fas fa-trash-alt text-danger" id={user_data.id}></i>
                                                                </a> 
                                                            </div> &nbsp;
                                                                <a onClick={utmAnalytics} data-bs-toggle="modal" data-bs-target="#utm_update_modal">
                                                                    <i className="fas fa-analytics text-success" id={user_data.id}></i>
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
                                    <h5 className="modal-title" id="utm_modalTitle">{buttonText} User</h5>
                                    <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">  
                                        <div className="col-md-12 text-wrap mb-3">
                                            <span style={{fontSize:'13px'}}><b>Note :</b> Email must be same as use in LinkedIn account.</span>
                                        </div>
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
                                            <input type="text" className="input_cus" placeholder="Campaign group name / Campaign group id" name="" id="campaign_group" {...register('campaign_group', { required: true })}/> 
                                            {errors.campaign_group && <p className="custom-error-messager">Campaign group is required.</p>}
                                        </div> */}
                                        <div className="col-md-12"> 
                                            <div className="tag-input mb-4">
                                                <ul className="tags">
                                                    {tagData.map((tag, index) => (
                                                    <li key={index} className="tag">
                                                        <span className="tag-title">{tag}</span>
                                                        <span className="tag-close-icon" onClick={() =>removeTagData(index)}> x </span>
                                                    </li>
                                                    ))}
                                                </ul>
                                                <input type="text" onKeyUp={event => (event.key === ',' ? addTagData(event) : null)} placeholder="Press type , to add a account ID" id="linkedin_id" />
                                            </div>
                                            {/* <input type="text" className="input_cus" placeholder="Linkedin Account ID" name="" id="linkedin_id" {...register('linkedin_id', { required: true })} data-role="tagsinput" />  */}
                                            {errors.linkedin_id && <p className="custom-error-messager">Linkedin Account id is required.</p>}
                                            
                                        </div> 
                                        {/* <span className="text-danger custom-star">*</span> */}
                                        {/* <div className="col-md-6">
                                            <select className="input_cus" id="user_role" {...register('user_role', { required: true })}>
                                                <option value="">Select Role</option>
                                                {
                                                (role.length)?
                                                role.map( (data,key)=>{ 
                                                return (
                                                    <option value={ data.id }>{ data.role }</option>
                                                )}):
                                                    <option value="0">No role added</option>
                                                }
                                            </select>
                                            {errors.user_role && <p className="custom-error-messager">User role is required.</p>}
                                        </div> */}
                                        {/* <span className="text-danger custom-star">*</span> */}
                                        <div className="col-md-12">
                                            <select className="input_cus" id="user_status" {...register('user_status', { required: true })}>
                                                <option value="">Select Status</option>
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                            {errors.user_status && <p className="custom-error-messager">User status is required.</p>}
                                        </div>
                                        {/* <div className="col-md-6">
                                             <input type="checkbox" value='1' id="is_link" /> Is link with linkedin
                                        </div> */}
                                    </div> 
                                    
                                    <input type="hidden" id="user_id" />
                                    <input type="hidden" id="is_sync" />
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="para_save_outer"> 
                                                <button href="#" className="utm_btn" disabled={buttonDisable}>{buttonText} User</button>
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
                                    <div className="utm_update_data_admin"> 
                                        <table className="table table-striped table-bodered">
                                            <thead>
                                                <tr>
                                                    <th scope="col"> #</th>
                                                    <th scope="col"> UTM</th>
                                                    <th scope="col">Total ads effected</th>  
                                                </tr>
                                            </thead>
                                            <tbody> 
                                                {
                                                (parameterUpdate.length>0)?
                                                parameterUpdate.map( (parameter_data,key)=>{ 
                                                return (
                                                    <tr>
                                                        <td>{key+1}</td>
                                                        <td>{(parameter_data.utm_name)?parameter_data.utm_name:'-'}</td>
                                                        <td>{(parameter_data.total_ads_effect)?parameter_data.total_ads_effect:'-'}</td> 
                                                    </tr>
                                                    
                                                    )}) : <tr><td colSpan='3'>No update.</td></tr>
                                                }  
                                                    <tr className="bg-dark text-white">
                                                        <td className="text-white">-</td>
                                                        <td className="text-white">Total</td>
                                                        <td className="text-white">
                                                         {totalEffectedAds}
                                                        </td> 
                                                    </tr>
                                            </tbody>
                                        </table>
                                    </div> 
                                </div>
                                <div className="table-responsive"> 
                                    <DataTable
                                        title="Full detail"
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
        <Bottom />
    </>
    );
}
export default User;