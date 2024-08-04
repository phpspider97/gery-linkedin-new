// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// constant
const icons = {
    IconDashboard,
    IconDeviceAnalytics
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: <FormattedMessage id="account" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'account',
            title: <FormattedMessage id="Accounts List" />,
            type: 'item',
            url: '/user',
            icon: icons.IconDashboard,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
