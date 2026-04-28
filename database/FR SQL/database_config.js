// ==============================================
// 枫榕赏金酒馆 - 数据库配置与API服务层 V0.6
// ==============================================

// Supabase 客户端配置
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

// 枫榕赏金酒馆 - Supabase 配置
const SUPABASE_URL = 'https://wdhtaiayfxrmhwspcnjm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_gOxqFETPc_PXAoyQnDi3xw_pfzo2XOM';

// 初始化 Supabase 客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==============================================
// 冒险者档案服务
// ==============================================
const AdventurerService = {
    /**
     * 加载冒险者档案
     * @param {string} uid - 冒险者编号
     * @returns {Promise<Object|null>}
     */
    async loadAdventurer(uid) {
        try {
            const { data: adventurer, error } = await supabase
                .from('adventurers')
                .select(`
                    *,
                    gears(*)
                `)
                .eq('uid', uid)
                .single();

            if (error) {
                console.error('江湖档案调取失败:', error);
                return null;
            }

            return adventurer;
        } catch (e) {
            console.error('加载冒险者档案异常:', e);
            return null;
        }
    },

    /**
     * 更新冒险者档案
     * @param {string} uid - 冒险者编号
     * @param {Object} updates - 更新数据
     * @returns {Promise<Object|null>}
     */
    async updateAdventurer(uid, updates) {
        try {
            const { data, error } = await supabase
                .from('adventurers')
                .update({ ...updates, last_active_at: new Date().toISOString() })
                .eq('uid', uid)
                .single();

            if (error) {
                console.error('更新档案失败:', error);
                return null;
            }

            return data;
        } catch (e) {
            console.error('更新冒险者档案异常:', e);
            return null;
        }
    },

    /**
     * 获取冒险者排名（按声望）
     * @param {number} limit - 返回数量
     * @returns {Promise<Array>}
     */
    async getLeaderboard(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('adventurers')
                .select('uid, display_name, prestige, level, tier')
                .order('prestige', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('获取排行榜失败:', error);
                return [];
            }

            return data;
        } catch (e) {
            console.error('获取排行榜异常:', e);
            return [];
        }
    }
};

// ==============================================
// 法器服务
// ==============================================
const GearService = {
    /**
     * 获取冒险者的法器列表
     * @param {string} ownerUid - 冒险者编号
     * @returns {Promise<Array>}
     */
    async getGearsByOwner(ownerUid) {
        try {
            const { data, error } = await supabase
                .from('gears')
                .select('*')
                .eq('owner_uid', ownerUid);

            if (error) {
                console.error('获取法器失败:', error);
                return [];
            }

            return data;
        } catch (e) {
            console.error('获取法器异常:', e);
            return [];
        }
    },

    /**
     * 更新法器状态
     * @param {string} gearId - 法器ID
     * @param {Object} updates - 更新数据
     * @returns {Promise<Object|null>}
     */
    async updateGear(gearId, updates) {
        try {
            const { data, error } = await supabase
                .from('gears')
                .update({ ...updates, last_used_at: new Date().toISOString() })
                .eq('id', gearId)
                .single();

            if (error) {
                console.error('更新法器状态失败:', error);
                return null;
            }

            return data;
        } catch (e) {
            console.error('更新法器状态异常:', e);
            return null;
        }
    },

    /**
     * 添加大力胶补丁并同步到数据库
     * @param {string} gearId - 法器ID
     * @returns {Promise<Object|null>}
     */
    async applyTape(gearId) {
        try {
            // 获取当前大力胶位置
            const { data: gear, error: fetchError } = await supabase
                .from('gears')
                .select('tape_positions, wear_count')
                .eq('id', gearId)
                .single();

            if (fetchError) {
                console.error('获取法器信息失败:', fetchError);
                return null;
            }

            // 生成新的大力胶位置
            const newPos = {
                top: Math.random() * 70 + '%',
                left: Math.random() * 70 + '%',
                rotate: Math.random() * 360 + 'deg'
            };

            // 更新数据库
            const updatedPositions = [...(gear.tape_positions || []), newPos];
            const { data, error } = await supabase
                .from('gears')
                .update({
                    tape_positions: updatedPositions,
                    wear_count: (gear.wear_count || 0) + 1
                })
                .eq('id', gearId)
                .single();

            if (error) {
                console.error('添加大力胶失败:', error);
                return null;
            }

            return { ...data, newPosition: newPos };
        } catch (e) {
            console.error('添加大力胶异常:', e);
            return null;
        }
    },

    /**
     * 增加法器热度
     * @param {string} gearId - 法器ID
     * @param {number} amount - 热度增量
     * @returns {Promise<Object|null>}
     */
    async increaseHeat(gearId, amount) {
        try {
            const { data, error } = await supabase.rpc('increase_gear_heat', {
                gear_id: gearId,
                amount: amount
            });

            if (error) {
                console.error('增加热度失败:', error);
                return null;
            }

            return data;
        } catch (e) {
            console.error('增加热度异常:', e);
            return null;
        }
    }
};

