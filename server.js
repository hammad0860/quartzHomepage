const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'HomePageQuartz/Homepage')));


app.post('/api/build-installer', (req, res) => {
    const electronAppPath = path.join(__dirname, 'quartz');

    const command = 'npm run start';

    exec(command, { cwd: electronAppPath }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error building installer: ${error.message}`);
          return res.status(500).json({ message: 'Build failed.' });
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
      });
});



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'HomePageQuartz/Homepage', 'index.html'));
});



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
