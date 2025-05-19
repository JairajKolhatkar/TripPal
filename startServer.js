const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

// Create a temporary directory without spaces
const tempDir = path.join(os.tmpdir(), 'trippal_db');

// Ensure the directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Copy the db.json file to the temp directory
const sourceDbPath = path.join(__dirname, 'db.json');
const targetDbPath = path.join(tempDir, 'db.json');

try {
  // Read the original db.json
  const dbContent = fs.readFileSync(sourceDbPath, 'utf8');
  
  // Write to the temp location
  fs.writeFileSync(targetDbPath, dbContent);
  
  console.log(`Database copied to: ${targetDbPath}`);
  
  // Start the JSON server from the temp directory
  const serverProcess = exec(`npx json-server --watch ${targetDbPath} --port 3001`, 
    { cwd: tempDir },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting server: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Server stderr: ${stderr}`);
      }
    }
  );
  
  // Handle server output
  serverProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  // Handle server exit
  serverProcess.on('exit', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
  
  console.log('JSON Server started. Press Ctrl+C to stop.');
  
} catch (error) {
  console.error(`Error: ${error.message}`);
} 