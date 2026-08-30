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

  init() {
    // Initial check
    if (window.bkStore.isAdminAuthenticated()) {
      this.showPanelView();
    } else {
      this.showLoginView();
    }
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

  handleLogin(e) {
    e.preventDefault();
    const pin = document.getElementById('adminPinInput').value.trim();
    if (window.bkStore.authenticateAdmin(pin)) {
      document.getElementById('adminPinInput').value = '';
      this.showPanelView();
      window.bkApp.toast("Admin Authentication Successful! Welcome to Brahma Kumaris CMS.");
    } else {
      alert("Invalid Security PIN. Please enter the correct PIN (default: peace108).");
    }
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
      } else {
        events = events.filter(e => e.category === filterCat);
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

      const card = document.createElement('div');
      card.className = `admin-event-row-card ${isDraft ? 'is-draft' : ''}`;

      card.innerHTML = `
        <div class="admin-ev-thumb-box">
          <img src="${ev.image || 'assets/images/light_palace_center.jpg'}" alt="${ev.title}">
        </div>

        <div class="admin-ev-details-box">
          <div class="admin-ev-badge-row">
            <span class="admin-cat-pill">${this.formatEventCatLabel(ev.category)}</span>
            ${isFeat ? `<span class="admin-feat-pill">⭐ Featured</span>` : ''}
            <span class="admin-status-pill ${isDraft ? 'draft' : 'published'}">
              ${isDraft ? '● Draft (Hidden)' : '● Published'}
            </span>
            <span class="admin-order-badge">Order: ${ev.order || 1}</span>
          </div>

          <h4 class="admin-ev-title">${ev.title}</h4>
          ${ev.titleMl ? `<div style="font-family:var(--font-malayalam);font-size:0.84rem;color:var(--sunset-crimson);margin-bottom:0.35rem;">${ev.titleMl}</div>` : ''}
          
          <div class="admin-ev-meta-line">
            <span><i data-lucide="calendar" style="width:13px;height:13px;"></i> ${ev.date}</span>
            <span><i data-lucide="clock" style="width:13px;height:13px;"></i> ${ev.time}</span>
            <span><i data-lucide="map-pin" style="width:13px;height:13px;"></i> ${ev.location}</span>
          </div>

          <p class="admin-ev-desc-preview">${ev.shortDesc || ''}</p>
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
      navathi: 'Navathi Celebrations',
      shivarathri: 'Festivals → Shivarathri',
      rakshabandhan: 'Festivals → Raksha Bandhan',
      other: 'Festivals → Other Programs'
    };
    return map[cat] || 'Event';
  }

  openAddEventModal() {
    const form = document.getElementById('addEventFormContainer');
    if (!form) return;

    document.getElementById('eventFormId').value = '';
    document.getElementById('eventFormTitleInput').value = '';
    document.getElementById('eventFormTitleMl').value = '';
    document.getElementById('eventFormCategory').value = 'latest';
    document.getElementById('eventFormOrder').value = '1';
    document.getElementById('eventFormDate').value = '';
    document.getElementById('eventFormTime').value = '10:00 AM - 1:00 PM';
    document.getElementById('eventFormVenue').value = 'Ashokapuram Light Palace, Kozhikode';
    document.getElementById('eventFormShortDesc').value = '';
    document.getElementById('eventFormFullDesc').value = '';
    document.getElementById('eventFormImageUrl').value = '';
    document.getElementById('eventFormAdditionalImages').value = '';
    document.getElementById('eventFormVideoUrl').value = '';
    document.getElementById('eventFormRegUrl').value = '';
    document.getElementById('eventFormExternalUrl').value = '';
    document.getElementById('eventFormIsFeatured').checked = false;
    document.getElementById('eventFormIsPublished').checked = true;

    this.removeEventMainImage();
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

    document.getElementById('eventFormId').value = ev.id;
    document.getElementById('eventFormTitleInput').value = ev.title || '';
    document.getElementById('eventFormTitleMl').value = ev.titleMl || '';
    document.getElementById('eventFormCategory').value = ev.category || 'latest';
    document.getElementById('eventFormOrder').value = ev.order || 1;
    document.getElementById('eventFormDate').value = ev.date || '';
    document.getElementById('eventFormTime').value = ev.time || '';
    document.getElementById('eventFormVenue').value = ev.location || ev.venue || '';
    document.getElementById('eventFormShortDesc').value = ev.shortDesc || '';
    document.getElementById('eventFormFullDesc').value = ev.fullDesc || ev.shortDesc || '';
    document.getElementById('eventFormImageUrl').value = ev.image || '';
    document.getElementById('eventFormAdditionalImages').value = Array.isArray(ev.additionalImages) ? ev.additionalImages.join(', ') : '';
    document.getElementById('eventFormVideoUrl').value = ev.videoUrl || '';
    document.getElementById('eventFormRegUrl').value = ev.registrationUrl || '';
    document.getElementById('eventFormExternalUrl').value = ev.externalUrl || '';
    document.getElementById('eventFormIsFeatured').checked = Boolean(ev.isFeatured);
    document.getElementById('eventFormIsPublished').checked = ev.status !== 'draft';

    this.previewEventMainImage(ev.image || '');
    this.previewEventVideo(ev.videoUrl || '');
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
    const category = document.getElementById('eventFormCategory').value;
    const order = parseInt(document.getElementById('eventFormOrder').value, 10) || 1;
    const date = document.getElementById('eventFormDate').value.trim();
    const time = document.getElementById('eventFormTime').value.trim();
    const location = document.getElementById('eventFormVenue').value.trim();
    const shortDesc = document.getElementById('eventFormShortDesc').value.trim();
    const fullDesc = document.getElementById('eventFormFullDesc').value.trim();
    const image = document.getElementById('eventFormImageUrl').value.trim() || 'assets/images/light_palace_center.jpg';
    
    const rawAdditional = document.getElementById('eventFormAdditionalImages').value.trim();
    const additionalImages = rawAdditional ? rawAdditional.split(',').map(s => s.trim()).filter(Boolean) : [];

    const videoUrl = document.getElementById('eventFormVideoUrl').value.trim();
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
      time,
      location,
      shortDesc,
      fullDesc,
      image,
      additionalImages,
      videoUrl,
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

    // Re-render live website events section
    if (window.bkApp && typeof window.bkApp.renderEventsSection === 'function') {
      window.bkApp.renderEventsSection(category);
    }

    window.bkApp.toast(`🕊️ Event "${saved.title}" saved & published successfully!`);
  }

  duplicateEvent(eventId) {
    const cloned = window.bkStore.duplicateEvent(eventId);
    if (cloned) {
      this.renderAdminEvents();
      this.refreshDashboard();
      if (window.bkApp) window.bkApp.renderEvents();
      window.bkApp.toast(`📋 Duplicated as Draft: "${cloned.title}"`);
    }
  }

  togglePublishEvent(eventId) {
    const updated = window.bkStore.togglePublishEvent(eventId);
    if (updated) {
      this.renderAdminEvents();
      this.refreshDashboard();
      if (window.bkApp) window.bkApp.renderEvents();
      window.bkApp.toast(`🕊️ Event is now ${updated.status === 'published' ? 'Published publicly' : 'saved as Draft (Hidden)'}.`);
    }
  }

  deleteEvent(eventId) {
    if (confirm("Are you sure you want to permanently delete this event?")) {
      window.bkStore.deleteEvent(eventId);
      this.renderAdminEvents();
      this.refreshDashboard();
      if (window.bkApp) window.bkApp.renderEvents();
      window.bkApp.toast("🕊️ Event deleted.");
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
    if (window.bkApp && typeof window.bkApp.renderCenters === 'function') {
      window.bkApp.renderCenters('all');
    }
    window.bkApp.toast(`🕊️ Center "${name}" saved successfully!`);
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
      if (window.bkApp && typeof window.bkApp.renderCenters === 'function') {
        window.bkApp.renderCenters('all');
      }
      window.bkApp.toast(`Center "${c.name}" removed.`);
    }
  }

  togglePublishCenter(id) {
    const updated = window.bkStore.togglePublishCenter(id);
    if (updated) {
      this.renderCentersManager();
      if (window.bkApp && typeof window.bkApp.renderCenters === 'function') {
        window.bkApp.renderCenters('all');
      }
      window.bkApp.toast(`Visibility updated for "${updated.name}".`);
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
    if (pin) pin.value = s.adminPin || 'peace108';
  }

  handleSaveSettings(e) {
    e.preventDefault();
    const orgName = document.getElementById('setOrgName').value.trim();
    const orgNameMl = document.getElementById('setOrgNameMl').value.trim();
    const phonePrimary = document.getElementById('setPhone1').value.trim();
    const phoneSecondary = document.getElementById('setPhone2').value.trim();
    const email = document.getElementById('setEmail').value.trim();
    const announcement = document.getElementById('setAnnouncement').value.trim();
    const adminPin = document.getElementById('setAdminPin').value.trim() || 'peace108';

    window.bkStore.updateSettings({ orgName, orgNameMl, phonePrimary, phoneSecondary, email, announcement, adminPin });

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

      card.innerHTML = `
        <div class="admin-course-day-header">
          <div class="admin-course-day-title">
            <span class="admin-course-day-num">Day 0${mod.day}</span>
            <strong style="font-size:1.1rem;color:var(--sunset-dark-base);">${mod.title}</strong>
          </div>
          <span style="font-size:0.8rem;padding:0.25rem 0.65rem;border-radius:4px;background:${hasValidVideo ? '#d1fae5;color:#065f46;' : '#fef3c7;color:#92400e;'}">
            ${hasValidVideo ? '✅ Video Linked' : '⏳ Video Placeholder'}
          </span>
        </div>

        <form onsubmit="event.preventDefault(); bkAdmin.handleSaveCourseDay(${mod.day});">
          <div class="admin-course-grid-form">
            <div class="form-group">
              <label for="adminCourseTitle_${mod.day}">Lesson Title (Day ${mod.day})</label>
              <input type="text" id="adminCourseTitle_${mod.day}" class="form-control" value="${mod.title || ''}" required>
            </div>

            <div class="form-group">
              <label for="adminCourseTitleMl_${mod.day}">Malayalam Title</label>
              <input type="text" id="adminCourseTitleMl_${mod.day}" class="form-control" value="${mod.titleMl || ''}">
            </div>
          </div>

          <div class="admin-course-grid-form">
            <div class="form-group">
              <label for="adminCourseDuration_${mod.day}">Video Duration</label>
              <input type="text" id="adminCourseDuration_${mod.day}" class="form-control" value="${mod.duration || '30 mins'}" placeholder="e.g. 25 min or 45 mins">
            </div>

            <div class="form-group">
              <label for="adminCourseYt_${mod.day}">YouTube Video URL (Public or Unlisted)</label>
              <input type="text" id="adminCourseYt_${mod.day}" class="form-control" value="${mod.youtubeUrl || ''}" placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..." oninput="bkAdmin.handleYouTubeUrlInput(${mod.day}, this)">
              <div id="ytFeedbackDay${mod.day}" class="yt-valid-feedback ${hasValidVideo ? 'valid' : ''}">
                ${hasValidVideo ? `✅ Valid YouTube ID: <code>${videoId}</code>` : 'ℹ️ Paste any Public or Unlisted YouTube URL.'}
              </div>
            </div>
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
                <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1" frameborder="0" allowfullscreen></iframe>
              </div>
            ` : `
              <div style="font-size:0.84rem;color:var(--text-muted);padding:0.75rem;background:#fff;border-radius:4px;border:1px dashed #e5e7eb;">
                No video linked yet. The website will display the elegant "Day 0${mod.day} Video Coming Soon" placeholder.
              </div>
            `}
          </div>

          <div style="display:flex;justify-content:flex-end;margin-top:1.25rem;">
            <button type="submit" class="btn-cta-course" style="padding:0.6rem 1.4rem;">
              <i data-lucide="save" style="width:16px;height:16px;"></i>
              <span>Save Day ${mod.day} Lesson</span>
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
          <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1" frameborder="0" allowfullscreen></iframe>
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
    const descEl = document.getElementById(`adminCourseDesc_${dayNumber}`);
    const ytEl = document.getElementById(`adminCourseYt_${dayNumber}`);

    if (!titleEl) return;

    const title = titleEl.value.trim();
    const titleMl = titleMlEl ? titleMlEl.value.trim() : '';
    const duration = durationEl ? durationEl.value.trim() : '30 mins';
    const description = descEl ? descEl.value.trim() : '';
    const youtubeUrl = ytEl ? ytEl.value.trim() : '';

    if (!title) {
      alert(`Lesson title for Day ${dayNumber} is required.`);
      return;
    }

    // Update in store
    const updated = window.bkStore.updateCourseModule(dayNumber, {
      title,
      titleMl,
      duration,
      description,
      summary: description,
      youtubeUrl
    });

    if (updated) {
      // Re-render main website course page in real time
      if (window.bkApp && typeof window.bkApp.renderCourseModules === 'function') {
        window.bkApp.renderCourseModules();
      }

      window.bkApp.toast(`🕊️ Day ${dayNumber} lesson updated successfully!`);

      // Refresh admin course card view
      this.renderAdminCourseManager();
    } else {
      alert(`Failed to update Day ${dayNumber}.`);
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
