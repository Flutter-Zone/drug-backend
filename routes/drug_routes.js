const express = require('express');
const drugController = require('./../controllers/drug_controller');
const authController = require('./../controllers/auth_controller');

const router = express.Router();

router.use(authController.protect);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(drugController.getAllDrugs)
  .post(drugController.createDrug);

router
  .route('/:id')
  .get(drugController.getDrug)
  .patch(
    drugController.uploadDrugImages,
    drugController.resizeDrugImages,
    drugController.updateDrug
  )
  .delete(drugController.deleteDrug);

module.exports = router;
