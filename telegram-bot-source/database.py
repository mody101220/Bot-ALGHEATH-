import sqlite3
import os
from datetime import datetime
from config import DB_PATH

def init_db():
    """Initializes the SQLite schema if it doesn't already exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Enable Write-Ahead Logging for high concurrent read-write performance
    cursor.execute("PRAGMA journal_mode=WAL;")
    
    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT,
        full_name TEXT,
        joined_at TEXT NOT NULL,
        is_premium INTEGER DEFAULT 0,
        referred_by INTEGER,
        stars_balance INTEGER DEFAULT 0,
        free_uses_left INTEGER DEFAULT 5,
        daily_login_checked TEXT
    );
    """)
    
    # 2. Referrals Analytics
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS referrals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referred_id INTEGER UNIQUE,
        referrer_id INTEGER,
        earned_stars INTEGER DEFAULT 0,
        rewarded_at TEXT NOT NULL,
        FOREIGN KEY (referred_id) REFERENCES users(user_id),
        FOREIGN KEY (referrer_id) REFERENCES users(user_id)
    );
    """)

    # 3. Custom Affiliate Offers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS affiliate_offers (
        offer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        affiliate_link TEXT NOT NULL,
        payout_description TEXT,
        clicks INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        revenue_earned REAL DEFAULT 0.0,
        is_active INTEGER DEFAULT 1
    );
    """)

    # 4. Content Scheduler
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS posts_scheduler (
        post_id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL, -- 'Telegram', 'TikTok', 'Instagram'
        title TEXT,
        body TEXT NOT NULL,
        scheduled_for TEXT NOT NULL, -- ISO Format
        is_published INTEGER DEFAULT 0,
        prompt_used TEXT
    );
    """)

    # 5. Star Purchases Ledger
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payments_ledger (
        payment_id TEXT PRIMARY KEY,
        user_id INTEGER,
        amount_stars INTEGER,
        purpose TEXT,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
    """)
    
    conn.commit()
    conn.close()

class Database:
    def __init__(self):
        self.db_path = DB_PATH

    def _execute(self, query, params=(), commit=False, fetch="all"):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        try:
            cursor.execute(query, params)
            if commit:
                conn.commit()
            if fetch == "all":
                return cursor.fetchall()
            elif fetch == "one":
                return cursor.fetchone()
            return None
        finally:
            conn.close()

    # User-centric queries
    def get_or_create_user(self, user_id, username, full_name, referred_by=None):
        existing = self._execute("SELECT * FROM users WHERE user_id = ?", (user_id,), fetch="one")
        if existing:
            return existing
        
        joined = datetime.utcnow().isoformat()
        ref = None
        if referred_by and referred_by != user_id:
            # Verify referrer exists
            ref_exists = self._execute("SELECT user_id FROM users WHERE user_id = ?", (referred_by,), fetch="one")
            if ref_exists:
                ref = referred_by
                
        self._execute(
            "INSERT INTO users (user_id, username, full_name, joined_at, referred_by) VALUES (?, ?, ?, ?, ?)",
            (user_id, username, full_name, joined, ref),
            commit=True
        )
        
        if ref:
            # Log referral and reward base points
            self._execute(
                "INSERT INTO referrals (referred_id, referrer_id, earned_stars, rewarded_at) VALUES (?, ?, ?, ?)",
                (user_id, ref, 50, joined),
                commit=True
            )
            self._execute(
                "UPDATE users SET stars_balance = stars_balance + 50 WHERE user_id = ?",
                (ref,),
                commit=True
            )
            
        return self._execute("SELECT * FROM users WHERE user_id = ?", (user_id,), fetch="one")

    def upgrade_to_premium(self, user_id):
        self._execute("UPDATE users SET is_premium = 1 WHERE user_id = ?", (user_id,), commit=True)
        # Give lifetime commissions allocation
        user_info = self._execute("SELECT referred_by FROM users WHERE user_id = ?", (user_id,), fetch="one")
        if user_info and user_info[0]:
            ref_id = user_info[0]
            commission_stars = int(250 * 0.25) # 25% of premium cost
            self._execute(
                "UPDATE users SET stars_balance = stars_balance + ? WHERE user_id = ?",
                (commission_stars, ref_id),
                commit=True
            )

    def deduct_usage(self, user_id):
        user = self._execute("SELECT is_premium, free_uses_left FROM users WHERE user_id = ?", (user_id,), fetch="one")
        if not user:
            return False
        is_premium, free_uses = user
        if is_premium:
            return True # Infinite AI credits for premiums
        if free_uses > 0:
            self._execute("UPDATE users SET free_uses_left = free_uses_left - 1 WHERE user_id = ?", (user_id,), commit=True)
            return True
        return False

    def get_stats(self):
        total_users = self._execute("SELECT COUNT(*) FROM users", fetch="one")[0]
        premium_users = self._execute("SELECT COUNT(*) FROM users WHERE is_premium = 1", fetch="one")[0]
        stars_sold = self._execute("SELECT SUM(amount_stars) FROM payments_ledger", fetch="one")[0] or 0
        referrals_count = self._execute("SELECT COUNT(*) FROM referrals", fetch="one")[0]
        return {
            "total_users": total_users,
            "premium_users": premium_users,
            "stars_sold": stars_sold,
            "referrals": referrals_count,
        }
