const axios = require('axios');
const server_url = 'http://127.0.0.1:8000/';

const config = {
    headers:{
        'Content-type':'application/json',
    }
}
export const login = (data,callback) =>{
    const {email,password,token} = data;
    const body = JSON.stringify({email, password,token})
    axios.post(server_url+'api/login',body,config)
    .then(res =>{
        if(res.data.success){
            if(typeof window !=='undefined'){
                localStorage.setItem('jwt',JSON.stringify(res.data))
              }
        }

        if(typeof callback==="function"){
            callback(res)
        }
    }).catch(err=>console.log(err))
}

//register

export const register = (user,callback) =>{
    const {email,username,password} =user

    const body = JSON.stringify({email, username, password})

    axios.post(server_url+'api/register', body,config)
    .then(res =>{
        if(res.data.success){
            localStorage.setItem('token',res.data.token)
        }

        if(typeof callback==="function"){
            callback(res)
        }
    }).catch(err=>console.log(err))
}

// forgot pasword


export const forgotpassword = (data,callback) =>{

    const {email} = data;

    const body = JSON.stringify({email})
   
    axios.post(server_url+'api/forgot-password',body,config)
    .then(res =>{
        if(res.data.success){
           
        }

        if(typeof callback==="function"){
            callback(res)
        }
    }).catch(err=>console.log(err))
}


export const resetpassword = (data,callback) =>{

    const {password,token} = data;

    const body = JSON.stringify({password,token})
   
    axios.post(server_url+'api/reset-password',body,config)
    .then(res =>{
        if(res.data.success){
           
        }

        if(typeof callback==="function"){
            callback(res)
        }
    }).catch(err=>console.log(err))
}


export const verifyaccount = (data,callback) =>{

    const {token} = data;

    const body = JSON.stringify({token})
   
    axios.post(server_url+'api/verify-account',body,config)
    .then(res =>{
        if(res.data.success){
           
        }

        if(typeof callback==="function"){
            callback(res)
        }
    }).catch(err=>console.log(err))
}

/// update profile


export const updateprofile = (data,callback) =>{

    const {old_password,username,password,token} = data;

    const body = JSON.stringify({old_password,username,password,token})
   
    axios.post(server_url+'api/update-profile',body,config)
    .then(res =>{
        if(res.data.success){
           
        }

        if(typeof callback==="function"){
            callback(res)
        }
    }).catch(err=>console.log(err))
}



export const authenticate =  (data, next) =>{

    if(typeof window !=='undefined'){
      localStorage.setItem('jwt',JSON.stringify(data))
      next();
    }
  }

export const logout = () =>{

    if(typeof window !=='undefined'){
        localStorage.removeItem('jwt');

      
      }
   
    window.location.reload()
}

export const isAuthenticated = () =>{
    if(typeof window =='undefined'){
        return false;
    }

    if(localStorage.getItem('user_token')){
        return JSON.parse(localStorage.getItem('user_token'));
    }else{
        return false;
    }
}


// get user list 

export const userListing = (data,callback) =>{

    const {token} = data;

    const body = JSON.stringify({token})
   
    axios.get(server_url+'api/getUsers',body,config)
    .then(res =>{
        if(res.data.success){
           
        }

        if(typeof callback==="function"){
            callback(res)
        }
    }).catch(err=>console.log(err))
}

// delete account d

export const deleteAccount = (data,callback) =>{
    const {token,status} = data;

    const body = JSON.stringify({token,status})
    
    axios.post(server_url+'api/delete-account',body,config)
    .then(res =>{
        if(res.data.success){
           
        }

        if(typeof callback==="function"){
            callback(res)
        }
    }).catch(err=>console.log(err))
}