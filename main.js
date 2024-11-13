document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item.has-submenu');
    
    menuItems.forEach(menuItem => {
        const menuTitle = menuItem.querySelector('.menu-title');
        
        menuTitle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // إغلاق القوائم الأخرى
            menuItems.forEach(item => {
                if (item !== menuItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });
            
            // تبديل حالة القائمة الحالية
            menuItem.classList.toggle('active');
            
            // إعادة تعيين الانيميشن عند الإغلاق
            const submenuItems = menuItem.querySelectorAll('.submenu-item');
            if (!menuItem.classList.contains('active')) {
                submenuItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-10px)';
                });
            }
        });
    });

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(e) {
        menuItems.forEach(menuItem => {
            if (!menuItem.contains(e.target)) {
                menuItem.classList.remove('active');
            }
        });
    });

    // فتح النافذة المنبثقة للحظر
    const banButtons = document.querySelectorAll('.action-btn.ban');
    const banModal = document.getElementById('banModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBan = document.querySelector('.cancel-ban');
    
    banButtons.forEach(button => {
        button.addEventListener('click', () => {
            banModal.classList.add('active');
        });
    });

    // إغلاق النافذة المنبثقة
    [closeModal, cancelBan].forEach(element => {
        element.addEventListener('click', () => {
            banModal.classList.remove('active');
        });
    });

    // تنفيذ الحظر
    const confirmBan = document.querySelector('.confirm-ban');
    confirmBan.addEventListener('click', () => {
        const reason = document.querySelector('.ban-reason').value;
        const duration = document.querySelector('.ban-duration').value;
        
        // هنا يمكنك إضافة كود للتواصل مع الخادم لتنفيذ الحظر
        console.log(`تم الحظر لمدة ${duration} يوم(أيام)، السبب: ${reason}`);
        
        banModal.classList.remove('active');
    });

    // تحديث قائمة اللاعبين
    const refreshBtn = document.querySelector('.refresh-btn');
    refreshBtn.addEventListener('click', () => {
        // هنا يمكنك إضافة كود لتحديث قائمة اللاعبين
        console.log('جاري تحديث القائمة...');
    });

    // تكوين API السيرفر
    const fivemAPI = {
        serverIP: '',
        serverPort: '30120',
        
        // دالة جلب قائمة اللاعبين
        async getPlayers() {
            try {
                // استخدام FiveM Server API
                const response = await fetch(`http://${this.serverIP}:${this.serverPort}/info.json`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Server data:', data);
                
                // استخدام FiveM Players API
                const playersResponse = await fetch(`http://${this.serverIP}:${this.serverPort}/players.json`);
                if (!playersResponse.ok) {
                    throw new Error('Players data not available');
                }
                const players = await playersResponse.json();
                console.log('Players:', players);
                
                return players.map(player => ({
                    id: player.id,
                    name: player.name,
                    ping: player.ping || 0
                }));
            } catch (error) {
                console.error('Error fetching players:', error);
                return [];
            }
        }
    };

    // تحديث قائمة اللاعبين في الواجهة
    async function updatePlayersList() {
        try {
            const playersList = document.querySelector('.players-list');
            if (!playersList) return;

            const players = await fivemAPI.getPlayers();
            
            playersList.innerHTML = '';
            
            if (players.length === 0) {
                playersList.innerHTML = '<div class="no-players">لا يوجد لاعبين متصلين حالياً</div>';
                return;
            }

            players.forEach(player => {
                const playerCard = `
                    <div class="player-card">
                        <div class="player-info">
                            <div class="player-details">
                                <h3>${player.name}</h3>
                                <div class="player-meta">
                                    <span class="player-id">ID: ${player.id}</span>
                                    <span class="player-ping">Ping: ${player.ping}ms</span>
                                </div>
                            </div>
                        </div>
                        <div class="player-actions">
                            <button class="action-btn ban" onclick="handleBanPlayer('${player.id}')">
                                <i class="fas fa-ban"></i>
                                حظر
                            </button>
                            <button class="action-btn kick" onclick="handleKickPlayer('${player.id}')">
                                <i class="fas fa-sign-out-alt"></i>
                                طرد
                            </button>
                            <button class="action-btn warn">
                                <i class="fas fa-exclamation-triangle"></i>
                                تحذير
                            </button>
                            <button class="action-btn give-item">
                                <i class="fas fa-gift"></i>
                                إعطاء آيتم
                            </button>
                        </div>
                    </div>
                `;
                playersList.innerHTML += playerCard;
            });
        } catch (error) {
            console.error('Error updating players list:', error);
        }
    }

    // تحديث القائمة كل 5 ثواني
    setInterval(updatePlayersList, 5000);

    // تحديث القائمة عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', updatePlayersList);

    // تحديث عند الضغط على زر التحديث
    document.querySelector('.refresh-btn')?.addEventListener('click', updatePlayersList);
}); 


