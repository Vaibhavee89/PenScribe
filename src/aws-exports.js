const awsConfig = {
  aws_project_region: 'eu-north-1',
  aws_cognito_region: 'eu-north-1',
  aws_user_pools_id: 'eu-north-1_MfM1UFiXX',
  aws_user_pools_web_client_id: '2rjvmtdvm6ai23fbjgcu5n9ali',
  oauth: {
    domain: 'eu-north-1mfm1ufixx.auth.eu-north-1.amazoncognito.com',
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: 'https://d84l1y8p4kdic.cloudfront.net/',
    redirectSignOut: 'https://d84l1y8p4kdic.cloudfront.net/',
    responseType: 'code'
  }
};

export default awsConfig;
