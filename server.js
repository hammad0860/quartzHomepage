const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec, execFile } = require('child_process');




const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'HomePageQuartz/Homepage')));


app.post('/api/build-installer', (req, res) => {
    const electronAppPath = path.join(__dirname, 'quartz');

    const installerPath = path.join(electronAppPath, 'out', 'make', 'squirrel.windows', 'x64');
    const windowsDirectory = path.join(electronAppPath, 'out', 'make', 'squirrel.windows');
    const command = 'npm run make';  

    //Checks if the installer has already been built
    if (!(fs.existsSync(windowsDirectory))) {
        
        const env = {
            ...process.env,
            TMP: 'C:\\TempElectron',
            TEMP: 'C:\\TempElectron',
          };

        exec(command, { cwd: electronAppPath, env }, (error, stdout, stderr) => {
            if (error) {
            console.error(`Error building installer: ${error.message}`);
            return res.status(500).json({ message: 'Build failed.' });
            }
            if (stderr) {
            console.error(`stderr: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);


        const files = fs.readdirSync(installerPath);
        const setupFile = files.find(file => file.endsWith('.exe'));
    
        //Executes the installer for windows
        execFile(path.join(installerPath, setupFile), (error, stdout, stderr) => {
            if (error) {
            console.error(`Error executing installer: ${error.message}`);
            return res.status(500).json({ message: 'Failed to execute installer.' });
            }
            if (stderr) {
            console.error(`stderr: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);
        })
     });

    }
    else {
        const files = fs.readdirSync(installerPath);
        const setupFile = files.find(file => file.endsWith('.exe'));
    
        //Executes the installer for windows
        execFile(path.join(installerPath, setupFile), (error, stdout, stderr) => {
            if (error) {
            console.error(`Error executing installer: ${error.message}`);
            return res.status(500).json({ message: 'Failed to execute installer.' });
            }
            if (stderr) {
            console.error(`stderr: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);
        }
    )
    }

    




});



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'HomePageQuartz/Homepage', 'index.html'));
});



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
