const mongoos = require('mongoose');
const Schema = mongoos.Schema;


const blogSchema = new Schema({

    user_id:{
        type: mongoos.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    title: {
        type: String,
        require: [true, "Please enter the title"],
    },
    snippet: {
        type: String,
        require: [true, "Please enter the snippet"],
    },
    body: {
        type: String,
        require: [true, "Please enter the body"],
    }
},
    {
        timestamps: true
    }
)


const Blog = mongoos.model('Blog', blogSchema);
module.exports = Blog