const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')


const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  img: {
    data: Buffer,
    contentType: String
  },
  description: {
    type: String
  },
  content: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }

})

articleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

module.exports = mongoose.model('Article', articleSchema)