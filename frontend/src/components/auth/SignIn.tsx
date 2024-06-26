import React from 'react'
import { useNavigate } from 'react-router-dom';

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js"
import awsConfiguration from '../../awsConfiguration'

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

const SignIn: React.FC = () => {
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const changedEmailHaldler = (e: any) => setEmail(e.target.value)
  const changedPasswordHandler = (e: any) => setPassword(e.target.value)
  const navigate = useNavigate();

  const signIn = () => {
    const authenticationDetails = new AuthenticationDetails({
      Username : email,
      Password : password
    })
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('result: ' + result)
        const accessToken = result.getAccessToken().getJwtToken()
        console.log('AccessToken: ' + accessToken)
        setEmail('')
        setPassword('')
        navigate('/Creat');
      },
      onFailure: (err) => {
        console.error(err)
      }
    })
  }

  return (
    <div className="SignIn">
      <h1>SingIn</h1>
      <input type="text" placeholder='email' onChange={changedEmailHaldler}/>
      <input type="text" placeholder='password' onChange={changedPasswordHandler}/>
      <button onClick={signIn}>Sign In</button>
    </div>
  )
}

export default SignIn
