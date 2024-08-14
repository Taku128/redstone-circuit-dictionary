import { signOut } from "aws-amplify/auth"
import { useNavigate } from 'react-router-dom';
import "./SignOutPage.css";

export default function SignOut() {
  const navigate = useNavigate();
  async function handleSignOut() {
    await signOut()
    navigate('/');
  }

  return (
    <button type="button" onClick={handleSignOut} className="signOutButton">
      ログアウト
    </button>
  )
}
