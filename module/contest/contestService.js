const mongoose = require("mongoose");
const contestTypeSchema = require("../../model/contest_type");
const contestSchema = require("../../model/contests");
const appUserSchema = require("../../model/app_users");
const genreSchema = require("../../model/genre");
const { format } = require("date-fns");
const redis = require("redis");
const { getFileFromR2 } = require("../../utils/helper");

(async () => {
  try {
    // Create the Redis client
    redisClient = redis.createClient({
      url: "redis://localhost:6379", // This is a common way to specify Redis connection details
    });

    // Connect to Redis
    await redisClient.connect();

    console.log("Connected to Redis");

    // Properly handle connection errors
    redisClient.on("error", (error) => {
      // console.error("Redis Client Error", error);
      redisClient = null;
    });

    // Optionally handle the connection end event
    redisClient.on("end", () => {
      // console.log("Redis connection closed");
      redisClient = null;
    });
  } catch (error) {
    // console.error("Failed to connect to Redis:", error);
    redisClient = null;
  }
})();
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
      // if (redisClient) {
      //   let activeCachedDataKey = `allContests:Active`;
      //   let activeCachedData = await redisClient.get(activeCachedDataKey);
      //   if (activeCachedData) {
      //     await redisClient.del(activeCachedDataKey);
      //   }
      //   let archivedCachedDataKey = `allContests:Archived`;
      //   let archivedCachedData = await redisClient.get(archivedCachedDataKey);
      //   if (archivedCachedData) {
      //     await redisClient.del(archivedCachedDataKey);
      //   }

      //   let draftCachedDataKey = `allContests:Draft`;
      //   let draftCachedData = await redisClient.get(draftCachedDataKey);
      //   if (draftCachedData) {
      //     await redisClient.del(draftCachedDataKey);
      //   }

      //   let ongoingCachedDataKey = `allContests:ongoing`;
      //   let ongoingCachedData = await redisClient.get(ongoingCachedDataKey);
      //   if (ongoingCachedData) {
      //     await redisClient.del(ongoingCachedDataKey);
      //   }
      // }
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
    // if (redisClient) {
    //   const cachedDataKey = `allContests:${req.body.type}`;
    //   let cachedData = await redisClient.get(cachedDataKey);
    //   if (cachedData) {
    //     console.log("Data found in cache");
    //     return JSON.parse(cachedData);
    //   }
    // }
    let contestQuery = {};

    if (req.body.type === "Active") {
      contestQuery = { status: "Active" };
    } else if (req.body.type === "Archived") {
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
      select: "username email full_name profile_img profile_cover verified",
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
      // if (redisClient) {
      //   await redisClient.set(
      //     `allContests:${req.body.type}`,
      //     JSON.stringify(result)
      //   );
      // }
    } else {
      result.code = 204;
    }
  } else {
    // if (redisClient) {
    //   const cachedDataKey = `allContests`;
    //   let cachedData = await redisClient.get(cachedDataKey);
    //   if (cachedData) {
    //     console.log("Data found in cache");
    //     return JSON.parse(cachedData);
    //   }
    // }
    const contests = await contestSchema.find().populate({
      path: "participates.user_id",
      model: "app_users",
      select: "username email full_name profile_img profile_cover verified",
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
      // if (redisClient) {
      //   await redisClient.set(`allContests`, JSON.stringify(result));
      // }
    } else {
      result.code = 204;
    }
  }

  return result;
};

