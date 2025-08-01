# Serverless Training Module Generator

A serverless web application for creating and managing video-based training modules, with a SvelteKit frontend, AWS Lambda backend, and Streamlit analytics dashboard.

**Repository**: [https://github.com/victordeman/Serverless-Training-Module-Generator](https://github.com/victordeman/Serverless-Training-Module-Generator)

## Project Structure
```
Serverless-Training-Module-Generator/
├── frontend/                    # SvelteKit frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/     # Svelte components (e.g., VideoUpload)
│   │   │   └── api.ts          # API client for backend communication
│   │   ├── routes/
│   │   │   └── modules/new/    # Module creation page
│   │   └── tests/              # Vitest tests
│   ├── package.json
│   └── vite.config.ts
├── backend/                    # AWS Lambda backend
│   ├── functions/              # Lambda function handlers
│   ├── tests/                 # Vitest tests
│   ├── package.json
│   └── serverless.yml          # Serverless Framework configuration
├── streamlit/                  # Streamlit analytics dashboard
│   ├── app.py
│   └── requirements.txt
├── designs/                    # Figma design files (not included in script)
└── README.md
```

## Tech Stack
- **Frontend**: Svelte 5, SvelteKit 3.x, TypeScript, CSS/HTML, Vitest
- **Backend**: AWS Lambda, Node.js 20.x, AWS S3, AWS DynamoDB, REST API (API Gateway)
- **Analytics**: Streamlit, Python, Boto3
- **Design**: Figma (mockups not included in script)

## Features
- **Drag-and-Drop Video Upload**: Admins upload videos using presigned S3 URLs with progress indicators.
- **Metadata Management**: Form for adding module title, description, and language with Zod validation.
- **Preview Mode**: Test modules before publishing.
- **Analytics Dashboard**: View module usage (views, completion rates) via Streamlit (password: 12345).

## Setup Instructions
### Prerequisites
- Node.js 20.x
- Python 3.10+
- AWS CLI (configured with credentials)
- Serverless Framework
- Git (for manual repository management)

### Frontend Setup (SvelteKit)
1. Install dependencies from the project root:
   ```bash
   npm install --prefix frontend
   ```
2. Run the development server:
   ```bash
   npm run dev --prefix frontend
   ```
3. Run tests:
   ```bash
   npm run test --prefix frontend
   ```

### Backend Setup (AWS Lambda)
1. Install dependencies from the project root:
   ```bash
   npm install --prefix backend
   ```
2. Deploy to AWS from the project root:
   ```bash
   npx serverless deploy --config backend/serverless.yml
   ```
3. Update `frontend/src/lib/api.ts` with the API Gateway URL from the deployment output.

### Streamlit Setup
1. Create and activate a virtual environment from the project root:
   ```bash
   python3 -m venv streamlit/venv
   source streamlit/venv/bin/activate  # On Windows: streamlit\venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r streamlit/requirements.txt
   ```
3. Run the Streamlit app:
   ```bash
   streamlit run streamlit/app.py
   ```
4. Enter the password "12345" to access the dashboard (WARNING: This is insecure; consider using environment variables for production).

### AWS Configuration
1. Ensure the S3 bucket `training-module-videos` and DynamoDB table `TrainingModules` (with `moduleId` as partition key) are created via the `serverless.yml` deployment.
2. Configure IAM roles for Lambda with access to S3, DynamoDB, and API Gateway:
   - S3: `s3:PutObject`, `s3:GetObject`
   - DynamoDB: `dynamodb:PutItem`, `dynamodb:Scan`, `dynamodb:UpdateItem`
   - API Gateway: Invoke permissions

## Development Notes
- Replace `<api-gateway-url>` in `frontend/src/lib/api.ts` with the API Gateway URL after deployment.
- Use presigned S3 URLs for video uploads to avoid Lambda timeouts (already implemented).
- Ensure CORS is enabled on S3 and API Gateway (configured in `serverless.yml`).
- Monitor AWS costs for S3, Lambda, and DynamoDB usage.

## Testing
- **Frontend**: Tests are in `frontend/tests/` using Vitest.
- **Backend**: Tests are in `backend/tests/` using Vitest with AWS SDK mocks.
- Run tests from the project root:
  ```bash
  npm run test --prefix frontend
  npm run test --prefix backend
  ```

## Deployment
- **Frontend**: Deploy to Vercel or AWS Amplify using:
  ```bash
  npm run build --prefix frontend
  ```
- **Backend**: Deploy via Serverless Framework:
  ```bash
  npx serverless deploy --config backend/serverless.yml
  ```
- **Streamlit**: Host on a server or Streamlit Cloud (manual setup required).

## Security
- The Streamlit dashboard uses the password "12345" (insecure; replace with an environment variable in production).
- Validate file types and sizes in the frontend and backend.
- Sanitize form inputs in SvelteKit using Zod.
- Use AWS IAM roles with least privilege.

## Contributing
Contributions are welcome! Fork the repository and submit a pull request manually.

## License
MIT License
