import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey:        import.meta.env.VITE_FIREBASE_API_KEY        || 'demo-key',
  authDomain:    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN    || 'demo.firebaseapp.com',
  databaseURL:   import.meta.env.VITE_FIREBASE_DATABASE_URL   || 'https://demo-default-rtdb.firebaseio.com',
  projectId:     import.meta.env.VITE_FIREBASE_PROJECT_ID     || 'demo-project',
}

let app, db

try {
  app = initializeApp(firebaseConfig)
  db  = getDatabase(app)
} catch (e) {
  // Silently degrade — demo runs without Firebase
  db = null
}

export { db }
