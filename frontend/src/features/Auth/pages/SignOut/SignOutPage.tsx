import { signOut } from "aws-amplify/auth"; 
import { useNavigate } from 'react-router-dom'; 
import "./SignOutPage.css"; 

export default function SignOut() {
  const navigate = useNavigate(); 

  // サインアウト処理
  async function handleSignOut() {
    await signOut(); // サインアウトを実行
    navigate('/'); // サインアウト後にホームページに遷移
  }

  return (
    <button type="button" onClick={handleSignOut} className="signOutButton">
      ログアウト
    </button>
  );
}
