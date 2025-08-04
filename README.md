# Serverless Training Module Generator

A serverless web application for creating and managing video-based training modules, with a React frontend, AWS Lambda backend, and Streamlit analytics dashboard.

**Repository**: [https://github.com/victordeman/Serverless-Training-Module-Generator](https://github.com/victordeman/Serverless-Training-Module-Generator)

## Project Structure
```
./
├── frontend/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # React components (e.g., VideoUpload)
│   │   ├── pages/              # Page components (App, NewModule, Modules)
│   │   ├── lib/                # API client for backend communication
│   │   └── tests/              # Vitest tests
│   ├── public/                 # Static assets (e.g., favicon.ico)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tsconfig.json
│   └── tests/
├── backend/                    # AWS Lambda backend
│   ├── functions/              # Lambda function handlers
│   ├── tests/                 # Vitest tests
│   ├── package.json
│   └── serverless.yml          # Serverless Framework configuration
├── streamlit/                  # Streamlit analytics dashboard
│   └── app.py
├── designs/                    # Figma design files (not included)
├── venv/                       # Python virtual environment
├── requirements.txt            # Python dependencies
├── .gitignore
└── README.md
```

## Tech Stack
- **Frontend**: React 18.x, Vite, TypeScript, CSS, Vitest, React Router
- **Backend**: AWS Lambda, Node.js 20.x, AWS S3, AWS DynamoDB, REST API (API Gateway)
- **Analytics**: Streamlit, Python, Boto3
- **Design**: Figma (mockups not included)

## Features
- **Drag-and-Drop Video Upload**: Admins upload videos to S3 using presigned URLs with progress indicators.
- **Metadata Management**: Form for adding module title, description, and language with Zod validation, saved to DynamoDB.
- **Module Listing**: View modules and track analytics (views, completions).
- **Analytics Dashboard**: View module usage via Streamlit (password-protected).

## Setup Instructions
### Prerequisites
- Node.js 20.x
- Python 3.10+
- AWS CLI (configured with credentials)
- Serverless Framework
- Git (for manual repository management)

### Running the Script
Run the script from the desired project directory (e.g., `/path/to/Serverless-Training-Module-Generator`):
```bash
chmod +x generate_project.sh
./generate_project.sh
```
This creates files in the current directory. Do not run from a directory named `Serverless-Training-Module-Generator` to avoid nesting.

### Frontend Setup (React with Vite)
All commands are run from the project root:
1. Install dependencies:
   ```bash
   npm install --prefix frontend
   ```
2. Run the development server:
   ```bash
   npm run dev --prefix frontend
   ```
   - Access at `http://localhost:5173/`.
3. Run tests:
   ```bash
   npm run test --prefix frontend
   ```
   - Tests use `@testing-library/react` and check the `<progress>` element with `getByRole('progressbar')`.

### Backend Setup (AWS Lambda)
1. Install dependencies:
   ```bash
   npm install --prefix backend
   ```
2. Deploy to AWS:
   ```bash
   npx serverless deploy --config backend/serverless.yml
   ```
3. Update `frontend/src/lib/api.ts` with the API Gateway URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/dev`).

### Streamlit Setup
1. Activate the virtual environment:
   ```bash
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Upgrade pip:
   ```bash
   pip install --upgrade pip
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure AWS credentials:
   ```bash
   aws configure
   ```
   Or:
   ```bash
   export AWS_ACCESS_KEY_ID='your_access_key'
   export AWS_SECRET_ACCESS_KEY='your_secret_key'
   export AWS_DEFAULT_REGION='us-east-1'
   ```
5. Set the dashboard password:
   ```bash
   export DASHBOARD_PASSWORD='your_secure_password'
   ```
6. Run Streamlit:
   ```bash
   streamlit run streamlit/app.py
   ```
   - Access at `http://localhost:8501`, enter the password.

### AWS Configuration
1. Ensure the S3 bucket (`training-module-videos`) and DynamoDB table (`TrainingModules`) are created via the deployment.
2. Configure IAM roles for Lambda:
   - S3: `s3:PutObject`, `s3:GetObject`
   - DynamoDB: `dynamodb:PutItem`, `dynamodb:Scan`, `dynamodb:UpdateItem`
   - API Gateway: Invoke permissions
3. Configure AWS CLI:
   ```bash
   aws configure
   ```

## Usage
1. **Create a Module**:
   - Go to `http://localhost:5173/modules/new`.
   - Drag and drop a video (MP4, AVI, etc.).
   - Fill in title, description, and language.
   - Click "Save" to store metadata in DynamoDB.
2. **View Modules**:
   - Go to `http://localhost:5173/modules`.
   - Click "View Module" or "Complete Module" to track analytics.
3. **View Analytics**:
   - Go to `http://localhost:8501`.
   - Enter the password to see module views and completions.

## Development Notes
- Replace `<api-gateway-url>` in `frontend/src/lib/api.ts` after backend deployment.
- Use presigned S3 URLs for video uploads to avoid Lambda timeouts.
- Ensure CORS is enabled in `backend/serverless.yml`.
- Monitor AWS costs for S3, Lambda, and DynamoDB.
- The frontend uses TypeScript and Zod for validation.

## Testing
- **Frontend**: Tests in `frontend/tests/` use Vitest and `@testing-library/react`.
- **Backend**: Tests in `backend/tests/` use Vitest with AWS SDK mocks.
- Run tests:
  ```bash
  npm run test --prefix frontend
  npm run test --prefix backend
  ```

## Deployment
- **Frontend**: Deploy to Vercel or AWS Amplify:
  ```bash
  npm run build --prefix frontend
  vercel --prod --cwd frontend
  ```
- **Backend**: Deploy via Serverless Framework:
  ```bash
  npx serverless deploy --config backend/serverless.yml
  ```
- **Streamlit**: Host on a server or Streamlit Cloud.

## Security
- Use a secure password in `DASHBOARD_PASSWORD` environment variable.
- Validate file types and sizes in frontend and backend.
- Sanitize inputs with Zod (frontend) and server-side validation.
- Use AWS IAM roles with least privilege.

## Contributing
Contributions are welcome! Fork the repository and submit a pull request manually.

## License
MIT License
