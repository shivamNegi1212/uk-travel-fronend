# 🚀 Render Deployment - FINAL CONFIGURATION

## ✅ Project Structure (CORRECT)

```
uk-travel-app/
├── backend/                    # Node.js Express backend
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/                   # React + Vite frontend
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── server.js              # Express server to serve dist
│   ├── .node-version          # 18.20.2
│   ├── .nvmrc                 # 18.20.2
│   └── ...
├── render.yaml                # Monorepo deployment config
└── .gitignore
```

---

## 🎯 Render Configuration (EXACT SETTINGS)

### **render.yaml** (Root level - already configured)
```yaml
services:
  - type: web
    name: uk-travel-frontend
    env: node
    rootDir: frontend              # ← CRITICAL: Points to frontend folder
    nodeVersion: 18.20.2           # ← Stable LTS
    region: oregon
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: VITE_API_URL
        value: https://uk-travel-backend.onrender.com/api
```

### **Render Dashboard Settings** (If not using render.yaml)
| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Node Version** | `18.20.2` |
| **Environment Variable: NODE_ENV** | `production` |
| **Environment Variable: VITE_API_URL** | `https://uk-travel-backend.onrender.com/api` |

---

## 📁 Frontend Configuration Files

### **frontend/package.json**
```json
{
  "name": "repido-frontend",
  "type": "module",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "dev": "vite",
    "start": "node server.js",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^4.5.3"
  }
}
```

### **frontend/.node-version**
```
18.20.2
```

### **frontend/.nvmrc**
```
18.20.2
```

### **frontend/server.js**
```javascript
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
  console.log(`📍 Live Backend: https://uk-travel-backend.onrender.com/api`)
})
```

---

## 🔧 Why This Configuration Works

### **Root Cause (Fixed)**
- ❌ **Before**: Render couldn't find `/node_modules/vite/dist/node/cli.js` because it was looking in wrong path
- ✅ **After**: `rootDir: frontend` tells Render to work inside frontend/ folder where package.json is located

### **Key Points**
1. **Monorepo Structure**: Backend and frontend in separate folders
2. **rootDir: frontend**: Render clones repo, then cd's into frontend/ for npm install & build
3. **Vite 4.5.3**: Stable version, fully compatible with Node 18
4. **Express Server**: Serves static dist/ files + handles SPA routing
5. **Node 18.20.2**: LTS version, perfect compatibility

---

## ✅ Deployment Checklist

- [x] Frontend moved to `frontend/` folder
- [x] `render.yaml` has `rootDir: frontend`
- [x] `frontend/.node-version` = 18.20.2
- [x] `frontend/.nvmrc` = 18.20.2
- [x] `frontend/package.json` has correct scripts
- [x] `frontend/server.js` uses ESM + Express
- [x] `vite`: `^4.5.3` in devDependencies
- [x] Local build tested: ✓ built in 11.29s
- [x] Pushed to GitHub with proper structure

---

## 🚀 Next Steps

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Select**: `uk-travel-frontend` service
3. **Click**: Manual Deploy (or wait for auto-deploy from GitHub)
4. **Expected Result**: 
   - Build succeeds
   - Frontend goes live at: https://uk-travel-frontend.onrender.com
   - Can connect to backend API: https://uk-travel-backend.onrender.com/api

---

## 📊 Final Status

| Component | Status | Details |
|-----------|--------|---------|
| **Project Structure** | ✅ | Monorepo with separate frontend/ |
| **Node Version** | ✅ | 18.20.2 (LTS) |
| **Vite Version** | ✅ | 4.5.3 (stable) |
| **Render Config** | ✅ | rootDir set to frontend |
| **Local Build** | ✅ | Works perfectly |
| **Git Push** | ✅ | Pushed to GitHub |
| **Ready for Deploy** | ✅ | **YES - Go deploy now!** |

---

## 🆘 If Still Having Issues

**Error**: `Cannot find module vite/dist/node/cli.js`
- **Solution**: Make sure Render rootDir is set to `frontend` (not empty, not `/`)

**Error**: Port 3000 already in use
- **Solution**: Render will auto-assign a port. Don't hardcode 3000 in production

**Error**: Build timeout
- **Solution**: Render Free plan has 15-min limit. Local build should complete in <1min

---

## 📞 Contact

If deployment still fails, provide:
1. Full Render build log (copy-paste)
2. Confirm `rootDir: frontend` is set in Render
3. Confirm you pushed latest code to GitHub