const getContest = async (req) => {
  const result = { data: null, code: 204 };

  try {
    const id = req.params.id;
    const { country, genre } = req.body;

    const contest = await contestSchema
      .findOneAndUpdate(
        { _id: id },
        { $inc: { views: 1 } }, // Increment views counter
        { new: true } // Return the updated document
      )
      .populate({
        path: "participates.user_id",
        model: "app_users",
        select:
          "full_name username email profile_img profile_cover verified city country",
      });

    const filteredParticipants = contest.participates.filter((participant) => {
      if (country && participant.user_id.country !== country) {
        return false;
      }
      if (genre && !participant.genres.includes(genre)) {
        return false;
      }
      return true;
    });

    if (contest) {
      const appUserId = req.decoded ? req.decoded.id : null;

      // Use $in operator to find appUser in one query
      const appUser = appUserId
        ? await appUserSchema.findById(appUserId)
        : null;

      // Use async/await with map instead of forEach for better control flow
      const participants = await Promise.all(
        filteredParticipants
          .filter((participant) => participant.status === "Active") // Filter by status
          .map(async (participant) => {
            let isVoted = false;
            let isFavourite = false;

            if (appUserId) {
              isVoted = participant.votes.some(
                (vote) => String(vote.user_id) === String(appUserId)
              );
            }

            if (appUser) {
              isFavourite = appUser.favourites.some((favorite) =>
                favorite.participant_ids.includes(participant.user_id._id)
              );
            }

            let {
              title,
              _id,
              description,
              media,
              genres,
              status,
              least_quality,
              votes,
            } = participant;

            const user = {
              _id: participant.user_id._id,
              username: participant.user_id.username,
              full_name: participant.user_id.full_name,
              email: participant.user_id.email,
              profile_img: participant.user_id.profile_img,
              profile_cover: participant.user_id.profile_cover,
              verified: participant.user_id.verified,
              city: participant.user_id.city,
              country: participant.user_id.country,
            };

            // Check if media is a local file (not a URL), then fetch from R2
            if (!media.startsWith("http://") && !media.startsWith("https://")) {
              media = await getFileFromR2(media);
            }

            return {
              title,
              _id,
              description,
              media,
              genres,
              status,
              least_quality,
              votes,
              user,
              is_voted: isVoted,
              is_favourite: isFavourite,
            };
          })
      );

      const isParticipated = contest.participates.some(
        (participant) => String(participant.user_id._id) === String(appUserId)
      );

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
        ...contest.toObject(), // Use toObject() to convert Mongoose document to plain JavaScript object
        participates: participants,
        endDays: endDays,
        isParticipated: isParticipated,
      };

      result.data = contestWithEndDays;
      result.code = 200;
    }
  } catch (error) {
    console.error("Error in getContest:", error); // Log the error for debugging
  }

  return result;
};

