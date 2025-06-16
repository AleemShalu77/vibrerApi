const entryReportSchema = require("../../model/entry_report");
const contestSchema = require("../../model/contests");
const genreSchema = require("../../model/genre");
const { format } = require("date-fns");
const { getFileFromR2 } = require("../../utils/helper");

const submitReport = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const {
    contest_id,
    entry_id,
    reported_user_id,
    content_type,
    report_reason,
    company,
    contact_email,
    report_description,
  } = req.body;

  const reporter_id = payload.id;

  const contestExists = await contestSchema.findOne({ _id: contest_id });
  if (!contestExists) {
    result.code = 2031;
    return result;
  }

  const isParticipateIdExists = contestExists.participates.some(
    (participant) => String(participant._id) === String(entry_id)
  );

  const isParticipateUserIdExists = contestExists.participates.some(
    (participant) => String(participant.user_id) === String(reported_user_id)
  );

  if (!isParticipateIdExists) {
    result.code = 2032;
    return result;
  }

  if (!isParticipateUserIdExists) {
    result.code = 2055;
    return result;
  }

  const existingReport = await entryReportSchema.findOne({
    contest_id,
    entry_id,
    reporter_id,
  });

  if (existingReport) {
    result.code = 205;
    return result;
  }

  const newReport = new entryReportSchema({
    contest_id,
    entry_id,
    reported_user_id,
    content_type,
    report_reason,
    company,
    contact_email,
    report_description,
    reporter_id,
    status: "Pending",
  });

  try {
    const savedReport = await newReport.save();
    result.data = savedReport;
    result.code = 201;
  } catch (error) {
    console.error("Error while saving report:", error);
    result.code = 500;
  }

  return result;
};

const getReports = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const id = payload.id;
  // const id = "65ea1ad4c5543eaf1efb910e";
  let reportQuery = {
    reported_user_id: id,
  };

  if (req.query.status) {
    if (req.query.status === "Active") {
      reportQuery = {
        reported_user_id: id,
        $or: [
          {
            status: "Open",
          },
          {
            status: "Active",
          },
          {
            status: "Under process",
          },
        ],
      };
    } else {
      reportQuery = { reported_user_id: id, status: req.query.status };
    }
  }

  try {
    // Step 1: Fetch report data and populate contest_id and reporter_id
    const reportData = await entryReportSchema
      .find(reportQuery)
      .populate({
        path: "contest_id",
        model: "contests",
        select:
          "title description conditions reward time_zone starts_on ends_on banner",
      })
      .populate({
        path: "reporter_id",
        model: "app_users",
        select:
          "full_name username email profile_img profile_cover verified city country",
      });

    // Step 2: Map over the results and manually fetch the participates data for each entry
    if (reportData && reportData.length > 0) {
      result.data = await Promise.all(
        reportData.map(async (report) => {
          const reportObj = report.toObject(); // Convert to plain JS object

          // Step 3: Find the matching participates document using entry_id and project required fields
          const contest = await contestSchema.findOne(
            {
              _id: report.contest_id._id, // Match contest_id
              "participates._id": report.entry_id, // Match entry_id within participates
            },
            {
              "participates.$": 1, // Project only the matching participate entry
            }
          );

          // Step 4: If found, handle participate data
          if (
            contest &&
            contest.participates &&
            contest.participates.length > 0
          ) {
            let entry = contest.participates[0];

            // Step 5: Populate genres information
            const genresInfo = await genreSchema.find({
              _id: { $in: entry.genres },
            });

            if (genresInfo) {
              entry.genres = genresInfo; // Replace genres with detailed information
            }

            // Step 6: Resolve media URL
            let media = entry.media;
            if (!media.startsWith("http://") && !media.startsWith("https://")) {
              media = await getFileFromR2(media); // Assume getFileFromR2 is defined to fetch the media URL
            }
            entry.media = media; // Update media URL

            // Step 7: Calculate remaining days for contest end
            const currentDate = new Date();
            const contestEndDate = report.contest_id.ends_on;
            const endDateTime = new Date(
              `${contestEndDate.end_date} ${contestEndDate.end_time}`
            );
            const timeDifference =
              endDateTime.getTime() - currentDate.getTime();
            const endDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

            // Add calculated end days to contest
            reportObj.contest_id.endDays = endDays;

            // Step 8: Attach participate details to the report object
            reportObj.participate_details = {
              title: entry.title,
              description: entry.description,
              media: entry.media,
              status: entry.status,
              least_quality: entry.least_quality,
              genres: entry.genres,
            };
          }

          return reportObj;
        })
      );

      result.code = 200;
    } else {
      result.code = 204;
    }
  } catch (error) {
    result.code = 500; // Server error
    result.error = error;
  }

  return result;
};

