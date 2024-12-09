# FlavorMind - AI-Powered Recipe Generator

FlavorMind is a full-stack application that generates personalized recipes using AI technology. The application consists of a FastAPI backend and a React frontend.
bash
cd recipe-backend

2. Create and activate a virtual environment:
   bash
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
3. Install dependencies:
 bash
pip install -r requirements.txt

4. Create a .env file based on .env.example:
   bash
cp .env.example .env

5. Start the backend server:
   bash
uvicorn app:app --host 0.0.0.0 --port 8080 --workers 1

#### Docker Setup (Alternative)
bash
docker-compose up --build

### Frontend Setup

1. Navigate to the frontend directory:
   bash
cd recipe-frontend

2. Install dependencies:
   bash
npm install

3. Start the development server:
   bash
npm start

## 🔧 Configuration

### Backend Environment Variables
- `PORT`: Server port (default: 8080)
- `OLLAMA_HOST`: Ollama API endpoint
- `PYTHONUNBUFFERED`: Python output buffering
- `USDA_API_KEY`: USDA API key for nutritional data

### Frontend Environment Variables
- `REACT_APP_API_URL`: Backend API endpoint

## 📦 Deployment

### Backend Deployment (Google Cloud Run)
1. Build and push the Docker image:
   
:
bash
gcloud builds submit --config cloudbuild.yaml

### Frontend Deployment (Firebase)
1. Build the production bundle:
   bash
npm run build

2. Deploy to Firebase:
   bash
firebase deploy

## 🛠 API Endpoints

### Backend API
- `POST /generate-recipe`: Generate a new recipe
  - Request body:
    ```json
    {
      "preference": "string",
      "dietary_restrictions": ["string"],
      "budget_preference": "string"
    }
    ```
- `GET /health`: Health check endpoint
- `GET /`: API information

## 🔒 Security

- CORS enabled with appropriate configurations
- Environment variables for sensitive data
- Error handling and input validation

## 📚 Project Structure
recipe-app/
├── recipe-backend/
│ ├── ai/
│ ├── cache/
│ ├── app.py
│ ├── Dockerfile
│ └── requirements.txt
└── recipe-frontend/
├── public/
├── src/
│ ├── components/
│ ├── api/
│ └── App.js
└── package.json

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Bernard Ginn Jr  - full development

## 🙏 Acknowledgments

- OpenAI for AI technology
- USDA for nutritional data API
- Material-UI for React components
