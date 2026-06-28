import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
	shop: {
		type: String,
		required: true,
	},
	announcementText: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	}
});

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
