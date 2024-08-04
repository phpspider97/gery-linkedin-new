// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';

// constant
const icons = {
    IconDashboard,
    IconDeviceAnalytics,
    GroupIcon,
    PersonIcon,
    AirlineStopsIcon
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //
 
const dashboard = {
    id: 'dashboard',
    title: <FormattedMessage id="account" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'default',
            title: <FormattedMessage id="Dashboard" />,
            type: 'item',
            url: '/admin',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        // {
        //     id: 'default1',
        //     title: <FormattedMessage id="Role" />,
        //     type: 'item',
        //     url: '/admin/role',
        //     icon: icons.AirlineStopsIcon,
        //     breadcrumbs: false
        // },
        // {
        //     id: 'default2',
        //     title: <FormattedMessage id="Staff" />,
        //     type: 'item',
        //     url: '/admin/staff',
        //     icon: icons.GroupIcon,
        //     breadcrumbs: false
        // },
        {
            id: 'default3',
            title: <FormattedMessage id="User" />,
            type: 'item',
            url: '/admin/user',
            icon: icons.PersonIcon,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
