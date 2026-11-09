// @ts-nocheck

const ADMIN_KEY = "ARIL-OWNER-889988"; 
const PARTNER_KEYS = [
    { key: "ARIL-1HARI", duration: 86400000, price: "Rp 5.000", label: "1 Hari" },
    { key: "ARIL-7HARI", duration: 604800000, price: "Rp 25.000", label: "7 Hari" },
    { key: "ARIL-30HARI", duration: 2592000000, price: "Rp 85.000", label: "30 Hari" }
];
const LINK_TOPUP_DIAMOND = "https://link-web-topup-diamond-lo.com"; 
const LINK_TOKO_BUKU = "https://link-toko-buku-lo.com";

const state = {
    userRole: 'guest', 
    currentPage: 'page-splash',
    selectedGame: '',
    isGameSelected: false,
    products: [
        { id: 1, category: 'ff', title: 'Cheat Free Fire - VIP', price: 'Rp 150.000', icon: '🔥' },
        { id: 2, category: 'ff', title: 'Cheat Free Fire - Pro', price: 'Rp 75.000', icon: '💎' },
        { id: 3, category: '8ball', title: 'Cheto 8Ball Pool - Autowin', price: 'Rp 100.000', icon: '🎱' },
        { id: 4, category: '8ball', title: 'Cheto 8Ball Pool - Longline', price: 'Rp 200.000', icon: '📏' }
    ]
};

// ================= NAVIGASI HALAMAN =================
window.nextPage = function(targetId) {
    const bgAudio = document.getElementById('audio-maintenance');
    if (bgAudio) { 
        bgAudio.pause(); 
        bgAudio.currentTime = 0; 
    }
    
    document.querySelectorAll('.page').forEach(p => { 
        p.classList.remove('active'); 
        p.style.display = 'none'; 
    });
    
    document.querySelectorAll('.bg-video').forEach(v => { 
        v.pause(); 
        v.currentTime = 0; 
    });

    const target = document.getElementById(targetId);
    if (!target) return;
    
    target.style.display = 'flex';
    target.classList.add('active'); 
    
    state.currentPage = targetId;

    let vidId = null;
    if (targetId === 'page-home') vidId = 'vid-home';
    if (targetId === 'page-catalog') vidId = 'vid-catalog';
    if (targetId === 'page-admin-panel') vidId = 'vid-admin';

    if (vidId) {
        const vid = document.getElementById(vidId);
        if (vid) { 
            vid.muted = false; 
            vid.play().catch(() => { 
                vid.muted = true; 
                vid.play(); 
            }); 
        }
    }
    
    if (targetId === 'page-home') { 
        const lp = document.getElementById('login-panel'); 
        if(lp) lp.classList.add('hidden'); 
        cekStatusTokoDiHome(); 
    }
    
    if (targetId === 'page-catalog') { 
        renderCatalog('all'); 
    }
};

// ================= FUNGSI KLIK SPLASH =================
document.addEventListener('DOMContentLoaded', () => {
    // Daftarin event listener khusus buat tombol splash
    const splashTrigger = document.getElementById('splash-trigger');
    if (splashTrigger) {
        splashTrigger.addEventListener('click', function() {
            // Nyalain audio video
            document.querySelectorAll('.bg-video').forEach(v => { 
                v.muted = false; 
                v.volume = 1.0; 
            });
            // Pindah ke halaman 2
            nextPage('page-home');
        });
    }
});

// ================= MAINTENANCE & AUTH =================
function checkStoreStatus() { return localStorage.getItem('storeClosed') === 'true'; }

window.cekStatusTokoDiHome = function() {
    const isClosed = checkStoreStatus();
    const maintenanceScreen = document.getElementById('maintenance-screen');
    const homeContent = document.getElementById('home-content');
    const bgVideo = document.getElementById('vid-home'); 
    const bgAudio = document.getElementById('audio-maintenance'); 

    if (isClosed && state.userRole !== 'admin') {
        maintenanceScreen.classList.remove('hidden');
        homeContent.style.display = 'none';
        if (bgVideo) bgVideo.pause(); 
        if (bgAudio) { bgAudio.volume = 1.0; bgAudio.play().catch(() => {}); }
    } else {
        maintenanceScreen.classList.add('hidden');
        homeContent.style.display = 'flex';
        if (bgAudio) { bgAudio.pause(); bgAudio.currentTime = 0; }
        if (bgVideo) { bgVideo.muted = false; bgVideo.play().catch(() => {}); }
    }
};

