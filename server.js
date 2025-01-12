const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec, execFile } = require('child_process');
const os = require('os');




const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'HomePageQuartz/Homepage')));


app.post('/api/build-installer', (req, res) => {
    const electronAppPath = path.join(__dirname, 'quartz');

    const platform = os.platform();

    if (platform == 'win32') {
        const installerPath = path.join(electronAppPath, 'out', 'make', 'squirrel.windows', 'x64');
        const files = fs.readdirSync(installerPath);
        const setupFile = files.find(file => file.endsWith('.exe'));
    
        
        
        execFile(path.join(installerPath, setupFile), (error, stdout, stderr) => {
            if (error) {
            console.error(`Error executing installer: ${error.message}`);
            return res.status(500).json({ message: 'Failed to execute installer.' });
            }
            if (stderr) {
            console.error(`stderr: ${stderr}`);
            }
            return res.status(200).json({ message: 'Installer executed successfully.' });
            
        })
    }

});



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'HomePageQuartz/Homepage', 'index.html'));
});



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
