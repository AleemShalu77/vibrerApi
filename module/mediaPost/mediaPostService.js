const fs = require("fs").promises;
const path = require("path");
const url = require("url");
require("dotenv").config();
const nodemailer = require("nodemailer");
// const mediaPostSchema = require("../../model/media_post");
const contestSchema = require("../../model/contests");
const appUserSchema = require("../../model/app_users");
const genreSchema = require("../../model/genre");
const { MEDIA_VIDEO_URL } = require("../../config/index");
const helper = require("../../utils/helper");
const sendGridMail = require("@sendgrid/mail");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffmpeg = require("fluent-ffmpeg");

// Set the path to the ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const transporter = nodemailer.createTransport({
  host: "smtp.ionos.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_FROM, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

const addMediaPost = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const { contest_id, title, description, genres } = req.body;

  // Check if the contest exists
  const contestExists = await contestSchema.exists({ _id: contest_id });
  if (!contestExists) {
    result.code = 2031;
    return result;
  }

  const existingMediaPost = await contestSchema.findOne({
    _id: contest_id,
    "participates.user_id": payload.id,
  });
  if (existingMediaPost) {
    result.code = 205;
    return result;
  }

  // Convert genres to an array of unique strings
  const genresArray = [
    ...new Set(
      genres.flatMap((genreString) =>
        genreString.split(",").map((genre) => genre.trim())
      )
    ),
  ];

  // Build the mediaPost object
  const mediaPost = {
    user_id: payload.id,
    title: title,
    description: description,
    genres: genresArray,
    status: "Under Review",
  };

  // Convert video to mp4 format and compress if it's a video file
  if (
    req.file &&
    (req.file.mimetype.startsWith("video/") ||
      req.file.mimetype.startsWith("application/")) &&
    !req.file.originalname.endsWith(".mp4")
  ) {
    const mp4FileName = `${req.file.filename.split(".")[0]}.mp4`;
    const mp4FilePath = path.join(
      __dirname,
      `../../public/mediaVideo/${mp4FileName}`
    );

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(req.file.path)
        .videoCodec("libx264") // Use H.264 codec for video
        .audioCodec("aac") // Use AAC codec for audio
        .outputOptions([
          "-vf",
          "scale=640:480", // Resize video to 640x480 (adjust as needed)
          "-crf",
          "28", // Set Constant Rate Factor for video quality (adjust as needed)
          "-preset",
          "medium", // Set the encoding preset for speed vs compression ratio (adjust as needed)
        ])
        .output(mp4FilePath)
        .on("end", async () => {
          // Delete the original video file
          fs.unlink(req.file.path, () => {});

          // Update the mediaPost object with the mp4 file path
          mediaPost.media = `${MEDIA_VIDEO_URL}${mp4FileName}`;

          // Update the contest with the new mediaPost
          const updatedContest = await contestSchema.findOneAndUpdate(
            { _id: contest_id },
            { $push: { participates: mediaPost } },
            { new: true }
          );

          if (updatedContest) {
            const user = await appUserSchema.findById(payload.id);
            const contestData = await contestSchema.findById({
              _id: contest_id,
            });
            let newGenres = await Promise.all(
              genresArray.map(async (genr) => {
                const genreObject = await genreSchema.findById(genr);
                return genreObject ? genreObject.name : null;
              })
            );

            newGenres = newGenres.filter((genre) => genre !== null).join(", ");
            const message = await helper.getContestParticipantMailappUser(
              user,
              mediaPost,
              contestData,
              newGenres
            );
            const messageData = await helper.getMessage(
              message,
              user.email,
              process.env.EMAIL_FROM,
              "Vibrer Participation confirmation"
            );

            // Assuming you have a function to send the verification email
            const send = await transporter.sendMail(messageData);
            result.data = mediaPost;
            result.code = 201;
          } else {
            result.code = 204;
          }

          resolve();
        })
        .on("error", (err) => {
          console.error("Error during video conversion:", err);
          reject(err);
        })
        .run();
    });
  } else if (
    req.file &&
    req.file.mimetype.startsWith("video/") &&
    req.file.originalname.endsWith(".mp4")
  ) {
    // If it's not a video, update mediaPost with the original file path
    mediaPost.media = `${MEDIA_VIDEO_URL}${req.file.filename}`;

    // Update the contest with the new mediaPost
    const updatedContest = await contestSchema.findOneAndUpdate(
      { _id: contest_id },
      { $push: { participates: mediaPost } },
      { new: true }
    );

    if (updatedContest) {
      const user = await appUserSchema.findById(payload.id);
      const contestData = await contestSchema.findById({ _id: contest_id });
      let newGenres = await Promise.all(
        genresArray.map(async (genr) => {
          const genreObject = await genreSchema.findById(genr);
          return genreObject ? genreObject.name : null;
        })
      );

      newGenres = newGenres.filter((genre) => genre !== null).join(", ");
      const message = await helper.getContestParticipantMailappUser(
        user,
        mediaPost,
        contestData,
        newGenres
      );
      const messageData = await helper.getMessage(
        message,
        user.email,
        process.env.EMAIL_FROM,
        "Vibrer Participation confirmation"
      );

      // Assuming you have a function to send the verification email
      const send = await transporter.sendMail(messageData);
      result.data = mediaPost;
      result.code = 201;
    } else {
      result.code = 204;
    }
  }

  return result;
};

