import React from 'react';
import useVerification from '../hooks/useVerification';
import '../../../css/Verification.css';

const VerificationForm: React.FC = () => {
  const {
    email,
    verificationCode,
    error,
    changedEmailHandler,
    changedVerificationCodeHandler,
    verifyCode,
  } = useVerification();

  return (
    <div className="Verification">
      <h1>Authenticate</h1>
      <p>emailに検証コードを送りました。届いた検証コードを以下に入力してください</p>
      <input type="text" placeholder="verification code" onChange={changedVerificationCodeHandler} />
      <input type="text" placeholder='email' onChange={changedEmailHandler} />
      {error && <div className="error">{error}</div>}
      <button onClick={verifyCode}>Authenticate</button>
    </div>
  );
};

export default VerificationForm;
