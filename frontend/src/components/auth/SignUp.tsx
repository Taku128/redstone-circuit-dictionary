import React from 'react'
import { useNavigate } from 'react-router-dom';
import {
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js"
import awsConfiguration from '../../awsConfiguration'
import "../css/SignUp.css"

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

const SignUp: React.FC = () => {
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')
  const navigate = useNavigate();

  const changedEmailHandler = (event: any) => setEmail(event.target.value)
  const changedPasswordHandler = (event: any) => setPassword(event.target.value)
  const signUp = () => {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      })
    ]
    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        setError(err.message || JSON.stringify(err))
        return
      }
      setError('')
      setEmail('')
      setPassword('')
      navigate('/Verification');
    })
  }

  return (
    <div className="SignUp">
      <h1 style={{ textAlign: 'left' }}>SignUp</h1>
      <p>※パスワードは他のアカウントとは別のものを使用してください!</p>
      <input type="text" placeholder="email" onChange={changedEmailHandler} />
      <input type="password" placeholder="password" onChange={changedPasswordHandler} />
      {error && <div className="error">{error}</div>}
      <button onClick={signUp}>SignUp</button>
    </div>
  )
}

export default SignUp
