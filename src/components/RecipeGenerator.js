// Import necessary components and hooks from React and Material-UI
import React, { useState } from 'react';
// Resource for React hooks: https://react.dev/reference/react
import axios from 'axios';
// Resource for Axios: https://axios-http.com/docs/intro
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  Box,
  Snackbar,
  Alert
} from '@mui/material';
// Resource for Material-UI components: https://mui.com/material-ui/getting-started/overview/

const RecipeGenerator = () => {
  // State variables using useState hook
  // Resource for useState: https://react.dev/reference/react/useState
  const [preference, setPreference] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetailsOption, setShowDetailsOption] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [recipe, setRecipe] = useState(null);

  // Function to handle recipe generation
  const handleGenerateRecipe = async () => {
    setLoading(true);
    setError(null);
    setRecommendation('');
    setDetails('');
    setShowDetailsOption(false);
    try {
      // Make a POST request to the backend API
      // Resource for Axios post: https://axios-http.com/docs/post_example
      const response = await axios.post('http://localhost:5001/generate-recipe', { preference });
      setRecommendation(response.data.recommendation);
      setRecipeName(response.data.recipe_name);
      setDetails(response.data.details);
      setShowDetailsOption(true);
    } catch (err) {
      setError('Failed to generate recipe');
      setSnackbar({ open: true, message: 'Failed to generate recipe', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle showing recipe details
  const handleGetDetails = () => {
    setShowDetailsOption(false);
  };

  // Function to handle closing the snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Render the component
  // Resource for JSX: https://react.dev/learn/writing-markup-with-jsx
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        AI-Powered Recipe Generator
      </Typography>
      {!recommendation && !loading && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            placeholder="What kind of food are you in the mood for today?"
            sx={{ mb: 2 }}
          />
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleGenerateRecipe} 
            disabled={loading || !preference}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Recipe'}
          </Button>
        </Box>
      )}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      )}
      {recommendation && !loading && (
        <Box>
          <Typography variant="h5" gutterBottom>Recommendation:</Typography>
          <Typography paragraph>{recommendation}</Typography>
          {showDetailsOption && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Would you like to see the ingredients and instructions?
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleGetDetails}>
                  Yes
                </Button>
                <Button variant="contained" color="secondary" onClick={handleGenerateRecipe}>
                  Generate another recipe
                </Button>
                <Button variant="outlined" onClick={() => { 
                  setRecommendation(''); 
                  setShowDetailsOption(false); 
                  setPreference(''); 
                  setDetails(''); 
                }}>
                  Start over
                </Button>
              </Box>
            </Box>
          )}
          {!showDetailsOption && details && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Ingredients and Instructions for {recipeName}:
              </Typography>
              <Typography paragraph sx={{ whiteSpace: 'pre-line' }}>{details}</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleGenerateRecipe}>
                  Generate another recipe
                </Button>
                <Button variant="outlined" onClick={() => { 
                  setRecommendation(''); 
                  setDetails(''); 
                  setShowDetailsOption(false); 
                  setPreference(''); 
                }}>
                  Start over
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RecipeGenerator;