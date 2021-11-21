const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { initializeApp } = require('firebase-admin/app');
var admin = require("firebase-admin");

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Doctor Portal Running");
})

var serviceAccount = require('./doctors-portal-firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${pass}@cluster0.ni4ot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const verifyToken = async (req, res, next) => {
    if (req.body.headers.Authorization.startsWith('Bearer ')) {
        const token = req.body.headers.Authorization.split(' ')[1];
        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }
    }
    next();
}



async function run() {
    try {
        await client.connect();

        const database = client.db('doctors_portal');
        const booking_appointment = database.collection('booking_appointment');
        const userCollection = database.collection('users');

        // console.log('enter')

        //Insert Booking
        app.post('/bookings', async (req, res) => {
            const data = req.body.data;
            const result = await booking_appointment.insertOne(data);
            if (result) {
                res.send(result.insertedId)
            }
        })

        // //Get all booking
        // app.get('/bookings', async (req, res) => {
        //     const result = booking_appointment.find({});
        //     const bookings = await result.toArray();
        //     if (bookings) {
        //         res.send(bookings)
        //     }
        // })

        //Get booking by email
        app.get('/bookings', async (req, res) => {
            const userId = req.query.userId;
            const date = req.query.date;
            const query = { date: date };
            const result = booking_appointment.find(query);
            const bookings = await result.toArray();
            if (bookings) {
                res.send(bookings)
            }
        })

        // // Add User information
        // app.post('/users', async (req, res) => {
        //     const data = req.body.data;
        //     const user = await userCollection.insertOne(data);
        //     if (user.insertedId) {
        //         res.send(user.insertedId);
        //     }
        // })

        app.put('/users', async (req, res) => {
            const user = req.body.data;
            const query = { email: user.email };
            const options = { upsert: true };
            const update = { $set: user };
            const result = await userCollection.updateOne(query, update, options);
            res.send(result);

        })

        // Get all user
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const user = await cursor.toArray();
            res.send(user)
        })

        // Get all user
        app.get('/users/:uid', async (req, res) => {
            const id = req.params.uid;
            const query = { uid: id }
            const user = await userCollection.findOne(query);
            res.send(user)
        })

        app.put('/users/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await userCollection.findOne({ email: requester });
                if (requesterAccount.role === "Admin") {
                    const query = { email: email };
                    const update = {
                        $set: {
                            role: 'Admin'
                        }
                    }
                    const result = await userCollection.updateOne(query, update);
                    res.json(result);
                }
                else {
                    res.status(403).json({ massage: 'Forbidden' })
                }
            }

        })
    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, console.log("Server Running on", port))