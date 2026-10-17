/**
 * Brahma Kumaris Kozhikode - Admin Management Suite Controller (CMS)
 * Handles Dynamic Tab Builder, Media & Gallery CRUD, Events CRUD,
 * Registrations CRM, Daily Wisdom editor, and Site Settings.
 */

class AdminController {
  constructor() {
    this.currentPane = 'dashboard';
    this.uploadedImageData = null;

    // Bindings
    this.init = this.init.bind(this);
  }

  async init() {
    const token = sessionStorage.getItem('bk_admin_token');
    if (token) {
      try {
        const res = await fetch('/api/admin/verify', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            this.showPanelView();
            return;
          }
        }
      } catch (e) {
        if (window.bkStore && window.bkStore.isAdminAuthenticated()) {
          this.showPanelView();
          return;
        }
      }
    }
    this.showLoginView();
  }

  openAdminModal() {
    const modal = document.getElementById('adminModal');
    if (!modal) return;
    modal.classList.add('active');

    if (window.bkStore.isAdminAuthenticated()) {
      this.showPanelView();
      this.refreshAllPanes();
    } else {
      this.showLoginView();
    }
  }

  closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  showLoginView() {
    const loginView = document.getElementById('adminLoginView');
    const panelView = document.getElementById('adminPanelView');
    if (loginView) loginView.style.display = 'block';
    if (panelView) panelView.style.display = 'none';
  }

  showPanelView() {
    const loginView = document.getElementById('adminLoginView');
    const panelView = document.getElementById('adminPanelView');
    if (loginView) loginView.style.display = 'none';
    if (panelView) {
      panelView.style.display = 'flex';
      this.refreshAllPanes();
    }
  }

  async handleLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    const pinInput = document.getElementById('adminPinInput');
    const pin = pinInput ? pinInput.value.trim() : '';
    const errBox = document.getElementById('loginErrorMsg');
    if (errBox) { errBox.style.display = 'none'; errBox.textContent = ''; }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pin })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('bk_admin_token', data.token);
        sessionStorage.setItem('bk_admin_session_auth', 'true');
        if (pinInput) pinInput.value = '';
        this.showPanelView();
        if (window.bkApp && window.bkApp.toast) {
          window.bkApp.toast("Admin Authentication Successful! Welcome to Brahma Kumaris CMS.");
        }
        return;
      } else {
        const msg = data.error || "Invalid administrative credentials.";
        if (errBox) {
          errBox.textContent = msg;
          errBox.style.display = 'block';
        } else {
          alert(msg);
        }
      }
    } catch (err) {
      if (window.bkStore && window.bkStore.authenticateAdmin(pin)) {
        sessionStorage.setItem('bk_admin_session_auth', 'true');
        if (pinInput) pinInput.value = '';
        this.showPanelView();
        return;
      }
      if (errBox) {
        errBox.textContent = "Invalid administrative credentials.";
        errBox.style.display = 'block';
      } else {
        alert("Invalid administrative credentials.");
      }
    }
  }

  async handleLogout() {
    const token = sessionStorage.getItem('bk_admin_token');
    try {
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        });
      }
    } catch (e) {}
    sessionStorage.removeItem('bk_admin_token');
    sessionStorage.removeItem('bk_admin_session_auth');
    this.showLoginView();
  }

  switchPane(paneId, btn) {
    this.currentPane = paneId;
    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    document.querySelectorAll('.admin-body .admin-pane').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`pane-${paneId}`);
    if (target) target.classList.add('active');

    this.refreshPaneData(paneId);
  }

  // Live Responsive Device Viewport Preview Simulator
  setDevicePreview(device, btn) {
    document.querySelectorAll('.btn-device-prev').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const appRoot = document.getElementById('appRoot') || document.body;
    appRoot.classList.remove('device-preview-desktop', 'device-preview-tablet', 'device-preview-mobile');

    if (device === 'tablet') {
      appRoot.classList.add('device-preview-tablet');
      window.bkApp.toast("📱 Simulating Tablet Viewport (768px).");
    } else if (device === 'mobile') {
      appRoot.classList.add('device-preview-mobile');
      window.bkApp.toast("📱 Simulating Mobile Viewport (390px).");
    } else {
      appRoot.classList.add('device-preview-desktop');
      window.bkApp.toast("🖥️ Simulating Desktop Viewport (100%).");
    }
  }

  refreshAllPanes() {
    this.refreshDashboard();
    this.renderAboutManager();
    this.renderDailyMuraliManager();
    this.renderCentersManager();
    this.renderYouTubeManager();
    this.renderAdminSocialChannels();
    this.renderAdminCourseManager();
    this.renderAdminTabsList();
    this.renderAdminGallery();
    this.renderCloudinaryManager();
    this.renderAdminEvents();
    this.renderAdminRegistrations();
    this.loadSettingsForm();
  }

  refreshPaneData(paneId) {
    if (paneId === 'dashboard') this.refreshDashboard();
    if (paneId === 'about-mgr') this.renderAboutManager();
    if (paneId === 'murali-mgr') this.renderDailyMuraliManager();
    if (paneId === 'centers-mgr') this.renderCentersManager();
    if (paneId === 'youtube-mgr') this.renderYouTubeManager();
    if (paneId === 'social-channels-mgr') this.renderAdminSocialChannels();
    if (paneId === 'course-mgr') this.renderAdminCourseManager();
    if (paneId === 'tab-builder') this.renderAdminTabsList();
    if (paneId === 'gallery-mgr') this.renderAdminGallery();
    if (paneId === 'cloudinary-mgr') this.renderCloudinaryManager();
    if (paneId === 'events-mgr') this.renderAdminEvents();
    if (paneId === 'registrations-mgr') this.renderAdminRegistrations();
    if (paneId === 'settings-mgr') this.loadSettingsForm();
  }

  // --- Dashboard Pane ---
  refreshDashboard() {
    const regs = window.bkStore.getRegistrations();
    const tabs = window.bkStore.getTabs();
    const gallery = window.bkStore.getGallery();
    const events = window.bkStore.getEvents();

    const statReg = document.getElementById('statRegCount');
    const statTabs = document.getElementById('statTabsCount');
    const statMedia = document.getElementById('statMediaCount');
    const statEv = document.getElementById('statEventsCount');

    if (statReg) statReg.textContent = regs.length;
    if (statTabs) statTabs.textContent = tabs.length;
    if (statMedia) statMedia.textContent = gallery.length;
    if (statEv) statEv.textContent = events.length;

    // Recent registrations table
    const tbody = document.getElementById('dashRecentRegsTable');
    if (tbody) {
      const recent = regs.slice(0, 5);
      tbody.innerHTML = recent.length === 0 ? '<tr><td colspan="6" style="text-align:center;">No registrations yet.</td></tr>' : '';
      recent.forEach(r => {
        const tr = document.createElement('tr');
        const statusClass = (r.status || 'New').toLowerCase();
        tr.innerHTML = `
          <td><strong>${r.name}</strong></td>
          <td>${r.phone}</td>
          <td>${r.preferredCenter || 'Ashokapuram'}</td>
          <td>${r.courseType}</td>
          <td><span class="badge-status ${statusClass}">${r.status || 'New'}</span></td>
          <td>${r.date}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // --- Dynamic Tab Builder ---
  renderAdminTabsList() {
    const container = document.getElementById('adminTabsListContainer');
    if (!container) return;

    const tabs = window.bkStore.getTabs();
    container.innerHTML = '';

    tabs.forEach(t => {
      const card = document.createElement('div');
      card.className = `admin-tab-item-card ${t.isCore ? 'is-core' : 'is-custom'}`;
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:1rem;">
          <div style="width:36px;height:36px;border-radius:50%;background:rgba(217,69,20,0.1);display:flex;align-items:center;justify-content:center;color:var(--sunset-primary);">
            <i data-lucide="${t.icon || 'file-text'}" style="width:18px;height:18px;"></i>
          </div>
          <div>
            <strong style="font-size:1rem;color:var(--sunset-dark-base);">${t.label}</strong>
            <span style="font-size:0.75rem;margin-left:0.5rem;padding:0.15rem 0.5rem;border-radius:4px;background:${t.isCore ? '#fef3c7;color:#92400e;' : '#fee2e2;color:#991b1b;'}">
              ${t.isCore ? 'Core System Tab' : 'Custom Page Tab'}
            </span>
            <div style="font-size:0.8rem;color:var(--text-muted);">Slug: /#${t.id} • Order: ${t.order || 0} • ${t.enabled !== false ? '✅ Active in Navigation' : '❌ Hidden'}</div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:0.6rem;">
          <button class="btn-action-sm" onclick="bkAdmin.toggleTab('${t.id}')" style="background:#f3f4f6;color:#374151;">
            ${t.enabled !== false ? 'Hide' : 'Show'}
          </button>
          ${!t.isCore ? `
            <button class="btn-action-sm btn-action-edit" onclick="bkAdmin.showEditTabForm('${t.id}')">Edit Content</button>
            <button class="btn-action-sm btn-action-del" onclick="bkAdmin.deleteTab('${t.id}')">Delete</button>
          ` : ''}
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  showAddTabForm() {
    const form = document.getElementById('addTabFormContainer');
    if (!form) return;
    document.getElementById('tabFormId').value = '';
    document.getElementById('tabFormLabel').value = '';
    document.getElementById('tabFormSubtitle').value = '';
    document.getElementById('tabFormContent').value = '';
    document.getElementById('tabFormTitle').textContent = 'Create New Dynamic Navigation Tab';
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
  }

  showEditTabForm(tabId) {
    const form = document.getElementById('addTabFormContainer');
    const tab = window.bkStore.getTabs().find(t => t.id === tabId);
    const page = window.bkStore.getCustomPage(tabId);
    if (!form || !tab) return;

    document.getElementById('tabFormId').value = tab.id;
    document.getElementById('tabFormLabel').value = tab.label;
    document.getElementById('tabFormIcon').value = tab.icon || 'file-text';
    document.getElementById('tabFormSubtitle').value = page ? (page.subtitle || '') : '';
    document.getElementById('tabFormContent').value = page ? (page.contentHtml || '') : '';
    document.getElementById('tabFormTitle').textContent = `Edit Tab: ${tab.label}`;

    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
  }

  hideAddTabForm() {
    const form = document.getElementById('addTabFormContainer');
    if (form) form.style.display = 'none';
  }

  handleSaveTab(e) {
    e.preventDefault();
    const id = document.getElementById('tabFormId').value;
    const label = document.getElementById('tabFormLabel').value.trim();
    const icon = document.getElementById('tabFormIcon').value;
    const subtitle = document.getElementById('tabFormSubtitle').value.trim();
    const contentHtml = document.getElementById('tabFormContent').value.trim();

    if (!label) {
      alert("Tab label is required.");
      return;
    }

    if (id) {
      // Edit existing custom tab
      window.bkStore.updateTab(id, { label, icon });
      window.bkStore.updateCustomPage(id, { title: label, subtitle, contentHtml });
      window.bkApp.toast(`Tab "${label}" updated successfully!`);
    } else {
      // Add new tab
      const newTab = window.bkStore.addTab({ label, icon, subtitle, contentHtml });
      window.bkApp.toast(`New dynamic tab "${label}" created and added to top navigation!`);
    }

    this.hideAddTabForm();
    this.renderAdminTabsList();
    this.refreshDashboard();
  }

  toggleTab(tabId) {
    const tab = window.bkStore.getTabs().find(t => t.id === tabId);
    if (tab) {
      window.bkStore.updateTab(tabId, { enabled: tab.enabled === false ? true : false });
      this.renderAdminTabsList();
      window.bkApp.toast(`Tab visibility updated.`);
    }
  }

  deleteTab(tabId) {
    if (confirm("Are you sure you want to delete this custom tab and its content page?")) {
      window.bkStore.deleteTab(tabId);
      this.renderAdminTabsList();
      this.refreshDashboard();
      window.bkApp.toast("Tab deleted successfully.");
    }
  }

  // --- Media & Gallery Manager ---
  renderAdminGallery() {
    const container = document.getElementById('adminGalleryTableContainer');
    if (!container) return;

    const items = window.bkStore.getGallery();
    container.innerHTML = '';

    let html = `
      <div style="overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (items.length === 0) {
      html += `<tr><td colspan="5" style="text-align:center;">No gallery items uploaded yet.</td></tr>`;
    } else {
      items.forEach(item => {
        html += `
          <tr>
            <td><img src="${item.thumbnail || item.url}" style="width:60px;height:45px;object-fit:cover;border-radius:4px;" alt="thumb"></td>
            <td><strong>${item.title}</strong><div style="font-size:0.78rem;color:var(--text-muted);">${item.description || ''}</div></td>
            <td><span class="facility-tag">${item.category}</span></td>
            <td>${item.date}</td>
            <td>
              <div style="display:flex;gap:0.4rem;">
                <button class="btn-action-sm btn-action-edit" onclick="bkAdmin.showEditMediaForm('${item.id}')">Edit</button>
                <button class="btn-action-sm btn-action-del" onclick="bkAdmin.deleteMedia('${item.id}')">Delete</button>
              </div>
            </td>
          </tr>
        `;
      });
    }

    html += `</tbody></table></div>`;
    container.innerHTML = html;
  }

  showAddMediaForm() {
    const form = document.getElementById('addMediaFormContainer');
    if (!form) return;
    document.getElementById('mediaFormId').value = '';
    document.getElementById('mediaFormTitleInput').value = '';
    document.getElementById('mediaFormUrl').value = '';
    document.getElementById('mediaFormDesc').value = '';
    document.getElementById('mediaFormTitle').textContent = 'Add New Media Item to Gallery';
    this.uploadedImageData = null;
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
  }

  showEditMediaForm(mediaId) {
    const form = document.getElementById('addMediaFormContainer');
    const item = window.bkStore.getGallery().find(g => g.id === mediaId);
    if (!form || !item) return;

    document.getElementById('mediaFormId').value = item.id;
    document.getElementById('mediaFormTitleInput').value = item.title;
    document.getElementById('mediaFormCategory').value = item.category;
    document.getElementById('mediaFormUrl').value = item.url;
    document.getElementById('mediaFormDesc').value = item.description || '';
    document.getElementById('mediaFormTitle').textContent = `Edit Media: ${item.title}`;
    this.uploadedImageData = null;

    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
  }

  hideAddMediaForm() {
    const form = document.getElementById('addMediaFormContainer');
    if (form) form.style.display = 'none';
  }

  handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.uploadedImageData = event.target.result;
        document.getElementById('mediaFormUrl').value = `[Uploaded File: ${file.name}]`;
        window.bkApp.toast(`Loaded image: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  }

  handleSaveMedia(e) {
    e.preventDefault();
    const id = document.getElementById('mediaFormId').value;
    const title = document.getElementById('mediaFormTitleInput').value.trim();
    const category = document.getElementById('mediaFormCategory').value;
    let url = document.getElementById('mediaFormUrl').value.trim();
    const description = document.getElementById('mediaFormDesc').value.trim();

    if (this.uploadedImageData) {
      url = this.uploadedImageData;
    }

    if (!title || !url) {
      alert("Title and image URL or uploaded file are required.");
      return;
    }

    if (id) {
      window.bkStore.updateGalleryItem(id, { title, category, url, thumbnail: url, description });
      window.bkApp.toast(`Media item "${title}" updated!`);
    } else {
      window.bkStore.addGalleryItem({ title, category, url, thumbnail: url, description });
      window.bkApp.toast(`New media item "${title}" added to gallery!`);
    }

    this.hideAddMediaForm();
    this.renderAdminGallery();
    this.refreshDashboard();
  }

  deleteMedia(mediaId) {
    if (confirm("Are you sure you want to delete this media item?")) {
      window.bkStore.deleteGalleryItem(mediaId);
      this.renderAdminGallery();
      this.refreshDashboard();
      window.bkApp.toast("Media item deleted from gallery.");
    }
  }

  // =========================================================================
  // CLOUDINARY IMAGE SUITE & ASSET MANAGER
  // =========================================================================
  async renderCloudinaryManager() {
    const grid = document.getElementById('cloudinaryGridContainer');
    if (!grid) return;

    if (!this.cloudinaryItems || this.cloudinaryItems.length === 0) {
      await this.loadCloudinaryImages();
    } else {
      this.renderCloudinaryGrid(this.cloudinaryItems);
    }
  }

  async loadCloudinaryImages(force = false) {
    const grid = document.getElementById('cloudinaryGridContainer');
    if (!grid) return;

    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:2.5rem;background:#fff;border-radius:8px;border:1px solid #e2e8f0;">
        <div style="display:inline-block;width:24px;height:24px;border:3px solid #f59e0b;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
        <div style="margin-top:0.75rem;font-weight:600;color:#64748b;">Loading images from Cloudinary (uo0dcjpe)...</div>
      </div>
    `;

    const CLOUD_NAME = 'uo0dcjpe';
    const LIST_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/wall_paper.json?t=${Date.now()}`;

    try {
      const res = await fetch(LIST_URL).catch(() => null);
      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && Array.isArray(data.resources) && data.resources.length > 0) {
          this.cloudinaryItems = data.resources.map((r, idx) => {
            const publicId = r.public_id;
            const version = r.version ? `v${r.version}/` : '';
            const encId = publicId.split('/').map(encodeURIComponent).join('/');
            const format = r.format || 'jpg';
            const title = publicId.split('/').pop().replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const thumbUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_600,h_400,q_auto,f_auto/${version}${encId}.${format}`;
            const fullUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto:best,f_auto/${version}${encId}.${format}`;
            return {
              id: `cld_${idx}`,
              publicId,
              title,
              format: format.toUpperCase(),
              width: r.width || 1920,
              height: r.height || 1080,
              thumbUrl,
              fullUrl
            };
          });
          this.renderCloudinaryGrid(this.cloudinaryItems);
          return;
        }
      }
    } catch (e) {
      console.warn('Direct Cloudinary fetch failed, using curated catalog:', e);
    }

    // Curated catalog fallback
    this.cloudinaryItems = [
      {
        id: 'cld_0',
        publicId: 'wall_paper/paramdham_light_palace',
        title: 'Paramdham Light Palace (Soul World)',
        format: 'JPG',
        width: 1920,
        height: 1080,
        thumbUrl: 'https://res.cloudinary.com/uo0dcjpe/image/upload/c_fill,w_600,h_400,q_auto,f_auto/wall_paper/paramdham_light_palace.jpg',
        fullUrl: 'https://res.cloudinary.com/uo0dcjpe/image/upload/q_auto:best,f_auto/wall_paper/paramdham_light_palace.jpg'
      },
      {
        id: 'cld_1',
        publicId: 'wall_paper/shiv_baba_golden_red_aura',
        title: 'Shiv Baba Divine Golden Red Radiance',
        format: 'JPG',
        width: 1920,
        height: 1080,
        thumbUrl: 'https://res.cloudinary.com/uo0dcjpe/image/upload/c_fill,w_600,h_400,q_auto,f_auto/wall_paper/shiv_baba_golden_red_aura.jpg',
        fullUrl: 'https://res.cloudinary.com/uo0dcjpe/image/upload/q_auto:best,f_auto/wall_paper/shiv_baba_golden_red_aura.jpg'
      },
      {
        id: 'cld_2',
        publicId: 'wall_paper/meditation_peace_clouds',
        title: 'Ocean of Peace Meditation Atmosphere',
        format: 'JPG',
        width: 1920,
        height: 1080,
        thumbUrl: 'https://res.cloudinary.com/uo0dcjpe/image/upload/c_fill,w_600,h_400,q_auto,f_auto/wall_paper/meditation_peace_clouds.jpg',
        fullUrl: 'https://res.cloudinary.com/uo0dcjpe/image/upload/q_auto:best,f_auto/wall_paper/meditation_peace_clouds.jpg'
      },
      {
        id: 'cld_3',
        publicId: 'wall_paper/brahma_baba_angelic_stage',
        title: 'Prajapita Brahma Baba Angelic Stage',
        format: 'JPG',
        width: 1920,
        height: 1080,
        thumbUrl: 'https://res.cloudinary.com/uo0dcjpe/image/upload/c_fill,w_600,h_400,q_auto,f_auto/wall_paper/brahma_baba_angelic_stage.jpg',
        fullUrl: 'https://res.cloudinary.com/uo0dcjpe/image/upload/q_auto:best,f_auto/wall_paper/brahma_baba_angelic_stage.jpg'
      },
      {
        id: 'cld_4',
        publicId: 'wall_paper/golden_age_bharat_paradise',
        title: 'Golden Age Bharat Satyug Deity World',
        format: 'JPG',
        width: 1920,
        height: 1080,
        thumbUrl: 'https://res.cloudinary.com/uo0dcjpe/image/upload/c_fill,w_600,h_400,q_auto,f_auto/wall_paper/golden_age_bharat_paradise.jpg',
        fullUrl: 'https://res.cloudinary.com/uo0dcjpe/image/upload/q_auto:best,f_auto/wall_paper/golden_age_bharat_paradise.jpg'
      },
      {
        id: 'cld_5',
        publicId: 'wall_paper/rajyoga_spark_point_of_light',
        title: 'Soul as Sparkling Star in Forehead',
        format: 'JPG',
        width: 1920,
        height: 1080,
        thumbUrl: 'https://res.cloudinary.com/uo0dcjpe/image/upload/c_fill,w_600,h_400,q_auto,f_auto/wall_paper/rajyoga_spark_point_of_light.jpg',
        fullUrl: 'https://res.cloudinary.com/uo0dcjpe/image/upload/q_auto:best,f_auto/wall_paper/rajyoga_spark_point_of_light.jpg'
      }
    ];

    this.renderCloudinaryGrid(this.cloudinaryItems);
  }

  renderCloudinaryGrid(items) {
    const grid = document.getElementById('cloudinaryGridContainer');
    if (!grid) return;

    if (!items || items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;background:#fff;border-radius:8px;border:1px solid #e2e8f0;color:#64748b;">
          No Cloudinary images match your search.
        </div>
      `;
      return;
    }

    grid.innerHTML = items.map(img => `
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);display:flex;flex-direction:column;transition:transform 0.15s ease,box-shadow 0.15s ease;">
        <div style="position:relative;width:100%;height:140px;background:#0f172a;overflow:hidden;">
          <img src="${img.thumbUrl}" alt="${img.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.src='assets/images/paramdham.jpg'">
          <span style="position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,0.7);color:#fff;font-size:0.7rem;padding:2px 6px;border-radius:4px;font-weight:600;">
            ${img.format} ${img.width ? `• ${img.width}x${img.height}` : ''}
          </span>
        </div>
        <div style="padding:0.85rem;display:flex;flex-direction:column;flex:1;justify-content:space-between;">
          <div>
            <h5 style="margin:0 0 0.35rem 0;font-size:0.9rem;font-weight:700;color:#1e293b;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
              ${img.title}
            </h5>
            <div style="font-size:0.72rem;color:#64748b;font-family:monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${img.publicId}">
              ${img.publicId}
            </div>
          </div>
          <div style="margin-top:0.85rem;display:flex;flex-direction:column;gap:0.4rem;">
            <div style="display:flex;gap:0.4rem;">
              <button type="button" class="btn-action-sm" style="flex:1;background:#f8fafc;border:1px solid #cbd5e1;color:#334155;font-size:0.75rem;padding:4px 6px;border-radius:4px;cursor:pointer;" onclick="bkAdmin.copyCloudinaryUrl('${img.fullUrl}')" title="Copy Direct URL">
                📋 Copy URL
              </button>
              <a href="${img.fullUrl}" target="_blank" rel="noopener noreferrer" class="btn-action-sm" style="background:#f8fafc;border:1px solid #cbd5e1;color:#334155;font-size:0.75rem;padding:4px 8px;border-radius:4px;text-decoration:none;display:inline-flex;align-items:center;" title="Open in new tab">
                ↗
              </a>
            </div>
            <button type="button" class="btn-action-sm" style="width:100%;background:#fef3c7;border:1px solid #f59e0b;color:#92400e;font-size:0.75rem;font-weight:600;padding:5px 8px;border-radius:4px;cursor:pointer;" onclick="bkAdmin.addCloudinaryToSiteGallery('${img.publicId}', '${img.format}', '${img.title.replace(/'/g, "\\'")}', '${img.fullUrl}')">
              + Add to Website Gallery
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  filterCloudinaryImages(query) {
    if (!this.cloudinaryItems) return;
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      this.renderCloudinaryGrid(this.cloudinaryItems);
      return;
    }
    const filtered = this.cloudinaryItems.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.publicId.toLowerCase().includes(q) ||
      (item.format && item.format.toLowerCase().includes(q))
    );
    this.renderCloudinaryGrid(filtered);
  }

  refreshCloudinaryImages() {
    this.cloudinaryItems = null;
    this.loadCloudinaryImages(true);
    if (window.bkApp && window.bkApp.toast) {
      window.bkApp.toast("Refreshed Cloudinary assets from uo0dcjpe!");
    }
  }

  copyCloudinaryUrl(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        if (window.bkApp && window.bkApp.toast) {
          window.bkApp.toast("📋 Cloudinary URL copied to clipboard!");
        } else {
          alert("Copied URL:\n" + url);
        }
      }).catch(() => {
        prompt("Copy image URL:", url);
      });
    } else {
      prompt("Copy image URL:", url);
    }
  }

  addCloudinaryToSiteGallery(publicId, format, title, url) {
    window.bkStore.addGalleryItem({
      title: title || 'Cloudinary Spiritual Artwork',
      category: 'Meditation',
      url: url,
      thumbnail: url,
      description: `Cloudinary asset: ${publicId}`
    });
    this.renderAdminGallery();
    this.refreshDashboard();
    if (window.bkApp && window.bkApp.toast) {
      window.bkApp.toast(`✨ Added "${title}" to website photo gallery!`);
    } else {
      alert(`Added "${title}" to website photo gallery!`);
    }
  }

  showCloudinaryUploadModal() {
    const el = document.getElementById('cloudinaryUploadContainer');
    if (el) {
      el.style.display = 'block';
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  hideCloudinaryUploadModal() {
    const el = document.getElementById('cloudinaryUploadContainer');
    if (el) el.style.display = 'none';
    this.cloudinaryLocalData = null;
    const previewBox = document.getElementById('cloudinaryUploadPreviewBox');
    if (previewBox) previewBox.style.display = 'none';
  }

  handleCloudinaryLocalFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.cloudinaryLocalData = e.target.result;
      const previewBox = document.getElementById('cloudinaryUploadPreviewBox');
      const previewImg = document.getElementById('cloudinaryUploadPreviewImg');
      if (previewBox && previewImg) {
        previewImg.src = this.cloudinaryLocalData;
        previewBox.style.display = 'block';
      }
      const titleInput = document.getElementById('cloudinaryCustomTitle');
      if (titleInput && !titleInput.value) {
        titleInput.value = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      }
      if (window.bkApp && window.bkApp.toast) {
        window.bkApp.toast(`Loaded image: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  }

  saveCloudinaryAsset() {
    const title = (document.getElementById('cloudinaryCustomTitle')?.value || '').trim();
    const tag = document.getElementById('cloudinaryCustomTag')?.value || 'wall_paper';
    let url = (document.getElementById('cloudinaryDirectUrl')?.value || '').trim();

    if (this.cloudinaryLocalData) {
      url = this.cloudinaryLocalData;
    }

    if (!title) {
      alert("Please enter an image title.");
      return;
    }

    if (!url) {
      alert("Please enter a direct Cloudinary URL / Public ID, or choose an image file.");
      return;
    }

    if (!url.startsWith('http') && !url.startsWith('data:')) {
      const enc = url.split('/').map(encodeURIComponent).join('/');
      url = `https://res.cloudinary.com/uo0dcjpe/image/upload/q_auto:best,f_auto/${enc}`;
    }

    const newItem = {
      id: `cld_custom_${Date.now()}`,
      publicId: `custom/${title.toLowerCase().replace(/\s+/g, '_')}`,
      title: title,
      format: 'JPG',
      width: 1920,
      height: 1080,
      thumbUrl: url,
      fullUrl: url
    };

    if (!this.cloudinaryItems) this.cloudinaryItems = [];
    this.cloudinaryItems.unshift(newItem);

    window.bkStore.addGalleryItem({
      title: title,
      category: tag === 'wall_paper' ? 'Meditation' : tag,
      url: url,
      thumbnail: url,
      description: `Uploaded/Linked asset: ${title}`
    });

    this.renderCloudinaryGrid(this.cloudinaryItems);
    this.renderAdminGallery();
    this.refreshDashboard();
    this.hideCloudinaryUploadModal();

    if (window.bkApp && window.bkApp.toast) {
      window.bkApp.toast(`🕊️ Image "${title}" successfully linked and saved to website media!`);
    } else {
      alert(`Image "${title}" successfully saved!`);
    }
  }

  // =========================================================================
  // EVENTS & WORKSHOPS MANAGEMENT
  // =========================================================================

  filterAdminEvents(category, btn) {
    this.currentEventFilter = category;
    document.querySelectorAll('.admin-ev-filter-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-cat') === category);
    });
    this.renderAdminEvents(category);
  }

  renderAdminEvents(filterCat = this.currentEventFilter || 'all') {
    const container = document.getElementById('adminEventsCardsContainer');
    if (!container) return;

    let events = window.bkStore.getEvents('all', true); // include drafts

    if (filterCat !== 'all') {
      if (filterCat === 'drafts') {
        events = events.filter(e => e.status === 'draft');
      } else if (filterCat === 'navathi') {
        events = events.filter(e => Boolean(e.isNavathi));
      } else {
        events = events.filter(e => (e.category || '').toLowerCase() === filterCat.toLowerCase());
      }
    }

    container.innerHTML = '';

    if (events.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem;background:#fff;border-radius:var(--radius-md);border:1px dashed #ccc;color:var(--text-muted);">
          <i data-lucide="calendar" style="width:36px;height:36px;margin-bottom:0.5rem;color:var(--sunset-primary);"></i>
          <p style="margin:0;font-size:0.95rem;">No events found in this category.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'admin-events-list';

    events.forEach(ev => {
      const isDraft = ev.status === 'draft';
      const isFeat = Boolean(ev.isFeatured);
      const isNavathi = Boolean(ev.isNavathi);
      const photoCount = Array.isArray(ev.photos) ? ev.photos.length : (Array.isArray(ev.additionalImages) ? ev.additionalImages.length : 0);
      const hasVideo = Boolean(ev.youtubeUrl || ev.videoUrl);

      const card = document.createElement('div');
      card.className = `admin-event-row-card ${isDraft ? 'is-draft' : ''} ${isNavathi ? 'is-navathi-admin-card' : ''}`;

      card.innerHTML = `
        <div class="admin-ev-thumb-box" style="position:relative;">
          <img src="${ev.coverImage || ev.image || 'assets/images/light_palace_center.jpg'}" alt="${ev.title}">
          ${isNavathi ? `<span style="position:absolute;top:6px;left:6px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-size:0.68rem;font-weight:700;padding:2px 6px;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.25);">✨ 90th Navathi</span>` : ''}
        </div>

        <div class="admin-ev-details-box">
          <div class="admin-ev-badge-row" style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.4rem;">
            <span class="admin-cat-pill">${this.formatEventCatLabel(ev.category)}</span>
            ${isNavathi ? `<span style="background:#fef3c7;color:#92400e;border:1px solid #fcd34d;font-size:0.75rem;font-weight:700;padding:2px 8px;border-radius:4px;">✨ Navathi Tagged</span>` : ''}
            <span style="background:#e0f2fe;color:#0369a1;font-size:0.75rem;font-weight:700;padding:2px 7px;border-radius:4px;">${ev.year || (ev.date ? ev.date.substring(0,4) : '2026')}</span>
            ${isFeat ? `<span class="admin-feat-pill">⭐ Featured</span>` : ''}
            <span class="admin-status-pill ${isDraft ? 'draft' : 'published'}">
              ${isDraft ? '● Draft (Hidden)' : '● Published'}
            </span>
            <span class="admin-order-badge">Order: ${ev.order || 1}</span>
            ${hasVideo ? `<span style="display:inline-flex;align-items:center;gap:3px;background:#fee2e2;color:#b91c1c;font-size:0.72rem;font-weight:600;padding:2px 6px;border-radius:4px;"><i data-lucide="video" style="width:12px;height:12px;"></i> Video</span>` : ''}
            ${photoCount > 0 ? `<span style="display:inline-flex;align-items:center;gap:3px;background:#f3e8ff;color:#6b21a8;font-size:0.72rem;font-weight:600;padding:2px 6px;border-radius:4px;"><i data-lucide="camera" style="width:12px;height:12px;"></i> ${photoCount} Photos</span>` : ''}
          </div>

          <h4 class="admin-ev-title" style="margin:0 0 0.25rem 0;">${ev.title}</h4>
          ${ev.titleMl ? `<div style="font-family:var(--font-malayalam);font-size:0.84rem;color:var(--sunset-crimson);margin-bottom:0.35rem;">${ev.titleMl}</div>` : ''}
          
          <div class="admin-ev-meta-line" style="display:flex;gap:0.75rem;flex-wrap:wrap;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;">
            <span><i data-lucide="calendar" style="width:13px;height:13px;"></i> ${ev.date}</span>
            <span><i data-lucide="map-pin" style="width:13px;height:13px;color:#d97706;"></i> <strong>${ev.centre || ev.location}</strong></span>
            ${ev.time ? `<span><i data-lucide="clock" style="width:13px;height:13px;"></i> ${ev.time}</span>` : ''}
          </div>

          <p class="admin-ev-desc-preview" style="font-size:0.85rem;color:#4b5563;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${ev.description || ev.shortDesc || ''}</p>
        </div>

        <div class="admin-ev-actions-box">
          <button class="btn-action-sm btn-action-edit" onclick="bkAdmin.openEditEventModal('${ev.id}')" title="Edit Event">
            <i data-lucide="edit-2" style="width:13px;height:13px;"></i>
            <span>Edit</span>
          </button>
          <button class="btn-action-sm" style="background:#f3f4f6;color:#374151;border:1px solid #d1d5db;" onclick="bkAdmin.duplicateEvent('${ev.id}')" title="Duplicate Event">
            <i data-lucide="copy" style="width:13px;height:13px;"></i>
            <span>Copy</span>
          </button>
          <button class="btn-action-sm" style="background:${isDraft ? '#dcfce7' : '#fef3c7'};color:${isDraft ? '#166534' : '#92400e'};border:none;" onclick="bkAdmin.togglePublishEvent('${ev.id}')" title="${isDraft ? 'Publish' : 'Unpublish'}">
            <i data-lucide="${isDraft ? 'eye' : 'eye-off'}" style="width:13px;height:13px;"></i>
            <span>${isDraft ? 'Publish' : 'Unpublish'}</span>
          </button>
          <button class="btn-action-sm btn-action-del" onclick="bkAdmin.deleteEvent('${ev.id}')" title="Delete Event">
            <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
            <span>Delete</span>
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);
    if (window.lucide) window.lucide.createIcons();
  }

  formatEventCatLabel(cat) {
    const map = {
      latest: 'Latest Event',
      navathi: 'Navathi Special',
      Festivals: 'Festivals',
      'Rajayoga Shivir': 'Rajayoga Shivir',
      'Youth Program': 'Youth Program',
      'Social Service': 'Social Service',
      Celebrations: 'Celebrations',
      shivarathri: 'Shivarathri',
      rakshabandhan: 'Raksha Bandhan',
      other: 'Other'
    };
    return map[cat] || cat || 'Event';
  }

  populateEventCentresDropdown(selectedCentre = '') {
    const sel = document.getElementById('eventFormCentre');
    if (!sel) return;

    const centers = window.bkStore.getCenters ? window.bkStore.getCenters() : [];
    sel.innerHTML = '';

    if (centers.length === 0) {
      const fallbackCentres = ["Kozhikode Main", "Ashokapuram", "Feroke", "Vadakara", "West Hill", "Balussery", "Koyilandy", "Chevayoor"];
      fallbackCentres.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (selectedCentre && (selectedCentre.toLowerCase() === c.toLowerCase())) opt.selected = true;
        sel.appendChild(opt);
      });
      return;
    }

    centers.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = c.name + (c.area ? ` (${c.area})` : '');
      if (selectedCentre) {
        if (selectedCentre.toLowerCase() === c.name.toLowerCase() ||
            selectedCentre.toLowerCase().includes(c.name.toLowerCase()) ||
            c.name.toLowerCase().includes(selectedCentre.toLowerCase())) {
          opt.selected = true;
        }
      }
      sel.appendChild(opt);
    });
  }

  onEventDateChange(dateVal) {
    if (!dateVal) return;
    const yearInput = document.getElementById('eventFormYear');
    if (yearInput) {
      const y = dateVal.substring(0, 4);
      if (y && !isNaN(parseInt(y, 10))) {
        yearInput.value = y;
      }
    }
  }

  openAddEventModal() {
    const form = document.getElementById('addEventFormContainer');
    if (!form) return;

    this.populateEventCentresDropdown();

    document.getElementById('eventFormId').value = '';
    document.getElementById('eventFormTitleInput').value = '';
    document.getElementById('eventFormTitleMl').value = '';
    const isNavathiCheck = document.getElementById('eventFormIsNavathi');
    if (isNavathiCheck) isNavathiCheck.checked = false;

    document.getElementById('eventFormCategory').value = 'Festivals';
    document.getElementById('eventFormOrder').value = '1';

    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('eventFormDate').value = todayStr;
    const yearInput = document.getElementById('eventFormYear');
    if (yearInput) yearInput.value = todayStr.substring(0, 4) || '2026';

    document.getElementById('eventFormTime').value = '10:00 AM - 1:00 PM';
    const venueInput = document.getElementById('eventFormVenue');
    if (venueInput) venueInput.value = '';

    document.getElementById('eventFormShortDesc').value = '';
    document.getElementById('eventFormFullDesc').value = '';
    document.getElementById('eventFormImageUrl').value = 'assets/images/light_palace_center.jpg';
    document.getElementById('eventFormAdditionalImages').value = '';
    document.getElementById('eventFormVideoUrl').value = '';
    document.getElementById('eventFormRegUrl').value = '';
    document.getElementById('eventFormExternalUrl').value = '';
    document.getElementById('eventFormIsFeatured').checked = false;
    document.getElementById('eventFormIsPublished').checked = true;

    this.previewEventMainImage('assets/images/light_palace_center.jpg');
    this.previewEventVideo('');
    this.renderAdminScheduleRows([]);

    document.getElementById('eventFormTitle').textContent = 'Create New Event / Gathering';
    document.getElementById('btnSaveEventText').textContent = 'Save & Publish Event';

    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
    if (window.lucide) window.lucide.createIcons();
  }

  openEditEventModal(eventId) {
    const form = document.getElementById('addEventFormContainer');
    const ev = window.bkStore.getEvent(eventId);
    if (!form || !ev) return;

    this.populateEventCentresDropdown(ev.centre || ev.location || '');

    document.getElementById('eventFormId').value = ev.id;
    document.getElementById('eventFormTitleInput').value = ev.title || '';
    document.getElementById('eventFormTitleMl').value = ev.titleMl || '';

    const isNavathiCheck = document.getElementById('eventFormIsNavathi');
    if (isNavathiCheck) isNavathiCheck.checked = Boolean(ev.isNavathi);

    const centreSel = document.getElementById('eventFormCentre');
    if (centreSel && (ev.centre || ev.location)) {
      const match = ev.centre || ev.location;
      for (let i = 0; i < centreSel.options.length; i++) {
        if (centreSel.options[i].value.toLowerCase() === match.toLowerCase() ||
            match.toLowerCase().includes(centreSel.options[i].value.toLowerCase())) {
          centreSel.selectedIndex = i;
          break;
        }
      }
    }

    const venueInput = document.getElementById('eventFormVenue');
    if (venueInput) venueInput.value = ev.venue || '';

    document.getElementById('eventFormCategory').value = ev.category || 'Festivals';
    document.getElementById('eventFormOrder').value = ev.order || 1;
    document.getElementById('eventFormDate').value = ev.date || '';

    const yearInput = document.getElementById('eventFormYear');
    if (yearInput) yearInput.value = ev.year || (ev.date ? ev.date.substring(0, 4) : '2026');

    document.getElementById('eventFormTime').value = ev.time || '';
    document.getElementById('eventFormShortDesc').value = ev.description || ev.shortDesc || '';
    document.getElementById('eventFormFullDesc').value = ev.fullDesc || '';

    const img = ev.coverImage || ev.image || '';
    document.getElementById('eventFormImageUrl').value = img;

    const photosList = Array.isArray(ev.photos) && ev.photos.length > 0 ? ev.photos : (Array.isArray(ev.additionalImages) ? ev.additionalImages : []);
    document.getElementById('eventFormAdditionalImages').value = photosList.join(', ');

    const vid = ev.youtubeUrl || ev.videoUrl || '';
    document.getElementById('eventFormVideoUrl').value = vid;

    document.getElementById('eventFormRegUrl').value = ev.registrationUrl || '';
    document.getElementById('eventFormExternalUrl').value = ev.externalUrl || '';
    document.getElementById('eventFormIsFeatured').checked = Boolean(ev.isFeatured);
    document.getElementById('eventFormIsPublished').checked = ev.status !== 'draft';

    this.previewEventMainImage(img);
    this.previewEventVideo(vid);
    this.renderAdminScheduleRows(ev.schedule || []);

    document.getElementById('eventFormTitle').textContent = `Edit Event: ${ev.title}`;
    document.getElementById('btnSaveEventText').textContent = 'Update Event';

    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
    if (window.lucide) window.lucide.createIcons();
  }

  hideAddEventForm() {
    const form = document.getElementById('addEventFormContainer');
    if (form) form.style.display = 'none';
  }

  handleEventImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      document.getElementById('eventFormImageUrl').value = base64;
      this.previewEventMainImage(base64);
    };
    reader.readAsDataURL(file);
  }

  previewEventMainImage(url) {
    const wrap = document.getElementById('eventMainImagePreviewWrap');
    const removeBtn = document.getElementById('btnRemoveEventMainImg');
    if (!wrap) return;

    if (url && url.trim()) {
      wrap.innerHTML = `<img src="${url.trim()}" alt="Preview" style="width:100%;height:100%;object-fit:cover;">`;
      if (removeBtn) removeBtn.style.display = 'inline-block';
    } else {
      wrap.innerHTML = `<span style="font-size:0.75rem;color:#888;">No Image</span>`;
      if (removeBtn) removeBtn.style.display = 'none';
    }
  }

  removeEventMainImage() {
    const urlInput = document.getElementById('eventFormImageUrl');
    const fileInput = document.getElementById('eventFormImageFileInput');
    if (urlInput) urlInput.value = '';
    if (fileInput) fileInput.value = '';
    this.previewEventMainImage('');
  }

  previewEventVideo(url) {
    const container = document.getElementById('eventVideoPreviewContainer');
    if (!container) return;

    if (!url || !url.trim()) {
      container.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    const embedUrl = window.bkUtils.getYouTubeEmbedUrl(url.trim());
    if (embedUrl) {
      container.style.display = 'block';
      container.innerHTML = `
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:var(--radius-sm);border:1px solid #ddd;">
          <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen></iframe>
        </div>
      `;
    } else {
      container.style.display = 'block';
      container.innerHTML = `<div style="font-size:0.8rem;color:#dc2626;padding:0.4rem;">Invalid YouTube URL. Please use a valid youtube.com or youtu.be link.</div>`;
    }
  }

  renderAdminScheduleRows(schedule = []) {
    const container = document.getElementById('adminScheduleRowsContainer');
    if (!container) return;

    container.innerHTML = '';
    if (schedule.length === 0) {
      schedule = [{ time: '', session: '' }];
    }

    schedule.forEach((s) => {
      this.addScheduleRow(s.time, s.session);
    });
  }

  addScheduleRow(time = '', session = '') {
    const container = document.getElementById('adminScheduleRowsContainer');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'admin-sched-row';
    row.style = 'display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;';

    row.innerHTML = `
      <input type="text" class="form-control admin-sched-time" style="width:140px;" placeholder="e.g. 10:00 AM" value="${time || ''}">
      <input type="text" class="form-control admin-sched-session" style="flex:1;" placeholder="Session / Discourse Topic" value="${session || ''}">
      <button type="button" class="btn-sm" style="background:#fee2e2;color:#ef4444;border:none;padding:0.35rem 0.55rem;border-radius:4px;cursor:pointer;" onclick="this.closest('.admin-sched-row').remove()">✕</button>
    `;
    container.appendChild(row);
  }

  getScheduleFromForm() {
    const rows = document.querySelectorAll('#adminScheduleRowsContainer .admin-sched-row');
    const schedule = [];
    rows.forEach(r => {
      const time = r.querySelector('.admin-sched-time')?.value.trim();
      const session = r.querySelector('.admin-sched-session')?.value.trim();
      if (time || session) {
        schedule.push({ time: time || '', session: session || '' });
      }
    });
    return schedule;
  }

  handleSaveEvent(e) {
    e.preventDefault();
    const id = document.getElementById('eventFormId').value;
    const title = document.getElementById('eventFormTitleInput').value.trim();
    const titleMl = document.getElementById('eventFormTitleMl').value.trim();
    const isNavathi = document.getElementById('eventFormIsNavathi')?.checked || false;
    const centre = document.getElementById('eventFormCentre')?.value.trim() || 'Kozhikode Main';
    const venue = document.getElementById('eventFormVenue')?.value.trim() || '';
    const category = document.getElementById('eventFormCategory').value;
    const order = parseInt(document.getElementById('eventFormOrder').value, 10) || 1;
    const date = document.getElementById('eventFormDate').value.trim();
    
    let year = document.getElementById('eventFormYear')?.value.trim();
    if (!year && date) year = date.substring(0, 4);
    if (!year) year = '2026';

    const time = document.getElementById('eventFormTime').value.trim();
    const shortDesc = document.getElementById('eventFormShortDesc').value.trim();
    const fullDesc = document.getElementById('eventFormFullDesc').value.trim();
    const coverImage = document.getElementById('eventFormImageUrl').value.trim() || 'assets/images/light_palace_center.jpg';
    
    const rawPhotos = document.getElementById('eventFormAdditionalImages').value.trim();
    const photos = rawPhotos ? rawPhotos.split(/[\n,]+/).map(s => s.trim()).filter(Boolean) : [];

    const youtubeUrl = document.getElementById('eventFormVideoUrl').value.trim();
    const registrationUrl = document.getElementById('eventFormRegUrl').value.trim();
    const externalUrl = document.getElementById('eventFormExternalUrl').value.trim();
    const isFeatured = document.getElementById('eventFormIsFeatured').checked;
    const isPublished = document.getElementById('eventFormIsPublished').checked;
    const status = isPublished ? 'published' : 'draft';

    const schedule = this.getScheduleFromForm();

    const eventData = {
      id: id || undefined,
      title,
      titleMl,
      category,
      order,
      date,
      year,
      centre,
      venue,
      location: venue ? `${centre} (${venue})` : centre,
      isNavathi,
      description: shortDesc,
      shortDesc,
      fullDesc: fullDesc || shortDesc,
      coverImage,
      image: coverImage,
      photos,
      additionalImages: photos,
      youtubeUrl,
      videoUrl: youtubeUrl,
      time,
      registrationUrl,
      externalUrl,
      isFeatured,
      status,
      schedule
    };

    const saved = window.bkStore.saveEvent(eventData);

    this.hideAddEventForm();
    this.renderAdminEvents();
    this.refreshDashboard();

    // Re-render live website events and navathi sections
    if (window.bkApp) {
      if (typeof window.bkApp.renderEventsPage === 'function') window.bkApp.renderEventsPage();
      if (typeof window.bkApp.renderNavathiPage === 'function') window.bkApp.renderNavathiPage();
      if (typeof window.bkApp.renderEventsSection === 'function') window.bkApp.renderEventsSection(category);
    }

    if (window.bkApp && typeof window.bkApp.toast === 'function') {
      window.bkApp.toast(`🕊️ Event "${saved.title}" saved successfully!`);
    }
  }

  duplicateEvent(eventId) {
    const cloned = window.bkStore.duplicateEvent(eventId);
    if (cloned) {
      this.renderAdminEvents();
      this.refreshDashboard();
      if (window.bkApp) {
        if (typeof window.bkApp.renderEventsPage === 'function') window.bkApp.renderEventsPage();
        if (typeof window.bkApp.renderNavathiPage === 'function') window.bkApp.renderNavathiPage();
        if (typeof window.bkApp.renderEventsSection === 'function') window.bkApp.renderEventsSection();
      }
      if (window.bkApp && typeof window.bkApp.toast === 'function') {
        window.bkApp.toast(`📋 Duplicated as Draft: "${cloned.title}"`);
      }
    }
  }

  togglePublishEvent(eventId) {
    const updated = window.bkStore.togglePublishEvent(eventId);
    if (updated) {
      this.renderAdminEvents();
      this.refreshDashboard();
      if (window.bkApp) {
        if (typeof window.bkApp.renderEventsPage === 'function') window.bkApp.renderEventsPage();
        if (typeof window.bkApp.renderNavathiPage === 'function') window.bkApp.renderNavathiPage();
        if (typeof window.bkApp.renderEventsSection === 'function') window.bkApp.renderEventsSection();
      }
      if (window.bkApp && typeof window.bkApp.toast === 'function') {
        window.bkApp.toast(`🕊️ Event is now ${updated.status === 'published' ? 'Published publicly' : 'saved as Draft (Hidden)'}.`);
      }
    }
  }

  deleteEvent(eventId) {
    if (confirm("Are you sure you want to permanently delete this event?")) {
      window.bkStore.deleteEvent(eventId);
      this.renderAdminEvents();
      this.refreshDashboard();
      if (window.bkApp) {
        if (typeof window.bkApp.renderEventsPage === 'function') window.bkApp.renderEventsPage();
        if (typeof window.bkApp.renderNavathiPage === 'function') window.bkApp.renderNavathiPage();
        if (typeof window.bkApp.renderEventsSection === 'function') window.bkApp.renderEventsSection();
      }
      if (window.bkApp && typeof window.bkApp.toast === 'function') {
        window.bkApp.toast("🕊️ Event deleted.");
      }
    }
  }

  // --- Registrations CRM ---
  renderAdminRegistrations() {
    const tbody = document.getElementById('adminRegsTableBody');
    if (!tbody) return;

    const regs = window.bkStore.getRegistrations();
    tbody.innerHTML = '';

    if (regs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;">No student registrations received yet.</td></tr>`;
      return;
    }

    regs.forEach(r => {
      const tr = document.createElement('tr');
      const statusClass = (r.status || 'New').toLowerCase();
      tr.innerHTML = `
        <td>${r.date}</td>
        <td><strong>${r.name}</strong>${r.email ? `<div style="font-size:0.75rem;color:var(--text-muted);">${r.email}</div>` : ''}</td>
        <td><a href="tel:${r.phone}" style="color:var(--sunset-primary);font-weight:700;">${r.phone}</a></td>
        <td>${r.preferredCenter || 'Ashokapuram'}</td>
        <td>${r.courseType}<br><small style="color:var(--text-muted);">${r.timePreference || ''}</small></td>
        <td>
          <select onchange="bkAdmin.changeRegStatus('${r.id}', this.value)" style="padding:0.25rem 0.5rem;border-radius:4px;font-size:0.8rem;border:1px solid #ccc;background:#fff;">
            <option value="New" ${r.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Contacted" ${r.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Enrolled" ${r.status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
            <option value="Completed" ${r.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
        <td>
          <button class="btn-action-sm btn-action-del" onclick="bkAdmin.deleteRegistration('${r.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  changeRegStatus(id, newStatus) {
    window.bkStore.updateRegistrationStatus(id, newStatus);
    window.bkApp.toast(`Registration status updated to "${newStatus}".`);
    this.refreshDashboard();
  }

  deleteRegistration(id) {
    if (confirm("Delete this registration entry?")) {
      window.bkStore.deleteRegistration(id);
      this.renderAdminRegistrations();
      this.refreshDashboard();
      window.bkApp.toast("Registration entry deleted.");
    }
  }

  exportRegistrationsCSV() {
    const regs = window.bkStore.getRegistrations();
    let csv = "ID,Name,Phone,Email,Center,Course,Time,Date,Status,Notes\n";
    regs.forEach(r => {
      csv += `"${r.id}","${r.name}","${r.phone}","${r.email || ''}","${r.preferredCenter || ''}","${r.courseType}","${r.timePreference || ''}","${r.date}","${r.status}","${(r.notes || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bk_kozhikode_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.bkApp.toast("Registrations spreadsheet exported to CSV!");
  }

  // --- About Us Content Manager ---
  renderAboutManager() {
    const aboutData = window.bkStore.getAboutData();
    if (!aboutData) return;

    const bk = aboutData.aboutBk || {};
    const kzk = aboutData.aboutKozhikode || {};

    const bkHeading = document.getElementById('aboutBkHeading');
    const bkHeadingMl = document.getElementById('aboutBkHeadingMl');
    const bkText = document.getElementById('aboutBkText');
    const bkImage = document.getElementById('aboutBkImage');
    const bkPub = document.getElementById('aboutBkPublished');

    if (bkHeading) bkHeading.value = bk.heading || '';
    if (bkHeadingMl) bkHeadingMl.value = bk.headingMl || '';
    if (bkText) bkText.value = bk.text || '';
    if (bkImage) bkImage.value = bk.image || '';
    if (bkPub) bkPub.checked = bk.published !== false;

    const kzkHeading = document.getElementById('aboutKozhikodeHeading');
    const kzkHeadingMl = document.getElementById('aboutKozhikodeHeadingMl');
    const kzkText = document.getElementById('aboutKozhikodeText');
    const kzkImage = document.getElementById('aboutKozhikodeImage');
    const kzkPub = document.getElementById('aboutKozhikodePublished');

    if (kzkHeading) kzkHeading.value = kzk.heading || '';
    if (kzkHeadingMl) kzkHeadingMl.value = kzk.headingMl || '';
    if (kzkText) kzkText.value = kzk.text || '';
    if (kzkImage) kzkImage.value = kzk.image || '';
    if (kzkPub) kzkPub.checked = kzk.published !== false;
  }

  handleSaveAbout(e) {
    e.preventDefault();
    const aboutBk = {
      heading: document.getElementById('aboutBkHeading').value.trim(),
      headingMl: document.getElementById('aboutBkHeadingMl').value.trim(),
      text: document.getElementById('aboutBkText').value.trim(),
      image: document.getElementById('aboutBkImage').value.trim(),
      published: document.getElementById('aboutBkPublished').checked
    };

    const aboutKozhikode = {
      heading: document.getElementById('aboutKozhikodeHeading').value.trim(),
      headingMl: document.getElementById('aboutKozhikodeHeadingMl').value.trim(),
      text: document.getElementById('aboutKozhikodeText').value.trim(),
      image: document.getElementById('aboutKozhikodeImage').value.trim(),
      published: document.getElementById('aboutKozhikodePublished').checked
    };

    window.bkStore.updateAboutData({ aboutBk, aboutKozhikode });
    if (window.bkApp && typeof window.bkApp.renderAboutPage === 'function') {
      window.bkApp.renderAboutPage();
    }
    window.bkApp.toast("🕊️ About Us content saved & updated on live website!");
  }

  // --- Daily Murali & Sacred Wisdom Manager ---
  renderDailyMuraliManager() {
    const m = window.bkStore.getDailyMurali();
    if (!m) return;

    const dDate = document.getElementById('muraliFormDate');
    const dTitle = document.getElementById('muraliFormTitle');
    const dTitleMl = document.getElementById('muraliFormTitleMl');
    const dEss = document.getElementById('muraliFormEssence');
    const dEssMl = document.getElementById('muraliFormEssenceMl');
    const dBless = document.getElementById('muraliFormBlessing');
    const dBlessMl = document.getElementById('muraliFormBlessingMl');
    const dSlog = document.getElementById('muraliFormSlogan');
    const dSlogMl = document.getElementById('muraliFormSloganMl');
    const dFull = document.getElementById('muraliFormFullText');
    const dAudio = document.getElementById('muraliFormAudioUrl');
    const dVideo = document.getElementById('muraliFormVideoUrl');
    const dPub = document.getElementById('muraliFormPublished');

    if (dDate) dDate.value = m.date || new Date().toISOString().split('T')[0];
    if (dTitle) dTitle.value = m.title || '';
    if (dTitleMl) dTitleMl.value = m.titleMl || '';
    if (dEss) dEss.value = m.essence || '';
    if (dEssMl) dEssMl.value = m.essenceMl || '';
    if (dBless) dBless.value = m.blessing || '';
    if (dBlessMl) dBlessMl.value = m.blessingMl || '';
    if (dSlog) dSlog.value = m.slogan || '';
    if (dSlogMl) dSlogMl.value = m.sloganMl || '';
    if (dFull) dFull.value = m.fullMuraliText || '';
    if (dAudio) dAudio.value = m.audioUrl || '';
    if (dVideo) dVideo.value = m.videoUrl || '';
    if (dPub) dPub.checked = m.published !== false;
  }

  handleSaveDailyMurali(e) {
    e.preventDefault();
    const data = {
      date: document.getElementById('muraliFormDate').value.trim(),
      title: document.getElementById('muraliFormTitle').value.trim(),
      titleMl: document.getElementById('muraliFormTitleMl').value.trim(),
      essence: document.getElementById('muraliFormEssence').value.trim(),
      essenceMl: document.getElementById('muraliFormEssenceMl').value.trim(),
      blessing: document.getElementById('muraliFormBlessing').value.trim(),
      blessingMl: document.getElementById('muraliFormBlessingMl').value.trim(),
      slogan: document.getElementById('muraliFormSlogan').value.trim(),
      sloganMl: document.getElementById('muraliFormSloganMl').value.trim(),
      fullMuraliText: document.getElementById('muraliFormFullText').value.trim(),
      audioUrl: document.getElementById('muraliFormAudioUrl').value.trim(),
      videoUrl: document.getElementById('muraliFormVideoUrl').value.trim(),
      published: document.getElementById('muraliFormPublished').checked
    };

    window.bkStore.updateDailyMurali(data);
    if (window.bkApp && typeof window.bkApp.renderDailyMuraliPage === 'function') {
      window.bkApp.renderDailyMuraliPage();
    }
    window.bkApp.toast("🕊️ Daily Murali updated on live website!");
  }

  // --- Kozhikode Center List CRUD Manager ---
  renderCentersManager() {
    const container = document.getElementById('adminCentersCardsContainer');
    if (!container) return;

    const centers = window.bkStore.getCenters(true);
    container.innerHTML = '';

    if (centers.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted);">No centers configured. Click "+ Add New Center" above.</div>';
      return;
    }

    centers.forEach(c => {
      const card = document.createElement('div');
      card.className = 'admin-center-edit-card';
      card.style.cssText = `
        background: #fff;
        border: 1px solid ${c.isPrimary ? 'var(--sunset-amber)' : 'var(--divine-card-border)'};
        border-radius: var(--radius-md);
        padding: 1.25rem;
        margin-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      `;

      card.innerHTML = `
        <div style="flex:1;min-width:260px;">
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem;">
            ${c.isPrimary ? '<span style="background:var(--sunset-primary);color:#fff;font-size:0.7rem;font-weight:700;padding:0.15rem 0.5rem;border-radius:4px;">★ Main Sub-Zone</span>' : ''}
            <span style="background:#f3f4f6;color:#555;font-size:0.75rem;padding:0.15rem 0.45rem;border-radius:4px;">${c.area || 'Kozhikode'}</span>
            <span style="font-size:0.75rem;color:${c.published !== false ? '#10b981' : '#ef4444'};font-weight:600;">
              ${c.published !== false ? '● Live Published' : '○ Draft / Hidden'}
            </span>
          </div>
          <h4 style="margin:0 0 0.25rem 0;font-size:1.1rem;color:var(--sunset-dark-base);">${c.name}</h4>
          ${c.nameMl ? `<div style="font-size:0.85rem;color:var(--sunset-crimson);margin-bottom:0.35rem;">${c.nameMl}</div>` : ''}
          <div style="font-size:0.85rem;color:var(--text-muted);display:flex;flex-wrap:wrap;gap:1rem;">
            <span><i data-lucide="user" style="width:13px;height:13px;display:inline-block;vertical-align:middle;"></i> ${c.contactPerson || 'BK Center In-charge'}</span>
            <span><i data-lucide="phone" style="width:13px;height:13px;display:inline-block;vertical-align:middle;"></i> <a href="tel:${c.phone || '+91 9746334202'}" style="color:var(--sunset-dark-base);font-weight:600;">${c.phone || 'No phone'}</a></span>
            ${c.whatsapp ? `<span><i data-lucide="message-circle" style="width:13px;height:13px;display:inline-block;vertical-align:middle;color:#10b981;"></i> WA: ${c.whatsapp}</span>` : ''}
          </div>
        </div>

        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button class="btn-action-sm ${c.published !== false ? 'btn-action-view' : 'btn-action-edit'}" onclick="bkAdmin.togglePublishCenter('${c.id}')" title="Toggle Public Visibility">
            ${c.published !== false ? 'Hide' : 'Publish'}
          </button>
          <button class="btn-action-sm btn-action-edit" onclick="bkAdmin.editCenter('${c.id}')">
            <i data-lucide="edit-3" style="width:13px;height:13px;"></i> Edit
          </button>
          <button class="btn-action-sm btn-action-del" onclick="bkAdmin.deleteCenter('${c.id}')" ${c.isPrimary ? 'disabled title="Cannot delete primary center"' : ''}>
            <i data-lucide="trash-2" style="width:13px;height:13px;"></i> Delete
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  openAddCenterModal() {
    const container = document.getElementById('addCenterFormContainer');
    const title = document.getElementById('centerFormTitle');
    if (!container) return;

    // Reset fields
    document.getElementById('centerFormId').value = '';
    document.getElementById('centerFormName').value = '';
    document.getElementById('centerFormNameMl').value = '';
    document.getElementById('centerFormArea').value = '';
    document.getElementById('centerFormContactPerson').value = '';
    document.getElementById('centerFormPhone').value = '';
    document.getElementById('centerFormWhatsapp').value = '';
    document.getElementById('centerFormLandline').value = '';
    document.getElementById('centerFormAddress').value = '';
    document.getElementById('centerFormMapsUrl').value = '';
    document.getElementById('centerFormTimings').value = '';
    document.getElementById('centerFormDescription').value = '';
    document.getElementById('centerFormImage').value = '';
    document.getElementById('centerFormIsPrimary').checked = false;
    document.getElementById('centerFormPublished').checked = true;

    if (title) title.textContent = 'Create New Center';
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
  }

  hideAddCenterForm() {
    const container = document.getElementById('addCenterFormContainer');
    if (container) container.style.display = 'none';
  }

  editCenter(id) {
    const c = window.bkStore.getCenter(id);
    if (!c) return;

    const container = document.getElementById('addCenterFormContainer');
    const title = document.getElementById('centerFormTitle');
    if (!container) return;

    document.getElementById('centerFormId').value = c.id;
    document.getElementById('centerFormName').value = c.name || '';
    document.getElementById('centerFormNameMl').value = c.nameMl || '';
    document.getElementById('centerFormArea').value = c.area || '';
    document.getElementById('centerFormContactPerson').value = c.contactPerson || '';
    document.getElementById('centerFormPhone').value = c.phone || '';
    document.getElementById('centerFormWhatsapp').value = c.whatsapp || '';
    document.getElementById('centerFormLandline').value = c.landline || '';
    document.getElementById('centerFormAddress').value = c.address || '';
    document.getElementById('centerFormMapsUrl').value = c.mapsUrl || '';
    document.getElementById('centerFormTimings').value = c.timings || '';
    document.getElementById('centerFormDescription').value = c.description || '';
    document.getElementById('centerFormImage').value = c.image || '';
    document.getElementById('centerFormIsPrimary').checked = Boolean(c.isPrimary);
    document.getElementById('centerFormPublished').checked = c.published !== false;

    if (title) title.textContent = `Edit Center: ${c.name}`;
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
  }

  handleSaveCenter(e) {
    e.preventDefault();
    const id = document.getElementById('centerFormId').value.trim() || ('center_' + Date.now());
    const name = document.getElementById('centerFormName').value.trim();
    const nameMl = document.getElementById('centerFormNameMl').value.trim();
    const area = document.getElementById('centerFormArea').value.trim();
    const contactPerson = document.getElementById('centerFormContactPerson').value.trim();
    const phone = document.getElementById('centerFormPhone').value.trim();
    const whatsapp = document.getElementById('centerFormWhatsapp').value.trim();
    const landline = document.getElementById('centerFormLandline').value.trim();
    const address = document.getElementById('centerFormAddress').value.trim();
    const mapsUrl = document.getElementById('centerFormMapsUrl').value.trim();
    const timings = document.getElementById('centerFormTimings').value.trim();
    const description = document.getElementById('centerFormDescription').value.trim();
    const image = document.getElementById('centerFormImage').value.trim();
    const isPrimary = document.getElementById('centerFormIsPrimary').checked;
    const published = document.getElementById('centerFormPublished').checked;

    window.bkStore.saveCenter({
      id,
      name,
      nameMl,
      area,
      contactPerson,
      phone,
      whatsapp,
      landline,
      address,
      mapsUrl,
      timings,
      description,
      image,
      isPrimary,
      published
    });

    this.hideAddCenterForm();
    this.renderCentersManager();
    this.populateEventCentresDropdown();

    if (window.bkApp) {
      if (typeof window.bkApp.populateEventsCenterDropdown === 'function') window.bkApp.populateEventsCenterDropdown();
      if (typeof window.bkApp.populateNavathiCenterDropdown === 'function') window.bkApp.populateNavathiCenterDropdown();
      if (typeof window.bkApp.renderEventsPage === 'function') window.bkApp.renderEventsPage();
      if (typeof window.bkApp.renderNavathiPage === 'function') window.bkApp.renderNavathiPage();
      if (typeof window.bkApp.renderCenters === 'function') window.bkApp.renderCenters('all');
      if (typeof window.bkApp.toast === 'function') window.bkApp.toast(`🕊️ Center "${name}" saved successfully!`);
    }
  }

  deleteCenter(id) {
    const c = window.bkStore.getCenter(id);
    if (!c) return;
    if (c.isPrimary) {
      alert("The primary main center cannot be deleted.");
      return;
    }
    if (confirm(`Are you sure you want to delete "${c.name}"?`)) {
      window.bkStore.deleteCenter(id);
      this.renderCentersManager();
      this.populateEventCentresDropdown();

      if (window.bkApp) {
        if (typeof window.bkApp.populateEventsCenterDropdown === 'function') window.bkApp.populateEventsCenterDropdown();
        if (typeof window.bkApp.populateNavathiCenterDropdown === 'function') window.bkApp.populateNavathiCenterDropdown();
        if (typeof window.bkApp.renderEventsPage === 'function') window.bkApp.renderEventsPage();
        if (typeof window.bkApp.renderNavathiPage === 'function') window.bkApp.renderNavathiPage();
        if (typeof window.bkApp.renderCenters === 'function') window.bkApp.renderCenters('all');
        if (typeof window.bkApp.toast === 'function') window.bkApp.toast(`Center "${c.name}" removed.`);
      }
    }
  }

  togglePublishCenter(id) {
    const updated = window.bkStore.togglePublishCenter(id);
    if (updated) {
      this.renderCentersManager();
      this.populateEventCentresDropdown();

      if (window.bkApp) {
        if (typeof window.bkApp.populateEventsCenterDropdown === 'function') window.bkApp.populateEventsCenterDropdown();
        if (typeof window.bkApp.populateNavathiCenterDropdown === 'function') window.bkApp.populateNavathiCenterDropdown();
        if (typeof window.bkApp.renderEventsPage === 'function') window.bkApp.renderEventsPage();
        if (typeof window.bkApp.renderNavathiPage === 'function') window.bkApp.renderNavathiPage();
        if (typeof window.bkApp.renderCenters === 'function') window.bkApp.renderCenters('all');
        if (typeof window.bkApp.toast === 'function') window.bkApp.toast(`Visibility updated for "${updated.name}".`);
      }
    }
  }

  // --- YouTube Channels & Automatic Video Integration Manager ---
  renderYouTubeManager() {
    this.checkYouTubeApiStatus();
    const container = document.getElementById('adminYouTubeChannelsListContainer');
    if (!container) return;

    const channels = window.bkStore.getYouTubeChannels();
    container.innerHTML = '';

    channels.forEach(ch => {
      const card = document.createElement('div');
      card.className = 'admin-channel-config-card';
      card.style.cssText = `
        background: #fff;
        border: 1px solid var(--divine-card-border);
        border-radius: var(--radius-md);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      `;

      card.innerHTML = `
        <form onsubmit="bkAdmin.handleSaveYouTubeChannel(event, '${ch.id}')">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;border-bottom:1px solid #f3f4f6;padding-bottom:0.75rem;">
            <div>
              <span style="background:var(--sunset-primary);color:#fff;font-size:0.72rem;font-weight:700;padding:0.15rem 0.5rem;border-radius:4px;">${ch.contentType}</span>
              <h4 style="margin:0.25rem 0 0 0;font-size:1.15rem;color:var(--sunset-dark-base);">${ch.name}</h4>
            </div>
            <label style="display:flex;align-items:center;gap:0.4rem;cursor:pointer;font-size:0.85rem;">
              <input type="checkbox" id="adminYtActive_${ch.id}" ${ch.active !== false ? 'checked' : ''}>
              <strong>Active & Displayed on Public Website</strong>
            </label>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="adminYtContentType_${ch.id}">Content / Stream Type</label>
              <select id="adminYtContentType_${ch.id}" class="form-control">
                <option value="Podcast" ${ch.contentType === 'Podcast' ? 'selected' : ''}>Podcast Series (Weekly/Monthly Episodes)</option>
                <option value="Latest Live" ${ch.contentType === 'Latest Live' ? 'selected' : ''}>Latest Live Stream (Discourse / Satsang)</option>
                <option value="Latest Video" ${ch.contentType === 'Latest Video' ? 'selected' : ''}>Latest Video (General Discourse / Class)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="adminYtChannelId_${ch.id}">YouTube Channel ID</label>
              <input type="text" id="adminYtChannelId_${ch.id}" class="form-control" value="${ch.channelId || ''}" placeholder="e.g. UCxxxxxxxxxxxxxx">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="adminYtPlaylistId_${ch.id}">Podcast Playlist ID (Optional)</label>
              <input type="text" id="adminYtPlaylistId_${ch.id}" class="form-control" value="${ch.playlistId || ''}" placeholder="e.g. PLxxxxxxxxxxxxxx">
            </div>
            <div class="form-group">
              <label for="adminYtUrl_${ch.id}">YouTube Channel URL</label>
              <input type="url" id="adminYtUrl_${ch.id}" class="form-control" value="${ch.youtubeUrl || ''}" placeholder="https://www.youtube.com/@...">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="adminYtInsta_${ch.id}">Instagram Profile URL</label>
              <input type="url" id="adminYtInsta_${ch.id}" class="form-control" value="${ch.instagramUrl || ''}" placeholder="https://www.instagram.com/...">
            </div>
            <div class="form-group">
              <label for="adminYtFb_${ch.id}">Facebook Page URL</label>
              <input type="url" id="adminYtFb_${ch.id}" class="form-control" value="${ch.facebookUrl || ''}" placeholder="https://www.facebook.com/...">
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;margin-top:0.5rem;">
            <button type="submit" class="btn-submit-form" style="width:auto;padding:0.6rem 1.75rem;">
              <i data-lucide="save" style="width:14px;height:14px;margin-right:0.25rem;"></i> Save ${ch.name} Config
            </button>
          </div>
        </form>
      `;
      container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  async checkYouTubeApiStatus() {
    const statusText = document.getElementById('adminYtKeyStatusText');
    if (!statusText) return;

    try {
      const res = await fetch('/api/youtube/status');
      if (res.ok) {
        const data = await res.json();
        if (data.hasKey) {
          statusText.innerHTML = `<span style="color:#059669;font-weight:700;">Active & Configured via ${data.keySource}</span> • Cache age: ${data.cacheAgeSeconds}s`;
        } else {
          statusText.innerHTML = `<span style="color:#d97706;font-weight:600;">No API Key found. Set <code>YOUTUBE_API_KEY</code> env var on server for live YouTube Data API v3 automatic fetching. Using curated placeholders.</span>`;
        }
      } else {
        statusText.textContent = "Server status check returned non-200. Using local data.";
      }
    } catch (e) {
      statusText.textContent = "Static mode / server proxy offline. Using local channel data.";
    }
  }

  async clearYouTubeCache() {
    try {
      const res = await fetch('/api/youtube/clear-cache', { method: 'POST' });
      if (res.ok) {
        window.bkApp.toast("🔄 YouTube cache cleared on server. Fetching fresh videos...");
        this.checkYouTubeApiStatus();
        if (window.bkApp && typeof window.bkApp.renderLatestVideosSection === 'function') {
          window.bkApp.renderLatestVideosSection();
        }
      } else {
        window.bkApp.toast("Cache clear responded with status " + res.status);
      }
    } catch (e) {
      window.bkApp.toast("Server API not reachable.");
    }
  }

  handleSaveYouTubeChannel(e, id) {
    e.preventDefault();
    const contentType = document.getElementById(`adminYtContentType_${id}`).value;
    const channelId = document.getElementById(`adminYtChannelId_${id}`).value.trim();
    const playlistId = document.getElementById(`adminYtPlaylistId_${id}`).value.trim();
    const youtubeUrl = document.getElementById(`adminYtUrl_${id}`).value.trim();
    const instagramUrl = document.getElementById(`adminYtInsta_${id}`).value.trim();
    const facebookUrl = document.getElementById(`adminYtFb_${id}`).value.trim();
    const active = document.getElementById(`adminYtActive_${id}`).checked;

    window.bkStore.updateYouTubeChannel(id, {
      contentType,
      channelId,
      playlistId,
      youtubeUrl,
      instagramUrl,
      facebookUrl,
      active
    });

    if (window.bkApp && typeof window.bkApp.renderContactPage === 'function') {
      window.bkApp.renderContactPage();
    }
    window.bkApp.toast(`🕊️ YouTube channel configuration saved!`);
  }

  // --- Daily Murli & Thought Updater (Legacy / Banner Sync) ---
  loadDailyThoughtForm() {
    const m = window.bkStore.getDailyMurali();
    if (!m) return;
  }

  handleSaveDailyThought(e) {
    e.preventDefault();
    window.bkApp.toast("Daily Murli updated!");
  }

  // --- Site Settings & Backup ---
  loadSettingsForm() {
    const s = window.bkStore.getSettings();
    if (!s) return;

    const orgName = document.getElementById('setOrgName');
    const orgNameMl = document.getElementById('setOrgNameMl');
    const p1 = document.getElementById('setPhone1');
    const p2 = document.getElementById('setPhone2');
    const email = document.getElementById('setEmail');
    const announcement = document.getElementById('setAnnouncement');
    const pin = document.getElementById('setAdminPin');

    if (orgName) orgName.value = s.orgName || '';
    if (orgNameMl) orgNameMl.value = s.orgNameMl || '';
    if (p1) p1.value = s.phonePrimary || '';
    if (p2) p2.value = s.phoneSecondary || '';
    if (email) email.value = s.email || '';
    if (announcement) announcement.value = s.announcement || '';
    if (pin) pin.value = '';
  }

  handleSaveSettings(e) {
    e.preventDefault();
    const orgName = document.getElementById('setOrgName').value.trim();
    const orgNameMl = document.getElementById('setOrgNameMl').value.trim();
    const phonePrimary = document.getElementById('setPhone1').value.trim();
    const phoneSecondary = document.getElementById('setPhone2').value.trim();
    const email = document.getElementById('setEmail').value.trim();
    const announcement = document.getElementById('setAnnouncement').value.trim();
    const adminPin = document.getElementById('setAdminPin').value.trim();

    const settingsUpdates = { orgName, orgNameMl, phonePrimary, phoneSecondary, email, announcement };
    if (adminPin) settingsUpdates.adminPin = adminPin;

    window.bkStore.updateSettings(settingsUpdates);

    // Call server-side save with authorization token
    const token = sessionStorage.getItem('bk_admin_token');
    if (token) {
      fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ settings: settingsUpdates })
      }).catch(err => console.warn('Server save note:', err));
    }

    // Update live DOM elements
    const brandName = document.getElementById('brandOrgName');
    const brandNameMl = document.getElementById('brandOrgNameMl');
    const annText = document.getElementById('announcementText');
    if (brandName) brandName.textContent = orgName;
    if (brandNameMl) brandNameMl.textContent = orgNameMl;
    if (annText) annText.textContent = announcement;

    window.bkApp.toast("Site settings updated successfully!");
  }

  downloadBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(window.bkStore.exportJSON());
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `bk_kozhikode_site_backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    window.bkApp.toast("Complete site backup exported to JSON!");
  }

  importBackupJSON(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (window.bkStore.importJSON(event.target.result)) {
          this.refreshAllPanes();
          window.bkApp.toast("Site backup restored successfully!");
        } else {
          alert("Invalid backup JSON file format.");
        }
      };
      reader.readAsText(file);
    }
  }

  // --- 7-Day Rajyoga Course Video Manager ---
  renderAdminCourseManager() {
    const container = document.getElementById('adminCourseDaysList');
    if (!container) return;

    const modules = window.bkStore.getCourseModules();
    container.innerHTML = '';

    modules.forEach(mod => {
      const card = document.createElement('div');
      card.className = 'admin-course-day-card';

      const videoId = mod.youtubeVideoId || (window.bkUtils ? window.bkUtils.extractYouTubeVideoId(mod.youtubeUrl || '') : '');
      const hasValidVideo = Boolean(videoId);
      const quizQuestions = Array.isArray(mod.quizQuestions) ? mod.quizQuestions : [];

      card.innerHTML = `
        <div class="admin-course-day-header">
          <div class="admin-course-day-title">
            <span class="admin-course-day-num">Day 0${mod.day}</span>
            <strong style="font-size:1.1rem;color:var(--sunset-dark-base);">${mod.title}</strong>
            <span style="font-size:0.9rem;color:#854d0e;font-weight:600;">(${mod.titleMl || ''})</span>
          </div>
          <span style="font-size:0.8rem;padding:0.25rem 0.65rem;border-radius:4px;background:${hasValidVideo ? '#d1fae5;color:#065f46;' : '#fef3c7;color:#92400e;'}">
            ${hasValidVideo ? '✅ Video Linked' : '⏳ Video Placeholder'}
          </span>
        </div>

        <form onsubmit="event.preventDefault(); bkAdmin.handleSaveCourseDay(${mod.day});">
          <!-- Lesson Metadata -->
          <div class="admin-course-grid-form">
            <div class="form-group">
              <label for="adminCourseTitle_${mod.day}">Lesson Title (English) *</label>
              <input type="text" id="adminCourseTitle_${mod.day}" class="form-control" value="${mod.title || ''}" required>
            </div>

            <div class="form-group">
              <label for="adminCourseTitleMl_${mod.day}">Lesson Title (Malayalam)</label>
              <input type="text" id="adminCourseTitleMl_${mod.day}" class="form-control" value="${mod.titleMl || ''}">
            </div>
          </div>

          <div class="admin-course-grid-form">
            <div class="form-group">
              <label for="adminCourseDuration_${mod.day}">Lesson Duration</label>
              <input type="text" id="adminCourseDuration_${mod.day}" class="form-control" value="${mod.duration || '45 mins'}" placeholder="e.g. 45 mins or 50 mins">
            </div>

            <div class="form-group">
              <label for="adminCourseYt_${mod.day}">YouTube Video URL (Public, Unlisted, or 11-char ID)</label>
              <input type="text" id="adminCourseYt_${mod.day}" class="form-control" value="${mod.youtubeUrl || ''}" placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..." oninput="bkAdmin.handleYouTubeUrlInput(${mod.day}, this)">
              <div id="ytFeedbackDay${mod.day}" class="yt-valid-feedback ${hasValidVideo ? 'valid' : ''}">
                ${hasValidVideo ? `✅ Valid YouTube ID: <code>${videoId}</code>` : 'ℹ️ Paste any Public or Unlisted YouTube URL.'}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="adminCourseKeyInsight_${mod.day}">Key Insight / Subtitle (Malayalam / English)</label>
            <input type="text" id="adminCourseKeyInsight_${mod.day}" class="form-control" value="${mod.keyInsight || ''}" placeholder="Core spiritual takeaway for seekers...">
          </div>

          <div class="form-group">
            <label for="adminCourseDesc_${mod.day}">Lesson Description & Spiritual Summary</label>
            <textarea id="adminCourseDesc_${mod.day}" class="form-control" rows="2" placeholder="Brief synopsis of this daily lesson...">${mod.description || mod.summary || ''}</textarea>
          </div>

          <!-- Video Live Preview Box -->
          <div id="ytPreviewDay${mod.day}" class="admin-course-preview-box">
            <div style="font-weight:700;font-size:0.85rem;margin-bottom:0.5rem;color:var(--sunset-dark-base);">
              📺 Video Embed Preview:
            </div>
            ${hasValidVideo ? `
              <div class="course-video-wrapper" style="margin:0;max-width:480px;">
                <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1" frameborder="0" allowfullscreen></iframe>
              </div>
            ` : `
              <div style="font-size:0.84rem;color:var(--text-muted);padding:0.75rem;background:#fff;border-radius:4px;border:1px dashed #e5e7eb;">
                No video linked yet. The website will display the elegant "Day 0${mod.day} Video Coming Soon" placeholder.
              </div>
            `}
          </div>

          <!-- Reflection Prompt Editor -->
          <div class="form-group" style="margin-top:1.5rem;background:#fefce8;padding:1rem;border-radius:8px;border:1px solid #fef08a;">
            <label for="adminCourseReflection_${mod.day}" style="color:#854d0e;font-weight:700;">
              🕊️ Daily Spiritual Reflection Prompt (Malayalam / English)
            </label>
            <textarea id="adminCourseReflection_${mod.day}" class="form-control" rows="2" placeholder="Enter daily reflection prompt to guide seekers' self-inquiry...">${mod.reflectionPrompt || ''}</textarea>
          </div>

          <!-- Full Malayalam Quiz Editor -->
          <div class="admin-quiz-section">
            <div class="admin-quiz-section-header">
              <div>
                <strong style="color:var(--sunset-dark-base);font-size:1.05rem;">
                  🧠 Malayalam Knowledge Quiz Questions
                </strong>
                <p style="font-size:0.82rem;color:var(--text-muted);margin:0.2rem 0 0 0;">
                  Edit Malayalam questions, multiple choice options, correct answers, and wisdom explanations.
                </p>
              </div>
              <button type="button" class="admin-btn-add-q" onclick="bkAdmin.addQuizQuestionToDay(${mod.day})">
                <i data-lucide="plus" style="width:14px;height:14px;"></i>
                <span>Add Quiz Question</span>
              </button>
            </div>

            <div id="quizContainerDay_${mod.day}">
              ${quizQuestions.map((q, qIdx) => `
                <div class="admin-quiz-q-card admin-qblock-day-${mod.day}" data-qid="${q.id || 'd' + mod.day + '_q' + (qIdx + 1)}">
                  <div class="admin-quiz-q-card-header">
                    <strong style="color:var(--sunset-dark-base);font-size:0.92rem;">Question ${qIdx + 1}</strong>
                    <button type="button" class="admin-btn-del-q" onclick="bkAdmin.removeQuizQuestion(this)">
                      <i data-lucide="trash-2" style="width:13px;height:13px;"></i> Remove
                    </button>
                  </div>

                  <div class="form-group" style="margin-bottom:0.75rem;">
                    <label>Question Text (Malayalam / English) *</label>
                    <input type="text" class="form-control admin-q-text" value="${(q.question || '').replace(/"/g, '&quot;')}" placeholder="e.g. രാജയോഗ ധ്യാന പ്രകാരം ആത്മാവിന്റെ യഥാർത്ഥ സ്വരൂപവും ഗുണങ്ങളും എന്താണ്?" required>
                  </div>

                  <label style="font-size:0.82rem;color:var(--text-muted);font-weight:600;">
                    Choices (Select the Radio Button corresponding to the Correct Answer):
                  </label>
                  <div class="admin-quiz-opt-grid">
                    ${(q.options || ['', '', '', '']).map((opt, optIdx) => `
                      <div class="admin-quiz-opt-item">
                        <input type="radio" name="correct_choice_${mod.day}_${qIdx}" value="${optIdx}" ${optIdx === q.correctIndex ? 'checked' : ''} title="Mark option ${optIdx + 1} as correct answer">
                        <input type="text" class="form-control admin-opt-input" value="${(opt || '').replace(/"/g, '&quot;')}" placeholder="Choice ${optIdx + 1}..." required>
                      </div>
                    `).join('')}
                  </div>

                  <div class="form-group" style="margin-top:0.75rem;margin-bottom:0;">
                    <label>Spiritual Explanation / Wisdom note</label>
                    <input type="text" class="form-control admin-q-expl" value="${(q.explanation || '').replace(/"/g, '&quot;')}" placeholder="Spiritual explanation shown after answering...">
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;margin-top:1.5rem;">
            <button type="submit" class="btn-cta-course" style="padding:0.65rem 1.6rem;">
              <i data-lucide="save" style="width:16px;height:16px;"></i>
              <span>Save Day ${mod.day} Lesson &amp; Quiz</span>
            </button>
          </div>
        </form>
      `;
      container.appendChild(card);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  handleYouTubeUrlInput(dayNumber, inputEl) {
    const url = inputEl.value.trim();
    const feedbackEl = document.getElementById(`ytFeedbackDay${dayNumber}`);
    const previewBox = document.getElementById(`ytPreviewDay${dayNumber}`);
    if (!feedbackEl || !previewBox) return;

    if (!url) {
      feedbackEl.className = 'yt-valid-feedback';
      feedbackEl.innerHTML = `ℹ️ Paste any Public or Unlisted YouTube URL.`;
      previewBox.innerHTML = `
        <div style="font-weight:700;font-size:0.85rem;margin-bottom:0.5rem;color:var(--sunset-dark-base);">
          📺 Video Embed Preview:
        </div>
        <div style="font-size:0.84rem;color:var(--text-muted);padding:0.75rem;background:#fff;border-radius:4px;border:1px dashed #e5e7eb;">
          No video linked yet. The website will display the elegant "Day 0${dayNumber} Video Coming Soon" placeholder.
        </div>
      `;
      return;
    }

    const videoId = window.bkUtils ? window.bkUtils.extractYouTubeVideoId(url) : '';

    if (videoId) {
      feedbackEl.className = 'yt-valid-feedback valid';
      feedbackEl.innerHTML = `✅ Valid YouTube Video ID: <code>${videoId}</code> (Embeds directly on site)`;
      previewBox.innerHTML = `
        <div style="font-weight:700;font-size:0.85rem;margin-bottom:0.5rem;color:var(--sunset-dark-base);">
          📺 Live Video Embed Preview:
        </div>
        <div class="course-video-wrapper" style="margin:0;max-width:480px;">
          <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1" frameborder="0" allowfullscreen></iframe>
        </div>
      `;
    } else {
      feedbackEl.className = 'yt-valid-feedback invalid';
      feedbackEl.innerHTML = `⚠️ Invalid YouTube URL. Supported formats: <code>https://youtube.com/watch?v=...</code>, <code>https://youtu.be/...</code>, or 11-char Video ID.`;
      previewBox.innerHTML = `
        <div style="font-weight:700;font-size:0.85rem;margin-bottom:0.5rem;color:var(--sunset-dark-base);">
          📺 Video Embed Preview:
        </div>
        <div style="font-size:0.84rem;color:#dc2626;padding:0.75rem;background:#fff;border-radius:4px;border:1px dashed #fca5a5;">
          Cannot preview video. Please ensure the URL is a valid YouTube link.
        </div>
      `;
    }
  }

  handleSaveCourseDay(dayNumber) {
    const titleEl = document.getElementById(`adminCourseTitle_${dayNumber}`);
    const titleMlEl = document.getElementById(`adminCourseTitleMl_${dayNumber}`);
    const durationEl = document.getElementById(`adminCourseDuration_${dayNumber}`);
    const keyInsightEl = document.getElementById(`adminCourseKeyInsight_${dayNumber}`);
    const descEl = document.getElementById(`adminCourseDesc_${dayNumber}`);
    const ytEl = document.getElementById(`adminCourseYt_${dayNumber}`);
    const reflectionEl = document.getElementById(`adminCourseReflection_${dayNumber}`);

    if (!titleEl) return;

    const title = titleEl.value.trim();
    const titleMl = titleMlEl ? titleMlEl.value.trim() : '';
    const duration = durationEl ? durationEl.value.trim() : '45 mins';
    const keyInsight = keyInsightEl ? keyInsightEl.value.trim() : '';
    const description = descEl ? descEl.value.trim() : '';
    const youtubeUrl = ytEl ? ytEl.value.trim() : '';
    const reflectionPrompt = reflectionEl ? reflectionEl.value.trim() : '';

    if (!title) {
      alert(`Lesson title for Day ${dayNumber} is required.`);
      return;
    }

    // Collect all quiz questions for this day
    const qBlocks = document.querySelectorAll(`.admin-qblock-day-${dayNumber}`);
    const quizQuestions = [];
    qBlocks.forEach((qEl, qIdx) => {
      const qId = qEl.getAttribute('data-qid') || `d${dayNumber}_q${qIdx + 1}`;
      const qText = qEl.querySelector('.admin-q-text')?.value.trim() || '';
      const optInputs = qEl.querySelectorAll('.admin-opt-input');
      const options = Array.from(optInputs).map(inp => inp.value.trim()).filter(Boolean);
      const checkedRadio = qEl.querySelector(`input[name="correct_choice_${dayNumber}_${qIdx}"]:checked`);
      const correctIndex = checkedRadio ? parseInt(checkedRadio.value, 10) : 0;
      const explanation = qEl.querySelector('.admin-q-expl')?.value.trim() || '';

      if (qText && options.length >= 2) {
        quizQuestions.push({
          id: qId,
          question: qText,
          options: options,
          correctIndex: correctIndex,
          explanation: explanation
        });
      }
    });

    // Update in store
    const updated = window.bkStore.updateCourseModule(dayNumber, {
      title,
      titleMl,
      duration,
      keyInsight,
      description,
      summary: description,
      youtubeUrl,
      reflectionPrompt,
      quizQuestions: quizQuestions.length > 0 ? quizQuestions : undefined
    });

    if (updated) {
      // Re-render public website course page in real time
      if (window.bkCourse && typeof window.bkCourse.render === 'function') {
        window.bkCourse.render();
      }
      if (window.bkApp && typeof window.bkApp.renderCourseModules === 'function') {
        window.bkApp.renderCourseModules();
      }

      if (window.bkApp && window.bkApp.toast) {
        window.bkApp.toast(`✨ Day ${dayNumber} lesson & Malayalam quiz saved successfully!`);
      } else {
        alert(`Day ${dayNumber} saved successfully!`);
      }

      // Refresh admin course card view
      this.renderAdminCourseManager();
    } else {
      alert(`Failed to update Day ${dayNumber}.`);
    }
  }

  addQuizQuestionToDay(dayNumber) {
    const container = document.getElementById(`quizContainerDay_${dayNumber}`);
    if (!container) return;
    const currentCount = container.querySelectorAll(`.admin-qblock-day-${dayNumber}`).length;
    const newIndex = currentCount;
    const newQId = `d${dayNumber}_q${newIndex + 1}_${Date.now()}`;

    const qCard = document.createElement('div');
    qCard.className = `admin-quiz-q-card admin-qblock-day-${dayNumber}`;
    qCard.setAttribute('data-qid', newQId);
    qCard.innerHTML = `
      <div class="admin-quiz-q-card-header">
        <strong style="color:var(--sunset-dark-base);font-size:0.92rem;">Question ${newIndex + 1}</strong>
        <button type="button" class="admin-btn-del-q" onclick="bkAdmin.removeQuizQuestion(this)">
          <i data-lucide="trash-2" style="width:13px;height:13px;"></i> Remove
        </button>
      </div>

      <div class="form-group" style="margin-bottom:0.75rem;">
        <label>Question Text (Malayalam / English) *</label>
        <input type="text" class="form-control admin-q-text" placeholder="Enter question in Malayalam..." required>
      </div>

      <label style="font-size:0.82rem;color:var(--text-muted);font-weight:600;">
        Choices (Select Radio Button for Correct Answer):
      </label>
      <div class="admin-quiz-opt-grid">
        ${[0, 1, 2, 3].map(optIdx => `
          <div class="admin-quiz-opt-item">
            <input type="radio" name="correct_choice_${dayNumber}_${newIndex}" value="${optIdx}" ${optIdx === 0 ? 'checked' : ''} title="Mark choice ${optIdx + 1} as correct">
            <input type="text" class="form-control admin-opt-input" placeholder="Choice ${optIdx + 1}..." required>
          </div>
        `).join('')}
      </div>

      <div class="form-group" style="margin-top:0.75rem;margin-bottom:0;">
        <label>Spiritual Explanation / Wisdom note</label>
        <input type="text" class="form-control admin-q-expl" placeholder="Wisdom explanation for seekers...">
      </div>
    `;
    container.appendChild(qCard);
    if (window.lucide) window.lucide.createIcons();
  }

  removeQuizQuestion(buttonEl) {
    const qCard = buttonEl.closest('.admin-quiz-q-card');
    if (!qCard) return;
    const container = qCard.parentElement;
    qCard.remove();
    if (container) {
      container.querySelectorAll('.admin-quiz-q-card').forEach((card, idx) => {
        const headerTitle = card.querySelector('.admin-quiz-q-card-header strong');
        if (headerTitle) headerTitle.textContent = `Question ${idx + 1}`;
        card.querySelectorAll('input[type="radio"]').forEach(radio => {
          const match = radio.name.match(/correct_choice_(\d+)/);
          const day = match ? match[1] : '1';
          radio.name = `correct_choice_${day}_${idx}`;
        });
      });
    }
  }

  // --- Social Media Channels Manager ---
  renderAdminSocialChannels() {
    const container = document.getElementById('adminSocialChannelsList');
    if (!container) return;

    const channels = window.bkStore.getSocialChannels();
    container.innerHTML = '';

    channels.forEach(ch => {
      const card = document.createElement('div');
      card.className = 'admin-social-channel-card';

      card.innerHTML = `
        <div class="admin-social-channel-header">
          <div class="admin-social-channel-title">
            <div class="social-channel-badge-num">
              <i data-lucide="radio" style="width:16px;height:16px;"></i>
            </div>
            <div>
              <strong style="font-size:1.15rem;color:var(--sunset-dark-base);">${ch.name}</strong>
              <div style="font-size:0.8rem;color:var(--text-muted);">Official Brahma Kumaris Channel</div>
            </div>
          </div>
          <label class="switch-container" style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.88rem;font-weight:600;">
            <input type="checkbox" id="adminSocialActive_${ch.id}" ${ch.active ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--sunset-primary);">
            <span>Active in Navigation & Media Hub</span>
          </label>
        </div>

        <form onsubmit="event.preventDefault(); bkAdmin.handleSaveSocialChannel('${ch.id}');">
          <div class="form-group">
            <label for="adminSocialName_${ch.id}">Channel Display Name</label>
            <input type="text" id="adminSocialName_${ch.id}" class="form-control" value="${ch.name}" readonly style="background:#f9fafb;">
          </div>

          <div class="admin-social-platform-row">
            <div class="form-group">
              <label for="adminSocialYt_${ch.id}" style="display:flex;align-items:center;gap:0.4rem;">
                <i data-lucide="youtube" style="width:15px;height:15px;color:#ef4444;"></i>
                <span>YouTube Channel URL</span>
              </label>
              <input type="url" id="adminSocialYt_${ch.id}" class="form-control" value="${ch.youtubeUrl || ''}" placeholder="e.g. https://www.youtube.com/@...">
            </div>

            <div class="form-group">
              <label for="adminSocialInsta_${ch.id}" style="display:flex;align-items:center;gap:0.4rem;">
                <i data-lucide="instagram" style="width:15px;height:15px;color:#ec4899;"></i>
                <span>Instagram Profile URL</span>
              </label>
              <input type="url" id="adminSocialInsta_${ch.id}" class="form-control" value="${ch.instagramUrl || ''}" placeholder="e.g. https://www.instagram.com/...">
            </div>

            <div class="form-group">
              <label for="adminSocialFb_${ch.id}" style="display:flex;align-items:center;gap:0.4rem;">
                <i data-lucide="facebook" style="width:15px;height:15px;color:#3b82f6;"></i>
                <span>Facebook Page URL</span>
              </label>
              <input type="url" id="adminSocialFb_${ch.id}" class="form-control" value="${ch.facebookUrl || ''}" placeholder="e.g. https://www.facebook.com/...">
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;margin-top:1rem;">
            <button type="submit" class="btn-cta-course" style="padding:0.6rem 1.4rem;">
              <i data-lucide="save" style="width:16px;height:16px;"></i>
              <span>Save ${ch.name} Links</span>
            </button>
          </div>
        </form>
      `;
      container.appendChild(card);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  handleSaveSocialChannel(channelId) {
    const ytEl = document.getElementById(`adminSocialYt_${channelId}`);
    const instaEl = document.getElementById(`adminSocialInsta_${channelId}`);
    const fbEl = document.getElementById(`adminSocialFb_${channelId}`);
    const activeEl = document.getElementById(`adminSocialActive_${channelId}`);

    if (!ytEl) return;

    const youtubeUrl = ytEl.value.trim();
    const instagramUrl = instaEl ? instaEl.value.trim() : '';
    const facebookUrl = fbEl ? fbEl.value.trim() : '';
    const active = activeEl ? activeEl.checked : true;

    const updated = window.bkStore.updateSocialChannel(channelId, {
      youtubeUrl,
      instagramUrl,
      facebookUrl,
      active
    });

    if (updated) {
      // Re-render navigation & media hub
      if (window.bkApp) {
        if (typeof window.bkApp.renderNavigation === 'function') window.bkApp.renderNavigation();
        if (typeof window.bkApp.renderMediaHub === 'function') window.bkApp.renderMediaHub();
      }

      window.bkApp.toast(`🕊️ Links for "${updated.name}" updated successfully!`);
      this.renderAdminSocialChannels();
    } else {
      alert(`Failed to update ${channelId}.`);
    }
  }

  confirmResetDefaults() {
    if (confirm("WARNING: This will reset all tabs, gallery items, course videos, and settings to the original default setup. Proceed?")) {
      window.bkStore.resetToDefaults();
      this.refreshAllPanes();
      if (window.bkApp) window.bkApp.renderCourseModules();
      window.bkApp.toast("Reset complete. Default content restored.");
    }
  }
}

// Global Admin Instance
window.bkAdmin = new AdminController();
document.addEventListener('DOMContentLoaded', () => {
  window.bkAdmin.init();
});
