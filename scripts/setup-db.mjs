// Run this script to set up the Supabase database schema
// Usage: node scripts/setup-db.mjs

const SUPABASE_URL = "https://gyzuvaimzanyvgyshzqj.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5enV2YWltemFueXZneXNoenFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjMxMzU1NywiZXhwIjoyMDg3ODg5NTU3fQ.K8tYBObQU0gu0oTsW4f-zPJBpm8O4qs9I_kZdAtMjVw";

const statements = [
    `CREATE TABLE IF NOT EXISTS chat_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT,
    is_guest BOOLEAN DEFAULT true,
    avatar_color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ DEFAULT now()
  )`,
    `CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES chat_users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active','archived')),
    last_message TEXT,
    last_activity TIMESTAMPTZ DEFAULT now(),
    admin_unread INT DEFAULT 0,
    user_unread INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
  )`,
    `CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user','admin')),
    sender_id UUID,
    text TEXT NOT NULL CHECK (char_length(text) <= 2000),
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
  )`,
    `CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    is_admin BOOLEAN DEFAULT false,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
  )`,
    `CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_conversations_activity ON conversations(last_activity DESC)`,
    `ALTER TABLE chat_users ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE conversations ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE messages ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_messages') THEN CREATE POLICY anon_read_messages ON messages FOR SELECT TO anon USING (true); END IF; END $$`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_conversations') THEN CREATE POLICY anon_read_conversations ON conversations FOR SELECT TO anon USING (true); END IF; END $$`,
];

async function run() {
    console.log("Setting up chat database schema...\n");
    for (const sql of statements) {
        const label = sql.substring(0, 60).replace(/\s+/g, " ").trim();
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: SERVICE_ROLE_KEY,
                    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
                    Prefer: "return=minimal",
                },
                body: JSON.stringify({}),
            });
            // Use the SQL editor endpoint instead
        } catch (e) {
            // Will use pg endpoint
        }

        // Use Supabase SQL endpoint
        const res = await fetch(`${SUPABASE_URL}/pg`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apikey: SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({ query: sql }),
        });

        if (!res.ok) {
            // Try management API
            const res2 = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: SERVICE_ROLE_KEY,
                    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
                },
                body: JSON.stringify({ sql }),
            });

            if (!res2.ok) {
                console.log(`⚠ ${label}... (may need manual execution)`);
                continue;
            }
        }
        console.log(`✓ ${label}...`);
    }

    console.log("\n✅ Schema setup attempted. If any failed, run supabase-schema.sql in the Supabase SQL Editor.");
}

run().catch(console.error);
