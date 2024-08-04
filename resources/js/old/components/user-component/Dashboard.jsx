import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom'; 
import {Link, useNavigate} from 'react-router-dom'; 
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
import $ from 'jquery';
import Top from "./common/Top";
import Bottom from "./common/Bottom"; 
import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png"; 
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Circles,TailSpin,ThreeDots } from  'react-loader-spinner'
import SortIcon from "@material-ui/icons/ArrowDownward";
import DataTable from "react-data-table-component";
import Pagination from "react-js-pagination";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
 
const columns = [
    {
      id: 1,
      name: "Account",  
      selector: (row) => row.name, 
      sortable: true,
      reorder: true, 
      wrap: true,
      style: { 
        '&:hover': {
          cursor: 'pointer', 
        },  
        'div:hover': {
            zIndex: 10000,
            minWidth: 'auto',
           // padding:'10px',
           bottomBorder: '1px solid #004AAD',
            //color:'white'
        }
      }
    },
    {
      id: 2,
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      reorder: true
    },
    {
        id: 3,
        name: "Spend",
        selector: (row) => (row.costInLocalCurrency)?parseInt(Math.round(row.costInLocalCurrency)):0??'-',
        cell: (row) => (row.costInLocalCurrency)?`$`+Math.round(row.costInLocalCurrency).toLocaleString("en-US"):0??'-',
        sortable: true,
        reorder: true,
         style:{ textAlign: 'left'}
      },
      {
          id: 6,
          name: "Impressions",
          selector: (row) => (row.impressions)?row.impressions:0,
          cell: (row) => (row.impressions)?row.impressions.toLocaleString("en-US"):0,
          sortable: true, 
          reorder: true, 
          style:{ textAlign: 'left'}
      },
      {
          id: 7,
          name: "Clicks",
          selector: (row) => (row.clicks)?row.clicks:0,
          cell: (row) => (row.clicks)?row.clicks.toLocaleString("en-US"):0,
          sortable: true, 
          reorder: true,
          style:{ textAlign: 'left'}
      },
  
      {
          id: 8,
          name: "Average CTR",
          selector: (row) =>  (row.clicks)?((row.clicks/row.impressions)*100).toFixed(2)??'-':0,
          cell: (row) =>  (row.clicks)?((row.clicks/row.impressions)*100).toFixed(2)+'%'??'-':0,
          sortable: true, 
          reorder: true,
          style:{ textAlign: 'left'}
        },
        {
          id: 9,
          name: "Average CPM",
          selector: (row) => (row.costInLocalCurrency)?((row.costInLocalCurrency/(row.impressions/1000))).toFixed(2)??'-':0,
          cell: (row) => (row.costInLocalCurrency)?'$'+((row.costInLocalCurrency/(row.impressions/1000))).toFixed(2)??'-':0,
          sortable: true, 
          reorder: true,
          style:{ textAlign: 'left'}
        },
        {
          id: 10,
          name: "Average CPC",
          selector: (row) => (row.costInLocalCurrency)?(row.costInLocalCurrency/row.clicks).toFixed(2)??'-':0,
          cell: (row) => (row.costInLocalCurrency)?'$'+(row.costInLocalCurrency/row.clicks).toFixed(2)??'-':0,
          sortable: true, 
          reorder: true,
          style:{ textAlign: 'left'}
      },
      // {
      //   id: 4,
      //   name: "Key Results",
      //   selector: (row) => row.runtime??'-',
      //   sortable: true,
      //   reorder: true,
      //   style:{ textAlign: 'left'}
      // },
      {
        id: 5,
        name: "Conversion Cost",
        selector: (row) => (row.externalWebsiteConversions)?Math.round(row.costInLocalCurrency/row.externalWebsiteConversions)??'-':0,
        cell: (row) => (row.externalWebsiteConversions)?'$'+Math.round(row.costInLocalCurrency/row.externalWebsiteConversions).toLocaleString("en-US")??'-':0,
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
      },
      {
        id: 11,
        name: "Leads",
        selector: (row) => row.oneClickLeads??'-',
        sortable: true, 
        reorder: true,
        style:{ textAlign: 'left'}
      },
      {
        id: 12,
        name: "Cost Per Lead",
        selector: (row) => (row.oneClickLeads)?(row.costInLocalCurrency/row.oneClickLeads).toFixed(2)??'-':0,
        cell: (row) => (row.oneClickLeads)?'$'+(row.costInLocalCurrency/row.oneClickLeads).toFixed(2)??'-':0,
        sortable: true, 
        reorder: true,
        style:{ textAlign: 'left'}
      }
];