window.openAdminLogin = function() {
    Swal.fire({
        title: 'Admin Access', text: 'Masukkan Kunci Admin Anda:', input: 'password',
        showCancelButton: true, confirmButtonText: 'Masuk', confirmButtonColor: '#ff4d4d', cancelButtonColor: '#333',
        background: '#111', color: '#fff',
        inputValidator: (value) => { if (value.trim() !== ADMIN_KEY) return 'Kunci Admin Salah!'; }
    }).then((result) => {
        if (result.isConfirmed) {
            state.userRole = 'admin';
            document.getElementById('user-display-name').innerText = 'Admin (Owner)';
            document.getElementById('user-badge').classList.remove('hidden');
            document.getElementById('btn-admin-setting').classList.remove('hidden');
            document.getElementById('login-panel').classList.add('hidden');
            Swal.fire({ icon: 'success', title: 'Akses Diterima', text: 'Selamat bekerja, Admin.', background: '#111', color: '#fff', timer: 1500, showConfirmButton: false });
            nextPage('page-catalog');
        }
    });
};

window.openPartnerLogin = function() {
    let htmlList = `<div style="text-align: left; font-size: 0.9rem; margin-bottom: 15px;"><p style="color: #aaa; margin-bottom: 10px;">Beli Key Partner untuk akses:</p><div class="key-price-list">`;
    PARTNER_KEYS.forEach(k => { htmlList += `<div class="key-price-item" onclick="purchaseKey('${k.price}', '${k.label}')"><strong>${k.label}</strong> - ${k.price}<span>Klik untuk beli</span></div>`; });
    htmlList += `</div></div>`;

    Swal.fire({
        title: 'Login Partner', html: htmlList, input: 'text', inputLabel: 'Masukkan Key Anda', inputPlaceholder: 'ARIL-...',
        showCancelButton: true, confirmButtonText: 'Login', confirmButtonColor: '#ffcc00', cancelButtonColor: '#333', background: '#111', color: '#fff',
        inputValidator: (value) => {
            if (!value) return 'Key tidak boleh kosong!';
            const keyInput = value.trim();
            if (keyInput === ADMIN_KEY) return null; 
            const keyData = PARTNER_KEYS.find(k => k.key === keyInput);
            if (!keyData) return 'Key tidak valid!';
            const expiry = localStorage.getItem('partner_expiry');
            if (expiry && Date.now() > parseInt(expiry)) return 'Key sudah expired!';
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const keyInput = result.value.trim();
            if (keyInput === ADMIN_KEY) {
                state.userRole = 'admin';
                document.getElementById('user-display-name').innerText = 'Admin (Owner)';
                document.getElementById('user-badge').classList.remove('hidden');
                document.getElementById('btn-admin-setting').classList.remove('hidden');
                document.getElementById('login-panel').classList.add('hidden');
                Swal.fire({ icon: 'success', title: 'Akses Admin Diterima', text: 'Selamat bekerja, Admin.', background: '#111', color: '#fff', timer: 1500, showConfirmButton: false });
                nextPage('page-catalog');
                return; 
            }
            state.userRole = 'moderator';
            const keyData = PARTNER_KEYS.find(k => k.key === keyInput);
            if (!localStorage.getItem('partner_expiry')) localStorage.setItem('partner_expiry', Date.now() + keyData.duration);
            document.getElementById('user-display-name').innerText = 'Partner';
            document.getElementById('user-badge').classList.add('hidden');
            document.getElementById('btn-admin-setting').classList.remove('hidden'); 
            document.getElementById('login-panel').classList.add('hidden');
            Swal.fire({ icon: 'success', title: 'Akses Diterima', text: 'Anda masuk sebagai Partner.', background: '#111', color: '#fff', timer: 1500, showConfirmButton: false });
            nextPage('page-catalog');
        }
    });
};

