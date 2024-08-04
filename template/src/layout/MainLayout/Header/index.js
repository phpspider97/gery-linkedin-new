// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
// project imports
import LAYOUT_CONST from 'constant';
import useConfig from 'hooks/useConfig';
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import MobileSection from './MobileSection';
import ProfileSection from './ProfileSection';
import LocalizationSection from './LocalizationSection';
import MegaMenuSection from './MegaMenuSection';
import NotificationSection from './NotificationSection';

import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
  } from 'mdb-react-ui-kit';
  import DataTable from "react-data-table-component";
// assets
import { IconMenu2 } from '@tabler/icons';
import SortIcon from "@material-ui/icons/ArrowDownward";
import { Circles,TailSpin,ThreeDots } from  'react-loader-spinner'

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();

    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);

    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const { layout } = useConfig();
    const [parameterUpdate,parameterUpdateData] = useState('');
    const [unreadUpdate, unreadUpdateData] = useState('0');
    

    // props.setIsAnyForceUpdate
    const chipSX = {
        height: 24,
        padding: '0 6px'
    };
    const chipErrorSX = {
        ...chipSX,
        color: theme.palette.orange.dark,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light,
        marginRight: '5px'
    };

    const chipWarningSX = {
        ...chipSX,
        color: theme.palette.warning.dark,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light
    };

    const chipSuccessSX = {
        ...chipSX,
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light,
        height: 28
    };
    

    const columns = [
        {
          id: 1,
          name: "UTM",
          selector: (row) => row.utm_name??'-',
          sortable: true,
          reorder: true
        },
        {
            id: 2,
            name: "Effected Ads ID",
            selector: (row) => row.ads_id??'-',
            sortable: true,
            reorder: true,
            style:{ textAlign: 'left'}
        },
        {
          id: 3,
          name: "Created At",
          selector: (row) => new Date(row.created_at).toUTCString()??'-',
          sortable: true,
          reorder: true,
          style:{ textAlign: 'left', width:'500px'}
        }
    ];


    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>

                {layout === LAYOUT_CONST.VERTICAL_LAYOUT || (layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && matchDownMd) ? (
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            overflow: 'hidden',
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                            color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                                color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
                            }
                        }}
                        onClick={() => dispatch(openDrawer(!drawerOpen))}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="20px" />
                    </Avatar>
                ) : null}
            </Box>

            {/* header search */}
            {/* <SearchSection /> */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />

            {/* mega-menu */}
            {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <MegaMenuSection />
            </Box>
 
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <LocalizationSection />
            </Box> */}

            {/* notification & profile */}
            <NotificationSection />
            <ProfileSection />

            {/* mobile header */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <MobileSection />
            </Box>
            
        </>
    );
};

export default Header;
