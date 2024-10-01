import { CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";
import React, { useState, useEffect } from "react";
import useFetchAuthSession from "./features/Dictionary/hooks/useFetchAuthSession";
import awsConfiguration from "./awsConfiguration";

const userPool = new CognitoUserPool({
    UserPoolId: awsConfiguration.UserPoolId,
    ClientId: awsConfiguration.ClientId,
  });

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [session, setSession] = useState<CognitoUserSession | null>(null);

    useEffect(() => {
        const FetchSession = async () => {
        const fetchedSession = await useFetchAuthSession(userPool);
        setSession(fetchedSession);
        };
        
        FetchSession();
    }, []);

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

    try {
      const response = await fetch(
        `https://b8fj8eos5m.execute-api.ap-northeast-1.amazonaws.com/dev/files-upload?filename=${selectedFile.name}`
      );
      const data = await response.json();
      const presignedUrl = data.url;

      await fetch(presignedUrl, {
        method: "PUT",
        // credentials: 'include',
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      const uploadedFileUrl = presignedUrl.split("?")[0];
      console.log(uploadedFileUrl);
      setFileUrl(uploadedFileUrl);
      alert("ファイルがアップロードされました！");
    } catch (error) {
      console.error("アップロードエラー:", error);
      alert("ファイルのアップロードに失敗しました");
    }
  };

  return (
    <div>
      <h1>ファイルアップロード</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>アップロード</button>
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
