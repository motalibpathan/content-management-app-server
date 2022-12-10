require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const url = process.env.DATABASE_URI;
// const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q66zrl2.mongodb.net/?retryWrites=true&w=majority`;
// const url = "mongodb://localhost:27017";
const run = async () => {
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
    }).catch((err) => {
      console.log(err);
    });

    if (!client) {
      return;
    }

    const db = client.db("tech-blog");
    const blogCollection = db.collection("blogs");

    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find({});
      const blogs = await cursor.toArray();
      res.send({ status: true, data: blogs });
    });

    app.get("/blogs/:id", async (req, res) => {
      const blog = blogCollection.findOne({ _id: ObjectId(req.params.id) });
      res.send({ status: true, data: blog });
    });

    app.post("/blog", async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    });

    app.patch("/blog/:id", async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: blog }
      );
      res.send(result);
    });

    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