// ==============================================
// 任务委托服务
// ==============================================
const BountyService = {
    /**
     * 获取活跃任务列表
     * @returns {Promise<Array>}
     */
    async getActiveBounties() {
        try {
            const { data, error } = await supabase
                .from('active_bounties')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('获取任务列表失败:', error);
                return [];
            }

            return data;
        } catch (e) {
            console.error('获取任务列表异常:', e);
            return [];
        }
    },

    /**
     * 创建新任务委托
     * @param {Object} bountyData - 任务数据
     * @returns {Promise<Object|null>}
     */
    async createBounty(bountyData) {
        try {
            const { data, error } = await supabase
                .from('bounties')
                .insert({
                    ...bountyData,
                    created_at: new Date().toISOString()
                })
                .single();

            if (error) {
                console.error('创建任务失败:', error);
                return null;
            }

            return data;
        } catch (e) {
            console.error('创建任务异常:', e);
            return null;
        }
    },

    /**
     * 领取任务
     * @param {string} bountyId - 任务ID
     * @param {string} adventurerUid - 冒险者编号
     * @returns {Promise<Object|null>}
     */
    async claimBounty(bountyId, adventurerUid) {
        try {
            const { data, error } = await supabase
                .from('bounties')
                .update({
                    status: 'claimed',
                    claimed_by_uid: adventurerUid
                })
                .eq('id', bountyId)
                .eq('status', 'active')
                .single();

            if (error) {
                console.error('领取任务失败:', error);
                return null;
            }

            return data;
        } catch (e) {
            console.error('领取任务异常:', e);
            return null;
        }
    },

    /**
     * 完成任务
     * @param {string} bountyId - 任务ID
     * @param {string} adventurerUid - 冒险者编号
     * @param {number} rating - 评价星级 (1-5)
     * @param {string} feedback - 反馈评价
     * @returns {Promise<Object|null>}
     */
    async completeBounty(bountyId, adventurerUid, rating = 5, feedback = '') {
        try {
            // 开始事务
            const { data: bounty, error: bountyError } = await supabase
                .from('bounties')
                .select('reward_prestige, issuer_uid')
                .eq('id', bountyId)
                .single();

            if (bountyError) {
                console.error('获取任务信息失败:', bountyError);
                return null;
            }

            // 更新任务状态
            await supabase
                .from('bounties')
                .update({ status: 'completed' })
                .eq('id', bountyId);

            // 增加冒险者声望
            await supabase.rpc('increment_prestige', {
                user_uid: adventurerUid,
                amount: bounty.reward_prestige
            });

            // 记录完成记录
            const { data, error } = await supabase
                .from('bounty_completions')
                .insert({
                    bounty_id: bountyId,
                    adventurer_uid: adventurerUid,
                    rating,
                    feedback
                })
                .single();

            if (error) {
                console.error('记录完成失败:', error);
                return null;
            }

            return { success: true, reward: bounty.reward_prestige };
        } catch (e) {
            console.error('完成任务异常:', e);
            return null;
        }
    }
};

// ==============================================
// 声望服务
// ==============================================
const PrestigeService = {
    /**
     * 增加声望
     * @param {string} uid - 冒险者编号
     * @param {number} amount - 增加数量
     * @returns {Promise<number|null>} 新的声望值
     */
    async addPrestige(uid, amount) {
        try {
            const { data, error } = await supabase.rpc('increment_prestige', {
                user_uid: uid,
                amount: amount
            });

            if (error) {
                console.error('增加声望失败:', error);
                return null;
            }

            return data;
        } catch (e) {
            console.error('增加声望异常:', e);
            return null;
        }
    },

    /**
     * 获取当前声望值
     * @param {string} uid - 冒险者编号
     * @returns {Promise<number|null>}
     */
    async getPrestige(uid) {
        try {
            const { data, error } = await supabase
                .from('adventurers')
                .select('prestige')
                .eq('uid', uid)
                .single();

            if (error) {
                console.error('获取声望失败:', error);
                return null;
            }

            return data.prestige;
        } catch (e) {
            console.error('获取声望异常:', e);
            return null;
        }
    }
};

