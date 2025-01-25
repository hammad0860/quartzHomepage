const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec, execFile } = require('child_process');
const os = require('os');
const { execSync } = require('child_process');
const AdmZip = require("adm-zip");



const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'HomePageQuartz/Homepage')));



// Route for downloading the installer
app.get('/api/download-installer', (req, res) => {
    const platform = os.platform();

    // Hosted installer file URLs for different platforms
    const hostedInstallers = {
        win32: 'https://myriade-installers.nyc3.digitaloceanspaces.com/Myriade-1.0.0%20Setup.exe',
       // darwin: '
       // linux: 
    };

    // Select the appropriate installer for the platform
    const installerURL = hostedInstallers[platform];
   
    if (installerURL) {
        return res.redirect(installerURL);
    } else {
        return res.status(400).json({ message: 'Unsupported platform' });
    }
});



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'HomePageQuartz/Homepage', 'index.html'));
});



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });



