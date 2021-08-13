const express = require('express');
const authCtrl = require('../controllers/auth.controller')
const pollCtrl = require('../controllers/poll.controller')

const router = express.Router();

router.route('/api/polls').get(pollCtrl.listPolls).post(authCtrl.requireSignin, authCtrl.isPowerAndAdmin, pollCtrl.createPoll);

router.route('/api/polls/vote/:pollId').put(authCtrl.requireSignin, pollCtrl.votePoll);

router.param('pollId', pollCtrl.pollByID);

router.route('/api/polls/close/:pollId').put(authCtrl.requireSignin, authCtrl.isPowerAndAdmin, pollCtrl.closePoll)

router.route('/api/polls/open/:pollId').put(authCtrl.requireSignin, authCtrl.isPowerAndAdmin, pollCtrl.openPoll)

router
  .route('/api/polls/:pollId')
  .get(authCtrl.requireSignin, pollCtrl.readPoll)
  .delete(authCtrl.requireSignin, authCtrl.isPowerAndAdmin, pollCtrl.removePoll);

module.exports = router;
