const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ks5x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const servicesCollection = client.db('quickFixer').collection('services');
        const reviewsCollection = client.db('quickFixer').collection('reviews');


        app.get('/service', async (req, res) => {
            const result = await servicesCollection.find().toArray();
            res.send(result);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await servicesCollection.findOne(filter);
            res.send(result);
        })

        app.get('/review', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        })

        // for pagination 
        app.get('/allServices', async (req, res) => {
            const size = parseInt(req.query.size);
            const page = parseInt(req.query.page) - 1;
            const result = await servicesCollection.find().skip(page * size).limit(size).toArray();
            res.send(result);
        })

        // for pagination 
        app.get('/serviceCount', async (req, res) => {
            const count = await servicesCollection.countDocuments();
            res.send({ count });
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally { }
}
run().catch(console.log);


app.get('/', (req, res) => {
    res.send('quick fixer ready');
})

app.listen(port, () => {
    console.log(`Quick Fixer running on port ${port}`);
})