function Dashboard() {
    setTimeout(function () { 
        $('.lnndaO').css("width", "130px"); 
    }, 1000);

    const navigate = useNavigate();
    const [account,accountData] = useState([]); 
    const [fixAccount,fixAccountData] = useState([]); 
    const [selectAccount,selectAccountData] = useState('/user'); 
    const [selectedRows, setSelectedRows] = React.useState([]); 
    const [pending, setPending] = React.useState(true);

    var today = new Date(); 
    let startDate = moment().subtract(29, 'days').format('MM/DD/YYYY') 
    let today_date = moment().subtract(0, 'days').format('MM/DD/YYYY') 
    const [currentDate, setCurrentDate] = useState((localStorage.getItem('current_date'))?localStorage.getItem('current_date'):today_date);
    const [previousDate, setPreviousDate] = useState((localStorage.getItem('previous_date'))?localStorage.getItem('previous_date'):startDate); 

    let default_start_date = previousDate.trim().replaceAll("/", "@");
    let default_end_date = currentDate.trim().replaceAll("/", "@");
    let search_date_range = `${default_start_date}_${default_end_date}`;
    const [defaultDateRange, setDefaultDateRange] = React.useState(search_date_range);

    const onRowClicked = (row, event) => { 
        navigate(`/user/campaign-group?account=${row.id}`); 
    };

    // const handleChange = () => {
    //     var a_selected_account = [];
    //     var count = -1;
    //     $('input[type=checkbox]').each(function(e){
    //         console.log($(this).val());
    //         if(this.checked){ 
    //             count++;
    //             if(count>0){ 
    //                 a_selected_account[count-1] = $(this).val(); 
    //             }
    //         } 
    //     }); 
    //     let selected_account = a_selected_account.join(','); 
    //     selectAccountData(`/user/campaign-group?account=${selected_account}`);
    // };

    const handleRowSelected = React.useCallback(state => { 
        let row_data = state.selectedRows;
        var a_selected_account = [];
        var count = -1;
        row_data.forEach(function(item){
            count++;
            a_selected_account[count] = item.id;
        });
        let selected_account = a_selected_account.join(','); 
        if(selected_account != ''){
            selectAccountData(`/user/campaign-group?account=${selected_account}`);
        }
	}, []);

    const searchName = (e) => { 
        let search_data = e.target.value; 
        const filteredItems = fixAccount.filter(
            item => item.name && item.name.toLowerCase().includes(search_data.toLowerCase()),
        );
        if( search_data !=  ''){
            accountData(filteredItems);
        }else{
            getData();
        }
    }; 
    const searchStatus = (e) => {
        let filter_data = e.target.value; 
        setPending(true);
        let search_date_range = defaultDateRange;   
        //console.log(`/api/linkedin/account/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`)
        axios.get(`/api/linkedin/account/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
            //accountData(response.data.elements);  
            const filteredItems = response.data.elements.filter(
                item => item.status && item.status.toLowerCase().includes(filter_data.toLowerCase()),
            ); 
            if(filter_data !=  ''){
                accountData(filteredItems); 
            }else{
                accountData(response.data.elements);
            }  
            const timeout = setTimeout(() => { 
                setPending(false);
            }, 1000); 
            return () => clearTimeout(timeout); 
        });
    }; 
    //$('.applyBtn').on('click',function(){
    $('.input_date').on('change',function(){ 
        setPending(true);
        $('.filter_status_data').val('');
        let search_date_range = $('.input_date').val(); 
        let modify_search_data = search_date_range.split('-');
        setPreviousDate(modify_search_data[0]) 
        setCurrentDate(modify_search_data[1]) 
        localStorage.setItem('current_date',modify_search_data[1])
        localStorage.setItem('previous_date',modify_search_data[0])
        let start_date = modify_search_data[0].trim().replaceAll("/", "@");
        let end_date = modify_search_data[1].trim().replaceAll("/", "@");
        search_date_range = `${start_date}_${end_date}`;

        if(search_date_range == ''){
            getData();
        }else{
            setDefaultDateRange(search_date_range)
            getData(search_date_range);
        } 
    });
 
    const getData = async (search_date_range='',filter_data='') => {  
        if(search_date_range === ''){
            search_date_range = defaultDateRange;
        }
        //console.log(`/api/linkedin/account/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`)
        await axios.get(`/api/linkedin/account/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
            accountData(response.data.elements);
            fixAccountData(response.data.elements);
            
            // Add account id in clickable link
            if(response.data.elements != undefined){
                var a_selected_account = [];
                var count = -1;
                response.data.elements.forEach(function(item){
                    count++;
                    a_selected_account[count] = item.id;
                });
                let selected_account = a_selected_account.join(','); 
                selectAccountData(`/user/campaign-group?account=${selected_account}`);
            }
            const timeout = setTimeout(() => { 
                setPending(false);
            }, 1000); 
            return () => clearTimeout(timeout);

            // if(response.data.length == 0 || response.data.length == undefined){
            //     $('.wating_text').text('No record.');
            //     $('.wating_color').removeClass('alert-success');
            //     $('.wating_color').addClass('alert-danger');
            // }
        });
    }
    useEffect(()=>{   
        getData(); 

        let current_url = window.location.href;
        let code_state = current_url.split('?')[1];
        $('#login_loader_div').hide();
        if(code_state !== undefined){ 
            //let redirect_url = 'http://localhost:3000/user'; 
            let redirect_url = 'https://www.pipelight.io/user';
            let user_id = localStorage.getItem('user_token'); 
            //console.log(`/api/linkedin/createAccount?${code_state}&redirect_url=${redirect_url}&user_id=${user_id}`);
            $('#login_loader_div').show();
            $('#dashboard_div').hide();
            
            axios.post(`/api/linkedin/createAccount?${code_state}&redirect_url=${redirect_url}&user_id=${user_id}`).then((response) => { 
                //console.log(response);
                if(response.data.status == 'success'){ 
                    localStorage.setItem('user_token', response.data.token); 
                    localStorage.setItem('user_name', response.data.user_name);
                    localStorage.setItem('user_linkedin_account_id', response.data.linkedin_id);
                    //setCode(""); 
                    toast(`Your account update.`); 
                    window.opener.location.href=`/${response.data.redirect}`;
                    self.close();
                    
                    navigate(`/${response.data.redirect}`);
                }else{
                    toast(`${response.data.msg}`)
                }
            }).catch( (error)=> {  
                console.log(error);
                toast('Tehnical issue.');
            });
           // accountData(accountRes.data);
        }

    },[]); 
    //console.log(account)
    return (
        <> 
        <Top />
        <div className='text-center mt-5 mx-auto' id='login_loader_div' style={{ paddingLeft:'40%',paddingTop:'25%'}}>
            <Circles height="100" width="100" color='grey' align="center" ariaLabel='loading' />
        </div>
        <section className="admin_body" id="dashboard_div">
            <div className="custom_container">
                <div className="row admin_upper_row1">
                    {/* <div className="col-md-12">
                        <div className="admin_top_right pull-right">
                            <button className="utm_btn bg-success custom-button" onClick={linkedInLogin}>SYNC Account</button>
                        </div>
                    </div> */}
                    <div className="col-md-6">
                        <div className="admin_top_left">
                            <ul className="nav nav-tabs custom_tabs" role="tablist">
                                <li className="nav-item" > 
                                    <Link to='/user' className="nav-link active">Account</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={selectAccount} className="nav-link add_account" >Campaign Groups</Link>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#" disabled>Campaigns</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#" disabled>Ads</a>
                                </li>
                            </ul>  
                        </div>
                    </div>
                    <div className="col-md-6 mt-2">
                        <div className="admin_top_right"> 
                            {/* <a href="#" className="utm_btn">UTM Wizard</a> */}
                            <select className="custom_select_box filter_status_data" onChange={searchStatus} defaultValue={''}>
                                <option value="">Select Status</option>
                                <option value="ACTIVE">Active</option>
                                {/* <option value="ARCHIVED">Archived</option> */}
                                <option value="CANCELED">Canceled</option>
                                <option value="DRAFT">Draft</option>
                                {/* <option value="PAUSED">Paused</option> */}
                            </select>
                            <input className="search_input" type="text" placeholder="Search" name="" onChange={searchName}/>  
                            <DateRangePicker initialSettings={{ startDate: previousDate, endDate: currentDate }}>
                                <input type="text" className="input_date" />
                            </DateRangePicker>
                        </div>
                    </div>
                </div>

                <div className="row">
                <div className="col-md-12">
                    <div className="table_main_outer">
                        <div className="table-responsive">
                            <DataTable
                                title=""
                                columns={columns}
                                data={account}
                                defaultSortFieldId={1}
                                sortIcon={<SortIcon />}
                                pagination
                                selectableRows
                                onSelectedRowsChange={handleRowSelected}
                                progressPending={pending}
                                progressComponent={<ThreeDots color="#00BFFF" height={60} width={60}/>}
                                onRowClicked={onRowClicked}
                            /> 
                        </div> 
                    </div>
                </div>
                {/* <div className="col-md-12 text-center">
                     
                </div>  */}
                </div>
            </div>
        </section>
        <Bottom />
    </>
    );
}
export default Dashboard;