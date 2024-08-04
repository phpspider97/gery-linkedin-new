import dashboard from './dashboard';
import widget from './widget';
import application from './application';
import forms from './forms';
import elements from './elements';
import pages from './pages';
import utilities from './utilities';
import support from './support';
import other from './other';
import admin from './admin';
import staff from './staff';
//import {Link, useNavigate} from 'react-router-dom'; 
//const navigate = useNavigate();
 
let is_admin = window.location.href.split('/')[3]
if(is_admin == 'admin' || is_admin == 'user'){
    if(localStorage.getItem('user_token') == '' || localStorage.getItem('user_token') == null){
        window.location.href = "/login";
    }
}

// ==============================|| MENU ITEMS ||============================== //

var menuItems
if(is_admin == 'admin'){ 
    if(localStorage.getItem('login_level') == 3){
        menuItems = { 
            items: [staff]
        };
    }else{
        menuItems = { 
            items: [admin]
        };
    }
}else{ 
    menuItems = { 
        items: [dashboard, widget] 
    };
}
 
export default menuItems;

 