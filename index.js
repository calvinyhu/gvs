require('dotenv').config();

const app = require('./app');

// Deployment Setup (Serve index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Server Setup
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
