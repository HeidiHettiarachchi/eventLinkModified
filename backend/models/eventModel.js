const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventRegSchema = new Schema({
    eventID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },

    eventName: {
        type: String,
        required: true
    },

    eventDate: {
        type: String,
        required: true
    },

    eventStartTime: {
        type: String, 
        required: true
    },

    eventFinishTime: {
        type: String, 
        required: true
    },

    timePeriod: {
        type: String, 
        required: true
    },

    eventPresident: {
        type: String, 
        required: true
    },

    eventProposal: {
        type: String,
        required: false
    },

    eventForm: {
        type: String,
        required: true
    },

    eventMode: {
        type: String, 
        enum: ['Physical', 'Online'], 
        required: true
    },

    eventType: {
        type: String, 
        enum: ['Hackathon', 'Academic', 'Non-Academic'],
        required: true
    },
    eventVenue:{
        type: String, 
        required: false,
        default: 'N/A'
    },
    eventStatus: {
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
        required: true
    }, 
    eventBudget: {
        type: Number, 
        required: true
    },
    eventImage: {
        type: String, 
        required: false
    },
}, { timestamps: true });

const eventRegForm = mongoose.model('eventRegForm', eventRegSchema);

module.exports = eventRegForm;