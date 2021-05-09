const express = require('express');
const authCtrl = require('../controllers/auth.controller')
const pollCtrl = require('../controllers/poll.controller')

const router = express.Router();

router.route('/api/polls').get(pollCtrl.list).post(authCtrl.requireSignin, authCtrl.isPowerAndAdmin, pollCtrl.create);

router.route('/api/polls/pos/:pollId').put(authCtrl.requireSignin, pollCtrl.voteYes);
router.route('/api/polls/neg/:pollId').put(authCtrl.requireSignin, pollCtrl.voteNo);

router.param('pollId', pollCtrl.pollByID);

router.route('/api/polls/close/:pollId').put(authCtrl.requireSignin, authCtrl.isPowerAndAdmin, pollCtrl.close)

router
  .route('/api/polls/:pollId')
  .get(authCtrl.requireSignin, pollCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isPowerAndAdmin, pollCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isPowerAndAdmin, pollCtrl.remove);

module.exports = router;
