// Import required modules
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./recipe-recommender-9d84c-firebase-adminsdk-d39zy-4d2df3e84e.json');

// Initialize Firebase Admin SDK
// Resource: https://firebase.google.com/docs/admin/setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get a Firestore database instance
const db = admin.firestore();

// Enable CORS for all routes
// Resource: https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());

// Parse JSON bodies for incoming requests
// Resource: https://expressjs.com/en/api.html#express.json
app.use(express.json());

// Function to run Python script and return a Promise
// Resource: https://nodejs.org/api/child_process.html#child_processspawncommand-args-options
function runPythonScript(data) {
  return new Promise((resolve, reject) => {
    // Spawn a new Python process
    const pythonProcess = spawn('python3', ['ai/generateRecipe.py']);
    let output = '';

    // Collect data from the Python script's stdout
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Log any errors from the Python script
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });

    // Write input data to the Python script's stdin
    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();

    // Handle the close event of the Python process
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject('Error generating recipe');
      } else {
        try {
          const result = JSON.parse(output);
          if (result.error) {
            reject(result.error);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject('Error parsing Python script output');
        }
      }
    });
  });
}

// Route to generate a recipe
// Resource: https://expressjs.com/en/guide/routing.html
app.post('/generate-recipe', async (req, res) => {
  try {
    const result = await runPythonScript(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error in generate-recipe:', error);
    res.status(500).json({ error: error.toString() });
  }
});

// Route to update user profile
app.post('/api/user/profile', async (req, res) => {
  try {
    const { uid, displayName, email, dietaryPreferences } = req.body;
    // Update user document in Firestore
    // Resource: https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document
    await db.collection('users').doc(uid).set({
      displayName,
      email,
      dietaryPreferences
    }, { merge: true });
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Route to get user profile
app.get('/api/user/profile/:uid', async (req, res) => {
  try {
    // Get user document from Firestore
    // Resource: https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document
    const userDoc = await db.collection('users').doc(req.params.uid).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json(userDoc.data());
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Route to add a recipe to user's favorites
app.post('/api/user/favorites', async (req, res) => {
  try {
    const { uid, recipeId } = req.body;
    // Add favorite recipe to user's subcollection in Firestore
    // Resource: https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document
    await db.collection('users').doc(uid).collection('favorites').doc(recipeId).set({
      addedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(200).json({ message: 'Recipe added to favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Route to update user's cooking history
app.post('/api/user/cooking-history', async (req, res) => {
  try {
    const { uid, recipeId } = req.body;
    // Add cooking history entry to user's subcollection in Firestore
    await db.collection('users').doc(uid).collection('cookingHistory').add({
      recipeId,
      cookedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(200).json({ message: 'Cooking history updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cooking history' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
