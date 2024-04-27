require("dotenv").config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = process.env.DB_URI
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const db = client.db("artCraftDB");
    const artCraftCollection = db.collection("artCraftCollection");

    app.get("/allArtCraft", async (req, res) => {
      const cursor = await artCraftCollection.find().toArray();
      res.json(cursor);
    });

    app.get("/allArtCraft/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await artCraftCollection.findOne(query);
      res.json(result);
    });


    
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





    app.get('/', (req, res) => {
      res.send('Hello World!')
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
run().catch(console.dir);
