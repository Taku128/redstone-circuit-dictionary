import type { FormEvent } from "react";
import { signIn } from "aws-amplify/auth";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./SignInPage.css";

// フォームの入力要素に対する型定義
interface SignInFormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}

// フォーム全体に対する型定義
interface SignInForm extends HTMLFormElement {
  readonly elements: SignInFormElements;
}

export default function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  // ログインフォームが送信されたときの処理
  async function handleSubmit(event: FormEvent<SignInForm>) {
    event.preventDefault(); // ページリロードを防ぐ
    const form = event.currentTarget;
    
    try {
      // AWS AmplifyのsignIn関数を使ってログイン処理を実行
      await signIn({
        username: form.elements.username.value,
        password: form.elements.password.value,
      });
      setError(''); // エラーメッセージをリセット
      navigate('/Create'); // ログイン成功後、指定したページにリダイレクト
    } catch (err) {
      // エラー発生時の処理
      if (err instanceof Error) {
        switch (err.message) {
          case "User does not exist.":
            setError("ユーザーが存在しません");
            break;
          case "Incorrect username or password.":
            setError("ユーザー名またはパスワードが間違っています");
            break;
          default:
            setError(err.message)
        }
      } else {
        setError('不明なエラーが発生しました'); // エラーの種類がわからない場合の処理
      }
    }
  }

  return (
    <div className="login-container">
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">ユーザー名</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input type="password" id="password" name="password" required />
        </div>
        {error && <div className="error">{error}</div>} 
        <button type="submit">ログイン</button>
        <Link to="/SignUp" className="signUp-button">サインアップへ</Link>
      </form>
    </div>
  );
}
