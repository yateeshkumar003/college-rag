# CollegeRAG Deployment

This project deploys as two separate services:
* **Backend:** Render Web Service (run from `server/`)
* **Frontend:** Vercel project (run from `client/`)
* **Databases:** MongoDB Atlas (document store) and Pinecone (vector index)

---

## 1. Prepare the Repository

Before deploying, confirm that all credentials and local secrets are ignored from Git tracking. Check your `.gitignore` files to ensure they do not upload local `.env` keys.

```bash
git init
git status
git add .
git commit -m "feat: project ready for production deployment"
git branch -M main
git remote add origin https://github.com/yateeshkumar003/college-rag.git
git push -u origin main
```

> [!WARNING]
> Do not stage or push `server/.env` or any file containing passwords or active API keys to GitHub. If the database password in your local `.env` has been pushed, immediately rotate the user credentials inside your MongoDB Atlas dashboard before proceeding.

---

## 2. Deploy the Backend on Render

Render hosts the Node.js/Express server application.

### Connection Steps:
1. Log in to [Render](https://render.com/) using your GitHub account.
2. Click **New** → **Web Service**.
3. Select your `college-rag` repository and click **Connect**.
4. Configure the Web Service settings:
   * **Name:** `collegerag-backend`
   * **Region:** Choose your preferred region.
   * **Branch:** `main`
   * **Root Directory:** `server` *(Tells Render to build from the server folder)*
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node src/server.js`
   * **Instance Type:** `Free`

### Environment Variables:
Under the **Environment Variables** section, add the following key-value pairs. 

> [!TIP]
> You can open the local file **[`deploy_keys.txt`](file:///c:/Users/yatee/OneDrive/Desktop/collagerag/deploy_keys.txt)** in VS Code to easily copy and paste your actual production database connections, Gemini API keys, and Pinecone credentials (this file is gitignored for security).

| Key | Value / Example |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://<username>:<password>@cluster.mongodb.net/collagerag` |
| `JWT_SECRET` | *Use a secure, random string (e.g., `SuperSecretSecureJWTKey123!`)* |
| `JWT_EXPIRES_IN` | `7d` |
| `GEMINI_API_KEY` | *Your Gemini API Key (starts with `AQ.` or `AIzaSy`)* |
| `GEMINI_MODEL` | `gemini-3.6-flash` |
| `PINECONE_API_KEY` | *Your Pinecone API Key (starts with `pcsk_`)* |
| `PINECONE_INDEX` | `collagerag-index` |
| `PINECONE_NAMESPACE` | `college-docs` |
| `CLIENT_URL` | *Leave empty temporarily. We will fill this after deploying the frontend.* |

5. Click **Create Web Service**. Once deployed, Render will generate a public URL (e.g., `https://collegerag-backend.onrender.com`). **Copy this URL.**

---

## 3. Deploy the Frontend on Vercel

Vercel is optimized for building and serving Next.js client pages.

### Connection Steps:
1. Log in to [Vercel](https://vercel.com/) using your GitHub account.
2. Click **Add New** → **Project**.
3. Locate `college-rag` in your imports list and click **Import**.
4. Configure Project settings:
   * **Framework Preset:** `Next.js`
   * **Root Directory:** Click **Edit** and choose the `client` folder.
   * **Build and Output Settings:** Leave default.

### Environment Variables:
Under the **Environment Variables** section, add:

* **Key:** `NEXT_PUBLIC_API_URL`
* **Value:** `https://collegerag-backend.onrender.com/api` *(Make sure to use your actual Render backend URL, appending `/api` at the end!)*

5. Click **Deploy**. Vercel will build the frontend and provide you with a public URL (e.g., `https://college-rag-frontend.vercel.app`). **Copy this URL.**

---

## 4. Connect Services (CORS Mapping)

For safety, the backend blocks requests from outside domains unless specified:

1. Open your **Render Dashboard** and click on your `collegerag-backend` Web Service.
2. Go to **Settings** → **Environment Variables**.
3. Update the **`CLIENT_URL`** key to point to your live Vercel address:
   * `CLIENT_URL` = `https://college-rag-frontend.vercel.app`
4. Save the changes. Render will automatically redeploy the backend.

---

## 5. Verify the Live System

Open your Vercel URL in your browser:
1. Go to `/register` and create a student account.
2. Sign in as Admin (`admin@college.edu` / `adminpassword123`) to upload guidelines PDFs.
3. Access `/chat` to ask grounded questions and confirm that sources cite correctly!