window.purchaseKey = function(price, label) {
    Swal.fire({ title: 'Beli Key', html: `Anda akan membeli Key Partner <b>${label}</b> seharga <b>${price}</b>.`, icon: 'info', showCancelButton: true, confirmButtonText: 'Bayar Sekarang', confirmButtonColor: '#25D366', cancelButtonColor: '#333', background: '#111', color: '#fff' }).then((result) => { if (result.isConfirmed) Swal.fire({ icon: 'success', title: 'Pembayaran Berhasil', text: 'Key Anda sudah dikirim.', background: '#111', color: '#fff' }); });
};

window.loginSimulasi = function(provider) {
    Swal.fire({ title: `Login ${provider}`, text: `Mengalihkan...`, icon: 'info', background: '#111', color: '#fff', timer: 1500, showConfirmButton: false })
    .then(() => {
        state.userRole = 'member';
        document.getElementById('user-display-name').innerText = `User (Member)`;
        document.getElementById('user-badge').classList.add('hidden');
        document.getElementById('btn-admin-setting').classList.add('hidden'); 
        document.getElementById('login-panel').classList.add('hidden');
        Swal.fire({ icon: 'success', title: 'Berhasil', text: `Login via ${provider} berhasil.`, background: '#111', color: '#fff', timer: 1500, showConfirmButton: false });
        nextPage('page-catalog');
    });
};

window.loginAsGuest = function() {
    state.userRole = 'member';
    document.getElementById('user-display-name').innerText = 'Tamu (Member)';
    document.getElementById('user-badge').classList.add('hidden');
    document.getElementById('btn-admin-setting').classList.add('hidden'); 
    document.getElementById('login-panel').classList.add('hidden');
    nextPage('page-catalog');
};

window.logout = function() {
    state.userRole = 'guest';
    document.getElementById('user-display-name').innerText = 'Developer Online';
    document.getElementById('user-badge').classList.add('hidden');
    document.getElementById('btn-admin-setting').classList.add('hidden'); 
    nextPage('page-home');
};

window.checkAuthAndGoCatalog = function() {
    const loginPanel = document.getElementById('login-panel');
    if (state.userRole === 'guest') { if(loginPanel) loginPanel.classList.remove('hidden'); } else { nextPage('page-catalog'); }
};

window.bukaSettingAdmin = function() {
    if (state.userRole !== 'admin') {
        Swal.fire({ icon: 'error', title: 'Akses Ditolak', text: 'Hanya OWNER/ADMIN yang punya akses ke halaman ini!', background: '#111', color: '#fff', confirmButtonColor: '#ff0055' });
        return; 
    }
    nextPage('page-admin-panel');
};

// ================= KATALOG & POSTER =================
window.filterCategory = function(category, btnElement) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    renderCatalog(category);
};

function renderCatalog(categoryFilter = 'all') {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    const filtered = state.products.filter(p => categoryFilter === 'all' || p.category === categoryFilter);
    if (filtered.length === 0) { productGrid.innerHTML = `<p style="color:#aaa; grid-column: 1/-1; text-align:center;">Belum ada produk.</p>`; return; }
    productGrid.innerHTML = filtered.map(product => `<div class="product-card" onclick="openDigitalModal('${product.title}')"><div class="product-image">${product.icon}</div><div class="product-info"><div class="product-title">${product.title}</div><div class="product-price">${product.price}</div></div></div>`).join('');
}

window.openDigitalModal = function(productName) {
    Swal.fire({ title: productName, text: "Produk ini dibeli langsung. Lanjutkan ke pembayaran?", icon: 'question', showCancelButton: true, confirmButtonColor: '#4da6ff', cancelButtonColor: '#333', confirmButtonText: 'Beli Langsung', cancelButtonText: 'Batal', background: '#111', color: '#fff' })
    .then((result) => { if (result.isConfirmed) Swal.fire({ title: 'Mengalihkan ke Pembayaran...', text: `Pesanan: ${productName}`, background: '#111', color: '#fff', timer: 1500, showConfirmButton: false, didOpen: () => Swal.showLoading() }); });
};

