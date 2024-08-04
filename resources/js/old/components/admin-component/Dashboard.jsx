import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {Link, useNavigate} from 'react-router-dom'; 
import $ from 'jquery';
import Top from "./common/Top";
import Menu from "./common/Menu";
import Bottom from "./common/Bottom"; 

function Dashboard() {
    const navigate = useNavigate();
    const [userCount,userCountData] = useState('1');
    const [loginLevel,loginLevelData] = useState('1');
    const [sidebarDisplay,setSidebarDisplay] = useState('inActive');
    
    const openSidebar = ()=>{
        if(sidebarDisplay === 'inActive'){
            setSidebarDisplay('active');
        }else{
            setSidebarDisplay('inActive');
        } 
    }

    useEffect(()=>{  
        loginLevelData(localStorage.getItem('login_level'));
        async function getData(){
            const userRes = await axios.get(`/api/user`); 
            userCountData(userRes.data.length);
        }
        getData();
    },[]);

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
                  Dashboard
                </div>
                <div className="row dashboard_row">
                    <div className="col-md-4">
                        <div className="dashboard_box">
                            <div className="box_title">
                                User<br />
                                Count
                            </div>
                            <div className="count_title">
                                { userCount }
                            </div>
                        </div>
                    </div>
                    <div className={`col-md-4 ${loginLevel != 3 ?'show_staff':'hide_staff'}`}>
                        <div className="dashboard_box orange">
                            <div className="box_title"> 
                                Add <br /> Staff
                            </div>
                            <div className="count_title">
                               <Link to="staff"> <i className="fas fa-edit"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="dashboard_box green">
                            <div className="box_title"> 
                                Add <br /> User
                            </div>
                            <div className="count_title">
                            <Link to="user"><i className="fas fa-edit"></i></Link>
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
export default Dashboard;