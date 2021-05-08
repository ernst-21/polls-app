const express = require('express');
const authCtrl = require('../controllers/auth.controller')
const pollCtrl = require('../controllers/poll.controller')

const router = express.Router();

router.route('/api/polls').get(pollCtrl.list).post(authCtrl.requireSignin, authCtrl.isPowerAndAdmin, pollCtrl.create);

router.route('/api/polls/:pollId').put(authCtrl.requireSignin, pollCtrl.voteYes).put(authCtrl.requireSignin, pollCtrl.voteNo);

router.param('pollId', pollCtrl.pollByID);

router
  .route('/api/polls/:pollId')
  .get(authCtrl.requireSignin, pollCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isPowerAndAdmin, pollCtrl.update)
  .put(authCtrl.requireSignin, authCtrl.isPowerAndAdmin, pollCtrl.close)
  .delete(authCtrl.requireSignin, authCtrl.isPowerAndAdmin, pollCtrl.remove);

module.exports = router;