window.openCartPanel = function() { document.getElementById('cart-modal').classList.remove('hidden'); };
window.closeCartModal = function() { document.getElementById('cart-modal').classList.add('hidden'); };
window.selectGame = function(gameName) { state.selectedGame = gameName; state.isGameSelected = true; Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `${gameName} dipilih!`, showConfirmButton: false, timer: 1500, background: '#111', color: '#fff' }); };

window.goToDiamondWeb = function() {
    if (!state.isGameSelected) { Swal.fire({ icon: 'warning', title: 'Pilih Game Dulu', text: 'Silakan klik logo game.', background: '#111', color: '#fff', confirmButtonColor: '#4da6ff' }); return; }
    Swal.fire({ title: 'Mengalihkan...', html: `Membawa Anda ke web Top Up <b>${state.selectedGame}</b>`, background: '#111', color: '#fff', timer: 1500, showConfirmButton: false, didOpen: () => { Swal.showLoading(); } }).then(() => { window.open(LINK_TOPUP_DIAMOND, '_blank'); });
};

window.goToBookWeb = function() { Swal.fire({ title: 'Mengalihkan...', html: `Membawa Anda ke web ARIL BOOKSTORE`, background: '#111', color: '#fff', timer: 1500, showConfirmButton: false, didOpen: () => { Swal.showLoading(); } }).then(() => { window.open(LINK_TOKO_BUKU, '_blank'); }); };

// ================= ADMIN PANEL =================
window.toggleAdminVideo = function() {
    const vid = document.getElementById('vid-admin'); const btn = document.getElementById('btn-pause-admin');
    if (!vid || !btn) return;
    if (vid.paused) { vid.play(); btn.innerHTML = '▶️'; } else { vid.pause(); btn.innerHTML = '⏸️'; }
};

window.openSettingsPopUp = function() { document.getElementById('settings-modal').classList.remove('hidden'); };
window.closeSettingsPopUp = function() { document.getElementById('settings-modal').classList.add('hidden'); };
window.toggleStoreStatus = function(isClosed) {
    localStorage.setItem('storeClosed', isClosed ? 'true' : 'false');
    closeSettingsPopUp();
    Swal.fire({ icon: 'success', title: isClosed ? 'Toko Ditutup' : 'Toko Dibuka', text: isClosed ? 'Member tidak bisa mengakses katalog.' : 'Member bisa berbelanja kembali.', background: '#111', color: '#fff', timer: 2000, showConfirmButton: false });
    if (isClosed) { nextPage('page-home'); }
};

window.checkOnlineMembers = function() {
    closeSettingsPopUp();
    const onlineUsers = JSON.parse(localStorage.getItem('aril_online_users') || '[]');
    const now = Date.now();
    const activeUsers = onlineUsers.filter(u => now - u.lastActive < 300000); 
    const totalUsers = JSON.parse(localStorage.getItem('aril_total_users') || '[]');
    let offlineCount = totalUsers.length - activeUsers.length; if (offlineCount < 0) offlineCount = 0;

    let html = `<div style="margin-bottom: 10px; text-align: center; font-size: 0.9rem;"><span style="color: #00ff00;">● Online: ${activeUsers.length}</span> | <span style="color: #ff4d4d;">● Offline: ${offlineCount}</span></div><ul style="text-align: left; max-height: 200px; overflow-y: auto;">`;
    if (activeUsers.length === 0) { html += '<li style="color: #aaa; text-align: center;">Tidak ada yang online.</li>'; } 
    else { activeUsers.forEach(u => { let displayName = (state.userRole === 'admin') ? u.name : 'Unknown (Costumer)'; html += `<li style="padding: 8px 0; border-bottom: 1px solid #333;"><span style="color: #00ff00;">●</span> <strong>${displayName}</strong></li>`; }); }
    html += '</ul>';
    Swal.fire({ title: state.userRole === 'admin' ? 'Data Member (Admin)' : 'Data Member (Partner)', html: html, icon: 'info', background: '#111', color: '#fff', confirmButtonColor: '#4da6ff', confirmButtonText: 'Tutup' });
};

