var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	roll: String,
	password: String,
	passwordConf: String,
	course: [String],
}),
User = mongoose.model('User', userSchema);

module.exports = User;