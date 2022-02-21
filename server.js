const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

mongoose.connect('mongodb://localhost/blog');

app.set('view engine', 'ejs');
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
app.set("views", path.join(__dirname, "views"));
app.use('/uploads', express.static('uploads'))
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });
  res.render('articles/index', { articles: articles });
});

app.use('/articles', articleRouter);

app.listen(5000);