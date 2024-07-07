import React from 'react'
import { useLocation, Link } from 'react-router-dom';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js"
import awsConfiguration from '../../awsConfiguration'
import "../css/SignIn.css"

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

const SignIn: React.FC = () => {
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')
  const location = useLocation();

  const changedEmailHandler = (e: any) => setEmail(e.target.value)
  const changedPasswordHandler = (e: any) => setPassword(e.target.value)

  const signIn = () => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
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
        setError('')
        window.location.href = location.pathname;
      },
      onFailure: (err) => {
        setError(err.message || JSON.stringify(err))
      }
    })
  }

  return (
    <div className="SignIn">
      <h1>SignIn</h1>
      <input type="text" placeholder='email' onChange={changedEmailHandler} />
      <input type="password" placeholder='password' onChange={changedPasswordHandler} />
      {error && <div className="error">{error}</div>}
      <button onClick={signIn}>Sign In</button>
      <p>アカウント作成は以下から</p>
      <Link className='link-button' to="/SignUp">SignUp</Link>
    </div>
  )
}

export default SignIn