const updateMediaPostStatus = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const { contest_id, participate_id, status } = req.body;

  // Check if the contest exists
  const contestExists = await contestSchema.exists({ _id: contest_id });
  if (!contestExists) {
    result.code = 2031;
    return result;
  }

  const existingMediaPost = await contestSchema.findOne({
    _id: contest_id,
    "participates.user_id": participate_id,
  });

  if (!existingMediaPost) {
    result.code = 2032;
    return result;
  }

  // Update the status of the specific participant
  const updatedContest = await contestSchema.findOneAndUpdate(
    {
      _id: contest_id,
      "participates.user_id": participate_id,
    },
    {
      $set: {
        "participates.$.status": status,
      },
    },
    { new: true }
  );

  if (updatedContest) {
    const updatedParticipant = updatedContest.participates.find(
      (participant) =>
        participant.user_id.toString() === participate_id.toString()
    );
    if (status === "Active") {
      const genresArray = updatedParticipant.genres;

      const user = await appUserSchema.findById(participate_id);
      const contestData = await contestSchema.findById({ _id: contest_id });
      let newGenres = await Promise.all(
        genresArray.map(async (genr) => {
          const genreObject = await genreSchema.findById(genr);
          return genreObject ? genreObject.name : null;
        })
      );

      newGenres = newGenres.filter((genre) => genre !== null).join(", ");
      const message = await helper.getContestApprovalMailappUser(
        user,
        updatedParticipant,
        contestData,
        newGenres
      );
      const messageData = await helper.getMessage(
        message,
        user.email,
        process.env.EMAIL_FROM,
        "Vibrer Participation Approved"
      );

      const send = await transporter.sendMail(messageData);
    }

    result.data = updatedParticipant;
    result.code = 202;
  } else {
    result.code = 204;
  }

  return result;
};

const contestParticipateVote = async (req) => {
  const result = { data: null };
  const { contest_id, participate_id } = req.body;
  const payload = req.decoded;

  try {
    const contestData = await contestSchema.findById({ _id: contest_id });

    if (!contestData) {
      result.code = 204;
      return result;
    }

    // Find the participant that the user has previously voted for
    const previousVoteParticipant = contestData.participates.find(
      (participant) =>
        participant.votes.some(
          (vote) => String(vote.user_id) === String(payload.id)
        )
    );

    // Check if the user has previously voted for a different participant
    if (
      previousVoteParticipant &&
      String(previousVoteParticipant.user_id) !== String(participate_id)
    ) {
      // Remove the earlier vote for the different participant
      previousVoteParticipant.votes = previousVoteParticipant.votes.filter(
        (vote) => String(vote.user_id) !== String(payload.id)
      );

      // Save the updated contest data
      await contestData.save();

      result.code = 2036; // Vote removed successfully
    }

    // Find the current participant
    const currentParticipant = contestData.participates.find(
      (participant) => String(participant.user_id) === String(participate_id)
    );

    // Check if the user has already voted for the current participant
    const existingVoteIndex = currentParticipant.votes.findIndex(
      (vote) => String(vote.user_id) === String(payload.id)
    );

    if (existingVoteIndex !== -1) {
      // If the user has already voted for the same participant, remove the vote
      currentParticipant.votes.splice(existingVoteIndex, 1);

      // Save the updated contest data
      await contestData.save();

      result.code = 2036; // Vote removed successfully
    } else {
      // Add a vote to the current participant if it doesn't exist
      currentParticipant.votes.push({
        user_id: payload.id,
      });

      // Save the updated contest data
      await contestData.save();

      result.code = 2035; // Vote added successfully
    }

    result.data = contestData;
  } catch (error) {
    result.code = 500; // Internal Server Error
    result.message = "Error processing the request";
  }

  return result;
};

