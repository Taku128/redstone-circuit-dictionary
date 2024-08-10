import type { FormEvent } from "react"
import { signUp } from "aws-amplify/auth"
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./SignUpPage.css"

interface SignInFormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement
  password: HTMLInputElement
}

interface SignInForm extends HTMLFormElement {
  readonly elements: SignInFormElements
}

export default function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  async function handleSubmit(event: FormEvent<SignInForm>) {
    event.preventDefault()
    const form = event.currentTarget
    
    try {
      await signUp({
        username: form.elements.username.value,
        password: form.elements.password.value,
      })
      setError('');
      navigate('/');
    } catch(err){
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  }

  return (
    <div className="signup-container">
      <h1>サインアップ</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">ユーザー名</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input type="password" id="password" name="password" />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">サインアップ</button>
        <Link to="/Creat" className='SignUp-button'>ログイン画面に戻る</Link>
      </form>
    </div> 
  )
}
