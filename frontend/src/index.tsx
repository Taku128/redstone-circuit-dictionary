import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import config from './awsConfiguration';

interface AwsMobile {
  aws_project_region: string;
  aws_cognito_identity_pool_id: string;
  aws_cognito_region: string;
  aws_user_pools_id: string;
  aws_user_pools_web_client_id: string;
}

const awsmobile: AwsMobile = {
  aws_project_region: config.region,
  aws_cognito_identity_pool_id: config.IdentityPoolId,
  aws_cognito_region: config.region,
  aws_user_pools_id: config.UserPoolId,
  aws_user_pools_web_client_id: config.ClientId
};

Amplify.configure(awsmobile);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
