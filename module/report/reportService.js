const entryReportSchema = require("../../model/entry_report");
const contestSchema = require("../../model/contests");

const submitReport = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const {
    contest_id,
    entry_id,
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

  if (!isParticipateIdExists) {
    result.code = 2032;
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

module.exports = {
  submitReport,
};