const getContestEntries = async (req) => {
  const result = { data: null, code: 204 };
  const appUserId = req.decoded ? req.decoded.id : null;

  try {
    const id = req.params.id;
    const {
      country,
      genre,
      limit = 10,
      offset = 0,
      is_top_three_participants = false,
      is_least_quality_participants = false,
    } = req.body;

    const validOffset =
      Number.isInteger(offset) && offset >= 0 ? limit * offset : 0;

    const appUser = appUserId ? await appUserSchema.findById(appUserId) : null;

    // Step 1: Update views count
    await contestSchema.findByIdAndUpdate(id, { $inc: { views: 1 } });

    const processParticipants = async (participants, startRank) => {
      return Promise.all(
        participants.map(async (participant, index) => {
          const isVoted = appUserId
            ? participant.votes.some(
                (vote) => String(vote.user_id) === String(appUserId)
              )
            : false;

          const isFavourite = appUser
            ? appUser.favourites.some((favorite) =>
                favorite.participant_ids.includes(participant.user._id)
              )
            : false;

          let {
            title,
            _id,
            description,
            media,
            genres,
            status,
            least_quality,
            votes,
          } = participant;

          if (!media.startsWith("http://") && !media.startsWith("https://")) {
            media = await getFileFromR2(media);
          }

          const user = {
            _id: participant.user._id,
            username: participant.user.username,
            full_name: participant.user.full_name,
            email: participant.user.email,
            profile_img: participant.user.profile_img,
            profile_cover: participant.user.profile_cover,
            verified: participant.user.verified,
            city: participant.user.city,
            country: participant.user.country,
          };

          return {
            title,
            _id,
            description,
            media,
            genres,
            status,
            least_quality,
            votes,
            votesCount: votes.length, // Adding vote count
            user,
            is_voted: isVoted,
            is_favourite: isFavourite,
            rank: startRank + index, // Adjust rank based on start rank
          };
        })
      );
    };

    // Step 2: Fetch Contest Details
    const contestDetailsPipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          ends_on: 1,
        },
      },
    ];
    const contestAggregation = await contestSchema
      .aggregate(contestDetailsPipeline)
      .exec();
    const contest = contestAggregation[0];
    if (!contest) {
      return result;
    }

    // Step 3: Fetch total number of entries
    const totalEntriesPipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: "$participates" },
      {
        $match: {
          "participates.status": "Active",
          ...(country && { "participates.user.country": country }),
          ...(genre && { "participates.genres": genre }),
        },
      },
      {
        $count: "totalEntries", // Count the total entries
      },
    ];
    const totalEntriesAggregation = await contestSchema
      .aggregate(totalEntriesPipeline)
      .exec();
    const totalEntries = totalEntriesAggregation[0]?.totalEntries || 0;

    // Step 4: Fetch Top 3 Participants
    let top3Participants = [];
    if (is_top_three_participants) {
      const top3Pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $unwind: "$participates" },
        {
          $lookup: {
            from: "app_users",
            localField: "participates.user_id",
            foreignField: "_id",
            as: "participates.user",
          },
        },
        { $unwind: "$participates.user" },
        {
          $match: {
            "participates.status": "Active",
            ...(country && { "participates.user.country": country }),
            ...(genre && { "participates.genres": genre }),
          },
        },
        {
          $addFields: {
            votesCount: { $size: "$participates.votes" },
          },
        },
        { $sort: { votesCount: -1 } },
        { $limit: 3 },
      ];
      const top3ParticipantsAggregation = await contestSchema
        .aggregate(top3Pipeline)
        .exec();
      top3Participants = await processParticipants(
        top3ParticipantsAggregation.map((a) => a.participates),
        1 // Starting rank for top 3 participants
      );
    }

    // Step 5: Fetch Least Quality Participants
    let leastQualityParticipants = [];
    if (is_least_quality_participants) {
      const leastQualityPipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $unwind: "$participates" },
        {
          $lookup: {
            from: "app_users",
            localField: "participates.user_id",
            foreignField: "_id",
            as: "participates.user",
          },
        },
        { $unwind: "$participates.user" },
        {
          $match: {
            "participates.status": "Active",
            "participates.least_quality": true,
            ...(country && { "participates.user.country": country }),
            ...(genre && { "participates.genres": genre }),
          },
        },
      ];
      const leastQualityParticipantsAggregation = await contestSchema
        .aggregate(leastQualityPipeline)
        .exec();
      leastQualityParticipants = await processParticipants(
        leastQualityParticipantsAggregation.map((a) => a.participates),
        is_top_three_participants ? 4 : 1 // Adjust rank for least quality participants
      );
    }

    // Step 6: Fetch Remaining Participants
    const remainingPipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: "$participates" },
      {
        $lookup: {
          from: "app_users",
          localField: "participates.user_id",
          foreignField: "_id",
          as: "participates.user",
        },
      },
      { $unwind: "$participates.user" },
      {
        $match: {
          "participates.status": "Active",
          // "participates.least_quality": { $ne: true },
          ...(country && { "participates.user.country": country }),
          ...(genre && { "participates.genres": genre }),
        },
      },
      {
        $addFields: {
          votesCount: { $size: "$participates.votes" },
        },
      },
      { $sort: { votesCount: -1 } },
      { $skip: validOffset },
      { $limit: limit },
    ];
    const remainingParticipantsAggregation = await contestSchema
      .aggregate(remainingPipeline)
      .exec();

    const remainingParticipants = await processParticipants(
      remainingParticipantsAggregation.map((a) => a.participates),
      validOffset + (is_top_three_participants ? 4 : 1) // Adjust rank for remaining participants
    );

    const currentDate = new Date();
    const endDateTime = new Date(
      contest.ends_on.end_date + " " + contest.ends_on.end_time
    );
    const timeDifference = endDateTime.getTime() - currentDate.getTime();
    const endDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

    const contestWithEndDays = {
      ...contest,
      ...(is_top_three_participants && { top3Participants }),
      ...(is_least_quality_participants && { leastQualityParticipants }),
      participates: remainingParticipants,
      endDays,
      isParticipated: appUserId ? true : false,
      totalEntries, // Add totalEntries to the result
    };

    result.data = contestWithEndDays;
    result.code = 200;
  } catch (error) {
    console.error("Error in getContest:", error); // Log the error for debugging
  }

  return result;
};

