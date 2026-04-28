const PrestigeSystemV1 = {
    currentValue: 2850,
    level: '初级猎人',
    tier: 'bronze',
    continuousDays: 0,
    progressPercent: 0,
    prestigeToNextLevel: 150,
    nextLevelThreshold: 3000,
    isAnimating: false,

    PRESTIGE_THRESHOLDS: [0, 3000, 6000, 10000, 15000],
    LEVEL_NAMES: ['初级猎人', '中坚力量', '资深猎人', '法器大师', '一代宗师'],
    TIER_CLASSES: ['bronze', 'silver', 'gold', 'legendary'],

    init(userData = {}) {
        this.currentValue = userData.prestige || 2850;
        this.level = userData.level || this.calculateLevel(this.currentValue);
        this.tier = this.calculateTier(this.currentValue);
        this.continuousDays = userData.continuousDays || 0;
        this.updateProgress();
        this.updateUI();
        this.bindEvents();
    },

    calculateLevel(prestige) {
        if (prestige >= this.PRESTIGE_THRESHOLDS[4]) return this.LEVEL_NAMES[4];
        if (prestige >= this.PRESTIGE_THRESHOLDS[3]) return this.LEVEL_NAMES[3];
        if (prestige >= this.PRESTIGE_THRESHOLDS[2]) return this.LEVEL_NAMES[2];
        if (prestige >= this.PRESTIGE_THRESHOLDS[1]) return this.LEVEL_NAMES[1];
        return this.LEVEL_NAMES[0];
    },

    calculateTier(prestige) {
        if (prestige >= 10000) return 'legendary';
        if (prestige >= 5000) return 'gold';
        if (prestige >= 2000) return 'silver';
        return 'bronze';
    },

    getNextLevelThreshold(prestige) {
        for (let threshold of this.PRESTIGE_THRESHOLDS) {
            if (prestige < threshold) return threshold;
        }
        return this.PRESTIGE_THRESHOLDS[this.PRESTIGE_THRESHOLDS.length - 1];
    },

    updateProgress() {
        this.level = this.calculateLevel(this.currentValue);
        this.tier = this.calculateTier(this.currentValue);
        this.nextLevelThreshold = this.getNextLevelThreshold(this.currentValue);

        if (this.currentValue >= this.PRESTIGE_THRESHOLDS[4]) {
            this.progressPercent = 100;
            this.prestigeToNextLevel = 0;
        } else {
            for (let i = this.PRESTIGE_THRESHOLDS.length - 2; i >= 0; i--) {
                if (this.currentValue >= this.PRESTIGE_THRESHOLDS[i]) {
                    let currentThreshold = this.PRESTIGE_THRESHOLDS[i];
                    let nextThreshold = this.PRESTIGE_THRESHOLDS[i + 1];
                    this.progressPercent = Math.floor(
                        ((this.currentValue - currentThreshold) / (nextThreshold - currentThreshold)) * 100
                    );
                    this.prestigeToNextLevel = nextThreshold - this.currentValue;
                    break;
                }
            }
        }
    },

    add(amount, source = 'task') {
        return new Promise((resolve) => {
            const oldLevel = this.level;
            const oldPrestige = this.currentValue;

            this.currentValue += amount;
            this.updateProgress();

            const newLevel = this.level;
            const isPromoted = newLevel !== oldLevel;

            this.animateValue('prestige-value', oldPrestige, this.currentValue, 1000);

            setTimeout(() => {
                this.updateUI();
                this.updateProgressBar();

                if (isPromoted) {
                    this.showPromotionEffect(oldLevel, newLevel);
                }

                this.showFloatingGain(amount, source);
                resolve({ isPromoted, oldLevel, newLevel, oldPrestige, currentValue: this.currentValue });
            }, 500);
        });
    },

    deduct(amount, reason = 'penalty') {
        const oldPrestige = this.currentValue;
        this.currentValue = Math.max(0, this.currentValue - amount);
        this.updateProgress();

        this.animateValue('prestige-value', oldPrestige, this.currentValue, 500);
        setTimeout(() => {
            this.updateUI();
            this.updateProgressBar();
        }, 300);
    },

    animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if (!obj) return;

        obj.classList.add('number-pulse');
        setTimeout(() => obj.classList.remove('number-pulse'), 500);

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentDisplay = Math.floor(easeProgress * (end - start) + start);

            obj.innerHTML = currentDisplay.toLocaleString();

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },

    updateUI() {
        const levelEl = document.getElementById('prestige-level');
        if (levelEl) {
            levelEl.textContent = this.level;
        }

        const tierEl = document.getElementById('prestige-tier');
        if (tierEl) {
            tierEl.textContent = this.getTierDisplayName(this.tier);
            tierEl.className = `tier-badge tier-${this.tier}`;
        }

        const continuousDaysEl = document.getElementById('continuous-days');
        if (continuousDaysEl) {
            continuousDaysEl.textContent = this.continuousDays;
        }

        const prestigeValueEl = document.getElementById('prestige-value');
        if (prestigeValueEl) {
            prestigeValueEl.innerHTML = this.currentValue.toLocaleString();
        }

        const progressTextEl = document.getElementById('prestige-progress-text');
        if (progressTextEl) {
            progressTextEl.textContent = `${this.currentValue.toLocaleString()} / ${this.nextLevelThreshold.toLocaleString()}`;
        }

        const nextLevelHintEl = document.getElementById('next-level-hint');
        if (nextLevelHintEl) {
            if (this.prestigeToNextLevel > 0) {
                nextLevelHintEl.textContent = `距离「${this.getNextLevelName()}」还差 ${this.prestigeToNextLevel.toLocaleString()} 声望`;
            } else {
                nextLevelHintEl.textContent = '已达到最高等级！';
            }
        }
    },

    updateProgressBar() {
        const progressFillEl = document.getElementById('prestige-progress-fill');
        const progressBarEl = document.getElementById('prestige-progress-bar');

        if (progressFillEl) {
            progressFillEl.style.width = `${this.progressPercent}%`;

            if (progressBarEl) {
                progressBarEl.className = `fuse-progress tier-${this.tier}`;
            }
        }
    },

    getNextLevelName() {
        for (let i = 0; i < this.PRESTIGE_THRESHOLDS.length; i++) {
            if (this.currentValue < this.PRESTIGE_THRESHOLDS[i]) {
                return this.LEVEL_NAMES[i];
            }
        }
        return this.LEVEL_NAMES[this.LEVEL_NAMES.length - 1];
    },

    getTierDisplayName(tier) {
        const tierNames = {
            'bronze': 'Bronze 🥉',
            'silver': 'Silver 🥈',
            'gold': 'Gold 🥇',
            'legendary': 'Legendary 👑'
        };
        return tierNames[tier] || tierNames['bronze'];
    },

    showFloatingGain(amount, source) {
        const gainEl = document.createElement('div');
        gainEl.className = 'floating-gain';
        gainEl.textContent = `+${amount}`;
        gainEl.style.left = '50%';
        gainEl.style.top = '-20px';

        const prestigeValueEl = document.getElementById('prestige-value');
        if (prestigeValueEl && prestigeValueEl.parentElement) {
            const parent = prestigeValueEl.parentElement;
            parent.style.position = 'relative';
            parent.appendChild(gainEl);

            setTimeout(() => {
                gainEl.remove();
            }, 1500);
        }
    },

    showPromotionEffect(oldLevel, newLevel) {
        this.createPromotionModal(oldLevel, newLevel);
    },

    createPromotionModal(oldLevel, newLevel) {
        const modal = document.createElement('div');
        modal.id = 'promotion-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;

        modal.innerHTML = `
            <div style="
                background: linear-gradient(145deg, #2D1E17, #1A120B);
                border: 4px solid #D4AF37;
                border-radius: 20px;
                padding: 50px;
                text-align: center;
                max-width: 450px;
                box-shadow: 0 0 60px rgba(212, 175, 55, 0.5);
                transform: scale(0.8);
                transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            ">
                <div style="font-size: 4rem; margin-bottom: 20px; animation: bounce 1s infinite;">
                    🎉
                </div>
                <h2 style="
                    color: #D4AF37;
                    font-size: 2rem;
                    margin-bottom: 15px;
                    text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
                ">
                    段位晋升！
                </h2>
                <div style="
                    background: rgba(212, 175, 55, 0.1);
                    border: 2px solid rgba(212, 175, 55, 0.3);
                    border-radius: 10px;
                    padding: 20px;
                    margin: 20px 0;
                ">
                    <div style="color: #a68b6d; font-size: 0.9rem; margin-bottom: 10px;">
                        从「${oldLevel}」
                    </div>
                    <div style="color: #D4AF37; font-size: 1.5rem; font-weight: bold;">
                        晋升为「${newLevel}」
                    </div>
                </div>
                <p style="color: #a68b6d; font-style: italic; margin-bottom: 25px;">
                    "江湖已传遍你的传说！"
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="PrestigeSystemV1.sharePromotion('${newLevel}')" style="
                        padding: 12px 25px;
                        background: linear-gradient(135deg, #07c160, #06ad56);
                        border: none;
                        border-radius: 25px;
                        color: white;
                        font-size: 0.9rem;
                        cursor: pointer;
                        transition: transform 0.2s;
                    ">
                        📤 分享成就
                    </button>
                    <button onclick="PrestigeSystemV1.closePromotionModal()" style="
                        padding: 12px 25px;
                        background: rgba(212, 175, 55, 0.2);
                        border: 2px solid rgba(212, 175, 55, 0.5);
                        border-radius: 25px;
                        color: #D4AF37;
                        font-size: 0.9rem;
                        cursor: pointer;
                        transition: transform 0.2s;
                    ">
                        收到！
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            const innerBox = modal.querySelector('div > div');
            if (innerBox) {
                innerBox.style.transform = 'scale(1)';
            }
        });

        this.addPromotionKeyframes();
    },

    closePromotionModal() {
        const modal = document.getElementById('promotion-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 500);
        }
    },

    sharePromotion(level) {
        const shareText = `我在枫榕赏金酒馆晋升为「${level}」！江湖已传遍我的传说！`;
        if (navigator.share) {
            navigator.share({
                title: '枫榕赏金酒馆 - 段位晋升',
                text: shareText,
                url: window.location.href
            }).catch(() => {});
        } else {
            this.copyToClipboard(shareText);
        }
        this.closePromotionModal();
    },

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('已复制到剪贴板！');
        }).catch(() => {});
    },

    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(26, 18, 11, 0.95);
            border: 2px solid #D4AF37;
            color: #D4AF37;
            padding: 12px 25px;
            border-radius: 25px;
            font-size: 0.9rem;
            z-index: 10001;
            animation: fadeInUp 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },

    addPromotionKeyframes() {
        if (document.getElementById('promotion-styles')) return;

        const style = document.createElement('style');
        style.id = 'promotion-styles';
        style.textContent = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translate(-50%, 20px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            .tier-badge {
                padding: 4px 12px;
                border-radius: 15px;
                font-size: 0.85rem;
                font-weight: bold;
            }
            .tier-bronze {
                background: linear-gradient(135deg, #CD7F32, #8B4513);
                color: white;
            }
            .tier-silver {
                background: linear-gradient(135deg, #C0C0C0, #808080);
                color: #1A120B;
            }
            .tier-gold {
                background: linear-gradient(135deg, #FFD700, #D4AF37);
                color: #1A120B;
            }
            .tier-legendary {
                background: linear-gradient(135deg, #FFD700, #FF6B6B, #FFD700);
                background-size: 200% auto;
                animation: goldShine 2s linear infinite;
                color: #1A120B;
            }
        `;
        document.head.appendChild(style);
    },

    async loginBonus() {
        try {
            const response = await fetch('/api/prestige/login-bonus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                await this.add(data.bonusAmount, 'daily_login');
                if (data.continuousDays >= 7) {
                    this.showToast(`连续登录 ${data.continuousDays} 天！额外奖励 +${data.bonusAmount - 50}`);
                }
            }
        } catch (error) {
            console.error('Login bonus error:', error);
        }
    },

    bindEvents() {
        const profileSection = document.getElementById('profile');
        if (profileSection) {
            const observer = new MutationObserver(() => {
                this.updateUI();
                this.updateProgressBar();
            });
            observer.observe(profileSection, { childList: true, subtree: true });
        }
    }
};

window.PrestigeSystemV1 = PrestigeSystemV1;