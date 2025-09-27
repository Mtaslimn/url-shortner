// Model file Defines the schema and model for storing shortened URLs and their visit history.

const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({ // here urlSchema is varialbe which use new instance of mongoose schema which is a predefine keyword
    shortId:{ // A field in the schema (like a column in a table). created by me.
        type:String, // Its value must be a string.
        required:true, // required: true → This field is mandatory (can’t be empty).
        unique:true, // unique: true → No two documents can have the same shortId (like a primary key).
    },
    redirectURL:{ // same type as above -- This will store the original long URL where the short link points.
         type:String,
        required:true,
    },
    visitHistory:[{ timestamp:{type: Number}}], // This defines a field that holds an array. created by me
},
{ timestamps: true} //a predefined option in Mongoose. adds two extra fields to every document:
);

const URL = mongoose.model("url", urlSchema); // Creates a model based on the schema. "url" → The name of the collection in MongoDB (it will automatically pluralize → becomes urls).

module.exports = URL; // Makes the URL model available outside this file.
 