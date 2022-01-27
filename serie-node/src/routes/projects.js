var express = require('express');
var router = express.Router();
const authMiddleware = require('../app/controllers/projectController');

router.use(authMiddleware);
router.get('/', (req, res, next) => res.send('okokok'));

module.exports = router;
