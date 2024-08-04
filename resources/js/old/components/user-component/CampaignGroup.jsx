import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom'; 
import {Link, useNavigate} from 'react-router-dom';
import $ from 'jquery';
import Top from "./common/Top";
import Bottom from "./common/Bottom"; 
import SortIcon from "@material-ui/icons/ArrowDownward";
import DataTable from "react-data-table-component"; 
import Pagination from "react-js-pagination";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Circles,TailSpin,ThreeDots } from  'react-loader-spinner'

const columns = [
    {
      id: 1,
      name: "Campaign Group Name",
      selector: (row) => row.name,
      sortable: true,
      reorder: true,
      wrap: true,
      style:{ 
        textAlign: 'left',
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
    }, 
    },
    {
        id: 2,
        name: "Status",
        selector: (row) => row.status??'-',
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
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
      selector: (row) => (row.costInLocalCurrency/row.oneClickLeads).toFixed(2)??'-',
      cell: (row) => (row.oneClickLeads)?'$'+(row.costInLocalCurrency/row.oneClickLeads).toFixed(2):'-',
      sortable: true, 
      reorder: true,
      style:{ textAlign: 'left'}
    }
]; 

function CampaignGroup() {
   
    setTimeout(function () {   
        $('.lnndaO').css("width", "150px"); 
    }, 1000);

    const navigate = useNavigate();
    const [campaignGroup,campaignGroupData] = useState([{
        name : 'loading..'
    }]);
    const [fixCampaignGroup,fixCampaignGroupData] = useState([{}]);
    const [selectCampaignGroup,selectCampaignGroupData] = useState('/user/campaign-group');
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [pending, setPending] = React.useState(true);
    const [filter, setFilter] = useState(''); 

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
        navigate(`/user/campaign/${row.id}`); 
    };

    // $("#check_all").on("click",function(){ 
    //     $('input:checkbox').not(this).prop('checked', this.checked);
    //     if(!this.checked){
    //         selectCampaignGroupData(`/user`);
    //     }else{ 
    //         var a_selected_account = [];
    //         var count = -1;
    //         $('input[type=checkbox]').each(function(){
    //             if(this.checked){ 
    //                 count++; 
    //                 if(count>0){  
    //                     a_selected_account[count-1] = $(this).val();
    //                 } 
    //             }
    //         });  
    //         let selected_account = a_selected_account.join(','); 
    //         selectCampaignGroupData(`/user/campaign/${selected_account}`);
    //     }
    // });

    const handleRowSelected = React.useCallback(state => { 
        let row_data = state.selectedRows;
        var a_selected_campaign_group = [];
        var count = -1;
        row_data.forEach(function(item){
            count++;
            a_selected_campaign_group[count] = item.id;
        });
        let selected_campaign_group = a_selected_campaign_group.join(',');  
        if(selected_campaign_group != ''){
            selectCampaignGroupData(`/user/campaign/${selected_campaign_group}`);
        }
	}, []);
    
    const searchName = (e) => {
        let search_data = e.target.value; 
        const filteredItems = fixCampaignGroup.filter(
            item => item.name && item.name.toLowerCase().includes(search_data.toLowerCase()),
        );
        if( search_data !=  ''){
            campaignGroupData(filteredItems);
        }else{
            getData();
        }
    };
     
    const searchStatus = (e) => {
        let filter_data = e.target.value; 
        setPending(true);
        let search_date_range = defaultDateRange; 
        let campaign_group_id = window.location.href.split('=').pop(); 
        axios.get(`/api/linkedin/campaignGroup/${campaign_group_id}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
            //campaignGroupData(response.data.elements);  
            const filteredItems = response.data.elements.filter(
                item => item.status && item.status.toLowerCase().includes(filter_data.toLowerCase()),
            ); 
            if(filter_data !=  ''){
                fixCampaignGroupData(filteredItems);
                campaignGroupData(filteredItems); 
            }else{
                fixCampaignGroupData(response.data.elements);
                campaignGroupData(response.data.elements);
            }  
            const timeout = setTimeout(() => { 
                setPending(false);
            }, 1000); 
            return () => clearTimeout(timeout); 
        });
    }; 
     
    //$('.input_date').on('change',function(){  
    function handleCallback(start, end, label) { 
        let is_search_val_exist = $('.search_name').val()
        setPending(true);  
        $('.filter_status_data').val('');
        let search_date_range = $('.input_date').val(); 
        //console.log(search_date_range);
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
            getData(search_date_range,is_search_val_exist);
        } 
    };
 
    const getData = async (search_date_range='',is_search_val_exist='') => {
        if(search_date_range === ''){
            search_date_range = defaultDateRange;
        }
        let filter_data = filter; 
        let campaign_group_id = window.location.href.split('=').pop(); 
        localStorage.setItem('user_selected_account_for_utm',campaign_group_id);  
  
        await axios.get(`/api/linkedin/campaignGroup/${campaign_group_id}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => {
            //console.log(response.data.elements)

            if(is_search_val_exist !== ''){
                let search_data = is_search_val_exist; 
                const filteredItems = fixCampaignGroup.filter(
                    item => item.name && item.name.toLowerCase().includes(search_data.toLowerCase()),
                );
                campaignGroupData(filteredItems); 
                fixCampaignGroupData(response.data.elements);
            }else{
                campaignGroupData(response.data.elements); 
                fixCampaignGroupData(response.data.elements);
                $('.filter_status_data').val('');
            }
 
            // Add campaign group id in clickable link
            var a_campaign_group_account = [];
            var count = -1;
            response.data.elements.forEach(function(item){
                count++;
                a_campaign_group_account[count] = item.id;
            });
            let selected_campaign_group = a_campaign_group_account.join(','); 
            selectCampaignGroupData(`/user/campaign/${selected_campaign_group}`);

            const timeout = setTimeout(() => { 
                setPending(false);
            }, 1000);
            return () => clearTimeout(timeout);
        });
    }  
    useEffect(()=>{   
        getData();
    },[]);  
    return (
        <> 
        <Top />
        <section className="admin_body">
            <div className="custom_container">
                <div className="row admin_upper_row">
                <div className="col-md-6">
                    <div className="admin_top_left">
                    <ul className="nav nav-tabs custom_tabs" role="tablist">
                        <li className="nav-item"> 
                            <Link to='/user' className="nav-link">Account</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/user/campaign-group' className="nav-link active">Campaign Groups</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={selectCampaignGroup}>Campaigns</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" disabled>Ads</a>
                        </li>
                        </ul>  
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="admin_top_right">
                        {/* <a href="#" className="utm_btn">UTM Wizard</a> */}
                        <select className="custom_select_box filter_status_data" onChange={searchStatus} defaultValue={''}>
                            <option value="">Select Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="ARCHIVED">Archived</option>
                            <option value="CANCELED">Canceled</option>
                            {/* <option value="COMPLETED">Completed</option> */}
                            <option value="DRAFT">Draft</option>
                            <option value="PAUSED">Paused</option>
                        </select>
                        <input className="search_input search_name" type="text" placeholder="Search" name="" onKeyUp={searchName} /> 
                        <DateRangePicker initialSettings={{ startDate: previousDate, endDate: currentDate }} onCallback={handleCallback}>
                            <input type="text" className="input_date"/>
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
                            data={campaignGroup}
                            defaultSortFieldId={1}
                            sortIcon={<SortIcon />}
                            pagination
                            selectableRows
                            onSelectedRowsChange={handleRowSelected}
                            progressPending={pending}
			                progressComponent={<ThreeDots color="#00BFFF" height={60} width={60} />}
                            onRowClicked={onRowClicked}
                        />
                    {/* <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">
                                <input className="form-check-input" id="check_all" type="checkbox" value=""/>
                            </th> 
                            <th scope="col">Campaign Group Name</th> 
                            <th scope="col">Spend</th>
                            <th scope="col">Key Results</th>
                            <th scope="col">Cost Per Result </th>
                            <th scope="col">Impressions</th>
                            <th scope="col">Clicks</th>
                            <th scope="col">Average CTR</th>
                            <th scope="col">Average CPM</th>
                            <th scope="col">Average CPC</th>
                            <th scope="col">Leads</th>
                            <th scope="col">Cost Per Lead</th>
                        </tr>
                        </thead>
                        <tbody id="search_table"> 
                        {
                            (campaignGroup.length)?
                            campaignGroup.map((account_data,key)=>{ 
                            return (
                            <tr>
                                <td>
                                    <input className="form-check-input" id="check_all" type="checkbox" value=""/>
                                </td> 
                                <td className="text-left">  
                                    <Link to={`/user/campaign/${account_data.id}`} >{account_data.campaign_group_name}</Link>  
                                </td> 
                                <td>{account_data.costInLocalCurrency}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>{account_data.impressions}</td>
                                <td>{account_data.clicks}</td> 
                                <td>{account_data.ctr}</td> 
                                <td>{account_data.cpm}</td> 
                                <td>{account_data.runtime}</td> 
                                <td>{account_data.oneClickLeads}</td> 
                                <td>{account_data.runtime}</td>
                            </tr>
                            )
                            })
                            :
                            <tr className="alert alert-success col-md-12 text-center wating_color">
                                <td colSpan="9" className="wating_text">
                                    Loading...
                                </td>
                            </tr>
                        } 
                        </tbody>
                    </table> */}
                    </div>

                    {/* <ul className="pagination_ul">
                        <li><a className="active" href="#">1</a></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li><a href="#">4</a></li>
                        <li><a href="#"><i className="fal fa-angle-double-right"></i></a></li>
                    </ul> */}
                    </div>
                </div>
                </div>
            </div>
            </section>
        <Bottom /> 
    </>
    );
}
export default CampaignGroup;