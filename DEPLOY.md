# Deploy Naapurusto to GitHub Pages

## One-time setup (5 minutes)

### 1. Create a GitHub repository named `naapurusto`

Go to https://github.com/new and create a new **public** repo named exactly `naapurusto`.

### 2. Push the project

Open Terminal, `cd` into this folder, then run:

```bash
git init
git add .
git commit -m "Initial Naapurusto MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/naapurusto.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3. Enable GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

### 4. Add the deployment workflow

Create the file `.github/workflows/deploy.yml` in your project with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Commit and push that file. GitHub Actions will build and deploy automatically.

### 5. Your live URL

```
https://YOUR_USERNAME.github.io/naapurusto/
```

The first deploy takes ~2 minutes. After that, every `git push main` redeploys automatically.

---

## Local development

```bash
npm install
npm run dev
```

Opens at http://localhost:5173/naapurusto/

---

## Project structure

```
src/
  App.jsx              — root component, state, routing
  data/mock.js         — all mock data (posts, ideas, community stats)
  components/
    Header.jsx         — top bar + neighbourhood selector
    BottomNav.jsx      — 4-tab navigation
    FeedView.jsx       — main feed with filter pills
    PostCard.jsx       — individual post card
    PostModal.jsx      — expanded post detail sheet
    CreatePost.jsx     — create post drawer
    ReportView.jsx     — anonymous report form + recent reports
    IdeasView.jsx      — ideas & voting
    CommunityView.jsx  — neighbourhood stats & contributors
    Icons.jsx          — inline SVG icon set
```

## Replacing mock data with real data

When you're ready to connect a real backend:
- Replace `src/data/mock.js` exports with Firebase Firestore queries
- Add Firebase Auth for user login
- The component interfaces stay the same — just swap the data source
