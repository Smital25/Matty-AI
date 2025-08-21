const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Team / Group system
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    }
  ],

  // Cloning metadata (optional)
  clonedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
});

// Clone function for a user
UserSchema.statics.cloneUser = async function (userId, teamId) {
  const user = await this.findById(userId);
  if (!user) throw new Error("User not found");

  const clonedUser = new this({
    name: user.name + " (Clone)",
    email: user.email.split("@")[0] + `+clone${Date.now()}@` + user.email.split("@")[1],
    password: user.password,
    clonedFrom: user._id,
    teams: [teamId]
  });

  await clonedUser.save();
  return clonedUser;
};

module.exports = mongoose.model("User", UserSchema);
