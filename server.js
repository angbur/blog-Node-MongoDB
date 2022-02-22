const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = process.env.PORT ? process.env.PORT : 4000;

mongoose.connect('mongodb://localhost/blog');

app.set('view engine', 'ejs');
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
app.set("views", path.join(__dirname, "views"));
app.use('/uploads', express.static('uploads'))
app.use('/css', express.static('css'))
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });
  res.render('articles/index', { articles: articles });
});

app.use('/articles', articleRouter);

let server = app.listen(port, () => {
  console.log(`Server Running on port: ${port}`);
});


server.on('clientError', (err, socket) => {
    console.error(err);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });