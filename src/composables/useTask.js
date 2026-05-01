import { ref, computed } from 'vue'
import { useTaskStore } from '../stores'

export function useTask() {
  const taskStore = useTaskStore()
  const loading = ref(false)
  const error = ref(null)

  const tasks = computed(() => taskStore.tasks)
  const stats = computed(() => taskStore.taskStats)
  const categories = computed(() => taskStore.taskCategories)

  async function loadTasks() {
    loading.value = true
    error.value = null
    try {
      await taskStore.loadTasks()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createTask(data) {
    loading.value = true
    error.value = null
    try {
      const result = await taskStore.createTask(data)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function acceptTask(taskId) {
    loading.value = true
    error.value = null
    try {
      const result = await taskStore.acceptTask(taskId)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function submitTask(taskId, data) {
    loading.value = true
    error.value = null
    try {
      const result = await taskStore.submitTask(taskId, data)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function completeTask(taskId) {
    loading.value = true
    error.value = null
    try {
      const result = await taskStore.completeTask(taskId)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function getTaskById(taskId) {
    return taskStore.getTaskById(taskId)
  }

  function getTasksByStatus(status) {
    return taskStore.getTasksByStatus(status)
  }

  function getTasksByCategory(category) {
    return taskStore.getTasksByCategory(category)
  }

  function searchTasks(keyword) {
    return taskStore.searchTasks(keyword)
  }

  return {
    tasks,
    stats,
    categories,
    loading,
    error,
    loadTasks,
    createTask,
    acceptTask,
    submitTask,
    completeTask,
    getTaskById,
    getTasksByStatus,
    getTasksByCategory,
    searchTasks
  }
}
