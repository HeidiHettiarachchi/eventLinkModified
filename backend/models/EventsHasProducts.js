const mongoose = require("mongoose");

const EventsHasProductsSchema = new mongoose.Schema(
    {
        event_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "eventRegForm",
            required: true,
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        accepted: {
            type: Boolean,
            default: false
        },
        qty: {
            type: Number,
            requred: true
        }
    },
    { timestamps: true }
);

const EventsHasProducts = mongoose.model("EventsHasProducts", EventsHasProductsSchema);

module.exports = EventsHasProducts;
