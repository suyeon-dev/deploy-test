const express = require('express');
const controller = require('../controller/Cvisitor');
const router = express.Router();

// 기본주소: localhost:PORT

// GET / => localhost:PORT/
router.get('/', controller.main);

// GET /visitors => localhost:PORT/visitor
router.get('/visitors', controller.getVisitors);

// GET /visitor/:id
router.get('/visitor/:id', controller.getVisitor);

// // POST
router.post('/visitor', controller.postVisitor);

// // DELETE
router.delete('/visitor', controller.deleteVisitor);

// PATCH
router.patch('/visitor', controller.patchVisitor);
module.exports = router;