function trackUserActivity() {
    const currentUser = { id: localStorage.getItem('aril_user_id') || Math.random().toString(36).substr(2, 9), name: state.userRole === 'admin' ? 'Admin' : (state.userRole === 'moderator' ? 'Partner' : (state.userRole === 'member' ? document.getElementById('user-display-name')?.innerText || 'Member' : 'Guest')), lastActive: Date.now() };
    localStorage.setItem('aril_user_id', currentUser.id);
    let onlineUsers = JSON.parse(localStorage.getItem('aril_online_users') || '[]');
    let totalUsers = JSON.parse(localStorage.getItem('aril_total_users') || '[]');
    const now = Date.now();
    onlineUsers = onlineUsers.filter(u => now - u.lastActive < 300000);
    const existingIndex = onlineUsers.findIndex(u => u.id === currentUser.id);
    if (existingIndex > -1) { onlineUsers[existingIndex] = currentUser; } else { onlineUsers.push(currentUser); }
    if (!totalUsers.includes(currentUser.id)) { totalUsers.push(currentUser.id); }
    localStorage.setItem('aril_online_users', JSON.stringify(onlineUsers));
    localStorage.setItem('aril_total_users', JSON.stringify(totalUsers));
    localStorage.setItem('aril_current_user', JSON.stringify(currentUser));
}
setInterval(trackUserActivity, 30000); setTimeout(trackUserActivity, 2000);

// ================= AI WIDGET =================
window.toggleAI = function() {
    const aiWidget = document.getElementById('ai-widget');
    const aiInput = document.getElementById('ai-input');
    if(aiWidget) { aiWidget.classList.toggle('hidden'); if (!aiWidget.classList.contains('hidden') && aiInput) aiInput.focus(); }
};

window.handleAIEnter = function(e) { if (e.key === 'Enter') sendAIMessage(); };

window.sendAIMessage = function() {
    const aiInput = document.getElementById('ai-input');
    if(!aiInput) return;
    const text = aiInput.value.trim();
    if (!text) return;
    appendMessage(text, 'ai-user');
    aiInput.value = '';
    
    if (text.trim() === ADMIN_KEY) {
        setTimeout(() => {
            appendMessage("PIN Admin terdeteksi. Akses Owner dibuka.", 'ai-bot');
            const aiChat = document.getElementById('ai-chat');
            const btn = document.createElement('button');
            btn.innerText = "🔓 Masuk ke Dashboard Admin";
            btn.style.cssText = "margin-top: 10px; padding: 10px; background: #ff0055; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; width: 100%;";
            btn.onclick = function() {
                state.userRole = 'admin';
                document.getElementById('user-display-name').innerText = 'Admin (Owner)';
                document.getElementById('user-badge').classList.remove('hidden');
                document.getElementById('btn-admin-setting').classList.remove('hidden');
                document.getElementById('maintenance-screen').classList.add('hidden');
                document.getElementById('home-content').style.display = 'flex';
                nextPage('page-catalog');
                toggleAI();
            };
            aiChat.appendChild(btn);
            aiChat.scrollTop = aiChat.scrollHeight;
        }, 500);
        return; 
    }
    setTimeout(() => { const reply = generateAIReply(text.toLowerCase()); appendMessage(reply, 'ai-bot'); }, 500);
};

function appendMessage(text, className) {
    const aiChat = document.getElementById('ai-chat');
    if(!aiChat) return;
    const div = document.createElement('div');
    div.className = `ai-msg ${className}`;
    div.innerText = text;
    aiChat.appendChild(div);
    aiChat.scrollTop = aiChat.scrollHeight;
}

