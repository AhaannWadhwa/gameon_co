const fs = require('fs');
const path = require('path');

// Try to read .env.local
try {
  const envLocal = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
  console.log('.env.local found');
  const lines = envLocal.split('\n');
  let clientId = null;
  let clientSecret = null;
  
  lines.forEach(line => {
    if (line.startsWith('GOOGLE_CLIENT_ID=')) {
      clientId = line.split('=')[1].trim();
      const raw = line.split('=')[1];
      console.log(`GOOGLE_CLIENT_ID raw length: ${raw.length}`);
    }
    if (line.startsWith('GOOGLE_CLIENT_SECRET=')) {
      clientSecret = line.split('=')[1].trim();
    }
  });

  if (clientId) {
    console.log(`GOOGLE_CLIENT_ID found: ${clientId.substring(0, 10)}...`);
    console.log(`GOOGLE_CLIENT_ID contains quotes: ${clientId.includes('"') || clientId.includes("'")}`);
    console.log(`GOOGLE_CLIENT_ID length: ${clientId.length}`);
    
    // Check for common issues
    if (clientId.includes(' ')) console.log('WARNING: GOOGLE_CLIENT_ID contains spaces');
    if (!clientId.endsWith('.apps.googleusercontent.com') && !clientId.endsWith('.apps.googleusercontent.com"')) console.log('WARNING: GOOGLE_CLIENT_ID does not end with .apps.googleusercontent.com');
  } else {
    console.log('GOOGLE_CLIENT_ID NOT found in .env.local');
  }

  if (clientSecret) {
    console.log('GOOGLE_CLIENT_SECRET found');
  } else {
    console.log('GOOGLE_CLIENT_SECRET NOT found in .env.local');
  }

} catch (e) {
  console.log('.env.local NOT found or could not be read');
  
  try {
    const env = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    console.log('.env found');
    const lines = env.split('\n');
    let clientId = null;
    let clientSecret = null;
    
    lines.forEach(line => {
        if (line.startsWith('GOOGLE_CLIENT_ID=')) {
        clientId = line.split('=')[1].trim();
        const raw = line.split('=')[1];
        console.log(`GOOGLE_CLIENT_ID raw length: ${raw.length}`);
        }
        if (line.startsWith('GOOGLE_CLIENT_SECRET=')) {
        clientSecret = line.split('=')[1].trim();
        }
    });

    if (clientId) {
        console.log(`GOOGLE_CLIENT_ID found in .env: ${clientId.substring(0, 10)}...`);
        console.log(`GOOGLE_CLIENT_ID contains quotes: ${clientId.includes('"') || clientId.includes("'")}`);
        console.log(`GOOGLE_CLIENT_ID length: ${clientId.length}`);
        
        // Check for common issues
        if (clientId.includes(' ')) console.log('WARNING: GOOGLE_CLIENT_ID contains spaces');
        if (!clientId.endsWith('.apps.googleusercontent.com') && !clientId.endsWith('.apps.googleusercontent.com"')) console.log('WARNING: GOOGLE_CLIENT_ID does not end with .apps.googleusercontent.com');
    } else {
        console.log('GOOGLE_CLIENT_ID NOT found in .env');
    }

    if (clientSecret) {
        console.log('GOOGLE_CLIENT_SECRET found in .env');
    } else {
        console.log('GOOGLE_CLIENT_SECRET NOT found in .env');
    }
  } catch (err) {
    console.log('.env also NOT found or could not be read');
  }
}
