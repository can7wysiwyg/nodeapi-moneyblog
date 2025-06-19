const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({
    adminMail: {
        type: String,
        required: true,
        unique: true
    },
    adminKey: {
        type: String,
        required: true,

    },
    adminSession: {
        type: Boolean,
        default: false
    },
    adminToken: {
        type: String,
        unique: true
    }


}, 
{
    timestamps: true
}
)


module.exports = mongoose.model('Admin', AdminSchema)