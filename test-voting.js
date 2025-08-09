// Clear localStorage and test voting from a clean state
console.log('🧹 Clearing localStorage...');
localStorage.removeItem('gifnouns_user');
localStorage.removeItem('gifnouns_user_votes');

console.log('📝 Instructions for testing:');
console.log('1. Vote up on a GIF - should show (1, 0)');
console.log('2. Vote down on same GIF - should show (0, 1)');
console.log('3. Vote up again - should show (1, 0)');
console.log('4. Vote up again - should show (0, 0)');
console.log('');
console.log('Watch the console for debugging logs that start with 🔍, 🔄, 📊');
console.log('localStorage cleared - you should get a new user session');
