import React, { useEffect, useState } from "react";
import { CognitoUserPool,CognitoUserSession } from 'amazon-cognito-identity-js';
import useFetchAuthSession from './features/Dictionary/hooks/useFetchAuthSession';
import awsConfiguration from './awsConfiguration';
import endpoint from "./endpoint";


const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
});

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  // const [session, setSession] = useState<CognitoUserSession | null>(null);

  // useEffect(() => {
  //   const FetchSession = async () => {
  //     const fetchedSession = await useFetchAuthSession(userPool);
  //     setSession(fetchedSession);
  //   };
    
  //   FetchSession();
  // }, []);

  // ファイルが選択されたときに呼び出される関数
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // S3にファイルをアップロードする関数
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("ファイルを選択してください");
      return;
    }

    let username = '';
    let cognitoSession = '';

    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        try {
          const session = await new Promise<CognitoUserSession>((resolve, reject) => {
            cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
              if (err) {
                reject(err);
              } else if (session) {
                resolve(session);
              } else {
                reject(new Error('Failed Get Session'));
              }
            });
          });
  
          if (session.isValid()) {
            cognitoSession = session.getAccessToken().getJwtToken();
            username = cognitoUser.getUsername();
          }
          else {
            console.log('Session Is Not Valid');
            return;
          }
        } catch (error) {
          console.error('Error getting user session', error);
          return;
        }
      } 
      if (!username){
        console.log('No cognito user found');
        return
    }

    try {
      const response = await fetch(endpoint + `/dev/files-upload?filename=${selectedFile.name}`, {
        method: 'GET',
        headers: {
          'Authorization': `${cognitoSession}`,
          'x-poster': `${username}`
        }
      });
      const data = await response.json();
      const presignedUrl = data.url;

      await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      setFileName(selectedFile.name)
      alert("ファイルがアップロードされました！");
    } catch (error) {
      console.error("アップロードエラー:", error);
      alert("ファイルのアップロードに失敗しました");
    }
  };

  const handleFileDownload = async () => {
    let username = '';
    let cognitoSession = '';

    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        try {
          const session = await new Promise<CognitoUserSession>((resolve, reject) => {
            cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
              if (err) {
                reject(err);
              } else if (session) {
                resolve(session);
              } else {
                reject(new Error('Failed Get Session'));
              }
            });
          });
  
          if (session.isValid()) {
            cognitoSession = session.getAccessToken().getJwtToken();
            username = cognitoUser.getUsername();
          }
          else {
            console.log('Session Is Not Valid');
            return;
          }
        } catch (error) {
          console.error('Error getting user session', error);
          return;
        }
      } 
      if (!username){
        console.log('No cognito user found');
        return
    }
    
    try {
      const response = await fetch(endpoint + `/dev/files-download?filename=${fileName}`, {
        method: 'GET',
        headers: {
          'Authorization': `${cognitoSession}`,
          'x-poster': `${username}`
        }
      });
      const data = await response.json();
      setFileUrl(data.url);
    } catch (error) {
      console.error("Error fetching presigned URL:", error);
    }
  };

  return (
    <div>
      <h1>ファイルアップロード</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>アップロード</button>
      <button onClick={() => handleFileDownload()}>Download File</button>
      {fileUrl && (
        <div>
          <h2>アップロードされたファイル:</h2>
          {selectedFile?.type.startsWith("image/") ? (
            <img src={fileUrl} alt="uploaded file" style={{ width: "300px" }} />
          ) : selectedFile?.type.startsWith("video/") ? (
            <video width="300" controls>
              <source src={fileUrl} type={selectedFile.type} />
              お使いのブラウザは動画をサポートしていません。
            </video>
          ) : (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              ファイルを表示
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