// ==============================================
// 勋章服务
// ==============================================
const MedalService = {
    /**
     * 获取冒险者的勋章列表
     * @param {string} uid - 冒险者编号
     * @returns {Promise<Array>}
     */
    async getMedalsByAdventurer(uid) {
        try {
            const { data, error } = await supabase
                .from('adventurer_medals')
                .select(`
                    *,
                    medals(name, description, icon, rarity)
                `)
                .eq('adventurer_uid', uid);

            if (error) {
                console.error('获取勋章失败:', error);
                return [];
            }

            return data;
        } catch (e) {
            console.error('获取勋章异常:', e);
            return [];
        }
    },

    /**
     * 授予勋章
     * @param {string} uid - 冒险者编号
     * @param {string} medalId - 勋章ID
     * @returns {Promise<Object|null>}
     */
    async awardMedal(uid, medalId) {
        try {
            const { data, error } = await supabase
                .from('adventurer_medals')
                .insert({
                    adventurer_uid: uid,
                    medal_id: medalId,
                    acquired_at: new Date().toISOString()
                })
                .single();

            if (error) {
                console.error('授予勋章失败:', error);
                return null;
            }

            return data;
        } catch (e) {
            console.error('授予勋章异常:', e);
            return null;
        }
    }
};

// ==============================================
// 江湖传闻服务
// ==============================================
const GossipService = {
    /**
     * 获取最新江湖传闻
     * @param {number} limit - 返回数量
     * @returns {Promise<Array>}
     */
    async getLatestGossips(limit = 5) {
        try {
            const { data, error } = await supabase
                .from('gossips')
                .select(`
                    *,
                    adventurers(display_name)
                `)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('获取传闻失败:', error);
                return [];
            }

            return data;
        } catch (e) {
            console.error('获取传闻异常:', e);
            return [];
        }
    },

    /**
     * 发布江湖传闻
     * @param {string} content - 传闻内容
     * @param {string} sourceUid - 发布者编号
     * @returns {Promise<Object|null>}
     */
    async createGossip(content, sourceUid) {
        try {
            const { data, error } = await supabase
                .from('gossips')
                .insert({
                    content,
                    source_uid: sourceUid,
                    created_at: new Date().toISOString()
                })
                .single();

            if (error) {
                console.error('发布传闻失败:', error);
                return null;
            }

            return data;
        } catch (e) {
            console.error('发布传闻异常:', e);
            return null;
        }
    }
};

// ==============================================
// 通知服务
// ==============================================
const NotificationService = {
    /**
     * 获取未读通知
     * @param {string} uid - 冒险者编号
     * @returns {Promise<Array>}
     */
    async getUnreadNotifications(uid) {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('recipient_uid', uid)
                .eq('is_read', false)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('获取通知失败:', error);
                return [];
            }

            return data;
        } catch (e) {
            console.error('获取通知异常:', e);
            return [];
        }
    },

    /**
     * 标记通知为已读
     * @param {string} uid - 冒险者编号
     * @returns {Promise<void>}
     */
    async markAllAsRead(uid) {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('recipient_uid', uid)
                .eq('is_read', false);

            if (error) {
                console.error('标记已读失败:', error);
            }
        } catch (e) {
            console.error('标记已读异常:', e);
        }
    },

    /**
     * 创建通知
     * @param {Object} notificationData - 通知数据
     * @returns {Promise<Object|null>}
     */
    async createNotification(notificationData) {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .insert({
                    ...notificationData,
                    created_at: new Date().toISOString()
                })
                .single();

            if (error) {
                console.error('创建通知失败:', error);
                return null;
            }

            return data;
        } catch (e) {
            console.error('创建通知异常:', e);
            return null;
        }
    }
};

// ==============================================
// 导出服务模块
// ==============================================
const TavernDatabase = {
    adventurer: AdventurerService,
    gear: GearService,
    bounty: BountyService,
    prestige: PrestigeService,
    medal: MedalService,
    gossip: GossipService,
    notification: NotificationService,
    supabase
};

// 全局暴露（用于浏览器环境）
if (typeof window !== 'undefined') {
    window.TavernDatabase = TavernDatabase;
}

export { TavernDatabase };
export default TavernDatabase;