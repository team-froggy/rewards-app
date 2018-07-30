const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: String,
    location: {
        address: String,
        city: String,
        state: String,
        zip: String
    },
    phone: {
        type: String,
        maxlength: 10
    },
    hours: String,
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Bar', schema);