import { adminRoot, UserRole } from './defaultValues';

const data = [
  {
    id: 'dashboards',
    icon: 'iconsminds-shop-4',
    label: 'menu.dashboards',
    to: `${adminRoot}/dashboards`,
    roles: [UserRole.Admin],
    subs: [
      {
        icon: 'simple-icon-briefcase',
        label: 'menu.default',
        to: `${adminRoot}/dashboards/default`,
        // roles: [UserRole.Admin],
      },
      // {
      //   icon: 'simple-icon-pie-chart',
      //   label: 'menu.analytics',
      //   to: `${adminRoot}/dashboards/analytics`,
      //   // roles: [UserRole.Admin],
      // },
      // {
      //   icon: 'simple-icon-basket-loaded',
      //   label: 'menu.ecommerce',
      //   to: `${adminRoot}/dashboards/ecommerce`,
      //   // roles: [UserRole.Editor],
      // },
      // {
      //   icon: 'simple-icon-doc',
      //   label: 'menu.content',
      //   to: `${adminRoot}/dashboards/content`,
      //   // roles: [UserRole.Editor],
      // },
    ],
  },
  {
    id: 'force',
    icon: 'iconsminds-digital-drawing',
    label: 'menu.force',
    to: `${adminRoot}/force`,
    subs: [
      {
        icon: 'simple-icon-doc',
        label: 'menu.force',
        to: `${adminRoot}/force`,
        // roles: [UserRole.Editor],
      },
    ],
  },
  {
    id: 'booking',
    icon: 'iconsminds-digital-drawing',
    label: 'menu.booking',
    to: `${adminRoot}/booking`,
    subs: [
      {
        icon: 'simple-icon-doc',
        label: 'menu.booking',
        to: `${adminRoot}/booking`,
        // roles: [UserRole.Editor],
      },
    ],
  },
  {
    id: 'location',
    icon: 'iconsminds-air-balloon-1',
    label: 'menu.location',
    to: `${adminRoot}/location`,
    subs: [
      {
        icon: 'simple-icon-check',
        label: 'menu.location',
        to: `${adminRoot}/location`,
      },
    ],
  },
  {
    id: 'logout',
    icon: 'iconsminds-pantone',
    label: 'menu.logout',
    to: `${adminRoot}/logout`,
  },
  // {
  //   id: 'menu',
  //   icon: 'iconsminds-three-arrow-fork',
  //   label: 'menu.menu',
  //   to: `${adminRoot}/menu`,
  //   subs: [
  //     {
  //       icon: 'simple-icon-logout',
  //       label: 'menu.types',
  //       to: `${adminRoot}/menu/types`,
  //     },
  //     {
  //       icon: 'simple-icon-layers',
  //       label: 'menu.levels',
  //       to: `${adminRoot}/menu/levels`,
  //       subs: [
  //         {
  //           icon: 'simple-icon-arrow-right',
  //           label: 'menu.third-level-1',
  //           to: `${adminRoot}/menu/levels/third-level-1`,
  //         },
  //         {
  //           icon: 'simple-icon-arrow-right',
  //           label: 'menu.third-level-2',
  //           to: `${adminRoot}/menu/levels/third-level-2`,
  //         },
  //         {
  //           icon: 'simple-icon-arrow-right',
  //           label: 'menu.third-level-3',
  //           to: `${adminRoot}/menu/levels/third-level-3`,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 'blankpage',
  //   icon: 'iconsminds-bucket',
  //   label: 'menu.blank-page',
  //   to: `${adminRoot}/blank-page`,
  // },
  // {
  //   id: 'docs',
  //   icon: 'iconsminds-library',
  //   label: 'menu.docs',
  //   to: 'https://gogo-react-docs.coloredstrategies.com/',
  //   newWindow: true,
  // },
];
export default data;
