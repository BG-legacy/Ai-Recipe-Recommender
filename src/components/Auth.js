// Import necessary hooks and functions from React and Firebase
import { useState } from 'react';
// Resource for useState: https://react.dev/reference/react/useState
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// Resource for Firebase Authentication: https://firebase.google.com/docs/auth

const Auth = ({ onLogin }) => {
  // State variables for email, password, registration mode, and error messages
  // Resource for React state: https://react.dev/learn/state-a-components-memory
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle authentication (both sign up and log in)
  // Resource for async/await: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
  const handleAuth = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      let userCredential;
      if (isRegistering) {
        // Sign up the user
        // Resource for createUserWithEmailAndPassword: https://firebase.google.com/docs/auth/web/password-auth#create_a_password-based_account
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User signed up:', userCredential.user);
      } else {
        // Log in the user
        // Resource for signInWithEmailAndPassword: https://firebase.google.com/docs/auth/web/password-auth#sign_in_a_user_with_an_email_address_and_password
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in:', userCredential.user);
      }
      onLogin(userCredential.user);  // Call parent callback on successful login
    } catch (error) {
      // Handle authentication errors
      console.error('Authentication error:', error);
      setError('Authentication failed. Try again.');
    }
  };

  // Render the authentication form
  // Resource for React forms: https://react.dev/reference/react-dom/components/input
  return (
    <div>
      <h2>{isRegistering ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">
          {isRegistering ? 'Sign Up' : 'Log In'}
        </button>
        <p onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Auth;