const addToFavourite = async (req) => {
  const result = { data: null };
  const { contest_id, participate_id } = req.body;
  const payload = req.decoded;

  try {
    const contestData = await contestSchema.findById({ _id: contest_id });

    if (!contestData) {
      result.code = 2031;
      return result;
    }

    const isParticipateIdExists = contestData.participates.some(
      (participant) => String(participant.user_id) === String(participate_id)
    );

    if (!isParticipateIdExists) {
      result.code = 2032;
      return result;
    }
    const user = await appUserSchema.findById(payload.id);

    if (!user) {
      result.code = 2017;
      return result;
    }

    // Find the existing favorite, if any
    const existingFavoriteIndex = user.favourites.findIndex(
      (favorite) => String(favorite.contest_id) === String(contest_id)
    );

    if (existingFavoriteIndex !== -1) {
      // If the contest already exists in favorites
      const existingFavorite = user.favourites[existingFavoriteIndex];

      if (!existingFavorite.participant_ids.includes(participate_id)) {
        // If the participant doesn't exist in participant_ids, add it
        existingFavorite.participant_ids.push(participate_id);
        result.code = 2033; // Participant added to favorites
      } else {
        // If the participant already exists, remove it from participant_ids
        const participantIndex =
          existingFavorite.participant_ids.indexOf(participate_id);
        if (participantIndex !== -1) {
          existingFavorite.participant_ids.splice(participantIndex, 1);

          // If participant_ids becomes empty, remove the entire favorite entry
          if (existingFavorite.participant_ids.length === 0) {
            user.favourites.splice(existingFavoriteIndex, 1);
            result.code = 2034; // Entire entry removed from favorites
          } else {
            result.code = 2034; // Participant removed from favorites
          }
        }
      }
    } else {
      // If the contest doesn't exist in favorites, create a new favorite
      user.favourites.push({
        contest_id: contest_id,
        participant_ids: [participate_id],
      });
      result.code = 2033; // New favorite created
    }

    // Save the updated user data
    const updatedUserData = await user.save();

    result.data = updatedUserData;
  } catch (error) {
    console.error("Error:", error);
    result.code = 500; // Internal Server Error
    result.message = "Error processing the request";
  }

  return result;
};

const getAllFavouriteContestParticipants = async (req) => {
  const result = { data: null };
  const payload = req.decoded;

  try {
    // Find the user by their ID
    const user = await appUserSchema.findById(payload.id);

    if (!user) {
      result.code = 2017;
      return result;
    }

    // Extract favorites data
    const favorites = user.favourites.map((favorite) => ({
      contest_id: favorite.contest_id,
      participant_ids: favorite.participant_ids,
    }));

    // Fetch detailed information for each favorite contest and participants
    const detailedFavorites = [];
    for (const favorite of favorites) {
      const contestData = await contestSchema
        .findById(favorite.contest_id)
        .populate({
          path: "participates.user_id",
          model: "app_users",
        });

      if (contestData) {
        const currentDate = new Date();
        const endDateTime = new Date(
          contestData.ends_on.end_date + " " + contestData.ends_on.end_time
        );
        const timeDifference = endDateTime.getTime() - currentDate.getTime();
        const endDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

        const participants = contestData.participates
          .filter((participant) =>
            favorite.participant_ids.includes(
              participant.user_id._id.toString()
            )
          )
          .map((participant) => {
            // Check if the user has voted for this participant
            const isVoted = participant.votes.some(
              (vote) => String(vote.user_id) === String(payload.id)
            );

            return {
              user_id: {
                _id: participant.user_id._id,
                email: participant.user_id.email,
                name: participant.user_id.name,
                profile_img: participant.user_id.profile_img,
                profile_cover: participant.user_id.profile_cover,
                username: participant.user_id.username,
                city: participant.user_id.city,
                country: participant.user_id.country,
                date_of_birth: participant.user_id.date_of_birth,
                gender: participant.user_id.gender,
                verified: participant.user_id.verified,
              },
              title: participant.title,
              description: participant.description,
              media: participant.media,
              genres: participant.genres,
              votes: participant.votes,
              is_voted: isVoted,
            };
          });

        // Sort participants by votes in descending order
        participants.sort((a, b) => b.votes.length - a.votes.length);

        // Assign ranks based on the sorted order
        participants.forEach((participant, index) => {
          participant.rank = index + 1;
        });

        detailedFavorites.push({
          contest_id: contestData._id,
          contest_details: {
            title: contestData.title,
            description: contestData.description,
            conditions: contestData.conditions,
            reward: contestData.reward,
            banner: contestData.banner,
            start_on: contestData.start_on,
            ends_on: contestData.ends_on,
            endDays: endDays,
          },
          participants,
        });
      }
    }

    if (detailedFavorites.length > 0) {
      result.data = detailedFavorites;
      result.code = 200;
    } else {
      result.code = 204;
    }
  } catch (error) {
    console.error("Error:", error);
    result.code = 500; // Internal Server Error
    result.message = "Error processing the request";
  }

  return result;
};

