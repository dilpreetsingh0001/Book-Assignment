const express = require('express');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');
const app = express();
const PORT =5070;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Book Management API');
});


app.use('/books', bookRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));     

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
