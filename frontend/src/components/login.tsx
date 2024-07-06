import React from 'react'

// components
import SignUp from './auth/SignUp'
import Verification from './auth/Verification'
import SignIn from './auth/SignIn'
import SignOut from './auth/SignOut'

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../awsConfiguration'

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

const Login: React.FC = () => {

  const authentication = () => {
    const cognitoUser = userPool.getCurrentUser()
    // サインインユーザーがいればアプリのメイン画面へ、
    // いなければサインアップ、検証、サインイン画面を表示する。
    if (cognitoUser) {
      return (
        <div className="authorizedMode">
          <SignOut />
        </div>
      )
    } else {
      return (
        <div className="unauthorizedMode">
          <SignIn />
        </div>
      )
    }
  }

  return (
    <div className="App">
      { authentication() }
    </div>
  )
}

export default Login
