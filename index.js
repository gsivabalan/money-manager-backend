require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const dbURI = 'mongodb+srv://sivabalan:siva90balan@cluster0.bjz1ptp.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


const transactionSchema = new mongoose.Schema({
  type: String,
  description: String,
  category: String,
  division: String,
  amount: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);


app.get('/transactions', async (req, res) => {
  try {
    const income = await Transaction.find({ type: 'income' }).exec();
    const expenses = await Transaction.find({ type: 'expense' }).exec();
    res.json({ income, expenses });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});


app.get('/categories', (req, res) => {
  const categories = [
    'fuel',
    'movie',
    'food',
    'loan',
    'medical',
    'office',
    'personal',
  ];
  res.json(categories);
});


app.post('/transactions', async (req, res) => {
  const { type, description, category, division } = req.body;
  const amount = type === 'income' ? 100 : -100; // Replace with the actual amount
  const transaction = new Transaction({
    type,
    description,
    category,
    division,
    amount,
  });

  try {
    await transaction.save();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});


const port = process.env.PORT || 9090;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
