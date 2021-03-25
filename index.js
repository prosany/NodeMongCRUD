const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const password = 'Sunny[564696]';
const uri = "mongodb+srv://dbSANY9893:Sunny[564696]@cluster0.hgubw.mongodb.net/organicDB?retryWrites=true&w=majority";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

// Database connections
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("organicDB").collection("products");
    // Create data and save on database - CRUD => C (Create)
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(result => {
                console.log('Product added successfully');
                res.redirect('/')
            })
    });
    // Read data from database - CRUD => R (Read)
    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, doc) => {
                res.send(doc)
            })
    });
    // Call single data for update form database - CRUD => U (Update)
    app.get('/product/:id', (req, res) => {
        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, doc) => {
                res.send(doc[0]);
            })
    });
    // Update data and send again to database - CRUD => U (Update)
    app.patch('/update/:id', (req, res) => {
        collection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { price: req.body.price, quantity: req.body.quantity }
            })
            .then(result => {
                res.send(result.modifiedCount > 0);
            })
    });
    // Delete data from database - CRUD => D (Delete)
    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    });

    // Check Database Connected or Not Connected
    console.log('Database Connected')
    //   client.close();
});


app.listen(3000)