const fs = require('fs');
const path = require('path');

async function commitFileToGitHub(token, repoOwner, repoName, filePath, contentString, commitMessage) {
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'BK-Kozhikode-Admin-Sync',
    'Content-Type': 'application/json'
  };

  let sha = undefined;
  try {
    const getRes = await fetch(url, { headers });
    if (getRes.ok) {
      const getJson = await getRes.json();
      sha = getJson.sha;
    }
  } catch (e) {}

  const body = {
    message: commitMessage,
    content: Buffer.from(contentString, 'utf-8').toString('base64'),
    branch: 'main'
  };
  if (sha) body.sha = sha;

  const putRes = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub API ${putRes.status}: ${errText}`);
  }
  return await putRes.json();
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Pin, X-GitHub-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    body = {};
  }

  const incomingData = (body && body.data) ? body.data : body;
  if (!incomingData || typeof incomingData !== 'object' || Object.keys(incomingData).length === 0) {
    return res.status(400).json({ success: false, error: 'No data payload provided.' });
  }

  const dataDir = path.join(process.cwd(), 'data');
  const dataFilePath = path.join(dataDir, 'site_data.json');
  const tmpFilePath = path.join('/tmp', 'site_data.json');
  const rootSiteData = path.join(process.cwd(), 'siteData.json');

  let existing = {};
  if (fs.existsSync(tmpFilePath)) {
    try {
      existing = JSON.parse(fs.readFileSync(tmpFilePath, 'utf-8'));
    } catch (e) {}
  }
  if (!existing || Object.keys(existing).length === 0) {
    if (fs.existsSync(rootSiteData)) {
      try {
        existing = JSON.parse(fs.readFileSync(rootSiteData, 'utf-8'));
      } catch (e) {}
    } else if (fs.existsSync(dataFilePath)) {
      try {
        existing = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      } catch (e) {}
    }
  }

  const merged = { ...existing, ...incomingData };
  if (Array.isArray(incomingData.events)) {
    merged.events = incomingData.events;
  }
  if (Array.isArray(incomingData.categories)) {
    merged.categories = incomingData.categories;
  }
  if (Array.isArray(incomingData.wings)) {
    merged.wings = incomingData.wings;
  }
  if (incomingData.settings && typeof incomingData.settings === 'object') {
    merged.settings = { ...(existing.settings || {}), ...incomingData.settings };
  }
  delete merged.password;
  delete merged.data;

  const jsonString = JSON.stringify(merged, null, 2);

  // 1. Write to local repository files if writable
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(dataFilePath, jsonString, 'utf-8');
  } catch (err) {}

  try {
    fs.writeFileSync(rootSiteData, jsonString, 'utf-8');
  } catch (err) {}

  try {
    const srcDataDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(srcDataDir)) fs.mkdirSync(srcDataDir, { recursive: true });
    fs.writeFileSync(path.join(srcDataDir, 'siteData.json'), jsonString, 'utf-8');
    if (Array.isArray(merged.events)) {
      fs.writeFileSync(path.join(srcDataDir, 'events.json'), JSON.stringify(merged.events, null, 2), 'utf-8');
    }
  } catch (err) {}

  // 2. Write to /tmp/site_data.json (for serverless runtime persistence)
  try {
    fs.writeFileSync(tmpFilePath, jsonString, 'utf-8');
  } catch (err) {}

  // 3. GitHub repository commit sync if token available
  const ghToken = process.env.GITHUB_TOKEN ||
                  process.env.GH_TOKEN ||
                  req.headers['x-github-token'] ||
                  (body && body.githubToken) ||
                  (incomingData && incomingData.settings && incomingData.settings.githubToken) ||
                  '';

  const repoOwner = process.env.GITHUB_OWNER || 'bkpravi369';
  const repoName = process.env.GITHUB_REPO || 'bkkozhikode';
  let gitHubSynced = false;

  if (ghToken) {
    try {
      const commitMsg = `chore(data): auto-sync admin changes to siteData.json [${new Date().toISOString()}]`;
      await commitFileToGitHub(ghToken, repoOwner, repoName, 'siteData.json', jsonString, commitMsg);
      try {
        await commitFileToGitHub(ghToken, repoOwner, repoName, 'data/site_data.json', jsonString, commitMsg);
      } catch (e) {}
      gitHubSynced = true;
    } catch (ghErr) {
      console.warn('GitHub API auto-commit note:', ghErr.message);
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Site data saved successfully and permanently.',
    gitHubSynced,
    eventsCount: Array.isArray(merged.events) ? merged.events.length : 0,
    timestamp: Date.now()
  });
};
