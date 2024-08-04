import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation} from 'react-router-dom';
import $ from 'jquery'; 

export default function Menu(props) {
    const location = useLocation();
    const [loginLevel,loginLevelData] = useState('1');
    
    const { pathname } = location;
    const splitLocation = pathname.split("/");

    useEffect(()=>{  
        loginLevelData(localStorage.getItem('login_level'));
    },[]);
    return (
        <>
        <nav id="sidebar" class={props.is_display}>
            <ul className="list-unstyled components">
                <li className={ (splitLocation[1] === "admin" && splitLocation[2] === undefined )? "active" : ""}>
                    <Link to="/admin"><i className="fas fa-chart-line"></i> &nbsp; Dashboard</Link>
                </li>
                <li className={ splitLocation[2] === "role" ? "active" : "" || loginLevel != 3 ?'show_staff':'hide_staff'}>
                    <Link to="/admin/role"><i className="fas fa-database"></i> &nbsp; Role</Link>
                </li>
                <li className={ splitLocation[2] === "staff" ? "active" : "" || loginLevel != 3 ?'show_staff':'hide_staff' } >
                    <Link to="/admin/staff"><i className="fas fa-user"></i> &nbsp; Staff</Link>
                </li>
                <li className={splitLocation[2] === "user" ? "active" : ""}>
                    <Link to="/admin/user"><i className="fas fa-user"></i> &nbsp; User</Link>
                </li>
                <hr className="hr-style"/>
                <li>
                    <Link to="/logout"> <i className="fas fa-sign-out-alt"></i> &nbsp; Log Out</Link>
                </li>
                {/* <li>
                    <a href="#homeSubmenu" data-bs-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Settings</a>
                    <ul className="collapse list-unstyled" id="homeSubmenu">
                        <li>
                            <a href="#">Home 1</a>
                        </li>
                        <li>
                            <a href="#">Home 2</a>
                        </li>
                        <li>
                            <a href="#">Home 3</a>
                        </li>
                    </ul>
                </li> */} 
            </ul>
        </nav> 
        </>
    )
}
