import type { FormEvent } from "react";
import { signUp } from "aws-amplify/auth";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./SignUpPage.css";

interface SignUpFormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}

interface SignUpForm extends HTMLFormElement {
  readonly elements: SignUpFormElements;
}

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  
  // フォーム送信時の処理
  async function handleSubmit(event: FormEvent<SignUpForm>) {
    event.preventDefault(); // ページリロードを防ぐ
    const form = event.currentTarget;

    try {
      // ユーザーのサインアップ処理
      await signUp({
        username: form.elements.username.value,
        password: form.elements.password.value,
      });
      setError('');
      navigate('/SignIn'); // 成功時にサインインページに遷移
    } catch (err) {
      if (err instanceof Error) {
        switch (err.message) {
          case "username is required to signUp":
            setError("ユーザー名を入力してください");
            break;
          case "password is required to signUp":
            setError("パスワードを入力してください");
            break;
          case "Username already exists":
            setError("このユーザー名はすでに存在します");
            break;
          case "Password did not conform with policy: Password not long enough":
            setError("パスワードの長さが足りません");
            break;
          case "Password did not conform with policy: Password must have lowercase characters":
            setError("パスワードには小文字を使用する必要があります");
            break;
          case "Password did not conform with policy: Password must have numeric characters":
            setError("パスワードには数字を含める必要があります");
            break;
          default:
            setError(err.message)
        }
      } else {
        setError('不明なエラーが発生しました');
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
        {error && <div className="error">{error}</div>} {/* エラー表示 */}
        <button type="submit">サインアップ</button>
        <Link to="/Create" className="login-button">ログイン画面に戻る</Link>
      </form>
    </div>
  );
}
