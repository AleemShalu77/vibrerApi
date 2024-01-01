const fs = require("fs").promises;
const path = require("path");
const url = require("url");
// const mediaPostSchema = require("../../model/media_post");
const contestSchema = require("../../model/contests");
const { MEDIA_VIDEO_URL } = require("../../config/index");

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
    media: `${MEDIA_VIDEO_URL}${req.file.filename}`, // Assuming you have MEDIA_VIDEO_URL defined
  };

  // Update the contest with the new mediaPost
  const updatedContest = await contestSchema.findOneAndUpdate(
    { _id: contest_id },
    { $push: { participates: mediaPost } },
    { new: true }
  );

  if (updatedContest) {
    result.data = mediaPost;
    result.code = 201;
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
      // Remove the earlier vote
      previousVoteParticipant.votes = previousVoteParticipant.votes.filter(
        (vote) => String(vote.user_id) !== String(payload.id)
      );
    }

    // Find the current participant
    const currentParticipant = contestData.participates.find(
      (participant) => String(participant.user_id) === String(participate_id)
    );

    // Check if the user has already voted for the current participant
    const hasVoted = currentParticipant.votes.some(
      (vote) => String(vote.user_id) === String(payload.id)
    );

    if (hasVoted) {
      result.code = 205; // User has already voted for this participant
      return result;
    }

    // Add a vote to the current participant
    currentParticipant.votes.push({
      user_id: payload.id,
    });

    // Save the updated contest data
    const updatedContestData = await contestData.save();

    result.data = updatedContestData;
    result.code = 200;
  } catch (error) {
    result.code = 500; // Internal Server Error
    result.message = "Error processing the request";
  }

  return result;
};

// const updateMediaPost = async (req) => {
//     const result = { data: null };
//     const { id, title, description, type, media, file_name, slug, meta, likes, createdBy, status } = req.body;
//     const filter = { _id: id };
//     const mediaPost = await mediaPostSchema.updateOne(filter, {
//         title: title,
//         description: description,
//         type: type,
//         media: media,
//         file_name: file_name,
//         slug: slug,
//         meta: meta,
//         // likes:likes,
//         // createdBy:createdBy,
//         status: status
//     });
//     if (mediaPost) {
//         result.data = mediaPost;
//         result.code = 202;
//     } else {
//         result.code = 204;
//     }
//     return result;
// }

// const getAllMediaPost = async (req) => {
//     const result = { data: null };
//     const mediaPost = await mediaPostSchema.find();
//     if (mediaPost) {
//         result.data = mediaPost;
//         result.code = 200;
//     } else {
//         result.code = 204;
//     }
//     return result;
// }

// const getMediaPost = async (req) => {
//     const result = { data: null };
//     const id = req.params.id;
//     const mediaPost = await mediaPostSchema.findOne({ _id: id });
//     if (mediaPost) {
//         result.data = mediaPost;
//         result.code = 200;
//     } else {
//         result.code = 204;
//     }
//     return result;
// }

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
  // updateMediaPost,
  // getAllMediaPost,
  // getMediaPost,
  deleteMediaPost,
};
