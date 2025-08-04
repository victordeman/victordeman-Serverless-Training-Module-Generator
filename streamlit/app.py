import streamlit as st
import boto3
import pandas as pd
import botocore.exceptions
import os

st.title("Training Module Analytics Dashboard")

# AWS DynamoDB client
try:
    dynamodb = boto3.client('dynamodb', region_name='us-east-1')
except botocore.exceptions.NoCredentialsError:
    st.error("AWS credentials not found. Please configure AWS CLI or set credentials via environment variables.")
    st.stop()

# Password protection
password = st.text_input("Enter password", type="password")
if password != os.getenv('DASHBOARD_PASSWORD', '12345'):
    st.error("Incorrect password")
    st.stop()

# Fetch modules from DynamoDB
try:
    response = dynamodb.scan(TableName='TrainingModules')
    modules = response['Items']
except botocore.exceptions.ClientError as e:
    st.error(f"Failed to fetch data from DynamoDB: {e.response['Error']['Message']}")
    st.stop()

# Display analytics
if modules:
    data = [
        {
            'Module ID': item['moduleId']['S'],
            'Title': item['title']['S'],
            'Views': int(item['views']['N']),
            'Completions': int(item['completions']['N'])
        }
        for item in modules
    ]
    df = pd.DataFrame(data)
    st.dataframe(df)
    st.bar_chart(df.set_index('Module ID')[['Views', 'Completions']])
else:
    st.write("No modules found.")
