const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const validEmail =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },

  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const authSchema = Joi.object({
  password: Joi.string().min(2).max(15).required(),
  email: Joi.string().pattern(new RegExp(validEmail)).required(),
});
const emailSchema = Joi.object({
  email: Joi.string().pattern(new RegExp(validEmail)).required(),
});

const subSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const schemas = { authSchema, subSchema, emailSchema };

const User = model("user", userSchema);

module.exports = { User, schemas };
