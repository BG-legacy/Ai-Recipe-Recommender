// Import necessary functions from Firebase
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
// Resource for Firestore: https://firebase.google.com/docs/firestore

// Define the RecipeDisplay component
// This is a functional component that uses props
// Resource for React components: https://react.dev/learn/your-first-component
const RecipeDisplay = ({ recipe, user }) => {
  // If there's no recipe, don't render anything
  // This is a common pattern for conditional rendering in React
  // Resource: https://react.dev/learn/conditional-rendering
  if (!recipe) return null;

  // Define an asynchronous function to handle saving the recipe
  // Resource for async functions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
  const handleSaveRecipe = async () => {
    try {
      // Add a new document to the 'recipes' subcollection of the user's document
      // Resource for adding documents in Firestore: https://firebase.google.com/docs/firestore/manage-data/add-data
      await addDoc(collection(db, 'users', user.uid, 'recipes'), {
        recipe: recipe,
        createdAt: new Date()
      });
      // Alert the user that the recipe was saved successfully
      alert('Recipe saved successfully!');
    } catch (error) {
      // If there's an error, alert the user
      // In a production app, you might want to use a more user-friendly error handling method
      alert('Failed to save recipe.');
    }
  };

  // Render the component
  // Resource for JSX: https://react.dev/learn/writing-markup-with-jsx
  return (
    <div>
      <h2>Generated Recipe</h2>
      {/* Display the recipe in a pre-formatted text block */}
      <pre>{recipe}</pre>
      {/* Button to save the recipe, which calls handleSaveRecipe when clicked */}
      {/* Resource for handling events in React: https://react.dev/learn/responding-to-events */}
      <button onClick={handleSaveRecipe}>Save Recipe</button>
    </div>
  );
};

// Export the component so it can be used in other parts of the app
export default RecipeDisplay;