const entryReported = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const id = payload.id;
  // const id = "65ea1ad4c5543eaf1efb910e";
  let reportQuery = {
    reporter_id: id,
  };

  if (req.query.status) {
    if (req.query.status === "Active") {
      reportQuery = {
        reporter_id: id,
        $or: [
          {
            status: "Open",
          },
          {
            status: "Active",
          },
          {
            status: "Under process",
          },
        ],
      };
    } else {
      reportQuery = { reporter_id: id, status: req.query.status };
    }
  }

  try {
    // Step 1: Fetch report data and populate contest_id and reporter_id
    const reportData = await entryReportSchema
      .find(reportQuery)
      .populate({
        path: "contest_id",
        model: "contests",
        select:
          "title description conditions reward time_zone starts_on ends_on banner",
      })
      .populate({
        path: "reported_user_id",
        model: "app_users",
        select:
          "full_name username email profile_img profile_cover verified city country",
      });

    // Step 2: Map over the results and manually fetch the participates data for each entry
    if (reportData && reportData.length > 0) {
      result.data = await Promise.all(
        reportData.map(async (report) => {
          const reportObj = report.toObject(); // Convert to plain JS object

          // Step 3: Find the matching participates document using entry_id and project required fields
          const contest = await contestSchema.findOne(
            {
              _id: report.contest_id._id, // Match contest_id
              "participates._id": report.entry_id, // Match entry_id within participates
            },
            {
              "participates.$": 1, // Project only the matching participate entry
            }
          );

          // Step 4: If found, handle participate data
          if (
            contest &&
            contest.participates &&
            contest.participates.length > 0
          ) {
            let entry = contest.participates[0];

            // Step 5: Populate genres information
            const genresInfo = await genreSchema.find({
              _id: { $in: entry.genres },
            });

            if (genresInfo) {
              entry.genres = genresInfo; // Replace genres with detailed information
            }

            // Step 6: Resolve media URL
            let media = entry.media;
            if (!media.startsWith("http://") && !media.startsWith("https://")) {
              media = await getFileFromR2(media); // Assume getFileFromR2 is defined to fetch the media URL
            }
            entry.media = media; // Update media URL

            // Step 7: Calculate remaining days for contest end
            const currentDate = new Date();
            const contestEndDate = report.contest_id.ends_on;
            const endDateTime = new Date(
              `${contestEndDate.end_date} ${contestEndDate.end_time}`
            );
            const timeDifference =
              endDateTime.getTime() - currentDate.getTime();
            const endDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

            // Add calculated end days to contest
            reportObj.contest_id.endDays = endDays;

            // Step 8: Attach participate details to the report object
            reportObj.participate_details = {
              title: entry.title,
              description: entry.description,
              media: entry.media,
              status: entry.status,
              least_quality: entry.least_quality,
              genres: entry.genres,
            };
          }

          return reportObj;
        })
      );

      result.code = 200;
    } else {
      result.code = 204;
    }
  } catch (error) {
    result.code = 500; // Server error
    result.error = error;
  }

  return result;
};

const reportView = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const id = payload.id;
  if (!req.params.report_id) {
    result.code = 2041;
    return result;
  }

  try {
    // Step 1: Fetch report data and populate contest_id, reported_user_id, and reporter_id
    const reportData = await entryReportSchema
      .findById(req.params.report_id)
      .populate({
        path: "contest_id",
        model: "contests",
        select:
          "title description conditions reward time_zone starts_on ends_on banner",
      })
      .populate({
        path: "reported_user_id",
        model: "app_users",
        select:
          "full_name username email profile_img profile_cover verified city country",
      })
      .populate({
        path: "reporter_id",
        model: "app_users",
        select:
          "full_name username email profile_img profile_cover verified city country",
      });

    // Step 2: Check if report data exists
    if (reportData) {
      const reportObj = reportData.toObject(); // Convert to plain JS object

      // Step 3: Find the matching participates document using entry_id and project required fields
      const contest = await contestSchema.findOne(
        {
          _id: reportObj.contest_id._id, // Match contest_id
          "participates._id": reportObj.entry_id, // Match entry_id within participates
        },
        {
          "participates.$": 1, // Project only the matching participate entry
        }
      );

      // Step 4: If found, handle participate data
      if (contest && contest.participates && contest.participates.length > 0) {
        let entry = contest.participates[0];

        // Step 5: Populate genres information
        const genresInfo = await genreSchema.find({
          _id: { $in: entry.genres },
        });

        if (genresInfo) {
          entry.genres = genresInfo; // Replace genres with detailed information
        }

        // Step 6: Resolve media URL
        let media = entry.media;
        if (!media.startsWith("http://") && !media.startsWith("https://")) {
          media = await getFileFromR2(media); // Assume getFileFromR2 is defined to fetch the media URL
        }
        entry.media = media; // Update media URL

        // Step 7: Calculate remaining days for contest end
        const currentDate = new Date();
        const contestEndDate = reportObj.contest_id.ends_on;
        const endDateTime = new Date(
          `${contestEndDate.end_date} ${contestEndDate.end_time}`
        );
        const timeDifference = endDateTime.getTime() - currentDate.getTime();
        const endDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

        // Add calculated end days to contest
        reportObj.contest_id.endDays = endDays;

        // Step 8: Attach participate details to the report object
        reportObj.participate_details = {
          title: entry.title,
          description: entry.description,
          media: entry.media,
          status: entry.status,
          least_quality: entry.least_quality,
          genres: entry.genres,
        };
      }

      // Step 9: Set the result data and code
      result.data = reportObj;
      result.code = 200;
    } else {
      result.code = 204; // No Content
    }
  } catch (error) {
    result.code = 500; // Server error
    result.error = error;
  }

  return result;
};

module.exports = {
  submitReport,
  getReports,
  entryReported,
  reportView,
};
