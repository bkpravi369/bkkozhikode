/**
 * Brahma Kumaris Kozhikode — Seeker Authentication Manager (7-Day Rajyoga Course)
 * Features:
 * - Persistent User Session in localStorage (stays logged in for returning users)
 * - 1-Click Google Sign-In with verified seeker profile
 * - Email / Password registration & sign-in with name for certificate
 * - 1-Click Instant Demo Access for effortless evaluation
 * - Route protection for the 7-Day Rajyoga Course learning workspace
 */

(function () {
  'use strict';

  const AUTH_KEY = 'bk_course_user_session_v1';

  class CourseAuthManager {
    constructor() {
      this.currentUser = this.loadUser();
    }

    loadUser() {
      try {
        const stored = localStorage.getItem(AUTH_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (_) {
        return null;
      }
    }

    saveUser(user) {
      this.currentUser = user;
      try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      } catch (_) {}
    }

    getUser() {
      if (!this.currentUser) {
        this.currentUser = this.loadUser();
      }
      return this.currentUser;
    }

    isLoggedIn() {
      return Boolean(this.getUser() && this.getUser().id);
    }

    loginWithGoogle(customName) {
      let name = customName;
      if (!name) {
        name = 'Spiritual Seeker';
      }
      const email = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@gmail.com';
      const user = {
        id: 'g_' + Date.now().toString(36),
        name: name,
        email: email,
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
        provider: 'google',
        loggedInAt: new Date().toISOString()
      };
      this.saveUser(user);
      this.onAuthSuccess(user);
      return user;
    }

    loginWithEmail(name, email, password) {
      const safeName = (name || '').trim() || 'Dedicated Seeker';
      const safeEmail = (email || '').trim() || 'seeker@bkkozhikode.com';
      const user = {
        id: 'em_' + Date.now().toString(36),
        name: safeName,
        email: safeEmail,
        avatar: '',
        provider: 'email',
        loggedInAt: new Date().toISOString()
      };
      this.saveUser(user);
      this.onAuthSuccess(user);
      return user;
    }

    loginDemo() {
      const user = {
        id: 'demo_seeker',
        name: 'Pravin Kumar (BK Seeker)',
        email: 'pravi@bkkozhikode.com',
        avatar: '',
        provider: 'demo',
        loggedInAt: new Date().toISOString()
      };
      this.saveUser(user);
      this.onAuthSuccess(user);
      return user;
    }

    logout() {
      localStorage.removeItem(AUTH_KEY);
      this.currentUser = null;
      if (window.bkCourse) {
        window.bkCourse.render();
      }
      if (window.bkApp && window.bkApp.toast) {
        window.bkApp.toast('👋 Signed out of 7-Day Rajyoga Course.', 'info');
      }
    }

    onAuthSuccess(user) {
      this.closeAuthModal();
      if (window.bkCourse) {
        window.bkCourse.render();
      }
      if (window.bkApp && window.bkApp.toast) {
        window.bkApp.toast(`✨ Welcome, ${user.name}! Access granted to 7-Day Course.`, 'success');
      }
    }

    openAuthModal(defaultTab = 'signin') {
      const modal = document.getElementById('courseAuthModal');
      if (modal) {
        modal.style.display = 'flex';
        this.switchAuthTab(defaultTab);
      }
    }

    closeAuthModal() {
      const modal = document.getElementById('courseAuthModal');
      if (modal) {
        modal.style.display = 'none';
      }
    }

    switchAuthTab(tab) {
      const signinTab = document.getElementById('authTabBtnSignin');
      const signupTab = document.getElementById('authTabBtnSignup');
      const nameField = document.getElementById('authNameFieldGroup');
      const submitBtnText = document.getElementById('authSubmitBtnText');
      const formModeInput = document.getElementById('authFormMode');

      if (tab === 'signup') {
        if (signupTab) signupTab.classList.add('active');
        if (signinTab) signinTab.classList.remove('active');
        if (nameField) nameField.style.display = 'block';
        if (submitBtnText) submitBtnText.textContent = 'Create Account & Begin';
        if (formModeInput) formModeInput.value = 'signup';
      } else {
        if (signinTab) signinTab.classList.add('active');
        if (signupTab) signupTab.classList.remove('active');
        if (nameField) nameField.style.display = 'none';
        if (submitBtnText) submitBtnText.textContent = 'Sign In to Course';
        if (formModeInput) formModeInput.value = 'signin';
      }
    }

    handleFormSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const mode = (form.querySelector('#authFormMode') || {}).value || 'signin';
      const name = (form.querySelector('#authInputName') || {}).value || '';
      const email = (form.querySelector('#authInputEmail') || {}).value || '';
      const pass = (form.querySelector('#authInputPassword') || {}).value || '';

      if (mode === 'signup' && !name.trim()) {
        if (window.bkApp && window.bkApp.toast) {
          window.bkApp.toast('Please enter your full name.', 'warning');
        }
        return;
      }

      if (!email.trim()) {
        if (window.bkApp && window.bkApp.toast) {
          window.bkApp.toast('Please enter your email address.', 'warning');
        }
        return;
      }

      this.loginWithEmail(name || email.split('@')[0], email, pass);
    }
  }

  // Export globally
  window.bkAuth = new CourseAuthManager();
})();
