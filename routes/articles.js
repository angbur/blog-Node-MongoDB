const express = require('express');
const Article = require('./../models/article');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `articleImage-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "png" ) {
    cb(null, true);
  } else {
    cb(new Error("Not a jpg/png File!!"), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() });
});

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render('articles/edit', { article: article });
});

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect('/');
  res.render('articles/show', { article: article });
});

router.post('/',  upload.single("image"),  async (req, res, next) => {
  req.article = new Article();
  next();
},  saveArticleAndRedirect('new'));

router.put('/:id', upload.single("image"), async (req, res, next) => {
  req.article = await Article.findById(req.params.id);
  next();
}, saveArticleAndRedirect('edit'));

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {  
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.content = req.body.content;
    if (!req.file){
      article.img.name=article.img.name;
    } else {
      article.img.name = req.file.filename;
    }
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      res.render(`articles/${path}`, { article: article });
    }
  }
}

module.exports = router;