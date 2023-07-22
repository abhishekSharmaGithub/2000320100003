const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid URL parameters' });
  }

  try {
    const responses = await Promise.all(
      urls.map(async (url) => {
        try {
          const response = await axios.get(url, { timeout: 500 });
          return response.data.numbers;
        } catch (error) {
          console.error(`Error fetching data from ${url}: ${error.message}`);
          return [];
        }
      })
    );

    // Merge and deduplicate the numbers
    const mergedNumbers = responses.flat().reduce((uniqueNumbers, num) => {
      if (!uniqueNumbers.includes(num)) {
        uniqueNumbers.push(num);
      }
      return uniqueNumbers;
    }, []);

    // Sort the numbers in ascending order
    mergedNumbers.sort((a, b) => a - b);

    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error('Error while processing requests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/odd', async (req, res) => {
  try {
    const response = await axios.get('http://20.244.56.144/numbers/odd', { timeout: 500 });
    const oddNumbers = response.data.numbers;
    res.json({ numbers: oddNumbers });
  } catch (error) {
    console.error('Error fetching odd numbers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/prime', async (req, res) => {
  try {
    const response = await axios.get('http://20.244.56.144/numbers/primes', { timeout: 500 });
    const primeNumbers = response.data.numbers;
    res.json({ numbers: primeNumbers });
  } catch (error) {
    console.error('Error fetching prime numbers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
