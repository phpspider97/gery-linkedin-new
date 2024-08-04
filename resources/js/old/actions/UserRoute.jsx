import React, { Component } from 'react'; 

function UserRoute({ children }){  
    if(localStorage.getItem('user_token')){
        return children;
    }else{   
        window.location.href = "/";
    }
}
export default UserRoute;