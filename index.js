const express = require('express');
const cors = require('cors');

// Create App:
const app = express();
const port = process.env.PORT || 5000;

// Middleware Setup:
app.use(cors());
app.use(express.json());


// Database Connection:

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://Silent_Developer:Tata__Bangladesh__123@cluster0.tnc913c.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("Simple_Crud");
        const userCollection = database.collection("Users");

        // POST User API:
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // Get All User:
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Update Single User:
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email,
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, options);
            res.send(result);
        })

        // Get Single User API:
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user)
        });


        // Delete Single User:
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// Root API:
app.get('/', (req, res) => {
    res.send("Simple Crud is Running!");
})

// For Run Server:
app.listen(port, () => {
    console.log(`Simple Crud is Running on Port: ${port}`);
})