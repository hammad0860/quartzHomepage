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


app.get('/api/build-installer', (req, res) => {
    const electronAppPath = path.join(__dirname, 'quartz');
    const platform = os.platform();
    const command = 'npm run make';



    // Checks if the installer already exists for different Os systems
    //Creates the installer if it does not exist
    if (platform == "win32"){
        const installationPath = path.join(electronAppPath, 'out', 'make', 'squirrel.windows', 'x64');
        if (!fs.existsSync(installationPath)) {
           execSync(command);
        }

    }
    else if (platform == "darwin"){
        const installationPath = path.join(electronAppPath, 'out', 'make');
        if (!fs.existsSync(installationPath)){
            const files = fs.readdirSync(installationPath);
            const dmgFile = files.find(file => file.endsWith('.dmg'));
            if (!dmgFile){
                execSync(command);
            } 
        
         }

    }
    else {
        const installationPath = path.join(electronAppPath, 'out', 'make');
        if (!fs.existsSync(installationPath)){
            const files = fs.readdirSync(installationPath);
            const dmgFile = files.find(file => file.endsWith('.deb'));
            if (!dmgFile){
                execSync(command);
            } 
        
         }
    }




    
    // Saves the installer based for Windows
    if (platform == 'win32') {
        const installerPath = path.join(electronAppPath, 'out', 'make', 'squirrel.windows', 'x64');
        const files = fs.readdirSync(installerPath);
        const setupFile = files.find(file => file.endsWith('.exe'));
        const setupFullPath = path.join(installerPath, setupFile);  
        
        
        return res.download(setupFullPath, setupFile, (err) => {
            if (err) {
                console.error(`Error downloading Windows installer: ${err.message}`);
                return res.status(500).json({ message: 'Failed to download Windows installer.' });
            }
        });
    }

    // Saves the installer based for Mac
    else if (platform === 'darwin') {
        const installerPath = path.join(electronAppPath, 'out', 'make');
        const files = fs.readdirSync(installerPath);
        const dmgFile = files.find(file => file.endsWith('.dmg'));
        const dmgFullPath = path.join(installerPath, dmgFile);

       
        return res.download(dmgFullPath, dmgFile, (err) => {
            if (err) {
                console.error(`Error downloading Mac installer: ${err.message}`);
                return res.status(500).json({ message: 'Failed to download Mac installer.' });
            }
        });
    }


    
    // Saves the installer based for Linux
    else if (platform === 'linux') {
        const installerPath = path.join(electronAppPath, 'out', 'make');
        const files = fs.readdirSync(installerPath);
        const debFile = files.find(file => file.endsWith('.deb'));
        const debFullPath = path.join(installerPath, debFile);
    
        return res.download(debFullPath, debFile, (err) => {
            if (err) {
                console.error(`Error downloading Linux installer: ${err.message}`);
                return res.status(500).json({ message: 'Failed to download Linux installer.' });
            }
        });
    }

});



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'HomePageQuartz/Homepage', 'index.html'));
});



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });



