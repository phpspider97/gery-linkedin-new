import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, useLocation} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
  

function Logout() {
     
    const navigate = useNavigate();
    localStorage.setItem('user_token', ''); 
    localStorage.setItem('user_name', '');
    localStorage.setItem('user_image', '');
    localStorage.setItem('user_linkedin_account_id', '');
    localStorage.setItem('user_selected_account_for_utm', '');
    localStorage.setItem('login_level', '');
    localStorage.setItem('user_selected_campaign_id', ''); 
    localStorage.setItem('current_date', ''); 
    localStorage.setItem('previous_date', ''); 
    //toast(`You logout successfully.`);
    window.location.href = '/';
   
}
export default Logout; 