const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ah3a7qz.mongodb.net/?retryWrites=true&w=majority`;

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
   // await client.connect();

    const carcollectoin = client.db("carbd").collection("car");
    const bookingCollection = client.db("carbd").collection('bookings');



    app.get('/services', async (req, res) => {
        const cursor = carcollectoin.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    

    app.get('/services/:id', async (req, res) => {
        const id = req.params.id
        const query = {_id: new ObjectId(id) };
        const options = {
            // Include only the `title` and `imdb` fields in the returned document
            projection: { title: 1, price: 1, service_id: 1, img: 1 },
        };
        const cursor = await carcollectoin.findOne(query, options );
        res.send(cursor );
    })


    app.post('/bookings', async (req, res) => {
        const booking = req.body;
        console.log(booking);
        const bokinresult = await bookingCollection.insertOne(booking);
        res.send(bokinresult);
    });

    /* 
  }
  console.log( query )
  const emailresult = await bookingCollection.find(query).toArray();
  res.send(emailresult);*/



  app.get('/bookings', async (req, res) => {
    console.log(req.query.email);
    let query = {};
    if (req.query?.email) {
      query = { email: req.query.email }
    }
    console.log( query )
    const emailresult = await bookingCollection.find(query).toArray();
    res.send(emailresult)
   
    
})

    app.delete('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await bookingCollection.deleteOne(query);
        res.send( result);
    })


    app.patch('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedBooking = req.body;
        console.log(updatedBooking);
        const updateDoc = {
            $set: {
                status: updatedBooking.status
            },
        };
        const result = await bookingCollection.updateOne(filter, updateDoc);
        res.send(result);
    })


    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





//12we34rt567
//car-doc