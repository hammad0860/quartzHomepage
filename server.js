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

    // Executes the installer based for Windows
    if (platform == 'win32') {
        const installerPath = path.join(electronAppPath, 'out', 'make', 'squirrel.windows', 'x64');
        const files = fs.readdirSync(installerPath);
        const setupFile = files.find(file => file.endsWith('.exe'));
    
        
        
        execFile(path.join(installerPath, setupFile), (error, stdout, stderr) => {
            if (error) {
            console.error(`Error executing Windows installer: ${error.message}`);
            return res.status(500).json({ message: 'Failed to execute Windows installer.' });
            }
            if (stderr) {
            console.error(`stderr: ${stderr}`);
            }
            return res.status(200).json({ message: 'Windows Installer executed successfully.' });

        })
    }

    // Executes the installer based for Mac
    else if (platform === 'darwin') {
        const installerPath = path.join(electronAppPath, 'out', 'make', 'dmg');
        const files = fs.readdirSync(installerPath);
        const dmgFile = files.find(file => file.endsWith('.dmg'));
    
       
        execFile('open', [path.join(installerPath, dmgFile)], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Mac installer: ${error.message}`);
                return res.status(500).json({ message: 'Failed to execute Mac installer.' });
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            console.log('Mac installer executed successfully.');
            return res.status(200).json({ message: 'Mac installer executed successfully.' });
        });
    }


    
    // Executes the installer based for Linux
    else if (platform === 'linux') {
        const installerPath = path.join(electronAppPath, 'out', 'make', 'deb');
        const files = fs.readdirSync(installerPath);
        const debFile = files.find(file => file.endsWith('.deb'));
    
    
        const debFullPath = path.join(installerPath, debFile);
    
        execFile('sudo', ['dpkg', '-i', debFullPath], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Linux installer: ${error.message}`);
                return res.status(500).json({ message: 'Failed to execute Linux Installer' });
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            console.log('Linux installer executed successfully.');
            return res.status(200).json({ message: 'Linux installer executed successfully.' });
        });
    }

});



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'HomePageQuartz/Homepage', 'index.html'));
});



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
