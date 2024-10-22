// recipe-frontend/src/api/recipeApi.js

// Import axios, a popular HTTP client for making API requests
// Resource: https://axios-http.com/docs/intro
import axios from 'axios';

// API function to fetch a recipe from the backend using AI
// This function is asynchronous, allowing for non-blocking API calls
// Resource on async/await: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
export const fetchRecipeFromAI = async (ingredients) => {
  try {
    // Make a GET request to the backend API
    // Resource on axios.get: https://axios-http.com/docs/get_request
    const response = await axios.get('http://localhost:5001/generate-recipe', {
      // Pass the ingredients as a query parameter
      // Resource on query parameters: https://en.wikipedia.org/wiki/Query_string
      params: { ingredients }
    });

    // Return the data from the response
    // The response object typically contains properties like data, status, headers, etc.
    // Resource on response schema: https://axios-http.com/docs/res_schema
    return response.data;
  } catch (error) {
    // If an error occurs during the API call, log it to the console
    // Resource on console.error: https://developer.mozilla.org/en-US/docs/Web/API/Console/error
    console.error('Error fetching recipe from AI:', error);

    // Throw a new error with a user-friendly message
    // This error can be caught and handled by the calling function
    // Resource on Error objects: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    throw new Error('Failed to fetch recipe');
  }
};

// Note: This file can be expanded to include other API calls related to recipes
// For example, you might add functions for saving recipes, fetching user favorites, etc.
