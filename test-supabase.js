#!/usr/bin/env node

// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Updated Supabase configuration
const supabaseUrl = 'https://zidivolizgoabfdkuybi.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_KEY environment variable is not set');
  console.log('Please set your Supabase key:');
  console.log('export SUPABASE_KEY=your_supabase_anon_key_here');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('🔗 Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 10)}...` : 'NOT SET');

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('gallery_items')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      
      if (error.message.includes('relation "gallery_items" does not exist')) {
        console.log('\n📋 Database tables need to be created. Please run the schema setup.');
        console.log('You can run the SQL from supabase-schema.sql in your Supabase dashboard.');
      }
      
      return false;
    }

    console.log('✅ Supabase connection successful!');
    console.log('✅ Database is accessible');
    
    // Test gallery items table
    const { data: items, error: itemsError } = await supabase
      .from('gallery_items')
      .select('*')
      .limit(5);

    if (itemsError) {
      console.error('❌ Error fetching gallery items:', itemsError.message);
    } else {
      console.log(`✅ Gallery items table accessible (${items?.length || 0} items found)`);
    }

    // Test users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
    } else {
      console.log(`✅ Users table accessible (${users?.length || 0} users found)`);
    }

    return true;
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

async function createSampleData() {
  console.log('\n📝 Creating sample data...');
  
  try {
    // Create a sample user
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({
        fid: 99999,
        username: 'test.noun',
        display_name: 'Test User',
        pfp: '',
        follower_count: 10,
        following_count: 15
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Error creating test user:', userError.message);
    } else {
      console.log('✅ Test user created:', user.username);
    }

    // Create a sample gallery item
    const { data: item, error: itemError } = await supabase
      .from('gallery_items')
      .insert({
        gif_url: '/api/generate-gif?demo=test',
        creator_fid: 99999,
        creator_username: 'test.noun',
        creator_pfp: '',
        title: 'Test Creation',
        noggle_color: 'blue',
        eye_animation: 'nouns',
        votes: 0
      })
      .select()
      .single();

    if (itemError) {
      console.error('❌ Error creating test gallery item:', itemError.message);
    } else {
      console.log('✅ Test gallery item created:', item.title);
    }

  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  }
}

async function main() {
  console.log('🚀 Supabase Connection Test\n');
  
  const isConnected = await testSupabaseConnection();
  
  if (isConnected) {
    await createSampleData();
    console.log('\n🎉 Supabase is ready to use!');
  } else {
    console.log('\n❌ Please fix the connection issues before proceeding.');
  }
}

main().catch(console.error); 