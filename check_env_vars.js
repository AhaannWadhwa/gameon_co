require('dotenv').config();

console.log('--- DOTENV LOADED ---');
const clientId = process.env.GOOGLE_CLIENT_ID;
console.log(`GOOGLE_CLIENT_ID: ${clientId}`);
if (clientId) {
  console.log(`Length: ${clientId.length}`);
  console.log(`Contains quotes: ${clientId.includes('"') || clientId.includes("'")}`);
} else {
  console.log('GOOGLE_CLIENT_ID is undefined');
}

const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (clientSecret) {
    console.log(`GOOGLE_CLIENT_SECRET is set (length ${clientSecret.length})`);
    console.log(`Contains quotes: ${clientSecret.includes('"') || clientSecret.includes("'")}`);
}
