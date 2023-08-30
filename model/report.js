const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    content_id: { type: String, required: true },
    content_type: { type: String, required: true },
    report_reason: { type: String, required: true },
    report_description: { type: String, required: true },
    reporter_id: { type: String, required: true },
    reported_user_id: { type: String, required: true },
    reportedAt: { type: Date, default: Date.now },
    reviewer_id: { type: String },
    action_taken: {
        title: { type: String },
        description: { type: String },
        action_taken_at: { type: Date },
        action_taken_by: { type: String }
    },
    action_date: { type: Date },
    report_status: [{ type: String }],
    status: [{ type: String }],
    report_default_message: [{
        to: { type: String },
        message: { type: String },
        seen: { type: Boolean, default: false }
    }],
    report_messages: [{
        to: { type: String },
        message: { type: String },
        sent_by: { type: String },
        sentAt: { type: Date, default: Date.now },
        seen: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
