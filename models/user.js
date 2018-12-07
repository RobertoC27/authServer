const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

// On save hook encrypt password before storing it
userSchema.pre('save', function (next) {
    // Get access to user model
    const user = this;
    const saltRounds = 10;
    bcrypt.hash(user.password, saltRounds)
        .then(function (hash) {
            console.log(hash);
            
            user.password = hash;
            next();
        });

})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
        if(error)
            return callback(error);
        
        callback(null, isMatch);
    })
}

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;