const getContestAllParticipants = async (req) => {
  const result = { data: null, code: 204 }; // Initialize code to default 204

  try {
    const id = req.params.id;

    // Use findOneAndUpdate to get and update the contest in one query
    const contest = await contestSchema
      .findOneAndUpdate(
        { _id: id },
        { $inc: { views: 1 } }, // Increment views counter
        { new: true } // Return the updated document
      )
      .populate({
        path: "participates.user_id",
        model: "app_users",
        select:
          "full_name username email profile_img profile_cover verified city country",
      });

    if (contest) {
      const appUserId = req.decoded ? req.decoded.id : null;

      // Use $in operator to find appUser in one query
      const appUser = appUserId
        ? await appUserSchema.findById(appUserId)
        : null;

      let isParticipated = false;

      // Use async/await with map instead of forEach for better control flow
      const participants = await Promise.all(
        contest.participates.map(async (participant) => {
          let isVoted = false;
          let isFavourite = false;

          if (appUserId) {
            isVoted = participant.votes.some(
              (vote) => String(vote.user_id) === String(appUserId)
            );
          }

          if (appUser) {
            isFavourite = appUser.favourites.some((favorite) =>
              favorite.participant_ids.includes(participant.user_id._id)
            );
          }

          let {
            title,
            _id,
            description,
            media,
            genres,
            status,
            least_quality,
            votes,
          } = participant;

          const user = {
            _id: participant.user_id._id,
            username: participant.user_id.username,
            full_name: participant.user_id.full_name,
            email: participant.user_id.email,
            profile_img: participant.user_id.profile_img,
            profile_cover: participant.user_id.profile_cover,
            verified: participant.user_id.verified,
            city: participant.user_id.city,
            country: participant.user_id.country,
          };

          // Check if media is a local file (not a URL), then fetch from R2
          if (!media.startsWith("http://") && !media.startsWith("https://")) {
            media = await getFileFromR2(media);
          }

          return {
            title,
            _id,
            description,
            media,
            genres,
            status,
            least_quality,
            votes,
            user,
            is_voted: isVoted,
            is_favourite: isFavourite,
          };
        })
      );

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
        ...contest.toObject(), // Use toObject() to convert Mongoose document to plain JavaScript object
        participates: participants,
        endDays: endDays,
        isParticipated: isParticipated,
      };

      result.data = contestWithEndDays;
      result.code = 200;
    }
  } catch (error) {
    console.error("Error in getContest:", error); // Log the error for debugging
  }

  return result;
};

