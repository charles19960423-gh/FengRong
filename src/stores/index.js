import { createPinia } from 'pinia'

const pinia = createPinia()

export { pinia }

export { useAuthStore } from './modules/auth'
export { useTaskStore } from './modules/task'
export { useOrderStore } from './modules/order'
export { useTransactionStore } from './modules/transaction'
export { useEquipmentStore } from './modules/equipment'
export { useAchievementStore } from './modules/achievement'
export { useCouponStore } from './modules/coupon'
export { useFavoriteStore } from './modules/favorite'
export { useTeamStore } from './modules/team'
export { useInventoryStore } from './modules/inventory'
export { useSocialStore } from './modules/social'
export { useResourceStore } from './modules/resource'
export { useNotificationStore } from './modules/notification'
export { useEventStore } from './modules/event'
export { useClientStore } from './modules/client'