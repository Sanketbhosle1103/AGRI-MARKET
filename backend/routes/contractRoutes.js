const express = require('express');
const { createContract, signContract } = require('../controllers/contractController');
const router = express.Router();

router.post('/create', createContract);
router.post('/sign', signContract);

module.exports = router;
