import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    title: String,
    message: String
}, {
    collection: 'feedback'
});
const SpeakersSchema = new mongoose.Schema({
    name: String,
    shortname: String,
    title: String,
    summary: String,
    description: String,
    artWork: Array
}, {
    collection: 'speakers'
});
export const Feedback = mongoose.model('Feedback', FeedbackSchema);
export const Speakers = mongoose.model('Speakers', SpeakersSchema);