const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Import models
const Post = require("./src/models/post");

// Define application
const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", function (req, res) {
	// handle the request for root route
	res.send({ ping: "pong" });
});

// Operations: Create, Read, Update, Delete (CRUD)
app.post("/posts", function (req, res) {
	// Get values from request payload
	const title = req.body.title;
	const author = req.body.author;
	const content = req.body.content;

	// Assign values to Post model
	var post = new Post();
	post.title = title;
	post.author = author;
	post.content = content;

	// Save the post
	post.save(function (error, savedPost) {
		if (error) {
			// send error response
			res.status(500).send({ error: "Unable to save Post " });
		} else {
			// send success response
			res.status(200).send(savedPost);
		}
	});
});

// Get list of all posts
app.get("/posts", function (req, res) {
	Post.find({}, function (error, posts) {
		if (error) {
			// send error response
			res.status(422).send({ error: "Unable to fetch posts " });
		} else {
			// send success response
			res.status(200).send(posts);
		}
	});
});

app.get("/posts/:id", async (req, res) => {
	Post.findById(req.params.id, (error, post) => {
		if (error) {
			res.status(422).send("Unable to fetch post");
		} else {
			res.status(200).json(post);
		}
	});
});

app.delete("/posts/:id", async (req, res) => {
	Post.findByIdAndDelete(req.params.id, (error) => {
		if (error) {
			res.status(422).send("Unable to delete post");
		} else {
			res.status(200).send(`Deleted ${req.params.id} successfully`);
		}
	});
});

app.patch("/posts/:id", async (req, res) => {
	Post.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(error, post) => {
			if (error) {
				res.status(422).send("Unable to update post");
			} else {
				res.status(200).json(post);
			}
		}
	);
});

const PORT = process.env.PORT || 5000;

mongoose
	.connect(process.env.MONGO_URI)
	.then(() =>
		app.listen(PORT, () => {
			console.log(`MongoDB Connected and server running on port: ${PORT}`);
		})
	)
	.catch((err) => {
		console.log(err.message);
	});