const getVotedContestParticipants = async (req) => {
  const result = { data: null };
  const payload = req.decoded;

  try {
    // Find the user by their ID
    const user = await appUserSchema.findById(payload.id);

    if (!user) {
      result.code = 2017;
      return result;
    }

    // Fetch detailed information for each contest and participants
    const votedContests = [];
    const allContests = await contestSchema.find().populate({
      path: "participates.user_id",
      model: "app_users",
    });

    for (const contestData of allContests) {
      const currentDate = new Date();
      const endDateTime = new Date(
        contestData.ends_on.end_date + " " + contestData.ends_on.end_time
      );
      const timeDifference = endDateTime.getTime() - currentDate.getTime();
      const endDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

      const votedParticipants = contestData.participates
        .filter((participant) =>
          participant.votes.some(
            (vote) => String(vote.user_id) === String(payload.id)
          )
        )
        .map((participant) => {
          // Check if the user has voted for this participant
          const isVoted = participant.votes.some(
            (vote) => String(vote.user_id) === String(payload.id)
          );

          // Check if the participant is in the user's favorites
          const isFavourite = user.favourites.some((favorite) =>
            favorite.participant_ids.includes(participant.user_id._id)
          );

          return {
            user_id: {
              _id: participant.user_id._id,
              email: participant.user_id.email,
              name: participant.user_id.name,
              profile_img: participant.user_id.profile_img,
              profile_cover: participant.user_id.profile_cover,
              username: participant.user_id.username,
              city: participant.user_id.city,
              country: participant.user_id.country,
              date_of_birth: participant.user_id.date_of_birth,
              gender: participant.user_id.gender,
              verified: participant.user_id.verified,
            },
            title: participant.title,
            description: participant.description,
            media: participant.media,
            genres: participant.genres,
            votes: participant.votes,
            is_voted: isVoted,
            is_favourite: isFavourite,
          };
        });

      // Sort participants by votes in descending order
      votedParticipants.sort((a, b) => b.votes.length - a.votes.length);

      // Assign ranks based on the sorted order
      votedParticipants.forEach((participant, index) => {
        participant.rank = index + 1;
      });

      if (votedParticipants.length > 0) {
        votedContests.push({
          contest_id: contestData._id,
          contest_details: {
            title: contestData.title,
            description: contestData.description,
            conditions: contestData.conditions,
            reward: contestData.reward,
            banner: contestData.banner,
            start_on: contestData.start_on,
            ends_on: contestData.ends_on,
            endDays: endDays,
          },
          participants: votedParticipants,
        });
      }
    }

    if (votedContests.length > 0) {
      result.data = votedContests;
      result.code = 200;
    } else {
      result.code = 204;
    }
  } catch (error) {
    console.error("Error:", error);
    result.code = 500; // Internal Server Error
    result.message = "Error processing the request";
  }

  return result;
};

