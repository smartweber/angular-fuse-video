import { FuseNavigationModelInterface } from '../core/components/navigation/navigation.model';

export class FuseNavigationModel implements FuseNavigationModelInterface
{
    public model: any[];

    constructor()
    {
        this.model = [
            {
                'id'      : 'account',
                'title'   : 'Account',
                'translate': 'NAV.ACCOUNT',
                'type'    : 'group',
                'children': [
                    {
                        'id'   : 'company_information',
                        'title': 'Company Information',
                        'translate': 'NAV.COMPANY_INFORMATION',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    },
                    {
                        'id'   : 'features',
                        'title': 'Features',
                        'translate': 'NAV.FEATURES',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    },
                    {
                        'id'   : 'payments',
                        'title': 'Payments',
                        'translate': 'NAV.PAYMENTS',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    },
                    {
                        'id'   : 'subscription',
                        'title': 'Subscription',
                        'translate': 'NAV.SUBSCRIPTION',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    },
                    {
                        'id'   : 'transactions',
                        'title': 'Transactions',
                        'translate': 'NAV.TRANSACTIONS',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    }
                ]
            },
            {
                'id'      : 'channel',
                'title'   : 'Channel',
                'translate': 'NAV.CHANNEL',
                'type'    : 'group',
                'children': [
                    {
                        'id'   : 'channel_information',
                        'title': 'Channel Information',
                        'translate': 'NAV.CHANNEL_INFORMATION',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    },
                    {
                        'id'   : 'channel_branding',
                        'title': 'Channel Branding',
                        'translate': 'NAV.CHANNEL_BRANDING',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    }
                ]
            },
            {
                'id'      : 'content',
                'title'   : 'Content',
                'translate': 'NAV.CONTENT',
                'type'    : 'group',
                'children': [
                    {
                        'id'   : 'video_overview',
                        'title': 'Video Overview',
                        'translate': 'NAV.VIDEO_OVERVIEW',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    },
                    {
                        'id'   : 'videos_by_audit',
                        'title': 'Videos by audit',
                        'translate': 'NAV.VIDEOS_BY_AUDIT',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    }
                ]
            },
            {
                'id'      : 'tasks',
                'title'   : 'Tasks',
                'translate': 'NAV.TASKS',
                'type'    : 'group',
                'children': [
                    {
                        'id'   : 'audit_overview',
                        'title': 'Audit Overview',
                        'translate': 'NAV.AUDIT_OVERVIEW',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    }
                ]
            },
            {
                'id'      : 'users',
                'title'   : 'Users',
                'translate': 'NAV.USERS',
                'type'    : 'group',
                'children': [
                    
                ]
            },
            {
                'id'      : 'support',
                'title'   : 'Support',
                'translate': 'NAV.SUPPORT',
                'type'    : 'group',
                'children': [
                    
                ]
            },
            {
                'id'      : 'configurations',
                'title'   : 'Configurations',
                'translate': 'NAV.CONFIGURATIONS',
                'type'    : 'group',
                'children': [
                    {
                        'id'   : 'single_sign_on',
                        'title': 'Single Sign-On',
                        'translate': 'NAV.SINGLE_SIGN_ON',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    },
                    {
                        'id'   : 'tube_branding',
                        'title': 'Tube Branding',
                        'translate': 'NAV.TUBE_BRANDING',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    },
                    {
                        'id'   : 'tags',
                        'title': 'Tags',
                        'translate': 'NAV.TAGS',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    },
                    {
                        'id'   : 'information_classification',
                        'title': 'Information Classification',
                        'translate': 'NAV.INFORMATION_CLASSIFICATION',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    },
                    {
                        'id'   : 'access_control',
                        'title': 'Access Control',
                        'translate': 'NAV.ACCESS_CONTROL',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    }
                ]
            }
        ];
    }
}
