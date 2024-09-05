const inquirySchema = require("../../model/inquiry");

const addInquiry = async (req) => {
  const result = { data: null };
  const {
    inq_type,
    first_name,
    last_name,
    email,
    phone,
    company,
    city,
    country,
    message,
    interview,
  } = req.body;

  try {
    const inquiry = await inquirySchema.create({
      inq_type: inq_type,
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      company: company || null, // Optional
      city: city,
      country: country,
      message: message,
      interview: interview || false, // Default value is false
    });

    if (inquiry) {
      result.data = inquiry;
      result.code = 201;
    } else {
      result.code = 204;
    }
  } catch (error) {
    result.code = 500; // Handle error, set proper code and log/return error
    result.error = error.message;
  }

  return result;
};

const getAllInquiries = async (req) => {
  const result = { data: null };

  try {
    const inquiries = await inquirySchema.find().sort({ createdAt: -1 });
    if (inquiries && inquiries.length > 0) {
      result.data = inquiries;
      result.code = 200;
    } else {
      result.code = 204; // No inquiries found
    }
  } catch (error) {
    result.code = 500; // Handle error
    result.error = error.message;
  }

  return result;
};

const getInquiry = async (req) => {
  const result = { data: null };
  const id = req.params.id;

  try {
    const inquiry = await inquirySchema.findById(id);
    if (inquiry) {
      result.data = inquiry;
      result.code = 200;
    } else {
      result.code = 204; // No inquiry found for the given ID
    }
  } catch (error) {
    result.code = 500; // Error in case of invalid ID or other issues
    result.error = error.message;
  }

  return result;
};

const deleteInquiry = async (req) => {
  const result = { data: null };
  const id = req.params.id;

  try {
    const inquiry = await inquirySchema.findByIdAndRemove(id);
    if (inquiry) {
      result.data = inquiry;
      result.code = 203; // 203 for successful deletion
    } else {
      result.code = 204; // No inquiry found to delete
    }
  } catch (error) {
    result.code = 500; // Error occurred during deletion
    result.error = error.message;
  }

  return result;
};

module.exports = {
  addInquiry,
  getAllInquiries,
  getInquiry,
  deleteInquiry,
};
