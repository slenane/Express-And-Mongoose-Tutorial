const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { uuid } = require('uuidv4');
const mongoose = require('mongoose');

// This is telling mongoose what DB to connect to "movieApp" - If it doesn't exist it will create it
// The then and catch will let you know if you have been succesfully connected to the server
mongoose.connect('mongodb://localhost:27017/movieApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("CONNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("ERROR");
        console.log(err);
    })

// Import your subreddit JSON file
// const redditData = require("the JSON file")

// Import css/js/img files from the public folder and serve them to the ejs files 
// You only need to write href="./app.css" for the CSS file and not the whole path
// Use path.join to find the absolute path as below
app.use(express.static(path.join(__dirname, "/public")));

// The below is middleware to parse the req.body otherwise it will return undefined
// THese will parse URL and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add method overrride to use patch requests in html
// Set action of the form to action="/resource?_method=patch"
app.use(methodOverride("_method"));

// This will allow you to use EJS files and it will look in the views folder
app.set("view engine", "ejs");
// This will allow you to run nodemon from any folder and it will find the file
app.set("views", path.join(__dirname, "/views"));

// This will fire every time a new request is made
// app.use((req, res) => {
//     console.log("We GOT A NEW REQUEST!")
// });

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/cats", (req, res) => {
    res.send("MEOW");
});

app.get("/dogs", (req, res) => {
    res.send("WOOF");
});

// You can pass key value pairs into the ejs file as a second argument on the render
app.get("/random", (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1;
    res.render("random", { rand: num });
})

// Search for whatever you like and the query will = q which is what shows in the url and will show on your page
// UNless you search for nothing
app.get("/search", (req, res) => {
    const { q } = req.query;
    if (!q) {
        res.send("NOTHING FOUND IF NOTHING SEARCHED")
    }
    res.send(`<h1>Search results for: ${q}</h1>`);
});

// Here you can set the value to be passed in to be the req.params which is the :subreddit here
// This will give every page the same HTML with a different subreddit title
app.get("/r/:subreddit", (req, res) => {
    const { subreddit } = req.params;
    // You can also then use the req.params to get data from a JSON file - You have to import the JSON file from a dtabase and insert it like below
    const data = redditData[subreddit];
    // Then spread the data into the ejs file - Then you can directly show name/id etc without writing data.whatever
    if (data) {
        res.render("subreddit", { ...data })
    } else {
        res.render("notfound", { subreddit });
    }
});


// Get and Post requests
app.get("/tacos", (req, res) => {
    res.send("GET /tacos response")
});

app.post("/tacos", (req, res) => {
    // req.body will return an object with the submitted form data
    // Which you can destructure and save as a variable
    const { meat, qty } = req.body;
    res.send(`OK, here are you ${qty} ${meat} tacos`);
});

// RESTful Routes
// GET /comments - list all comments
// POST /comments - Create a new comment
// GET /comments/:id - Get one comment
// PATCH /comments/:id - Update one comment
// DELETE /comments/:id - Destroy one comment
 
app.get("/comments", (req, res) => {
    // This would be an index route that shows all comments
    // The comments being fed into the render is from a fictional array here to simulate a DB
    res.render("comments/index", { comments })
});

app.get("/comments/new", (req, res) => {
   // This will show the form to add a new comment 
    res.render("comments/new");
})

app.post("/comments", (req, res) => {
    const { username, comment } = req.body;
    // Push the comment to the fictional comments array
    // Use uuid to generate a random id
    comments.push({ username, comment, id: uuid() });
    res.redirect("/comments");
})

app.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render("comments/show", { comment })
})

// Show the edit comment form
app.get("/comments/:id/edit", (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render("comments/edit", { comment })
})

// You need to install method-override to submit the comment edit because HTML still doesn't accept patch requests
// method="POST" action="/comments/<%=comment.id%>?_method=PATCH"
app.patch("/comments/:id", (req, res) => {
    const { id } = req.params;
    const newCommentText = req.body.comment;
    const foundComment = comments.find(c => c.id === id);
    foundComment.comment = newCommentText;
    res.redirect("/comments");
})

// method="POST" action="/comments/<%=comment.id%>?_method=DELETE"
app.delete("/comments/:id", (req, res) => {
    const { id } = req.params;
    comments = comments.filter(c => c.id !== id);
    res.redirect("/comments");
})

// This is a catch all at the end if it matches nothing you have set
app.get("*", (req, res) => {
    res.send("Route not found");
});



app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
});