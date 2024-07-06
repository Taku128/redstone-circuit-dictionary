import React from 'react'
import { useNavigate } from 'react-router-dom';
import {
  CognitoUserPool,
  CognitoUser
} from "amazon-cognito-identity-js"
import awsConfiguration from '../../awsConfiguration'
import "../css/Verification.css"

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

const Verification: React.FC = () => {
  const [email, setEmail] = React.useState<string>('')
  const [verificationCode, setVerificationCode] = React.useState<string>('')
  const changedEmailHandler = (event: any) => setEmail(event.target.value)
  const changedVerificationCodeHandler = (event: any) => setVerificationCode(event.target.value)
  const navigate = useNavigate();

  const verifyCode = () => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })
    cognitoUser.confirmRegistration(verificationCode, true, (err: any) => {
      if (err) {
        console.log(err)
        return
      }
      console.log('verification succeeded')
      setEmail('')
      setVerificationCode('')
      navigate('/Creat');
    })
  }
  return (
    <div className="Verification">
      <h1>Authenticate</h1>
      <p>emailに検証コードを送りました。届いた検証コードを以下に入力してください</p>
      <input type="text" placeholder="verification code" onChange={changedVerificationCodeHandler} />
      <input type="text" placeholder='email' onChange={changedEmailHandler} />
      <button onClick={verifyCode}>Authenticate</button>
    </div>
  )
}

export default Verification
