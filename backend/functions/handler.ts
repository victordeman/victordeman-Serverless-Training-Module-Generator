import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const s3Client = new S3Client({ region: 'us-east-1' });
const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });

export const uploadVideo = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { moduleId } = JSON.parse(event.body || '{}');
    if (!moduleId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'moduleId is required' }) };
    }
    const command = new PutObjectCommand({
      Bucket: 'training-module-videos',
      Key: `${moduleId}.mp4`
    });
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return {
      statusCode: 200,
      body: JSON.stringify({ presignedUrl, moduleId })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const saveMetadata = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { moduleId, title, description, language } = JSON.parse(event.body || '{}');
    if (!moduleId || !title || !description || !language) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }
    const command = new PutItemCommand({
      TableName: 'TrainingModules',
      Item: {
        moduleId: { S: moduleId },
        title: { S: title },
        description: { S: description },
        language: { S: language },
        views: { N: '0' },
        completions: { N: '0' }
      }
    });
    await dynamoClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Metadata saved' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const getModules = async (): Promise<APIGatewayProxyResult> => {
  try {
    const command = new ScanCommand({ TableName: 'TrainingModules' });
    const data = await dynamoClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const trackAnalytics = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const moduleId = event.pathParameters?.id;
    const { action } = JSON.parse(event.body || '{}');
    if (!moduleId || !['view', 'complete'].includes(action)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid moduleId or action' }) };
    }
    const updateExpression = action === 'view' ? 'SET views = views + :inc' : 'SET completions = completions + :inc';
    const command = new UpdateItemCommand({
      TableName: 'TrainingModules',
      Key: { moduleId: { S: moduleId } },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: { ':inc': { N: '1' } },
      ReturnValues: 'UPDATED_NEW'
    });
    await dynamoClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Analytics updated' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
