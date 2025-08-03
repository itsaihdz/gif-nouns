require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...');
  console.log('=====================================');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || supabaseUrl === 'https://your-project-url.supabase.co') {
    console.log('❌ NEXT_PUBLIC_SUPABASE_URL not configured');
    console.log('   Please update .env.local with your Supabase URL');
    return;
  }
  
  if (!supabaseKey || supabaseKey === 'your-anon-key-here') {
    console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not configured');
    console.log('   Please update .env.local with your Supabase anon key');
    return;
  }
  
  console.log('✅ Environment variables found');
  console.log(`📡 URL: ${supabaseUrl}`);
  console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...`);
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('\n🔄 Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('gallery_items')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:');
      console.log(`   Error: ${error.message}`);
      
      if (error.message.includes('relation "gallery_items" does not exist')) {
        console.log('\n💡 Solution: Run the database schema');
        console.log('   1. Go to your Supabase SQL Editor');
        console.log('   2. Copy the content from supabase-schema.sql');
        console.log('   3. Paste and run it');
      }
      
      return;
    }
    
    console.log('✅ Database connection successful!');
    
    // Test gallery items
    console.log('\n🖼️ Testing gallery items...');
    const { data: items, error: itemsError } = await supabase
      .from('gallery_items')
      .select('*')
      .limit(5);
    
    if (itemsError) {
      console.log('❌ Failed to fetch gallery items:', itemsError.message);
      return;
    }
    
    console.log(`✅ Found ${items.length} gallery items`);
    
    // Test votes table
    console.log('\n🗳️ Testing votes table...');
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('*')
      .limit(5);
    
    if (votesError) {
      console.log('❌ Failed to fetch votes:', votesError.message);
      
      if (votesError.message.includes('vote_type')) {
        console.log('\n💡 Solution: The votes table schema needs to be updated');
        console.log('   Run the updated schema from supabase-schema.sql');
      }
      return;
    }
    
    console.log(`✅ Found ${votes.length} votes`);
    
    // Test users table
    console.log('\n👥 Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      console.log('❌ Failed to fetch users:', usersError.message);
      return;
    }
    
    console.log(`✅ Found ${users.length} users`);
    
    console.log('\n🎉 All tests passed! Supabase is properly configured.');
    console.log('\n📊 Summary:');
    console.log(`   - Gallery items: ${items.length}`);
    console.log(`   - Votes: ${votes.length}`);
    console.log(`   - Users: ${users.length}`);
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your Supabase URL and key');
    console.log('   2. Ensure your Supabase project is active');
    console.log('   3. Check if your IP is allowed (if using IP restrictions)');
  }
}

testSupabaseConnection(); 