function generateAIReply(input) {
    if (checkStoreStatus()) return "WEB SEDANG TUTUP ATAU DALAM PERBAIKAN (MAINTENANCE). Silakan Tunggu Beberapa Saat Lagi.";
    if (input.includes('diamond') || input.includes('top up') || input.includes('game')) return "Untuk Top Up Diamond, silakan klik tombol Keranjang di kiri atas, lalu pilih 'Top Up Diamond'.";
    if (input.includes('buku') || input.includes('book')) return "Untuk membeli buku, silakan klik tombol Keranjang di kiri atas, lalu pilih 'Beli Buku'.";
    if (input.includes('cheat') || input.includes('mod') || input.includes('apk')) return "Produk Cheat/MOD bisa dibeli langsung dengan mengklik gambarnya di halaman Katalog. Tidak masuk keranjang.";
    if (input.includes('bayar') || input.includes('qris')) return "Pembayaran mendukung QRIS Otomatis (GoPay) dan Transfer Bank BSI.";
    return "Silakan hubungi WA/Telegram kami jika butuh bantuan lebih lanjut.";
}

let isDragging = false, hasMoved = false, startX, startY, initialLeft, initialTop;
window.startDragAI = function(e) {
    const aiFab = document.getElementById('ai-fab'); if (!aiFab) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return; e.preventDefault();
    startX = e.clientX; startY = e.clientY;
    const rect = aiFab.getBoundingClientRect(); initialLeft = rect.left; initialTop = rect.top;
    isDragging = true; hasMoved = false;
    document.addEventListener('pointermove', onDragAI); document.addEventListener('pointerup', stopDragAI);
};
function onDragAI(e) {
    if (!isDragging) return; const aiFab = document.getElementById('ai-fab'); if (!aiFab) return;
    const dx = e.clientX - startX; const dy = e.clientY - startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;
    if (hasMoved) {
        let newLeft = initialLeft + dx; let newTop = initialTop + dy;
        const maxLeft = window.innerWidth - aiFab.offsetWidth; const maxTop = window.innerHeight - aiFab.offsetHeight;
        newLeft = Math.max(0, Math.min(newLeft, maxLeft)); newTop = Math.max(0, Math.min(newTop, maxTop));
        aiFab.style.left = newLeft + 'px'; aiFab.style.top = newTop + 'px'; aiFab.style.right = 'auto'; aiFab.style.bottom = 'auto';
    }
}
function stopDragAI(e) {
    if (!isDragging) return; isDragging = false;
    document.removeEventListener('pointermove', onDragAI); document.removeEventListener('pointerup', stopDragAI);
    if (!hasMoved) window.toggleAI();
}

// ================= BATERAI =================
function updateBatteryStatus(battery) {
    const el = document.getElementById('battery-level');
    if (!el) return;
    let icon = '🔋'; if (battery.charging) icon = '⚡'; else if (battery.level <= 0.2) icon = '🪫';
    el.innerText = `${icon} ${Math.round(battery.level * 100)}%`;
    if (battery.level <= 0.2 && !battery.charging) { el.style.color = '#ff4d4d'; } else { el.style.color = '#00ff00'; }
}
if ('getBattery' in navigator) {
    navigator.getBattery().then(function(battery) {
        updateBatteryStatus(battery);
        battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
        battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));
    });
} else {
    const el = document.getElementById('battery-level'); if (el) el.innerText = '🔋 20%';
}

// ================= VOLUME =================
window.toggleVolumeSlider = function() { const slider = document.getElementById('volume-slider-container'); if (slider) slider.classList.toggle('hidden'); };
window.changeVolume = function(val) { document.querySelectorAll('video').forEach(vid => { vid.volume = parseFloat(val); }); };

// ================= BACK BUTTON HP =================
history.pushState(null, null, location.href);
window.addEventListener('popstate', function(event) {
    history.pushState(null, null, location.href);
    if (state.currentPage !== 'page-home' && state.currentPage !== 'page-splash') { window.nextPage('page-catalog'); } 
    else if (state.currentPage === 'page-catalog') { window.nextPage('page-home'); }
});

// ================= INIT KATALOG =================
document.addEventListener('DOMContentLoaded', () => { renderCatalog('all'); });