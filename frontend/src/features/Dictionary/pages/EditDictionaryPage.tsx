import { useNavigate } from 'react-router-dom';
import "./EditDictionaryPage.css";

export default function EditDictionaryPage() {
  const navigate = useNavigate();
  async function handleEditDictionary() {
    navigate('/EditDictionary');
  }

  return (
    <button type="button" onClick={handleEditDictionary} className="EditDictionaryButton">
      管理画面
    </button>
  )
}
