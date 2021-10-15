const multer = require('multer');
const sharp = require('sharp');
const Drug = require('./../models/drug');
const catchAsync = require('../utils/catch_async');
const factory = require('./handler_factory');
const AppError = require('../utils/app_error');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadDrugImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.resizeDrugImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `Drug-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/Drugs/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `Drug-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/Drugs/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.getAllDrugs = factory.getAll(Drug);
exports.getDrug = factory.getOne(Drug);
exports.createDrug = factory.createOne(Drug);
exports.updateDrug = factory.updateOne(Drug);
exports.deleteDrug = factory.deleteOne(Drug);
