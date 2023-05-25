const asyncHandler = require('express-async-handler');
const Blog = require('../models/blog');


const getContacts = asyncHandler(async (req, res) => {
    const blog = await Blog.find({user_id: req.user.id});
    res.status(200).json(blog);
})

const getContact = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(blog);
})


const addContact = asyncHandler(async (req, res) => {
    const { title, snippet, body } = req.body;

    if (!title || !snippet || !body) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const blog = new Blog({
        title: title,
        snippet: snippet,
        body: body,
        user_id: req.user.id
    });

    blog.save()
        .then((result) => res.status(200).json({ status: 201, message: 'Contact created sucessfully', data: result }))
        .catch((err) => res.status(400).json({ status: 400, message: `${err}` }))

})


const updateContact = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        res.status(404);
        throw new Error("Contact not found");
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );


    res.status(200).json(updatedBlog);
})


const deleteContact = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404);
      throw new Error("Contact not found");
    }
   
    await Blog.deleteOne({ _id: req.params.id });
    res.status(200).json(blog);
})

module.exports = { getContacts, getContact, addContact, updateContact, deleteContact }