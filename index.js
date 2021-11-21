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

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;


admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "doctors-portal-4ecef",
        "private_key_id": "696746f55749a15ca4c7106e56d02a0adda73891",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDOZeVo3n4EZN0g\nt1OExD/pkkMO6iTAm3PdouBMxagZgfIWeEa7Ge4IVNtmFRcirvcjmpUUUQW7rKGP\nmCTemYZmWcLXcw8s64KXCeFMQvdqNK82qGCGLiOYGRBlI9SwIZCx5Mep13Ynvfhn\nXc2kL8whyKL9T22dzT0MnpSuL9nUsiRWq9bzpAt1fMAC3EEzlsbYoHFezeTW5h5C\n3TEN6lBGpVNAcrbwOV9lhr89rdFjUEPnz0oPZmb1wxt8Opl1pRoDjuy2h79O9Ss1\nHAj7meffVzsm4YQRb1c3tEIJMTp8S3CD1qTp7wb0QjOBI78bbTgOOrMZ7tDZ252C\nN6kdTZcPAgMBAAECggEAXx1bCqhZx3mZ491H+kucLm3ORF3HoREiZJWOKyL9U//r\nycoUwl1xMdq1HsaCWmPqFTjEEdBCxZmI/Iz/FKwIYTtlTHdEG43OqP8PGd9UeFee\nFSCkFsHFem62fP11otNdBHXrQ0w9MZRcmHoEbfDu7/Svk++aEtoFk76ywtDfYCIC\nO3t5WorJt6bbwJ/X3IEJ49YdqI6s62xdOaRkMkZ8Jy8L/XDVWf1z1phfK0F7VLot\nHQY9SYR2c3C44Z374M0AXaQP5DUdl9kc52uCh5QmUwcmynoxrHClDKTUbt3SRfRi\nb97LG3Y1RETJw5ek5rLAWU0w7jf77UCH81a90sQXDQKBgQDmQubjDf8OeF91VxUF\nvaVg34gT4dUC/eL7uWHZbIpwpLAgqVocwC2F8OeCIw0vObR+LNIIsZDkjEy1/TqC\nPgPx0gf/qv1Ng1UF2VxqynkAYBynI4P72fLZfTIpT8qAKmfZhJe4mgv29OPbUXVx\nJGqWApsY4u69DG5A4kZhBUHbRQKBgQDleCDQF7R0mYde0uRMR3jRdYZB7Pn9E8oY\nkIMR5dl9RE8QHNEqOoiDaC90NCpkI5GpUNpwq9CVvBfcViqbvToiKDU2k1hrIh30\na2wO2dqffzdgKXMwIhJ8QE8nG2UQtGvt7clkzUrp1S5Xo/pVa9SrV/P90UruY82Z\n5K86V0WkQwKBgAdRiwseb8Pi+Y2+NdHX5EC++hE/tUiCD0vW6ZBCjefkpCB1oYKW\nbRv7uy/8szeUCvOTsx1Jn4RUHUAPi2OGWxO9jDmJEsH68aHc9b4DL3NemqqJS3Ge\nzMQy4XxEp/gI4QId38CjTMwNnoxi+2ucL7MS5CEXXWUu1vZC+t+sjhpNAoGABp00\nzOqx/95hAYGwpOY2fEsX6JSNDBdi7txTetOWNj8ezEcYXFA9mRQKsh3Czwoba7bx\n5Od+5qH6ShaNudl1cICaMA2FMelU1bO29KKg45IGJZZsRInm4H/2CBmJCzc4GS6O\nbIJiU2UapdoLICUwhxPM65b5wu9LgNEPn+3eCwMCgYAweJBvc8LzdVii+qabd9Pn\nkMMOWTQWTbxE9qnD2HJbrtFLcnElzjRKpe3iL5Xc5X9gtWbSOUO4gYuthTwZvoaE\nOy8HWKd6Jircb83lWMBLzUzlGzPOh3rUUOdsvuCNRWlmLgQXMrCNGuhbxnp7sqIS\nGLva4ZW9fwqUnWfd8209MA==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-nu8fd@doctors-portal-4ecef.iam.gserviceaccount.com",
        "client_id": "101100215405808488713",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-nu8fd%40doctors-portal-4ecef.iam.gserviceaccount.com"
    }
    )
});


const uri = `mongodb+srv://${user}:${pass}@cluster0.ni4ot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// const verifyToken = async (req, res, next) => {
//     if (req.body.headers.Authorization.startsWith('Bearer ')) {
//         const token = req.body.headers.Authorization.split(' ')[1];
//         try {
//             const decodedUser = await admin.auth().verifyIdToken(token);
//             req.decodedEmail = decodedUser.email;
//         }
//         catch {

//         }
//     }
//     next();
// }


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

        // app.put('/users/:email', verifyToken, async (req, res) => {
        //     const email = req.params.email;
        //     const requester = req.decodedEmail;
        //     if (requester) {
        //         const requesterAccount = await userCollection.findOne({ email: requester });
        //         if (requesterAccount.role === "Admin") {
        //             const query = { email: email };
        //             const update = {
        //                 $set: {
        //                     role: 'Admin'
        //                 }
        //             }
        //             const result = await userCollection.updateOne(query, update);
        //             res.json(result);
        //         }
        //         else {
        //             res.status(403).json({ massage: 'Forbidden' })
        //         }
        //     }

        // })
    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port)