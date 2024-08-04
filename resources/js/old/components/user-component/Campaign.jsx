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
import {toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
import { useForm } from 'react-hook-form'; 
import Worker from 'web-worker';
 
const columns = [
    {
      id: 1,
      name: "Campaign Name",
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
        id: 4,
        name: "Key Results",
        selector: (row) => row.oneClickLeads??'-',
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
    },
    {
        id: 5,
        name: "Cost Per Result",
        selector: (row) => (row.oneClickLeads)?(row.costInLocalCurrency/row.oneClickLeads).toFixed(2)??'-':0,
        cell: (row) => (row.oneClickLeads)?'$'+(row.costInLocalCurrency/row.oneClickLeads).toFixed(2)??'-':0,
        sortable: true,
        reorder: true,
        style:{ textAlign: 'left'}
      },
    {
        id: 6,
        name: "Impressions",
        selector: (row) => (row.impressions)?parseInt(Math.round(row.impressions)):0??'-',
        cell: (row) => (row.impressions)?row.impressions.toLocaleString("en-US"):0,
        sortable: true, 
        reorder: true, 
        style:{ textAlign: 'left'}
    },
    {
        id: 7,
        name: "Clicks",
        selector: (row) => (row.clicks)?row.clicks:0,
        cell: (row) => (row.clicks)?parseInt(row.clicks.toLocaleString("en-US")):0,
        sortable: true, 
        reorder: true,
        style:{ textAlign: 'left'}
    },

    {
        id: 8,
        name: "Average CTR",
        selector: (row) => (row.clicks)?((row.clicks/row.impressions)*100).toFixed(2):0,
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
        selector: (row) => (row.costInLocalCurrency)?(row.costInLocalCurrency/row.clicks).toFixed(2):0??'-',
        cell: (row) => (row.costInLocalCurrency)?'$'+(row.costInLocalCurrency/row.clicks).toFixed(2)??'-':0,
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
      selector: (row) => (row.oneClickLeads)?(row.costInLocalCurrency/row.oneClickLeads):0??'-',
      cell: (row) => (row.oneClickLeads)?'$'+(row.costInLocalCurrency/row.oneClickLeads).toFixed(2)??'-':0,
      sortable: true, 
      reorder: true,
      style:{ textAlign: 'left'}
    }
];

function Campaign() {
    const { register,  handleSubmit, formState: { errors }, setValue  } = useForm();
    setTimeout(function () { 
        $('.lnndaO').css("width", "130px"); 
    }, 1000); 
    const navigate = useNavigate();
    const [fixCampaign,fixCampaignData] = useState([{}]);
    const [campaign,campaignData] = useState([{
        name : 'loading..'
    }]);
    const [utmParameter,utmParameterData] = useState([{
        utm_name : 'loading..'
    }]); 
    const [selectcampaign,selectcampaignData] = useState('/user'); 
    const [selectedRows, setSelectedRows] = React.useState([]); 
    const [pending, setPending] = React.useState(true);
    const [count, setCount] = useState(1);
    const [parameterCount, setParameterCount] = useState(1);
    const [utmCampaign, setUtmCampaign] = useState(0);
    const [utmCampaignName, setUtmCampaignName] = useState('');
    const [totalCampaignAds, setTotalCampaignAds] = useState(0);
    const [totalCampaign, setTotalCampaign] = useState(0);
    const [isAnyUpdate, setIsAnyUpdate] = useState('no');
    const [isAnyForceUpdate, setIsAnyForceUpdate] = useState(0);
    const [selectedAccount, setselectedAccount] = useState(localStorage.getItem('user_linkedin_account_id'));
    const [selectedRedirectAccount, setSelectedRedirectAccount] = useState(localStorage.getItem('user_selected_account_for_utm'));
    const [isLoaderDisplay, setIsLoaderDisplay] = useState(false); 
    const [selectedDateRange, selectedDateRangeData] = useState(''); 
    const [selectStatus, selectStatusData] = useState(''); 
    const [isExecute, isExecuteData] = useState('true'); 
    const [remainingAds, remainingAdsData] = useState(0); 
    
    var today = new Date(); 
    let startDate = moment().subtract(29, 'days').format('MM/DD/YYYY') 
    let today_date = moment().subtract(0, 'days').format('MM/DD/YYYY') 
    const [currentDate, setCurrentDate] = useState((localStorage.getItem('current_date'))?localStorage.getItem('current_date'):today_date);
    const [previousDate, setPreviousDate] = useState((localStorage.getItem('previous_date'))?localStorage.getItem('previous_date'):startDate); 

    let default_start_date = previousDate.trim().replaceAll("/", "@");
    let default_end_date = currentDate.trim().replaceAll("/", "@");
    let search_date_range = `${default_start_date}_${default_end_date}`;
    const [defaultDateRange, setDefaultDateRange] = React.useState(search_date_range);
     
    $('.utm_parameter').on('keyup',function() {
        this.value = this.value.replace(/\s/g,'_');
    });
    $(document).on('keyup','.utm_custom_value', function(e){ 
        this.value = this.value.replace(/\s/g,'_');
    });
    const onRowClicked = (row, event) => { 
        navigate(`/user/creative/${row.id}`); 
    };

    const handleRowSelected = React.useCallback(state => { 
        setTotalCampaignAds(0)
        setTotalCampaign(0)

        let row_data = state.selectedRows;
        var a_selected_campaign_group = [];
        var a_selected_campaign_name = [];
        var count = -1;
        row_data.forEach(function(item){
            count++;
            a_selected_campaign_group[count] = item.id;
            a_selected_campaign_name[count] = item.name;
            setTotalCampaign(count+1);
        });
        let selected_campaign_group = a_selected_campaign_group.join(',');  
        let selected_campaign_name = a_selected_campaign_name.join(', '); 
         
        setUtmCampaign(selected_campaign_group);
        setUtmCampaignName(selected_campaign_name);
        if(selected_campaign_group != ''){
            localStorage.setItem('selected_campaign_id',selected_campaign_group)
            //selectcampaignData(`/user/creative/${selected_campaign_group}`);
            selectcampaignData(`/user/creative/all`);
        }
 
        axios.get(`/api/linkedin/totalCampaignAds/${selected_campaign_group}-${localStorage.getItem('user_token')}`).then((response) => {
            setTotalCampaignAds(response.data.elements.length); 
        });

	}, []);
    
    const searchName = (e) => { 
        let search_data = e.target.value;   
        const filteredItems = fixCampaign.filter(
            item => item.name && item.name.toLowerCase().includes(search_data.toLowerCase()),
        );
        if( search_data !=  ''){
            campaignData(filteredItems);
        }else{
            getData();
        }
    };  
    const searchStatus = (e) => {  
        let filter_data = e.target.value; 
        setPending(true);  
        selectStatusData(filter_data);  
        let search_date_range = defaultDateRange; 
        let campaign_group_id = window.location.href.split('/').pop();  
         
        axios.get(`/api/linkedin/campaign/${campaign_group_id}-${localStorage.getItem('user_token')}-${search_date_range}--`).then((response) => {
            
            //campaignData(response.data.elements); 
            //console.log(response.data.elements); 
            const filteredItems = response.data.elements.filter(
                item => item.status && item.status.toLowerCase().includes(filter_data.toLowerCase()),
            ); 
            //console.log(filteredItems);
            if(filter_data !==  ''){ 
                fixCampaignData(filteredItems);
                campaignData(filteredItems); 
            }else{ 
                fixCampaignData(response.data.elements);
                campaignData(response.data.elements);
            }  
            const timeout = setTimeout(() => { 
                setPending(false);
            }, 1000); 
            return () => clearTimeout(timeout); 
        }); 
    };  

    const addMore = ()=>{   
        let new_parameterCount = parameterCount+1; 
        var html = '';
            html    =   `<div class="col-md-12 row mt-2" id="add_parameter_div_${new_parameterCount}">
                            <div class="col-md-4">
                                <input type="text" name="parameter_name[@0|insert@]" class="form-control utm_parameter" id="parameter_input_1" placeholder="Parameter name"  />
                            </div>
                            <div class="col-md-4">
                                <select class="form-control form-select add_update_field" id='${new_parameterCount}' onChange="addUpdateField(event)">
                                    <option selected value="">Select Variable</option>
                                    <option value="account_name">Account name</option>
                                    <option value="account_id">Account ID</option>
                                    <option value="campaign_name">Campaign name</option>
                                    <option value="campaign_id">Campaign ID</option>
                                    <option value="creative_name">Creative name</option>
                                    <option value="ad_id">Ad ID</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            <div class="col-md-4 parameter_value_${new_parameterCount}"></div>
                            <i class="fal fa-trash-alt delete_parameter parameter_delete_custom" id='${new_parameterCount}'></i>
                        </div>`;
            // html = `<div class="col-sm-3 my-1 col-md-12 mt-3" id="add_parameter_div_${new_parameterCount}"> 
            //             <div class="input-group">
            //                 <div class="input-group-prepend">
            //                     <div class="input-group-text">utm_</div>
            //                 </div>
            //                 <input type="text" name="parameter_name[@0|insert@]" class="form-control utm_parameter" placeholder="parameter, value" id='parameter_input_${new_parameterCount}'/>
            //                 <div class="input-group-append bg-danger">
            //                     <div class="input-group-text text-white bg-danger delete_parameter show-cursor" id='${new_parameterCount}' > X</div>
            //                 </div>
            //             </div>
            //         </div>`; 
            //console.log('id count -',$('#add_more').length)
            if($('#add_more').length == 0){ 
                $('#retrieve_parameter').after('<div id="add_more"></div>');
            }
            $("#add_more").append(html);
        setParameterCount(new_parameterCount)
    } 
    
     
    function updateUtmParameter(){  
        $('.utm_update_loader').show();
        let utm_capmaign_id = $('#utm_capmaign_id').val();
        let selected_utm = $('input[name="apply_utm"]:checked').val();
       
        const send_data = {
            'utm_capmaign_id' : utm_capmaign_id,
            'selected_utm' : selected_utm,
            'user_token' : localStorage.getItem('user_token')
        }   
        console.log(JSON.stringify(send_data))
        axios.post(`/api/linkedin/updateCampaignUtm`,send_data).then((response) => {
            
            let total_time = (totalCampaignAds*7/60).toFixed(2);
            let approx_time = Math.floor(total_time) +'-'+ Math.ceil(total_time); 
            toast(`Total ${totalCampaignAds} ads parameter effected. It takes ${approx_time} minutes to update in linkedin platform.`)
            //setIsAnyUpdate('yes');
            $('.utm_update_loader').hide();
            $("[data-bs-dismiss=modal]").trigger({ type: "click" });
            var count = 0;
            const update_interval = setInterval(function(){ 
                //console.log(`/api/getAdsUpdated/${localStorage.getItem('user_token')}`)
                axios.get(`/api/getAdsUpdated/${localStorage.getItem('user_token')}`).then((response) => { 
                    count += 1;  
                    //console.log(count)
                    if(count == 1){
                        $('#ads_update').show();
                        localStorage.setItem('total_update_ads',response.data.pending_ads);
                        $("#ads_update").html(`<b>0 / ${response.data.pending_ads}</b> ads are updated.`)
                    }else{ 
                        $("#ads_update").html(`
                        <b>${localStorage.getItem('total_update_ads') - response.data.pending_ads} / ${localStorage.getItem('total_update_ads')}</b> ads are updated.`)
                        setIsAnyForceUpdate(`${localStorage.getItem('total_update_ads') - response.data.pending_ads}`);
                        setIsAnyUpdate('yes');
                    } 
                    //console.log('response.data.display_error',response.data.display_error)
                    if(response.data.display_error != ''){
                        toast(`${response.data.display_error}`)
                    }
                    if( (localStorage.getItem('total_update_ads') - response.data.pending_ads) == localStorage.getItem('total_update_ads') ){
                        stopInterval();
                    }
                }); 
            }, 6000);
            function stopInterval(){
                clearInterval(update_interval);
                $('#ads_update').hide();
            }
        });
    }
    function showUpdateAds(){

        // axios.post(`/api/linkedin/updateCampaignUtm`,send_data).then((response) => {
        //     let total_time = (totalCampaignAds*7/60).toFixed(2);
        //     let approx_time = Math.floor(total_time) +'-'+ Math.ceil(total_time); 
        //     toast(`Total ${totalCampaignAds} ads parameter effected. It takes ${approx_time} minutes to update in linkedin platform.`)
        //     setIsAnyUpdate('yes');
        //     $('.utm_update_loader').hide();
        //     $("[data-bs-dismiss=modal]").trigger({ type: "click" });
        //     showUpdateAds()
        // });
        
        toast(`Total minutes to update in linkedin platform.`)
    }

    const addUtmParameter = ()=>{ 
        let campaign_id = utmCampaign; 
        var a_utm_parameter = []; 
        var a_utm_value = []; 
        var a_utm_field = []; 
        var a_combine_value = []; 
        let utm_name_id = $('#utm_name_id').val();
        let utm_name = $('#utm_name').val();
        $('.utm_parameter').each(function(k,v){ 
            var add_operation = v.name.split('@')[1];
            a_utm_parameter[k] = add_operation+'|'+$(this).val(); 
        });
        $('.utm_value').each(function(k,v){ 
           // console.log($(this).val()); 
            a_utm_value[k] =  $(this).val(); 
        });
        $('.add_update_field').each(function(k,v){  
            a_utm_field[k] = $(this).val(); 
        }); 
        for(let key in a_utm_parameter){
            a_combine_value[key] = `${a_utm_parameter[key]}#${a_utm_field[key]}#${a_utm_value[key]}`
        }

        if(campaign_id == ''){
            campaign_id = 1;
        }
        let send_data = {
            utm_name_id : utm_name_id,
            utm_name : utm_name,
            campaign_id : campaign_id,
            account_id : localStorage.getItem('user_selected_account_for_utm'),
            creative_id : 0, 
            a_utm_parameter : a_combine_value,
            user_token : localStorage.getItem('user_token')
        };
        // console.log(send_data)
        // console.log(JSON.stringify(send_data));
        axios.post(`/api/user/utmParameter`,send_data).then((response) => {
            //console.log('Insert'); 
            $('#add_more').remove();
            toast(response.data.msg)
            getUtmData();
            $(".open_main_utm").trigger({ type: "click" });
            //setTimeout(location.reload(),3000);
        });
    } 
    
    $(".delete_parameter").on("click",function(e){  
        $(`#add_parameter_div_${e.target.id}`).remove();

        // delete parameter display
        var utm_parameter_value = [];
        var utm_parameter_count = -1;
        $('.utm_parameter').each(function(k,v){ 
            if($(this).val() !== ''){
                utm_parameter_count++; 
                utm_parameter_value[utm_parameter_count] = $(this).val();
            }
        });
    
        var utm_value = [];
        var value_count = -1;
        $('.utm_value').each(function(k,v){ 
            if($(this).val() !== ''){ 
                value_count++;  
                utm_value[utm_parameter_value[value_count]] = $(this).val();
            }
        });  
        var code_string = '';
        var add_count = 0
        for(let para_key in utm_value){
            add_count++
            if(add_count == 1){
                code_string += `${para_key}=${utm_value[para_key]}`
            }else{
                code_string += `&${para_key}=${utm_value[para_key]}`
            }
        }
        
        $('.sample_parameter_code').val(`?${code_string}`);
    });
     
    // function handleEvent(event, picker) {
    //     console.log('1');
    // }
    // function handleCallback(start, end, label) {
    //     console.log('2');
    // }

    //$('.applyBtn').on('click',function(){ 
    //$('.input_date').on('change',function(){  
    function handleCallback(start, end, label) { 
        let is_search_val_exist = $('.search_name').val()
        setPending(true);
        $('.filter_status_data').val('');
        selectStatusData('');
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
            getData(search_date_range,'-',is_search_val_exist);  
        } 
    };
 
    
    const selectUtm = (e)=>{ 
        //buttonTextData('Update');
        //buttonDisableData(false);
        let id = parseInt(e.target.id); 
        $('#utm_name_id').val(id);
        //console.log(`/api/user/utm/${id}`); 
        axios.get(`/api/user/utm/${id}`).then((response) => { 
            if(response.status == 200){
                var html = '';
                $("#retrieve_parameter").empty();
                $('.parameter_div').remove();
                $('#retrieve_parameter').show();
                $('.hide_retrieve_parameter').empty(); 

                for (var parameter_id in response.data[0].parameter) { 
                    let paramter_key = response.data[0].parameter[parameter_id].split(',')[0]
                    let paramter_field = response.data[0].parameter[parameter_id].split(',')[1]
                    let paramter_value = response.data[0].parameter[parameter_id].split(',')[2]
                      

                    html += `<div class="col-md-12 row mt-2" id="edit_parameter_div_${parameter_id}">
                        <div class="col-md-4">
                            <input type="text" name="parameter_name[@${parameter_id}|update@]" class="form-control utm_parameter" id="parameter_input_1" placeholder="Parameter name" value="${paramter_key}" />
                        </div>
                        <div class="col-md-4">
                            <select class="form-control form-select add_update_field" id='${parameter_id}' onChange="addUpdateField(event)">
                                <option selected value="">Select Variable</option>
                                <option value="account_name" ${paramter_field=='account_name'?'selected':''}>Account name</option>
                                <option value="account_id" ${paramter_field=='account_id'?'selected':''}>Account ID</option>
                                <option value="campaign_name" ${paramter_field=='campaign_name'?'selected':''}>Campaign name</option>
                                <option value="campaign_id" ${paramter_field=='campaign_id'?'selected':''}>Campaign ID</option>
                                <option value="creative_name" ${paramter_field=='creative_name'?'selected':''}>Creative name</option>
                                <option value="ad_id" ${paramter_field=='ad_id'?'selected':''}>Ad ID</option>
                                <option value="custom" ${paramter_field=='custom'?'selected':''}>Custom</option>
                            </select>
                        </div>
                        <div class="col-md-4 parameter_value_${parameter_id}">
                            <input type="text" class="form-control utm_value" value='${paramter_value}' ${paramter_field !== 'custom' ? 'readonly' : ''} />
                        </div>
                        <i class="fal fa-trash-alt delete_added_parameter parameter_delete_custom" id=${parameter_id}></i>
                    </div>`
                }
                 
                $("#retrieve_parameter").append(html); 
                $('#utm_id').val(response.data[0].id);  
                $('#utm_name').val(response.data[0].utm_name); 
                setValue("utm_name", response.data[0].utm_name);
                $('#utm_parameter').val(response.data[0].parameter); 
                
                $('.delete_added_parameter').on('click', function(e) { 
                    let is_confirm = confirm('Are you sure you want to delete this parameter?'); 
                    if(is_confirm === true){
                        let id = e.target.id; 
                        axios.delete(`/api/user/utmParameter/${id}`).then((response) => {
                            if(response.status == 200){ 
                                $(`#edit_parameter_div_${e.target.id}`).remove(); 
                                toast(response.data.msg)

                                var utm_parameter_value = [];
                                var utm_parameter_count = -1;
                                $('.utm_parameter').each(function(k,v){ 
                                    if($(this).val() !== ''){
                                        utm_parameter_count++; 
                                        utm_parameter_value[utm_parameter_count] = $(this).val();
                                    }
                                });
                            
                                var utm_value = [];
                                var value_count = -1;
                                $('.utm_value').each(function(k,v){ 
                                    if($(this).val() !== ''){ 
                                        value_count++;  
                                        utm_value[utm_parameter_value[value_count]] = $(this).val();
                                    }
                                });  
                                var code_string = '';
                                var add_count = 0
                                for(let para_key in utm_value){
                                    add_count++
                                    if(add_count == 1){
                                        code_string += `${para_key}=${utm_value[para_key]}`
                                    }else{
                                        code_string += `&${para_key}=${utm_value[para_key]}`
                                    }
                                }
                                
                                $('.sample_parameter_code').val(`?${code_string}`);
                            }
                        }).catch((error)=> {  
                            $('#errorText').text('Some technical issue.'); 
                            $('#errorMsg').slideDown(1000);
                        }); 
                    }
                }); 
 
                // display parameter data on key up
                $(document).on('keyup change','.utm_value', function(e){ 
                    var utm_parameter_value = [];
                    var utm_parameter_count = -1;
                    $('.utm_parameter').each(function(k,v){ 
                        if($(this).val() !== ''){
                            utm_parameter_count++; 
                            utm_parameter_value[utm_parameter_count] = $(this).val();
                        }
                    });
                   
                    var utm_value = [];
                    var value_count = -1;
                    $('.utm_value').each(function(k,v){ 
                        if($(this).val() !== ''){ 
                            value_count++;  
                            utm_value[utm_parameter_value[value_count]] = $(this).val();
                        }
                    });  
                    var code_string = '';
                    var add_count = 0
                    for(let para_key in utm_value){
                        add_count++
                        if(add_count == 1){
                            code_string += `${para_key}=${utm_value[para_key]}`
                        }else{
                            code_string += `&${para_key}=${utm_value[para_key]}`
                        }
                    }
                     
                    $('.sample_parameter_code').val(`?${code_string}`);
                });

                // display parameter data on first time
                var utm_parameter_value = [];
                var utm_parameter_count = -1;
                $('.utm_parameter').each(function(k,v){ 
                    if($(this).val() !== ''){
                        utm_parameter_count++; 
                        utm_parameter_value[utm_parameter_count] = $(this).val();
                    }
                });
            
                var utm_value = [];
                var value_count = -1;
                $('.utm_value').each(function(k,v){ 
                    if($(this).val() !== ''){ 
                        value_count++;  
                        utm_value[utm_parameter_value[value_count]] = $(this).val();
                    }
                });  
                var code_string = '';
                var add_count = 0
                for(let para_key in utm_value){
                    add_count++
                    if(add_count == 1){
                        code_string += `${para_key}=${utm_value[para_key]}`
                    }else{
                        code_string += `&${para_key}=${utm_value[para_key]}`
                    }
                }
                
                $('.sample_parameter_code').val(`?${code_string}`);

            }
        }).catch((error)=> {  
            $('#errorText').text('Data not get.'); 
            $('#errorMsg').slideDown(1000);
        }); 
    }

    $(document).on('keyup change','.utm_value, .utm_parameter', function(e){   
        var utm_parameter_value = [];
        var utm_parameter_count = -1;
        $('.utm_parameter').each(function(k,v){ 
            if($(this).val() !== ''){
                utm_parameter_count++; 
                utm_parameter_value[utm_parameter_count] = $(this).val();
            }
        });
       
        var utm_value = [];
        var value_count = -1;
        $('.utm_value').each(function(k,v){ 
            if($(this).val() !== ''){ 
                value_count++;  
                if(utm_parameter_value[value_count] != undefined){
                    utm_value[utm_parameter_value[value_count]] = $(this).val();
                }
            }
        });  
        var code_string = '';
        var add_count = 0
        for(let para_key in utm_value){
            add_count++
            if(add_count == 1){
                code_string += `${para_key}=${utm_value[para_key]}`
            }else{
                code_string += `&${para_key}=${utm_value[para_key]}`
            }
        }
         
        $('.sample_parameter_code').val(`?${code_string}`);
    });
    const deleteUtmName = (e)=>{ 
        let is_confirm = confirm('Are you sure you want to delete this UTM?');
        if(is_confirm){ 
            let id = e.target.id; 
            axios.delete(`/api/user/utmName/${id}`).then((response) => { 
                if(response.status == 200){
                    $(`#row_${id}`).css("background-color", "#f8d7da").slideUp(500); 
                    toast(response.data.msg)
                }
            }).catch((error)=> {  
                $('#errorText').text('Some technical issue.'); 
                $('#errorMsg').slideDown(1000);
            }); 
        }
    }
    async function getUtmData(){
        let campaign_id = window.location.href.split('/').pop();
        let account_id_for_utm = localStorage.getItem('user_selected_account_for_utm');    
        //console.log(`/api/user/utmParameter/${account_id_for_utm}-${localStorage.getItem('user_token')}`);
        await axios.get(`/api/user/utmParameter/${account_id_for_utm}-${localStorage.getItem('user_token')}`).then((utm_response) => {  
            utmParameterData(utm_response.data); 
        });  
    }
    //console.log(isExecute);
    async function getData(search_date_range='',filter_data='',is_search_val_exist=''){  
        if(search_date_range === ''){
            search_date_range = defaultDateRange;
        }  
        if(filter_data === ''){
            filter_data = selectStatus;
        }
        let campaign_id = window.location.href.split('/').pop();  
        localStorage.setItem('user_selected_campaign_id',campaign_id);
        //console.log(`/api/linkedin/campaign/${campaign_id}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`)
        await axios.get(`/api/linkedin/campaign/${campaign_id}-${localStorage.getItem('user_token')}-${search_date_range}-${filter_data}`).then((response) => { 
            if(is_search_val_exist !== ''){
                let search_data = is_search_val_exist; 
                const filteredItems = fixCampaign.filter(
                    item => item.name && item.name.toLowerCase().includes(search_data.toLowerCase()),
                );
                campaignData(filteredItems); 
                fixCampaignData(response.data.elements); 
            }else{
                campaignData(response.data.elements); 
                fixCampaignData(response.data.elements);  
                $('.filter_status_data').val('');
            }

            // campaignData(response.data.elements); 
            // fixCampaignData(response.data.elements); 
             
            // Add campaign id in clickable link
            var a_campaign_account = [];
            var count = -1;
            response.data.elements.forEach(function(item){
                count++;
                a_campaign_account[count] = item.id;
            });
            let selected_campaign = a_campaign_account.join(','); 

            localStorage.setItem('selected_campaign_id',selected_campaign)
            //selectcampaignData(`/user/creative/${selected_campaign}`);
            selectcampaignData(`/user/creative/all`);
  
            let timeout = setTimeout(() => { 
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
     
    window.addUpdateField = function(e){ 
        setIsLoaderDisplay('true'); 
        let variable_div_id = e.target.id; 
        let variable_for = e.target.value; 
 
        if(variable_for == 'account_name'){
            $(`.parameter_value_${variable_div_id}`).empty(); 
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value account_name" value="" disabled />`
            const timeout = setTimeout(() => { 
                setIsLoaderDisplay(false);
                $(`.parameter_value_${variable_div_id}`).append(html); 
                $('.utm_value').val('{{account_name}}').trigger("change");
            }, 1000);  
            return () => clearTimeout(timeout); 
            // axios.get(`/api/linkedin/account/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-0-0`).then((response) => {  
            //     var a_account_name = []; 
            //     var html = `<select class="form-control form-select utm_value">`
            //     html += `<option value=''>Select account name</option>`
            //     for(let account_name_key in response.data.elements){
            //           html += `<option value='${response.data.elements[account_name_key].name.toLowerCase().replace(/ /g,"_")}'>${response.data.elements[account_name_key].name}</option>`
            //     }       
            //     html += `</select>`  
                 
            //     const timeout = setTimeout(() => { 
            //         setIsLoaderDisplay(false);
            //         $(`.parameter_value_${variable_div_id}`).append(html);
            //     }, 1000); 
            //     return () => clearTimeout(timeout); 
            // });
        }
        if(variable_for == 'account_id'){
            $(`.parameter_value_${variable_div_id}`).empty();
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value account_id" value="" disabled />`
            const timeout = setTimeout(() => { 
                setIsLoaderDisplay(false);
                $(`.parameter_value_${variable_div_id}`).append(html); 
                $('.account_id').val('{{account_id}}').trigger("change");
            }, 1000);  
            return () => clearTimeout(timeout);

            // axios.get(`/api/linkedin/account/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-0-0`).then((response) => { 
            //     var a_account_id = []; 
            //     var html = `<select class="form-control form-select utm_value">`
            //     html += `<option value=''>Select account id</option>`
            //     for(let account_id_key in response.data.elements){ 
            //           html += `<option value='${response.data.elements[account_id_key].id}'>${response.data.elements[account_id_key].id}</option>`
            //     }       
            //     html += `</select>` 
            //     const timeout = setTimeout(() => { 
            //         setIsLoaderDisplay(false);
            //         $(`.parameter_value_${variable_div_id}`).append(html);
            //     }, 1000); 
            //     return () => clearTimeout(timeout); 
            // });
        }
        if(variable_for == 'campaign_name'){
            $(`.parameter_value_${variable_div_id}`).empty(); 
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value campaign_name" value="" disabled />`
            const timeout = setTimeout(() => { 
                setIsLoaderDisplay(false);
                $(`.parameter_value_${variable_div_id}`).append(html); 
                $('.campaign_name').val('{{campaign_name}}').trigger("change");
            }, 1000);  
            return () => clearTimeout(timeout);

            // axios.get(`/api/linkedin/campaignUnderAccount/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-0-0`).then((response) => {  
            //     var a_campaign_name = []; 
            //     var html = `<select class="form-control form-select utm_value">`
            //     html += `<option value=''>Select campaign name</option>`
            //     for(let campaign_name_key in response.data.elements){ 
            //           html += `<option value='${response.data.elements[campaign_name_key].name.toLowerCase().replace(/ /g,"_")}'>${response.data.elements[campaign_name_key].name}</option>`
            //     }       
            //     html += `</select>` 
            //     const timeout = setTimeout(() => { 
            //         setIsLoaderDisplay(false);
            //         $(`.parameter_value_${variable_div_id}`).append(html);
            //     }, 1000); 
            //     return () => clearTimeout(timeout); 
            // });
        }
        if(variable_for == 'campaign_id'){
            $(`.parameter_value_${variable_div_id}`).empty();
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value campaign_id" value="" disabled />`
            const timeout = setTimeout(() => { 
                setIsLoaderDisplay(false);
                $(`.parameter_value_${variable_div_id}`).append(html); 
                $('.campaign_id').val('{{campaign_id}}').trigger("change");
            }, 1000);  
            return () => clearTimeout(timeout);

            // axios.get(`/api/linkedin/campaignUnderAccount/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-0-0`).then((response) => {  
            //     var a_campaign_id = [];  
            //     var html = `<select class="form-control form-select utm_value">`
            //     html += `<option value=''>Select campaign id</option>`
            //     for(let campaign_id_key in response.data.elements){ 
            //           html += `<option value='${response.data.elements[campaign_id_key].id}'>${response.data.elements[campaign_id_key].id}</option>`
            //     }       
            //     html += `</select>` 
            //     const timeout = setTimeout(() => { 
            //         setIsLoaderDisplay(false);
            //         $(`.parameter_value_${variable_div_id}`).append(html);
            //     }, 1000); 
            //     return () => clearTimeout(timeout); 
            // });
        }
        if(variable_for == 'creative_name'){
            $(`.parameter_value_${variable_div_id}`).empty();
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value creative_name" value="" disabled />`
            const timeout = setTimeout(() => { 
                setIsLoaderDisplay(false);
                $(`.parameter_value_${variable_div_id}`).append(html); 
                $('.creative_name').val('{{creative_name}}').trigger("change");
            }, 1000);  
            return () => clearTimeout(timeout);

            // axios.get(`/api/linkedin/creativeUnderAccount/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-0-0`).then((response) => {  
            //     var a_creative_name = []; 
            //     var html = `<select class="form-control form-select utm_value">`
            //         html += `<option value=''>Select creative name</option>`
            //     for(let creative_name_key in response.data.elements){   
            //         html += `<option value='${response.data.elements[creative_name_key].ads_name.toLowerCase().replace(/ /g,"_")}'>${response.data.elements[creative_name_key].ads_name}</option>`
            //     }       
            //     html += `</select>` 
            //     console.log(html)
            //     console.log(`.parameter_value_${variable_div_id}`)
            //     const timeout = setTimeout(() => { 
            //         setIsLoaderDisplay(false);
            //         $(`.parameter_value_${variable_div_id}`).append(html);
            //     }, 1000); 
            //     return () => clearTimeout(timeout); 
            // });
        }
        if(variable_for == 'ad_id'){ 
            $(`.parameter_value_${variable_div_id}`).empty();
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value ad_id" value="" disabled />`
            const timeout = setTimeout(() => { 
                setIsLoaderDisplay(false);
                $(`.parameter_value_${variable_div_id}`).append(html); 
                $('.ad_id').val('{{ad_id}}').trigger("change");
            }, 1000);  
            return () => clearTimeout(timeout);

            // axios.get(`/api/linkedin/campaignUnderAccount/${localStorage.getItem('user_linkedin_account_id')}-${localStorage.getItem('user_token')}-0-0`).then((response) => {  
            //     var a_creative_id = [];  
            //     var html = `<select class="form-control form-select utm_value">`
            //     html += `<option value=''>Select ads id</option>`
            //     for(let creative_id_key in response.data.elements){ 
            //           html += `<option value='${response.data.elements[creative_id_key].id}'>${response.data.elements[creative_id_key].id}</option>`
            //     }       
            //     html += `</select>` 
            //     const timeout = setTimeout(() => { 
            //         setIsLoaderDisplay(false);
            //         $(`.parameter_value_${variable_div_id}`).append(html);
            //     }, 1000); 
            //     return () => clearTimeout(timeout); 
            // });
        }
        if(variable_for == 'custom'){
            $(`.parameter_value_${variable_div_id}`).empty();   
            let html = `<input type="text" name="parameter_value[@0|insert@]" class="form-control utm_value utm_custom_value" id="parameter_input_1" placeholder="Parameter value"  />`    
            const timeout = setTimeout(() => { 
                    setIsLoaderDisplay(false);
                    $(`.parameter_value_${variable_div_id}`).append(html);
                }, 1000); 
                return () => clearTimeout(timeout); 
        }
    };
    
    useEffect(()=>{ 
        getData(); 
        getUtmData();
    },[]); 
    //console.log(campaign.length)  
    const resetData = ()=>{ 
        //buttonTextData('Add');
        $('#utm_name_id').val('');
        $('#utm_name').val('');
        $('.sample_parameter_code').val('');
        $('.utm_parameter').val('');
        $('.hide_retrieve_parameter').show();
        $('#retrieve_parameter').hide();
    } 
    //console.log(utmParameter)
    return ( 
        <>  
        <Top setIsAnyUpdate={isAnyUpdate} setIsAnyForceUpdate={isAnyForceUpdate} />
        <section class="admin_body">
            <div class="custom_container">
                <div class="row admin_upper_row">
                    <div class="col-md-5">
                        <div class="admin_top_left">
                            <ul class="nav nav-tabs custom_tabs" role="tablist">
                                <li class="nav-item"> 
                                    <Link to='/user' class="nav-link">Account</Link>
                                </li>
                                <li class="nav-item">
                                    <Link to={`/user/campaign-group?account=${selectedRedirectAccount}`} class="nav-link">Campaign Groups</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link active" to='' disabled>Campaigns</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link" to={selectcampaign} >Ads</Link>
                                </li>
                            </ul>  
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="admin_top_right">
                            <button class="utm_btn" data-bs-toggle="modal" data-bs-target="#utm_modal_manage" onClick={resetData}>UTM wizard</button>
                            <select class="custom_select_box filter_status_data" onChange={searchStatus} defaultValue={''}>
                                <option value="">Select Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="ARCHIVED">Archived</option>
                                <option value="CANCELED">Canceled</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="DRAFT">Draft</option>
                                <option value="PAUSED">Paused</option>
                            </select>
                            <input class="search_input search_name" type="text" placeholder="Search" name="" onChange={searchName} /> 
                            <DateRangePicker initialSettings={{ startDate: previousDate, endDate: currentDate }} onCallback={handleCallback}>
                                <input type="text" class="input_date"/>
                            </DateRangePicker>
                            {/* <input class="input_date date_from" type="date" name="" />
                            <input class="input_date date_to" type="date" name="" />   currentDateRange  */}
                        </div>
                    </div>
                </div> 
                <div class="row"> 
                <div className="ads_update_design" id="ads_update" style={{ display:'none'}}></div>
                    <div class="col-md-12">
                        <div class="table_main_outer">
                            <div class="table-responsive"> 
                                <DataTable
                                    title=""
                                    columns={columns}
                                    data={campaign}
                                    defaultSortFieldId={1}
                                    sortIcon={<SortIcon />}
                                    pagination
                                    selectableRows
                                    onSelectedRowsChange={handleRowSelected}
                                    progressPending={pending}
                                    progressComponent={<ThreeDots color="#00BFFF" height={60} width={60} />}
                                    onRowClicked={onRowClicked} 
                                /> 
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal custom_modal fade utm_modal_parameter" id="utm_modal" tabIndex="-1" role="dialog" aria-labelledby="utm_modalTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="utm_modalTitle">Add/Edit UTM Wizard</h5>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">

                            <form action="" method="POST" onSubmit={handleSubmit(addUtmParameter)} autoComplete="OFF" noValidate>
                                <div class="row" id='parameter_form'> 
                                    <div class="col-md-12">
                                        <input type="text" class="input_cus" placeholder="UTM Logic Name" name="" id="utm_name" {...register('utm_name', { required: true })}/>
                                        {errors.utm_name && <p class="custom-error-messager">UTM name is required.</p>}
                                    </div>  

                                    {isLoaderDisplay? 
                                        <div class="col-md-12 parameter_loader" style={{ paddingLeft:'80%'}}>
                                            <ThreeDots color="#00BFFF" height={40} width={40} /> 
                                        </div> 
                                        :''
                                    }
                                    <div class="col-sm-3 my-1 col-md-12 row hide_retrieve_parameter" id="add_parameter_div_1">
                                        <div class="col-md-4">
                                            <input type="text" name="parameter_name[@0|insert@]" class="form-control utm_parameter" id="parameter_input_1" placeholder="Parameter name" required/> 
                                        </div>
                                        <div class="col-md-4">
                                            <select class="form-control form-select add_update_field" id="1" name="add_update_field" onChange={addUpdateField} required defaultValue={''}>
                                                <option value="">Select Variable</option>
                                                <option value="account_name">Account name</option>
                                                <option value="account_id">Account ID</option>
                                                <option value="campaign_name">Campaign name</option>
                                                <option value="campaign_id">Campaign ID</option>
                                                <option value="creative_name">Creative name</option>
                                                <option value="ad_id">Ad ID</option>
                                                <option value="custom">Custom</option>
                                            </select>
                                        </div>
                                        <div class='col-md-4 parameter_value_1'>  
                                            <input type='hidden' value='' class='utm_value' />
                                        </div>
                                        <i class="fal fa-trash-alt delete_parameter parameter_delete_custom" id='1'></i>
                                    </div>
                                    {/* <div class="col-sm-3 my-1 col-md-12 hide_retrieve_parameter"> 
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">utm_</div>
                                            </div>
                                            <input type="text" name="parameter_name[@0|insert@]" class="form-control utm_parameter" id="parameter_input_1" placeholder="parameter, value"  />
                                        </div>
                                    </div>   */}
                                    <div id="retrieve_parameter"></div> 
                                    <div id="add_more"></div>

                                    <div class="col-sm-3 mt-3 col-md-12">  
                                        <textarea type="text" name="" class="form-control sample_parameter_code" placeholder="Sample parameter code" value="" disabled> </textarea>
                                    </div>  
                                </div>
                                
                                <div class="row">
                                    <input type="hidden" id="utm_name_id" />
                                    <div class="col-md-12">
                                        <div class="para_save_outer">
                                        <button type="button" class="utm_btn selectcampaign" onClick={addMore}><i class="fal fa-plus"></i>Add Parameter</button>
                                        <button type="submit" class="utm_btn" >Save</button>
                                        <button type="button" class="utm_btn open_main_utm" data-bs-toggle="modal" data-bs-target="#utm_modal_manage">View UTM</button>
                                        </div>
                                    </div>
                                </div> 
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal custom_modal fade" id="utm_modal_manage" tabIndex="-1" role="dialog" aria-labelledby="delete_modalTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="utm_modalTitle">UTM List</h5>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                            <div class="container col-md-12 text-wrap">
                                    <span style={{fontSize:'13px'}}><b>Note :</b> Select to desired custom UTM logic, and click "Apply UTM"<br />
                                    Selected campaign : <b>{
                                        (totalCampaign > 1)?totalCampaign:
                                            (utmCampaignName)?utmCampaignName:"Please select at least one campaign"
                                        } </b><br />
                                    Total Ads : <b>{totalCampaignAds} </b></span>
                                    <input type="hidden" id='utm_capmaign_id' value={utmCampaign} />
                                </div>
                                <div class="col-md-12">
                                    <div class="para_save_outer pull-right">
                                        <button class="utm_btn selectcampaign" data-bs-toggle="modal" data-bs-target="#utm_modal" onClick={resetData}>Create new UTM logic</button>
                                        <button class="utm_btn" onClick={updateUtmParameter}  disabled={ utmParameter.length == 0 ? true : utmCampaignName === '' ? true : false}>Apply UTM</button> 
                                    </div>
                                </div> 
                                <div class="col-md-12 utm_update_loader" style={{display:'none'}}>
                                    <div class='text-center mx-auto' style={{ paddingLeft:'50%'}}>
                                        <ThreeDots color="#00BFFF" height={60} width={60}/>
                                    </div>
                                </div> 
                                <div class="col-md-12">
                                    <div class="table_main_outer">
                                        <div class="table-responsive">
                                            <table class="table">
                                                <thead>
                                                <tr>
                                                    <th scope="col">
                                                    Sr. No.
                                                    </th>
                                                    <th scope="col">UTM Name</th> 
                                                    <th scope="col">Select</th> 
                                                    <th scope="col">Action</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                (utmParameter.length>0)?
                                                utmParameter.map((parameter_data,key)=>{ 
                                                return (
                                                <tr id={`row_${parameter_data.id}`} key={`${parameter_data?.id}`}>
                                                    <td>{key+1}</td>
                                                    <td>
                                                    { parameter_data.utm_name }
                                                    </td>
                                                    <td><input type="radio" name="apply_utm" value={parameter_data.id} defaultChecked /> </td>
                                                    <td>
                                                    <div class="list_td">
                                                        <a data-bs-toggle="modal" data-bs-target="#utm_modal" onClick={selectUtm}><i class="fal fa-pen" id={parameter_data.id}></i></a>
                                                        {/* <a href="#"><i class="fal fa-eye"></i></a> */}
                                                        <a onClick={deleteUtmName}><i class="fal fa-trash-alt" id={parameter_data.id}></i></a>
                                                    </div>
                                                    </td>
                                                </tr> 
                                                ) 
                                                })
                                                :
                                                <tr class="alert alert-alert col-md-12 text-center wating_color">
                                                    <td colSpan="4" class="wating_text">
                                                        No record.
                                                    </td>
                                                </tr>
                                                } 
                                                </tbody>
                                            </table>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Bottom />
    </>
    );
}
export default Campaign;