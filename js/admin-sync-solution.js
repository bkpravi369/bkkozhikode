// admin-sync-solution.js
// ഈ കോഡ് ഉപയോഗിച്ച് അഡ്മിൻ പാനലിലെ മാറ്റങ്ങൾ localStorage-ൽ നിന്ന് മാറ്റി,
// നേരിട്ട് Vercel/Node Server API വഴിയോ അല്ലെങ്കിൽ GitHub API വഴിയോ JSON ഫയലിലേക്ക് സേവ് ചെയ്യുന്ന കോഡ് സെറ്റ് ചെയ്യുക.

export async function saveAdminData(updatedData) {
  try {
    // LocalStorage ഉപയോഗിക്കുന്നത് പൂർണ്ണമായി ഒഴിവാക്കി API-ലേക്ക് അയക്കുന്നു
    const token = (typeof sessionStorage !== 'undefined') ? sessionStorage.getItem('bk_admin_token') : '';
    const ghToken = (typeof sessionStorage !== 'undefined') ? sessionStorage.getItem('bk_github_token') : '';
    const pin = (updatedData && updatedData.settings && updatedData.settings.adminPin) || 'Kozhikode@2026';

    const headers = {
      'Content-Type': 'application/json',
      'X-Admin-Pin': pin
    };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    if (ghToken) headers['X-GitHub-Token'] = ghToken;

    const response = await fetch('/api/save-data', {
      method: 'POST',
      headers,
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      // Fallback attempt to /api/admin/save if /api/save-data is not routed
      const fallback = await fetch('/api/admin/save', {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: updatedData })
      });
      if (!fallback.ok) {
        throw new Error(`Failed to save to server (HTTP ${response.status})`);
      }
      const fallbackResult = await fallback.json();
      return { success: true, data: fallbackResult };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Save error:', error);
    return { success: false, error: error.message };
  }
}

// Global attachment for vanilla JS browser scripts
if (typeof window !== 'undefined') {
  window.saveAdminData = saveAdminData;
}
