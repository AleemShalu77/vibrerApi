const contestTypeSchema = require("../../model/contest_type");
const contestSchema = require("../../model/contests");
const appUserSchema = require("../../model/app_users");
const { format } = require("date-fns");
const addContest = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const {
    contest_type,
    title,
    description,
    conditions,
    reward,
    time_zone,
    starts_on,
    ends_on,
    banner,
    status,
    publish,
  } = req.body;

  const coinPriceCheck = await contestSchema.findOne({
    contest_type: contest_type,
    title: title,
  });
  if (coinPriceCheck) {
    result.code = 205;
  } else {
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
      publish: publish,
    });
    if (contest) {
      result.data = contest;
      result.code = 201;
    } else {
      result.code = 204;
    }
  }
  return result;
};

const updateContest = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const {
    id,
    contest_type,
    title,
    description,
    conditions,
    reward,
    time_zone,
    starts_on,
    ends_on,
    banner,
    status,
    publish,
  } = req.body;

  try {
    const contest = await contestSchema.findOne({ _id: id });

    if (!contest) {
      result.code = 206; // Contest not found
    } else {
      const contestAlreadyExists = await contestSchema.findOne({
        _id: { $ne: id },
        contest_type: contest_type,
        title: title,
      });
      if (contestAlreadyExists) {
        result.code = 205; // Contest exists with same data
      } else {
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
    console.error("Error updating contest:", error);
    result.code = 500; // Internal server error
  }

  return result;
};

const getAllContest = async (req) => {
  const result = { data: null };

  if (req.body.type) {
    let contestQuery = {};

    if (req.body.type === "Archived") {
      contestQuery = { status: "Archived" };
    } else if (req.body.type === "Draft") {
      contestQuery = { publish: "Draft" };
    } else if (req.body.type === "ongoing") {
      const currentDate = new Date();
      const formattedCurrentDate = format(currentDate, "yyyy-MM-dd", {
        timeZone: "Asia/Kolkata",
      });
      const formattedCurrentTime = format(currentDate, "HH:mm", {
        timeZone: "Asia/Kolkata",
      });

      contestQuery = {
        status: { $ne: "Archived" },
        "starts_on.start_date": { $lte: formattedCurrentDate },
        "ends_on.end_date": { $gte: formattedCurrentDate },
        $or: [
          {
            "starts_on.start_date": formattedCurrentDate,
            "starts_on.start_time": { $lte: formattedCurrentTime },
          },
          {
            "ends_on.end_date": formattedCurrentDate,
            "ends_on.end_time": { $gte: formattedCurrentTime },
          },
          {
            "starts_on.start_date": { $lt: formattedCurrentDate },
            "ends_on.end_date": { $gt: formattedCurrentDate },
          },
        ],
      };
    } else if (req.body.type === "upcoming") {
      const currentDate = new Date();
      const formattedCurrentDate = format(currentDate, "yyyy-MM-dd", {
        timeZone: "Asia/Kolkata",
      });

      contestQuery = {
        status: { $ne: "Archived" },
        "starts_on.start_date": { $gt: formattedCurrentDate },
      };
    }

    const contests = await contestSchema.find(contestQuery).populate({
      path: "participates.user_id",
      model: "app_users",
      select: "username email name profile_img profile_cover verified",
    });

    const contestsWithEndDays = contests.map((contest) => {
      // Calculate the end days
      const endDate = new Date(contest.ends_on.end_date);
      const currentDate = new Date();
      const endDays = Math.ceil(
        (endDate - currentDate) / (1000 * 60 * 60 * 24)
      );

      // Add endDays to the contest object
      return { ...contest._doc, endDays };
    });

    if (contestsWithEndDays && contestsWithEndDays.length > 0) {
      result.data = contestsWithEndDays;
      result.code = 200;
    } else {
      result.code = 204;
    }
  } else {
    const contests = await contestSchema.find().populate({
      path: "participates.user_id",
      model: "app_users",
      select: "username email name profile_img profile_cover verified",
    });

    const contestsWithEndDays = contests.map((contest) => {
      // Calculate the end days
      const endDate = new Date(contest.ends_on.end_date);
      const currentDate = new Date();
      const endDays = Math.ceil(
        (endDate - currentDate) / (1000 * 60 * 60 * 24)
      );

      // Add endDays to the contest object
      return { ...contest._doc, endDays };
    });

    if (contestsWithEndDays && contestsWithEndDays.length > 0) {
      result.data = contestsWithEndDays;
      result.code = 200;
    } else {
      result.code = 204;
    }
  }

  return result;
};

const getContest = async (req) => {
  const result = { data: null };
  const id = req.params.id;

  try {
    const contest = await contestSchema.findOne({ _id: id }).populate({
      path: "participates.user_id",
      model: "app_users",
      select:
        "name username email profile_img profile_cover verified city country",
    });

    if (contest) {
      const appUserId = req.decoded ? req.decoded.id : null;
      const appUser = appUserId
        ? await appUserSchema.findById(appUserId)
        : null;

      let isParticipated = false;

      // Flatten participant details
      const participants = contest.participates.map((participant) => {
        let isVoted = false;
        let isFavourite = false;

        // Check if payload.id exists in votes
        if (appUserId) {
          isVoted = participant.votes.some(
            (vote) => String(vote.user_id) === String(appUserId)
          );
        }

        // Check if the user has participated
        if (
          appUserId &&
          String(participant.user_id._id) === String(appUserId)
        ) {
          isParticipated = true;
        }

        // Check if the participant exists in the user's favourite list
        if (
          appUser &&
          appUser.favourites.some((favorite) =>
            favorite.participant_ids.includes(participant.user_id._id)
          )
        ) {
          isFavourite = true;
        }

        return {
          title: participant.title,
          description: participant.description,
          media: participant.media,
          genres: participant.genres,
          status: participant.status,
          votes: participant.votes,
          user: {
            _id: participant.user_id._id,
            username: participant.user_id.username,
            name: participant.user_id.name,
            email: participant.user_id.email,
            profile_img: participant.user_id.profile_img,
            profile_cover: participant.user_id.profile_cover,
            verified: participant.user_id.verified,
            city: participant.user_id.city,
            country: participant.user_id.country,
          },
          is_voted: isVoted,
          is_favourite: isFavourite,
        };
      });

      // Sort participants by votes in descending order
      participants.sort((a, b) => b.votes.length - a.votes.length);

      // Assign ranks based on the sorted order
      participants.forEach((participant, index) => {
        participant.rank = index + 1;
      });

      // Calculate end days
      const currentDate = new Date();
      const endDateTime = new Date(
        contest.ends_on.end_date + " " + contest.ends_on.end_time
      );
      const timeDifference = endDateTime.getTime() - currentDate.getTime();
      const endDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

      // Return flattened contest object
      const contestWithEndDays = {
        ...contest._doc,
        participates: participants,
        endDays: endDays,
        isParticipated: isParticipated,
      };

      result.data = contestWithEndDays;
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
};

module.exports = {
  addContest,
  updateContest,
  getAllContest,
  getContest,
  deleteContest,
};
