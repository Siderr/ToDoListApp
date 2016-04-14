var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    text: String,
    completed: { type: Boolean, default: false}
});

module.exports = mongoose.model('Task', taskSchema);