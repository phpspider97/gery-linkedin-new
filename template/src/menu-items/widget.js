// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconChartArcs, IconClipboardList, IconChartInfographic } from '@tabler/icons'; 
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SummarizeIcon from '@mui/icons-material/Summarize';
import GroupIcon from '@mui/icons-material/Group';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'; 
import HubIcon from '@mui/icons-material/Hub';
import Tooltip from '@mui/material/Tooltip';
// constant
const icons = {
    IconChartArcs,
    IconClipboardList,
    IconChartInfographic,
    FilterAltIcon,
    SummarizeIcon,
    GroupIcon,
    RadioButtonCheckedIcon,
    HubIcon
};

// ==============================|| WIDGET MENU ITEMS ||============================== //

const widget = {
    id: 'widget',
    title: <FormattedMessage id="Menu" />,
    icon: icons.IconChartArcs,
    type: 'group',
    children: [
        {
            id: 'overview',
            title: <FormattedMessage id="Overview" />,
            type: 'item',
            url: '/user/overview',
            icon: icons.IconChartArcs,
            breadcrumbs: false
        },
        {
            id: 'campaigns',
            title: <FormattedMessage id="Campaigns" />,
            type: 'item',
            url: '/user/campaign-group',
            icon: icons.IconClipboardList,
            breadcrumbs: false
        },
        {
            id: 'funnels',
            title: <FormattedMessage id="Funnels" />,
            type: 'item',
            url: '/user/funnels',
            icon: icons.FilterAltIcon,
            breadcrumbs: false 
        },
        {
            id: 'reporting',
            title: <FormattedMessage id="Reporting" />,
            type: 'item',
            url: '/user/reporting',
            icon: icons.SummarizeIcon,
            breadcrumbs: false
        },
        {
            id: 'audiences',
            title: <FormattedMessage id="Audiences" />,
            type: 'item',
            url: '/user/audiences',
            icon: icons.GroupIcon,
            breadcrumbs: false
        },
        {
            id: 'competitors',
            title: <FormattedMessage id="Competitors" />,
            type: 'item',
            url: '/user/competitors',
            icon: icons.RadioButtonCheckedIcon,
            breadcrumbs: false
        },
        {
            id: 'hubspot',
            title: <FormattedMessage id="Hubspot" />,
            type: 'item',
            url: '/user/hubspot',
            icon: icons.HubIcon,
            breadcrumbs: false
        }
    ]
};

export default widget;