const getUserParticipatedContests = async (req) => {
  const result = { data: null };
  const payload = req.decoded;

  try {
    // Find the user by their ID
    const user = await appUserSchema.findById(payload.id);

    if (!user) {
      result.code = 2017;
      return result;
    }

    // Fetch detailed information for each contest and participants
    const participatedContests = [];
    const allContests = await contestSchema.find().populate({
      path: "participates.user_id",
      model: "app_users",
    });

    for (const contestData of allContests) {
      const currentDate = new Date();
      const endDateTime = new Date(
        contestData.ends_on.end_date + " " + contestData.ends_on.end_time
      );
      const timeDifference = endDateTime.getTime() - currentDate.getTime();
      const endDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

      // Check if the user has voted for at least one participant in this contest
      const isUserParticipant = contestData.participates.some((participant) =>
        participant.votes.some(
          (vote) => String(vote.user_id) === String(payload.id)
        )
      );

      if (isUserParticipant) {
        const participatedParticipants = contestData.participates
          .filter((participant) =>
            participant.votes.some(
              (vote) => String(vote.user_id) === String(payload.id)
            )
          )
          .map((participant) => {
            // Check if the participant is in the user's favorites
            const isFavourite = user.favourites.some((favorite) =>
              favorite.participant_ids.includes(participant.user_id._id)
            );

            return {
              user_id: {
                _id: participant.user_id._id,
                email: participant.user_id.email,
                name: participant.user_id.name,
                profile_img: participant.user_id.profile_img,
                profile_cover: participant.user_id.profile_cover,
                username: participant.user_id.username,
                city: participant.user_id.city,
                country: participant.user_id.country,
                date_of_birth: participant.user_id.date_of_birth,
                gender: participant.user_id.gender,
                verified: participant.user_id.verified,
              },
              title: participant.title,
              description: participant.description,
              media: participant.media,
              genres: participant.genres,
              votes: participant.votes,
              is_favourite: isFavourite,
            };
          });

        // Sort participants by votes in descending order
        participatedParticipants.sort(
          (a, b) => b.votes.length - a.votes.length
        );

        // Assign ranks based on the sorted order
        participatedParticipants.forEach((participant, index) => {
          participant.rank = index + 1;
        });

        if (participatedParticipants.length > 0) {
          participatedContests.push({
            contest_id: contestData._id,
            contest_details: {
              title: contestData.title,
              description: contestData.description,
              conditions: contestData.conditions,
              reward: contestData.reward,
              banner: contestData.banner,
              start_on: contestData.start_on,
              ends_on: contestData.ends_on,
              endDays: endDays,
            },
            participants: participatedParticipants,
          });
        }
      }
    }

    if (participatedContests.length > 0) {
      result.data = participatedContests;
      result.code = 200;
    } else {
      result.code = 204;
    }
  } catch (error) {
    console.error("Error:", error);
    result.code = 500; // Internal Server Error
    result.message = "Error processing the request";
  }

  return result;
};

// const getMediaPost = async (req) => {
//   const result = { data: null };
//   const id = req.params.id;
//   const mediaPost = await mediaPostSchema.findOne({ _id: id });
//   if (mediaPost) {
//     result.data = mediaPost;
//     result.code = 200;
//   } else {
//     result.code = 204;
//   }
//   return result;
// };

const deleteMediaPost = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const payload = req.decoded;

  try {
    const contest = await contestSchema.findOne({
      _id: id,
      "participates.user_id": payload.id,
    });

    if (contest) {
      // Get the media file URL from the contest data
      const mediaFileUrl = contest.participates.find(
        (participant) => String(participant.user_id) === String(payload.id)
      ).media;

      // Parse the URL to get the file name
      const fileName = mediaFileUrl.split("/").pop();

      // Construct the absolute path to the media file on your server
      const absoluteFilePath = path.join(
        __dirname,
        "../../public/mediaVideo",
        fileName
      );

      // Delete the media file
      await fs.unlink(absoluteFilePath);

      const updateResult = await contestSchema.updateOne(
        {
          _id: id,
          "participates.user_id": payload.id,
        },
        {
          $pull: {
            participates: {
              user_id: payload.id,
            },
          },
        }
      );

      if (updateResult.modifiedCount > 0) {
        result.code = 203; // Successfully deleted
      } else {
        result.code = 206; // No modifications (not deleted)
      }
    } else {
      result.code = 206; // Contest or user not found
    }
  } catch (error) {
    console.error("Error deleting media post:", error);
    result.code = 500; // Internal server error
  }

  return result;
};

module.exports = {
  addMediaPost,
  contestParticipateVote,
  updateMediaPostStatus,
  // getAllMediaPost,
  // getMediaPost,
  deleteMediaPost,
  addToFavourite,
  getAllFavouriteContestParticipants,
  getVotedContestParticipants,
  getUserParticipatedContests,
};
