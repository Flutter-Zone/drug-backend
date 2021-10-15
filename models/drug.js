const mongoose = require('mongoose');
const slugify = require('slugify');

// creating the schema
const drugSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Name of drug is required']
    },
    description: {
      type: String,
      required: [true, 'Description of drug is required'],
    },
    slug: String,
    imageCover: {
      type: String,
      required: [true, 'Drug must have a cover image']
    },
    price: {
      type: Number,
      required: [true, 'Price of drug is required']
    },
    images: [String]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

drugSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
});

// creating the Model
const Drug = mongoose.model('Drug', drugSchema);

module.exports = Drug;
