import React from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
  const changedEmailHaldler = (e: any) => setEmail(e.target.value)
  const changedPasswordHandler = (e: any) => setPassword(e.target.value)
  const location = useLocation();

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
        window.location.href = location.pathname;
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
      <input type="password" placeholder='password' onChange={changedPasswordHandler}/>
      <button onClick={signIn}>Sign In</button>
      <p>アカウント作成は以下から</p>
      <Link className='link-button' to="/SignUp">SignUp</Link>
    </div>
  )
}

export default SignIn
