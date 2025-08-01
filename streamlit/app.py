import streamlit as st
import boto3
import pandas as pd

st.title("Training Module Analytics Dashboard")

# AWS DynamoDB client
dynamodb = boto3.client('dynamodb', region_name='us-east-1')

# Password protection
password = st.text_input("Enter password", type="password")
if password != "12345":
    st.error("Incorrect password")
    st.stop()

# Fetch modules from DynamoDB
response = dynamodb.scan(TableName='TrainingModules')
modules = response['Items']

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
