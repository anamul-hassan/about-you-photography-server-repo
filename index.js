const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mongo DB Setup

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.yts1hwu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const sliderDataCollection = client
      .db('aboutYouPhotography')
      .collection('sliderData');
    const servicesDataCollection = client
      .db('aboutYouPhotography')
      .collection('servicesData');
    const recentWorkDataCollection = client
      .db('aboutYouPhotography')
      .collection('recentWork');
    const reviewDataCollection = client
      .db('aboutYouPhotography')
      .collection('reviewData');
    app.get('/slider', async (req, res) => {
      const query = {};
      const cursor = sliderDataCollection.find(query);
      const slidesData = await cursor.toArray();
      res.send(slidesData);
    });
    app.get('/services', async (req, res) => {
      const serviceLimit = +req.query.limit;
      const query = {};
      const cursor = servicesDataCollection.find(query);
      if (serviceLimit === 3) {
        const slidesData = await cursor.limit(serviceLimit).toArray();
        res.send(slidesData);
      } else {
        const slidesData = await cursor.toArray();
        res.send(slidesData);
      }
    });
    app.get('/services/:serviceId', async (req, res) => {
      const serviceId = req.params.serviceId;
      // console.log(serviceId);
      const query = { _id: ObjectId(serviceId) };
      const serviceDetails = await servicesDataCollection.findOne(query);
      res.send(serviceDetails);
    });
    app.get('/recent_work', async (req, res) => {
      const query = {};
      const cursor = recentWorkDataCollection.find(query);
      const recentWorkData = await cursor.toArray();
      res.send(recentWorkData);
    });
    app.get('/review_data', async (req, res) => {
      const categoryName = req.query;
      const userEmail = req.query.email;
      console.log(Object.keys(categoryName) === 'category');
      // let = query;
      // if (categoryName) {
      //   query = { category: categoryName };
      // }
      // if (email) {
      //   query = { email: userEmail };
      // }
      // console.log(query);
      // const cursor = reviewDataCollection.find(query);
      // const reviews = await cursor.toArray();
      // res.send(reviews);
    });
    app.get('/review_rewrite/:reviewId', async (req, res) => {
      const reviewId = req.params.reviewId;
      const query = { _id: ObjectId(reviewId) };
      const cursor = reviewDataCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    app.patch('/review_rewrite/:id', async (req, res) => {
      const id = req.params.id;
      const newReview = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          img: newReview.photoUrl,
          name: newReview.name,
          review: newReview.review,
          rating: newReview.rating,
        },
      };
      const result = await reviewDataCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
  } finally {
  }
}
run().catch(error => console.log(error));

// Initial Setup
app.get('/', (req, res) => {
  res.send('About You Photography server in running');
});
app.listen(port, () => {
  console.log('About You Photography server is running on port', port);
});
