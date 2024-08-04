import React,{ useState,useEffect} from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Routes, Switch } from 'react-router-dom';
import Login from "./Login"; 
import Registration from "./Registration"; 
import Logout from "./Logout"; 
import ForgotPassword from "./ForgotPassword";
import ChangeForgotPassword from "./ChangeForgotPassword";

import AdminDashboard from "./admin-component/Dashboard";
import UserRole from "./admin-component/UserRole";
import AddUser from "./admin-component/AddUser";
import AddStaff from "./admin-component/AddStaff";
import AdminRoute from '../actions/AdminRoute';
import UserRoute from '../actions/UserRoute';

import UserDashboard from "./user-component/Dashboard";
import CampaignGroup from "./user-component/CampaignGroup";
import Campaign from "./user-component/Campaign";
import Creative from "./user-component/Creative";
import Test from "./Test";

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import rootReducer from '../service/reducers/Index'

const store = createStore(rootReducer)

function App() {
    const [token, setToken] = useState();
    return (
        <>
            <Router> 
                <Routes> 
                    <Route exact path='/' element={<Login/>} />
                    <Route exact path='/registration' element={<Registration/>} />
                    <Route exact path='/forgot-password' element={<ForgotPassword/>} />
                    <Route exact path='/change-forgot-password/:id' element={<ChangeForgotPassword/>} />

                    {/* ADMIN ROUTES */} 
                    <Route path="/admin" element={ <AdminRoute> <AdminDashboard /> </AdminRoute> } /> 
                    <Route path="/admin/role" element={ <AdminRoute> <UserRole /> </AdminRoute> } /> 
                    <Route path="/admin/user" element={ <AdminRoute> <AddUser /> </AdminRoute> } /> 
                    <Route path="/admin/staff" element={ <AdminRoute> <AddStaff /> </AdminRoute> } /> 
                  
                    {/* USER ROUTES */}
                    <Route path="/user" element={ <UserRoute> <UserDashboard /> </UserRoute> } /> 
                    <Route path="/user/campaign-group" element={ <UserRoute> <CampaignGroup /> </UserRoute> } /> 
                    <Route path="/user/campaign/:campaignGroupID" element={ <UserRoute> <Campaign /> </UserRoute> } /> 
                    <Route path="/user/creative/:adsID" element={ <UserRoute> <Creative /> </UserRoute> } /> 
                    <Route exact path='/logout' element={<Logout/>} />

                    <Route exact path='/test' element={<Test/>} />

                </Routes> 
            </Router>
        </>
    );
}
 
export default App;
if (document.getElementById('app')) {
    ReactDOM.render(<Provider store={store} ><App /></Provider>, document.getElementById('app'));
}
