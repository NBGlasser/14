var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ArtSchema = new Schema({

    title: {
        type: String,
        required: false
    },
    link: {
      type: String,
      required: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
})

var Article = mongoose.model("Article", ArtSchema);

module.exports = Article;
