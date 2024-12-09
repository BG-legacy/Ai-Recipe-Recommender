import React from 'react';
import { Button, Typography, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#1a1a1a',
  color: '#FFD700',
  textAlign: 'center',
  padding: theme.spacing(4)
}));

const MainTitle = styled(Typography)(({ theme }) => ({
  fontSize: '5rem',
  fontWeight: 800,
  marginBottom: theme.spacing(2),
  fontFamily: "'Playfair Display', serif",
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem',
  }
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  marginBottom: theme.spacing(4),
  opacity: 0.9,
  maxWidth: '800px'
}));

const GetStartedButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FFD700',
  color: '#000000',
  padding: '15px 40px',
  fontSize: '1.2rem',
  '&:hover': {
    backgroundColor: '#DAA520',
  }
}));

const LandingPage = ({ onGetStarted }) => {
  return (
    <HeroSection>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <img 
            src="/image/logo.png" 
            alt="FlavorMind Logo" 
            style={{ width: '200px', height: '200px', marginBottom: '20px' }}
          />
        </Box>
        
        <MainTitle variant="h1">
          FlavorMind
        </MainTitle>
        
        <Subtitle variant="h2">
          Your AI-Powered Recipe Generator
        </Subtitle>
        
        <GetStartedButton 
          variant="contained" 
          onClick={onGetStarted}
          size="large"
        >
          GET STARTED
        </GetStartedButton>
      </Container>
    </HeroSection>
  );
};

export default LandingPage; 