const getSingleEntry = async (req) => {
  const result = { data: null };

  if (!req.params.contestId) {
    result.code = 2041;
    return result;
  }
  if (!req.params.entryId) {
    result.code = 2042;
    return result;
  }
  const { contestId, entryId } = req.params;

  try {
    const entry = await contestSchema.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(contestId) } },
      { $unwind: "$participates" },
      { $match: { "participates._id": new mongoose.Types.ObjectId(entryId) } },
      {
        $lookup: {
          from: "app_users",
          localField: "participates.user_id",
          foreignField: "_id",
          as: "participates.user",
        },
      },
      { $unwind: "$participates.user" },
      {
        $project: {
          contest: {
            _id: "$_id",
            title: "$title",
            description: "$description",
            conditions: "$conditions",
            reward: "$reward",
            banner: "$banner",
            time_zone: "$time_zone",
            starts_on: "$starts_on",
            ends_on: "$ends_on",
            status: "$status",
          },
          _id: "$participates._id",
          title: "$participates.title",
          description: "$participates.description",
          media: "$participates.media",
          status: "$participates.status",
          least_quality: "$participates.least_quality",
          votes: "$participates.votes",
          genres: "$participates.genres",
          user: {
            _id: "$participates.user._id",
            full_name: "$participates.user.full_name",
            username: "$participates.user.username",
            email: "$participates.user.email",
            profile_img: "$participates.user.profile_img",
            profile_cover: "$participates.user.profile_cover",
            verified: "$participates.user.verified",
            city: "$participates.user.city",
            country: "$participates.user.country",
          },
        },
      },
    ]);

    if (!entry || entry.length === 0) {
      return { code: 2032 };
    }

    const genresInfo = await genreSchema.find({
      _id: { $in: entry[0].genres },
    });

    if (genresInfo) {
      entry[0].genres = genresInfo;
    }

    let media = entry[0].media;
    if (!media.startsWith("http://") && !media.startsWith("https://")) {
      media = await getFileFromR2(media);
    }
    entry[0].media = media;

    // Calculate end days
    const currentDate = new Date();
    const contestEndDate = entry[0].contest.ends_on;
    const endDateTime = new Date(
      `${contestEndDate.end_date} ${contestEndDate.end_time}`
    );
    const timeDifference = endDateTime.getTime() - currentDate.getTime();
    const endDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

    entry[0].contest.endDays = endDays; // Add endDays to contest

    result.code = 2040;
    result.data = entry[0];
  } catch (error) {
    console.log(error);
    result.code = 500;
  }

  return result;
};

const getUserEntry = async (req) => {
  const result = { data: null };

  if (!req.params.contestId) {
    result.code = 2041;
    return result;
  }

  const { contestId } = req.params;
  const payload = req.decoded;
  const entryId = payload.id;

  try {
    const entry = await contestSchema.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(contestId) } },
      { $unwind: "$participates" },
      {
        $match: {
          "participates.user_id": new mongoose.Types.ObjectId(entryId),
        },
      },
      {
        $lookup: {
          from: "app_users",
          localField: "participates.user_id",
          foreignField: "_id",
          as: "participates.user",
        },
      },
      { $unwind: "$participates.user" },
      {
        $project: {
          contest: {
            _id: "$_id",
            title: "$title",
            description: "$description",
            conditions: "$conditions",
            reward: "$reward",
            banner: "$banner",
            time_zone: "$time_zone",
            starts_on: "$starts_on",
            ends_on: "$ends_on",
          },
          _id: "$participates._id",
          title: "$participates.title",
          description: "$participates.description",
          media: "$participates.media",
          status: "$participates.status",
          least_quality: "$participates.least_quality",
          votes: "$participates.votes",
          genres: "$participates.genres",
          user: {
            _id: "$participates.user._id",
            full_name: "$participates.user.full_name",
            username: "$participates.user.username",
            email: "$participates.user.email",
            profile_img: "$participates.user.profile_img",
            profile_cover: "$participates.user.profile_cover",
            verified: "$participates.user.verified",
            city: "$participates.user.city",
            country: "$participates.user.country",
          },
        },
      },
    ]);

    if (!entry || entry.length === 0) {
      return { code: 2032 };
    }

    const genresInfo = await genreSchema.find({
      _id: { $in: entry[0].genres },
    });

    if (genresInfo) {
      entry[0].genres = genresInfo;
    }

    let media = entry[0].media;
    if (!media.startsWith("http://") && !media.startsWith("https://")) {
      media = await getFileFromR2(media);
    }
    entry[0].media = media;

    result.code = 2040;
    result.data = entry[0];
  } catch (error) {
    console.log(error);
    result.code = 500;
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
  getSingleEntry,
  deleteContest,
  getContestAllParticipants,
  getUserEntry,
  getContestEntries,
};
