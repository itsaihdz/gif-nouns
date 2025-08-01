#!/usr/bin/env node

// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('================================');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.log('Please run: ./setup-env.sh');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔌 Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('gallery_items')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      
      if (error.message.includes('relation "gallery_items" does not exist')) {
        console.log('\n💡 The database schema hasn\'t been set up yet.');
        console.log('Please run the SQL commands from supabase-schema.sql in your Supabase dashboard.');
      }
      
      return;
    }
    
    console.log('✅ Database connection successful!');
    
    // Test gallery items
    const { data: items, error: itemsError } = await supabase
      .from('gallery_items')
      .select('*')
      .limit(5);
    
    if (itemsError) {
      console.error('❌ Error fetching gallery items:', itemsError.message);
      return;
    }
    
    console.log(`✅ Found ${items.length} gallery items`);
    
    // Test users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
      return;
    }
    
    console.log(`✅ Found ${users.length} users`);
    
    console.log('\n🎉 Supabase is working perfectly!');
    console.log('Your app is ready to use real data.');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testConnection(); 