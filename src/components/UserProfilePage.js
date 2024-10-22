// Import necessary hooks and functions from React and Firebase
import React, { useState, useEffect } from 'react';
// Resource for React hooks: https://react.dev/reference/react
import { auth, db } from '../firebase';
// Resource for Firebase setup: https://firebase.google.com/docs/web/setup
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
// Resource for Firestore operations: https://firebase.google.com/docs/firestore/manage-data/add-data
import { TextField, Button, Typography, Paper, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
// Resource for Material-UI components: https://mui.com/material-ui/getting-started/overview/
import DeleteIcon from '@mui/icons-material/Delete';

const UserProfilePage = () => {
  // State for user profile data
  // Resource for useState hook: https://react.dev/reference/react/useState
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    dietaryPreferences: ''
  });
  // State for saved recipes
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Effect hook to fetch profile and saved recipes when component mounts
  // Resource for useEffect hook: https://react.dev/reference/react/useEffect
  useEffect(() => {
    fetchProfile();
    fetchSavedRecipes();
  }, []);

  // Function to fetch user profile from Firestore
  const fetchProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    }
  };

  // Function to fetch saved recipes from Firestore
  const fetchSavedRecipes = async () => {
    const user = auth.currentUser;
    if (user) {
      const recipesRef = collection(db, 'users', user.uid, 'recipes');
      const querySnapshot = await getDocs(recipesRef);
      const recipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedRecipes(recipes);
    }
  };

  // Function to handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), profile);
      alert('Profile updated successfully');
    }
  };

  // Function to handle recipe deletion
  const handleDeleteRecipe = async (recipeId) => {
    const user = auth.currentUser;
    if (user) {
      await deleteDoc(doc(db, 'users', user.uid, 'recipes', recipeId));
      setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== recipeId));
    }
  };

  // Render the component
  // Resource for JSX: https://react.dev/learn/writing-markup-with-jsx
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Display Name"
          name="displayName"
          value={profile.displayName}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          margin="normal"
          disabled
        />
        <TextField
          fullWidth
          label="Dietary Preferences"
          name="dietaryPreferences"
          value={profile.dietaryPreferences}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Update Profile
        </Button>
      </Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Saved Recipes
      </Typography>
      <List>
        {savedRecipes.map((recipe) => (
          <ListItem key={recipe.id}>
            <ListItemText primary={recipe.recipe.recipe_name} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRecipe(recipe.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default UserProfilePage;