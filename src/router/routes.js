export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: '凤荣酒馆', requiresAuth: false }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../views/task/TasksView.vue'),
    meta: { title: '赏金任务', requiresAuth: true }
  },
  {
    path: '/publish',
    name: 'Publish',
    component: () => import('../views/task/PublishView.vue'),
    meta: { title: '发布任务', requiresAuth: true }
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: () => import('../views/EquipmentView.vue'),
    meta: { title: '设备租赁', requiresAuth: false }
  },
  {
    path: '/resources',
    name: 'Resources',
    component: () => import('../views/ResourceView.vue'),
    meta: { title: '江湖秘典', requiresAuth: false }
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('../views/EventView.vue'),
    meta: { title: '酒馆活动', requiresAuth: false }
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: () => import('../views/user/WalletView.vue'),
    meta: { title: '江湖钱庄', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/user/ProfileView.vue'),
    meta: { title: '个人中心', requiresAuth: false }
  },
  {
    path: '/achievements',
    name: 'Achievements',
    component: () => import('../views/AchievementsView.vue'),
    meta: { title: '成就系统', requiresAuth: false }
  },
  {
    path: '/coupons',
    name: 'Coupons',
    component: () => import('../views/CouponView.vue'),
    meta: { title: '优惠券', requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/OrderView.vue'),
    meta: { title: '我的订单', requiresAuth: true }
  },
  {
    path: '/bounty',
    name: 'Bounty',
    component: () => import('../views/user/BountyView.vue'),
    meta: { title: '赏金猎人', requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/user/SettingsView.vue'),
    meta: { title: '设置', requiresAuth: true }
  },
  {
    path: '/social',
    name: 'Social',
    component: () => import('../views/SocialView.vue'),
    meta: { title: '社交广场', requiresAuth: false }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/FavoriteView.vue'),
    meta: { title: '我的收藏', requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('../views/NotificationView.vue'),
    meta: { title: '消息通知', requiresAuth: false }
  },
  {
    path: '/support',
    name: 'Support',
    component: () => import('../views/SupportView.vue'),
    meta: { title: '帮助中心', requiresAuth: false }
  },
  {
    path: '/milestone',
    name: 'Milestone',
    component: () => import('../views/MilestoneView.vue'),
    meta: { title: '里程碑', requiresAuth: true }
  },
  {
    path: '/workbench',
    name: 'Workbench',
    component: () => import('../views/TaskWorkbench.vue'),
    meta: { title: '任务工作台', requiresAuth: true }
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('../views/TeamProjectView.vue'),
    meta: { title: '团队项目', requiresAuth: true }
  },
  {
    path: '/client',
    name: 'Client',
    component: () => import('../views/ClientConsole.vue'),
    meta: { title: '客户控制台', requiresAuth: true }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../views/HomeView.vue'),
    meta: { title: '页面未找到', requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]