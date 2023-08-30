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
  const payload = req.decoded;
  const { id, contest_type, title, description, conditions, reward, time_zone, starts_on, ends_on, banner, status, publish } = req.body;

  try {
    const contest = await contestSchema.findOne({  _id: id });

    if (!contest) {
      result.code = 206; // Contest not found
    } else {
      const contestAlreadyExists = await contestSchema.findOne({  _id: { $ne: id },  contest_type: contest_type, title:title });
        if(contestAlreadyExists)
        {
          result.code = 205; // Contest exists with same data
        }
        else
        {
      // Update contest fields
      contest.contest_type = contest_type;
      contest.title = title;
      contest.description = description;
      contest.conditions = conditions;
      contest.reward = reward;
      contest.time_zone = time_zone;
      contest.starts_on = starts_on;
      contest.ends_on = ends_on;
      contest.banner = banner;
      contest.updatedBy = payload.id;
      contest.updatedAt = new Date();
      contest.status = status;
      contest.publish = publish;

      const updatedContest = await contest.save(); // Save the updated contest

      if (updatedContest) {
        result.data = updatedContest;
        result.code = 202; // Successful update
      } else {
        result.code = 204; // Update failed
      }
    }
    }
  } catch (error) {
    console.error('Error updating contest:', error);
    result.code = 500; // Internal server error
  }

  return result;
};


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

  try {
    const contest = await contestSchema.findOne({ _id: id });

    if (contest) {
      result.data = contest;
      result.code = 200;
    } else {
      result.code = 204;
    }
  } catch (error) {
    result.code = 204;
  }

  return result;
};


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