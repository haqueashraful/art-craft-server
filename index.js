const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("artCraftDB");
    const artCraftCollection = db.collection("artCraftCollection");

    app.get("/allArtCraft", async (req, res) => {
      try {
        const cursor = await artCraftCollection.find().toArray();
        res.json(cursor);
      } catch (error) {
        console.error("Error fetching all art & craft items:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/allArtCraft/id/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log("Fetching item by ID:", id);
        const query = { _id: new ObjectId(id) };
        const result = await artCraftCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error fetching art & craft item by ID:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/allArtCraft/userEmail/:userEmail", async (req, res) => {
      try {
        const userEmail = req.params.userEmail;
        const query = { userEmail: userEmail };
        const result = await artCraftCollection.find(query).toArray();
        res.json(result);
      } catch (error) {
        console.error("Error fetching art & craft items by user email:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // app.get('/allArtCraft/:queryType/:queryValue', async (req, res) => {
    //   try {
    //     const { queryType, queryValue } = req.params;
    //     let query;
    //     if (queryType === 'id') {
    //       query = { _id: new ObjectId(queryValue) };
    //       const result = await artCraftCollection.findOne(query); // Use findOne for ID query
    //       return res.json(result); // Return directly without converting to array
    //     } else if (queryType === 'userEmail') {
    //       query = { userEmail: queryValue };
    //     } else {
    //       return res.status(400).json({ error: "Invalid query type" });
    //     }

    //     const result = await artCraftCollection.find(query).toArray();
    //     res.json(result);
    //   } catch (error) {
    //     console.error("Error fetching art & craft items:", error);
    //     res.status(500).json({ error: "Internal server error" });
    //   }
    // });

    app.post("/allArtCraft", async (req, res) => {
      const Craft = req.body;
      const result = await artCraftCollection.insertOne(Craft);
      res.json(result);
    });

    app.patch("/allArtCraft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedCraft = req.body;
      const updateDocument = {
        $set: {
          ...updatedCraft,
        },
      };
      const result = await artCraftCollection.updateOne(filter, updateDocument);
      res.json(result);
    });

    app.delete("/allArtCraft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await artCraftCollection.deleteOne(filter);
      res.json(result);
    });
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.error);
