const awsConfiguration = {
    region: process.env.REACT_APP_AWS_REGION || 'default-region',
    UserPoolId: process.env.REACT_APP_AWS_USER_POOL_ID || 'default-user-pool-id',
    ClientId: process.env.REACT_APP_AWS_CLIENT_ID || 'default-client-id',
}
export default awsConfiguration;
