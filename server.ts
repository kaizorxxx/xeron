import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from 'redis';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Redis Client
let redisUrl = process.env.REDIS_URL || 'redis-10906.crce194.ap-seast-1-1.ec2.cloud.redislabs.com:10906';
if (redisUrl && !redisUrl.includes('://')) {
  redisUrl = `redis://${redisUrl}`;
}

const redisClient = createClient({
  url: redisUrl
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Supabase Client for Auth Verification
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  supabaseUrl = 'https://nfwtvtwsjuezxtajbdor.supabase.co';
}

if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5md3R2dHdzanVlenh0YWpiZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTI4MDksImV4cCI6MjA4Nzg2ODgwOX0.uRFVCMJk0BFKcMt-ojSjif2zyad8tfkkSto1SXUzap8';
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase not configured. Using mock authentication.');
}

const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co') 
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getUser: async (token: string) => {
          if (token === 'mock-token') {
             return { data: { user: { id: 'mock-user-id', email: 'mock@example.com' } }, error: null };
          }
          return { data: { user: null }, error: { message: 'Invalid token' } };
        }
      }
    } as any;

async function startServer() {
  // Connect to Redis
  try {
    if (redisUrl) {
      await redisClient.connect();
      console.log('Connected to Redis');
    } else {
      console.warn('REDIS_URL not set. Redis features will be disabled/mocked.');
    }
  } catch (e) {
    console.error('Failed to connect to Redis:', e);
  }

  // API Routes
  
  // Get Balance
  app.get('/api/balance', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    try {
      if (!redisClient.isOpen) {
        return res.json({ balance: 0, source: 'mock' });
      }

      const balance = await redisClient.get(`balance:${user.id}`);
      return res.json({ balance: balance ? parseInt(balance.toString()) : 0, source: 'redis' });
    } catch (e) {
      console.error('Redis error:', e);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Initialize Balance (called after signup)
  app.post('/api/balance/init', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    try {
      if (redisClient.isOpen) {
        // Set initial balance to 0 if not exists
        const exists = await redisClient.exists(`balance:${user.id}`);
        if (!exists) {
          await redisClient.set(`balance:${user.id}`, '0');
        }
      }
      return res.json({ success: true });
    } catch (e) {
      console.error('Redis error:', e);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Deposit (Mock for now, just updates Redis)
  app.post('/api/deposit', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    try {
      if (redisClient.isOpen) {
        await redisClient.incrBy(`balance:${user.id}`, amount);
        const newBalance = await redisClient.get(`balance:${user.id}`);
        return res.json({ balance: parseInt(newBalance?.toString() || '0') });
      } else {
        return res.json({ balance: amount, source: 'mock' });
      }
    } catch (e) {
      console.error('Redis error:', e);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
