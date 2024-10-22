// Import necessary components and hooks from React and other libraries
import React, { useState } from 'react';
// Resource for React hooks: https://react.dev/reference/react/useState

// Import custom components
import Auth from './components/Auth';
import RecipeGenerator from './components/RecipeGenerator';
import UserProfilePage from './components/UserProfilePage';

// Import Firebase authentication
import { auth } from './firebase';
// Resource for Firebase Authentication: https://firebase.google.com/docs/auth

// Import Material-UI components and theming
import { ThemeProvider, createTheme, CssBaseline, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
// Resource for Material-UI: https://mui.com/material-ui/getting-started/overview/

// Create a custom theme for the application
// Resource for Material-UI theming: https://mui.com/material-ui/customization/theming/
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Green color
    },
    secondary: {
      main: '#ff9800', // Orange color
    },
  },
});

// Define the main App component
const App = () => {
  // State to keep track of the authenticated user
  // Resource for useState hook: https://react.dev/reference/react/useState
  const [user, setUser] = useState(null);
  
  // State to toggle between main content and user profile
  const [showProfile, setShowProfile] = useState(false);

  // Function to handle user logout
  const handleLogout = () => {
    auth.signOut(); // Sign out the user from Firebase
    setUser(null); // Clear the user state
    setShowProfile(false); // Reset the profile view
  };

  // Render the application
  // Resource for JSX: https://react.dev/learn/writing-markup-with-jsx
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline normalizes styles across browsers */}
      <CssBaseline />
      
      {/* AppBar for the top navigation */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bernard's Recipe Generator
          </Typography>
          {/* Conditional rendering based on user authentication */}
          {/* Resource for conditional rendering: https://react.dev/learn/conditional-rendering */}
          {user && (
            <>
              <Button color="inherit" onClick={() => setShowProfile(!showProfile)}>
                {showProfile ? 'Home' : 'Profile'}
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Main content container */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Conditional rendering based on user authentication */}
        {!user ? (
          <Auth onLogin={setUser} />
        ) : (
          <>
            {showProfile ? (
              <UserProfilePage />
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  Welcome, {user.email}!
                </Typography>
                <RecipeGenerator />
              </>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;