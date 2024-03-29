const contestTypeSchema = require("../../model/contest_type");
const contestSchema = require("../../model/contests");
const { format } = require('date-fns');
const addContest = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const { contest_type, title, description, conditions, reward, time_zone, starts_on, ends_on,  banner, status, publish } = req.body;
  
  const coinPriceCheck = await contestSchema.findOne({ contest_type: contest_type, title: title });
  if(coinPriceCheck)
  {
    result.code = 205;
  }
  else
  {
  
  const contest = await contestSchema.create({
    contest_type: contest_type,
    title: title,
    description: description,
    conditions: conditions,
    reward: reward,
    time_zone: time_zone,
    starts_on: starts_on,
    ends_on: ends_on,
    banner: banner,
    // votes: votes,
    // winner: winner,
    // winner_second: winner_second,
    // winner_third: winner_third,
    createdBy: payload.id,
    updatedBy: payload.id,
    status: status,
    publish: publish
  })
  if (contest) {
    result.data = contest
    result.code = 201;
  } else {
    result.code = 204;
  }
}
  return result;
}

const updateContest = async (req) => {
  const result = { data: null };
  const filter = { _id: id };
  const { contest_type, title, description, conditions, reward, time_zone, starts_on, ends_on, start_date, start_time, end_time, votes, winner, winner_second, winner_third, createdBy, updated_by, status } = req.body;
  const contest = await contestSchema.findOneAndUpdate(filter, {
    contest_type: contest_type,
    title: title,
    description: description,
    conditions: conditions,
    reward: reward,
    time_zone: time_zone,
    starts_on: starts_on,
    ends_on: ends_on,
    start_date: start_date,
    start_time: start_time,
    end_time: end_time,
    votes: votes,
    winner: winner,
    winner_second: winner_second,
    winner_third: winner_third,
    createdBy: createdBy,
    updated_by: updated_by,
    status: status
  })
  if (contest) {
    result.data = contest
    result.code = 202;
  } else {
    result.code = 204;
  }
  return result;
}

const getAllContest = async (req) => {
  const result = { data: null };
  if(req.body.type){ 
    if(req.body.type == 'Archived')
    {
      var contest = await contestSchema.find({
        status: 'Archived'
      });
    }
    else if(req.body.type == 'Draft')
    {
      var contest = await contestSchema.find({
        publish: 'Draft'
      });
    }
    else if(req.body.type == 'ongoing')
    {
      const currentDate = new Date(); // Get the current date and time
      const formattedCurrentDate = format(currentDate, 'yyyy-MM-dd', { timeZone: 'Asia/Kolkata' });
      const formattedCurrentTime = format(currentDate, 'HH:mm', { timeZone: 'Asia/Kolkata' });
      var contest = await contestSchema.find({
        status: { $ne: 'Archived' },
        'starts_on.start_date': { $lte: formattedCurrentDate },
        'ends_on.end_date': { $gte: formattedCurrentDate },
        $or: [
          { 'starts_on.start_date': formattedCurrentDate, 'starts_on.start_time': { $lte: formattedCurrentTime } },
          { 'ends_on.end_date': formattedCurrentDate, 'ends_on.end_time': { $gte: formattedCurrentTime } },
          { 'starts_on.start_date': { $lt: formattedCurrentDate }, 'ends_on.end_date': { $gt: formattedCurrentDate } }
        ]
      });
    }
  }
  else
  {
    var contest = await contestSchema.find();
  }
  if (contest) {
    result.data = contest;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const getContest = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const contest = await contestSchema.findOne({ _id: id });
  if (contest) {
    result.data = contest;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
}

const deleteContest = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const contest = await contestSchema.findOne({ _id: id });
  if (contest) {
    result.data = contest;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
}

module.exports = {
  addContest,
  updateContest,
  getAllContest,
  getContest,
  deleteContest
}