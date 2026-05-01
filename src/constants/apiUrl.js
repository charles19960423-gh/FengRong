const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.fengrong.com'

export const API_URLS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    ME: `${BASE_URL}/auth/me`,
    REFRESH: `${BASE_URL}/auth/refresh`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
    UPDATE_PROFILE: `${BASE_URL}/auth/profile`,
    CHANGE_PASSWORD: `${BASE_URL}/auth/password`
  },
  TASK: {
    LIST: `${BASE_URL}/tasks`,
    DETAIL: `${BASE_URL}/tasks/{id}`,
    CREATE: `${BASE_URL}/tasks`,
    UPDATE: `${BASE_URL}/tasks/{id}`,
    DELETE: `${BASE_URL}/tasks/{id}`,
    ACCEPT: `${BASE_URL}/tasks/{id}/accept`,
    SUBMIT: `${BASE_URL}/tasks/{id}/submit`,
    REVIEW: `${BASE_URL}/tasks/{id}/review`,
    SEARCH: `${BASE_URL}/tasks/search`,
    MY_TASKS: `${BASE_URL}/tasks/mine`,
    CATEGORIES: `${BASE_URL}/tasks/categories`
  },
  ORDER: {
    LIST: `${BASE_URL}/orders`,
    DETAIL: `${BASE_URL}/orders/{id}`,
    CREATE: `${BASE_URL}/orders`,
    UPDATE: `${BASE_URL}/orders/{id}`,
    DELETE: `${BASE_URL}/orders/{id}`,
    PAY: `${BASE_URL}/orders/{id}/pay`,
    CANCEL: `${BASE_URL}/orders/{id}/cancel`
  },
  EQUIPMENT: {
    LIST: `${BASE_URL}/equipment`,
    DETAIL: `${BASE_URL}/equipment/{id}`,
    RENT: `${BASE_URL}/equipment/{id}/rent`,
    VENUES: `${BASE_URL}/equipment/venues`,
    PACKAGES: `${BASE_URL}/equipment/packages`,
    COUPONS: `${BASE_URL}/equipment/coupons`
  },
  USER: {
    PROFILE: `${BASE_URL}/users/{id}`,
    WALLET: `${BASE_URL}/users/{id}/wallet`,
    TRANSACTIONS: `${BASE_URL}/users/{id}/transactions`,
    ACHIEVEMENTS: `${BASE_URL}/users/{id}/achievements`,
    COUPONS: `${BASE_URL}/users/{id}/coupons`,
    FAVORITES: `${BASE_URL}/users/{id}/favorites`,
    FOLLOWERS: `${BASE_URL}/users/{id}/followers`,
    FOLLOWING: `${BASE_URL}/users/{id}/following`
  },
  SOCIAL: {
    POSTS: `${BASE_URL}/social/posts`,
    POST_DETAIL: `${BASE_URL}/social/posts/{id}`,
    LIKES: `${BASE_URL}/social/posts/{id}/likes`,
    COMMENTS: `${BASE_URL}/social/posts/{id}/comments`,
    SHARE: `${BASE_URL}/social/posts/{id}/share`,
    EVENTS: `${BASE_URL}/social/events`,
    EVENT_DETAIL: `${BASE_URL}/social/events/{id}`,
    PARTICIPATE: `${BASE_URL}/social/events/{id}/participate`,
    PROJECTS: `${BASE_URL}/social/projects`,
    PROJECT_DETAIL: `${BASE_URL}/social/projects/{id}`
  },
  RESOURCE: {
    LIST: `${BASE_URL}/resources`,
    DETAIL: `${BASE_URL}/resources/{id}`,
    DOWNLOAD: `${BASE_URL}/resources/{id}/download`,
    CATEGORIES: `${BASE_URL}/resources/categories`
  }
}

export const STORAGE_KEYS = {
  TOKEN: 'tavern_token',
  CURRENT_USER: 'current_user',
  TASKS: 'fr_tasks',
  ORDERS: 'fr_orders',
  TRANSACTIONS: 'transactions',
  USER_COUPONS: 'fr_user_coupons',
  FAVORITES: 'fr_favorites',
  EQUIPPED_ACHIEVEMENTS: 'equippedAchievements',
  EQUIPMENT_RENTALS: 'equipment_rentals'
}

export const LOCAL_STORAGE_KEYS = {
  TOKEN: STORAGE_KEYS.TOKEN,
  USER: STORAGE_KEYS.CURRENT_USER,
  SETTINGS: 'tavern_settings'
}
