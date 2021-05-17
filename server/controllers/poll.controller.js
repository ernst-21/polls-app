const Poll = require('../models/poll.model');
const errorHandler = require('../helpers/dbErrorHandler');

const create = async (req, res, next) => {
  const poll = new Poll(req.body);
  try {
    await poll.save();
    return res.status(200).json({ message: 'Poll successfully created!' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};
const list = async (req, res) => {
  try {
    let polls = await Poll.find().select('question answers chosenAnswer _id voters created closed');
    res.json(polls);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const pollByID = async (req, res, next, id) => {
  try {
    let poll = await Poll.findById(id);
    if (!poll)
      return res.status('400').json({
        error: 'User not found'
      });
    req.profile = poll;
    next();
  } catch (err) {
    return res.status('400').json({
      error: 'Could not retrieve poll'
    });
  }
};

const read = (req, res) => {
  return res.json(req.profile);
};

const close = async (req, res) => {
  try {
    let poll = req.profile;
    poll.closed = true;
    await poll.save();
    res.json(poll);
  } catch (err) {
    return res.status(400).json({
      error:
        'Something went wrong and poll could not be updated. Please try again.'
    });
  }
};

const open = async (req, res) => {
  try {
    let poll = req.profile;
    poll.closed = false;
    await poll.save();
    res.json(poll);
  } catch (err) {
    return res.status(400).json({
      error:
        'Something went wrong and poll could not be updated. Please try again.'
    });
  }
};

const remove = async (req, res, next) => {
  try {
    let poll = req.profile;
    let deletedPoll = await poll.remove();
    res.json(deletedPoll);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const vote = async (req, res) => {

  await Poll.findByIdAndUpdate(
    req.params.pollId,
    {
      $push: { chosenAnswer: req.body.chosenAnswer, voters: req.body.userId }
    },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

exports.create = create;
exports.list = list;
exports.pollByID = pollByID;
exports.read = read;
exports.remove = remove;
exports.vote = vote;
exports.close = close;
exports.open = open;

