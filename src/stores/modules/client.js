import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useClientStore = defineStore('client', () => {
  const STORAGE_KEY = 'fr_client_data'

  const clients = ref([])
  const contracts = ref([])

  const mockClients = [
    {
      id: 'client-001',
      name: '城主府',
      avatar: '🏰',
      description: '城镇最高权力机构',
      level: 'vip',
      reputation: 100000,
      contactPerson: '王城主',
      contactPhone: '13800138010',
      address: '城主府大厅',
      services: ['任务发布', '装备采购', '场地租赁'],
      createdAt: '2024-01-01',
      status: 'active'
    },
    {
      id: 'client-002',
      name: '商会联盟',
      avatar: '💰',
      description: '江湖各大商会联合组织',
      level: 'vip',
      reputation: 85000,
      contactPerson: '钱会长',
      contactPhone: '13800138011',
      address: '商会大厦',
      services: ['商品交易', '物流配送', '资金融通'],
      createdAt: '2024-02-15',
      status: 'active'
    },
    {
      id: 'client-003',
      name: '药庐',
      avatar: '🌿',
      description: '知名药庐，提供各类药品',
      level: 'normal',
      reputation: 25000,
      contactPerson: '药师阿琳',
      contactPhone: '13800138005',
      address: '城南药庐',
      services: ['草药供应', '疗伤服务', '药方出售'],
      createdAt: '2024-06-01',
      status: 'active'
    }
  ]

  const mockContracts = [
    {
      id: 'contract-001',
      clientId: 'client-001',
      clientName: '城主府',
      title: '城墙修缮工程',
      description: '修复破损的城墙，增强城防',
      type: 'construction',
      value: 50000,
      duration: '30天',
      status: 'in-progress',
      signDate: '2024-12-01',
      deadline: '2024-12-31',
      progress: 65,
      contractorId: '13800138001',
      contractorName: '馆主大人'
    },
    {
      id: 'contract-002',
      clientId: 'client-002',
      clientName: '商会联盟',
      title: '货物运输协议',
      description: '负责商会货物的安全运输',
      type: 'transport',
      value: 20000,
      duration: '长期',
      status: 'active',
      signDate: '2024-11-15',
      deadline: '2025-11-15',
      progress: 30,
      contractorId: '13800138001',
      contractorName: '馆主大人'
    }
  ]

  function loadClients() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        clients.value = data.clients || []
        contracts.value = data.contracts || []
      } else {
        clients.value = [...mockClients]
        contracts.value = [...mockContracts]
        saveClients()
      }
    } catch {
      clients.value = [...mockClients]
      contracts.value = [...mockContracts]
    }
  }

  function saveClients() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      clients: clients.value,
      contracts: contracts.value
    }))
  }

  function getClients() {
    return clients.value
  }

  function getClientById(clientId) {
    return clients.value.find(c => c.id === clientId) || null
  }

  function getVIPClients() {
    return clients.value.filter(c => c.level === 'vip')
  }

  function createClient(data) {
    const newClient = {
      id: 'client-' + Date.now(),
      ...data,
      reputation: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    }
    clients.value.unshift(newClient)
    saveClients()
    return newClient
  }

  function updateClient(clientId, updates) {
    const client = getClientById(clientId)
    if (!client) return { success: false, message: '客户不存在' }

    Object.assign(client, updates)
    saveClients()
    return { success: true, client }
  }

  function createContract(data) {
    const newContract = {
      id: 'contract-' + Date.now(),
      ...data,
      status: 'active',
      progress: 0,
      signDate: new Date().toISOString().split('T')[0]
    }
    contracts.value.unshift(newContract)
    saveClients()
    return newContract
  }

  function getContracts(clientId) {
    return contracts.value.filter(c => c.clientId === clientId)
  }

  function getMyContracts(contractorId) {
    return contracts.value.filter(c => c.contractorId === contractorId)
  }

  function updateContract(contractId, updates) {
    const contract = contracts.value.find(c => c.id === contractId)
    if (!contract) return { success: false, message: '合同不存在' }

    Object.assign(contract, updates)
    saveClients()
    return { success: true, contract }
  }

  const contractStats = computed(() => ({
    total: contracts.value.length,
    active: contracts.value.filter(c => c.status === 'active').length,
    inProgress: contracts.value.filter(c => c.status === 'in-progress').length,
    completed: contracts.value.filter(c => c.status === 'completed').length
  }))

  return {
    clients,
    contracts,
    contractStats,
    loadClients,
    saveClients,
    getClients,
    getClientById,
    getVIPClients,
    createClient,
    updateClient,
    createContract,
    getContracts,
    getMyContracts,
    updateContract
  }
})