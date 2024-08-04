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
require("bootstrap/less/bootstrap.less");
import { useForm } from 'react-hook-form';
 
 
function UserRole() {
    
    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm();

    const navigate = useNavigate();
    
    const [role,roleData] = useState('');
    const [rolePermission,rolePermissionData] = useState([
        {id:1, permission:'Display'},
        {id:2, permission:'Create'},
        {id:3, permission:'Edit'},
        {id:4, permission:'Delete'},
    ]);
    const [rolePagination,rolePaginationData] = useState('');
    const [operation,operationData] = useState('Add');
    const [buttonText,buttonTextData] = useState('Add');
    const [buttonDisable,buttonDisableData] = useState(false);
    const [user_role,user_roleData] = useState('asdadad');
    const [sidebarDisplay,setSidebarDisplay] = useState('inActive');
  
    const openSidebar = ()=>{
        if(sidebarDisplay === 'inActive'){
            setSidebarDisplay('active');
        }else{
            setSidebarDisplay('inActive');
        } 
    }
     
    const deleteRole = (e)=>{ 
        let is_confirm = confirm('Are you sure you want to delete this role?');
        if(is_confirm){
            let id = e.target.id; 
            axios.delete(`/api/user-role/${id}`).then((response) => { 
                if(response.status == 200){ 
                    $(`#row_${id}`).css("background-color", "#f8d7da").slideUp(500); 
                    toast('User role deleted successfully!!')
                }
            }).catch((error)=> {  
                $('#errorText').text('Your credential not correct.'); 
                $('#errorMsg').slideDown(1000);
            }); 
        }
    }

    const selectRole = (e)=>{ 
        buttonTextData('Update');
        buttonDisableData(false);
        let id = parseInt(e.target.id);  
        axios.get(`/api/user-role/${id}`).then((response) => { 
            if(response.status == 200){   
                $('#role_id').val(response.data.id);
                $('#user_role').val(response.data.role);
                $('#user_role').val(response.data.role);
                $('#is_active').val(response.data.is_active);

                $(`.user_role_permission`).prop('checked', false); 
                $.each(response.data.permission_data, function(key,val){        
                    $(`#permission_${val.permission_id}`).prop('checked', true);     
                }); 
  
                // for remove validation    
                setValue("user_role", response.data.role )
                setValue("is_active", response.data.is_active )
                
            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.'); 
            $('#errorMsg').slideDown(1000);
        }); 
        
    }

    const submitData = ()=>{ 

        const id = $('#role_id').val(); 
        const user_role = $('#user_role').val(); 
        const is_active = $('#is_active').val(); 
        
        var user_role_permission = $('input[type=checkbox]:checked').map(function(_, el) {
            return $(el).val();
        }).get(); 

        const sendData = {
            'user_role' : user_role,
            'user_role_permission' : user_role_permission,
            'is_active' : is_active,
            'user_token' : localStorage.getItem('user_token')
        }      
        
        if(id){
            axios.put(`/api/user-role/${id}`, sendData).then((response) => { 
                if(response.status == 200){   
                    toast(response.data.msg); 
                    //Hide modal
                    $("[data-bs-dismiss=modal]").trigger({ type: "click" });
                }
            }).catch((error)=> {  
                toast('Technical issue.')
            }); 
        }else{
            axios.post(`/api/user-role`, sendData).then((response) => { 
                if(response.status == 200){
                    //navigate(`/admin/role`);
                    toast(response.data.msg); 
                    
                    //Hide modal
                    $("[data-bs-dismiss=modal]").trigger({ type: "click" });
                }
            }).catch((error)=> {   
                toast('Technical issue.')  
            }); 
        }
        operationData('Update');
        $('#user_role_form').trigger("reset");
    }
    
    const searchData = (e) => {
        var search_data = e.currentTarget.value?e.currentTarget.value:0;  
        async function getData(){
            const roleRes =  await axios.get(`/api/user-role/search/${search_data}`);
            roleData(roleRes.data); 
            
            if(roleRes.data.length == 0){
                $('.wating_text').text('No record.');
                $('.wating_color').removeClass('alert-success');
                $('.wating_color').addClass('alert-danger');
            }
        }
        getData(); 
    };

    const fetchData = async (pageNumber = 1) => { 
        const roleRes = await axios.get(`/api/user-role?page=${pageNumber}&record_count=10`); 
        roleData(roleRes.data.data);
 
        const rolePaginationRes = await axios.get(`/api/user-role?page=${pageNumber}&record_count=10`); 
        rolePaginationData(rolePaginationRes.data); 

        // if(roleRes.data.data.length<2){ 
        //     $('.pagination').hide();
        // }else{
        //     $('.pagination').show();
        // }
        // rolePermissionData([
        //     {id:1, permission:'Create'},
        //     {id:2, permission:'Edit'},
        //     {id:3, permission:'Delete'},
        // ]);

        if(role.length==0){
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
        $('#role_id').val('');
        $('#user_role_form').trigger("reset");
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
                Role
                </div>
                <section>
                    <div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="select_campaign">
                                    <div className="select_campaignleft">
                                        <input className="search_input" type="text" placeholder="Search role" id="role_search" onChange={searchData} />
                                        {/* <input className="input_date" type="date" name="" /> */}
                                    </div>
                                    <div className="select_campaignright">
                                        <a href="#" className="utm_btn" data-bs-toggle="modal" data-bs-target="#utm_modal" onClick={resetData}>Add Role</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12"> 
                                <div className="table_main_outer mt-2">
                                    <div className="table-responsive"> 
                                        <table className="table table-bordered">
                                            <thead className="bg-dark text-white">
                                            <tr>
                                                <th scope="col"> Sr. No.</th>
                                                <th scope="col">Role</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>  
                                            {
                                                (role.length)?
                                                role.map((role_data,key)=>{ 
                                                return (
                                                    <tr id={`row_${role_data.id}`} key={role_data?.id}>
                                                        <td>{
                                                            (rolePagination.current_page-1) * 10+key+1
                                                         }</td>
                                                        <td>  { role_data.role } </td>
                                                        <td>{ (role_data.is_active)?'Active':'Inactive' }</td>
                                                        <td>
                                                        <div className="list_td">
                                                            <a href="#" data-bs-target="#utm_modal" data-bs-toggle="modal" onClick={selectRole}>
                                                                <i className="fas fa-edit" id={role_data.id}></i>
                                                            </a> &nbsp;
                                                            <a href="#" onClick={deleteRole}>
                                                                <i className="fas fa-trash-alt text-danger" id={role_data.id}></i>
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
                                                activePage={rolePagination?.current_page ? rolePagination?.current_page : 0}
                                                itemsCountPerPage={rolePagination?.per_page ? rolePagination?.per_page : 0 }
                                                totalItemsCount={rolePagination?.total ? rolePagination?.total : 0}
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
                                    {/* <ul className="pagination_ul">
                                        <li><a className="active" href="#">1</a></li>
                                        <li><a href="#">2</a></li>
                                        <li><a href="#">3</a></li>
                                        <li><a href="#">4</a></li>
                                        <li><a href="#">4</a></li>
                                        <li><a href="#"><i className="fal fa-angle-double-right"></i></a></li>
                                    </ul> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
        

                <div className="modal custom_modal fade model_div" id="utm_modal" tabIndex="-1" role="dialog" aria-labelledby="utm_modalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                        
                            <form action="" method="POST" id="user_role_form" onSubmit={handleSubmit(submitData)} autoComplete="OFF">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="utm_modalTitle">{buttonText} Role</h5>
                                    <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <span className="text-danger custom-star">*</span>
                                        <div className="col-md-12"> 
                                            <input type="text" name="user_role" className="input_cus" placeholder="Add Role" id="user_role" {...register('user_role', { required: true })} /> 
                                            {errors.user_role && <p className="custom-error-messager">Add role is required.</p>}
                                        </div>  
                                        <span className="text-danger custom-star">*</span>
                                        <div className="col-md-12">
                                            <select className="input_cus" id="is_active" {...register('is_active', { required: true })}>
                                                <option value="">Select status</option>
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                            
                                            { errors.is_active && <p className="custom-error-messager">Role status is required.</p>}
                                        </div>

                                        <div className="col-md-12 mt-1"> 
                                        <label>Add Permission</label> <hr />
                                         {
                                             (rolePermission.length)?
                                             rolePermission.map( (permissionData,key)=>{ 
                                             return (
                                                 <div className="form-check form-check-inline" key={key}>
                                                     <input className="form-check-input user_role_permission" type="checkbox" id={`permission_${permissionData.id}`} value={ permissionData.id } name="user_role_permission[]"/>
                                                     <label className="form-check-label" htmlFor={`permission_${permissionData.id}`} >{ permissionData.permission }</label>
                                                 </div>
                                             )}): <span>Add role</span>
                                         }
                                         
                                        </div>
                                    </div> 
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="para_save_outer"> 
                                                <button className="utm_btn">{buttonText} Role</button> 
                                            </div>
                                        </div>
                                    </div>
                                    <input type="hidden" id="role_id" /> 
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
export default UserRole;