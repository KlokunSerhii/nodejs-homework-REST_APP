const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const validName =
  /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/;
const validPhone =
  /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const addSchemaPost = Joi.object({
  name: Joi.string()
    .min(2)
    .max(15)
    .pattern(new RegExp(validName))
    .required(),
  phone: Joi.string()
    .min(5)
    .pattern(new RegExp(validPhone))
    .required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  favorite: Joi.boolean(),
});

const addSchemaPut = Joi.object({
  name: Joi.string().min(2).max(50).pattern(new RegExp(validName)),
  phone: Joi.string().min(5).pattern(new RegExp(validPhone)),
  email: Joi.string().email({ minDomainSegments: 2 }),
  favorite: Joi.boolean(),
});
const Contact = model("contact", contactSchema);

const schemas = { addSchemaPut, addSchemaPost };

module.exports = { Contact, schemas };
