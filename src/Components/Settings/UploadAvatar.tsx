import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { userState } from "../../Atoms/UserState";
import { languageState } from "../../Atoms/LanguageState";
import { socketState } from "../../Atoms/SocketState";
import { env } from "process";
import { requests } from "../../requests";
import { ImageViewer } from "../Utils/ImageViewer";
import { AvatarImage } from "../Utils/AvatarImage";

export const UploadAvatar = (props: any) => {
  const [language, setLanguage] = useRecoilState(languageState);
  const [user, setUser] = useRecoilState(userState);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isEditing, setEditing] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar(e.target.files[0]);
    }
  };

  const setIsEditing = () => {
    setEditing((prev) => !prev);
  };

  const uploadAvatar = async () => {
    if (!avatar) {
      console.log("Выберите файл для загрузки");
      return;
    }

    const formData = new FormData();
    formData.append("file", avatar);
    //uploadAvatar
    const server = process.env.REACT_APP_SERVER_NAME;
    const requestConfig: RequestInit = {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
      },
      body: formData,
      credentials: "include",
    };
    const response = await fetch(
      `${server + requests.uploadAvatar} `,
      requestConfig
    );
    const data = await response.text();

    setEditing(false);
    setUser((prev) => ({ ...prev, image: data }));
  };

  return (
    <>
      <div>
        {user.image && <AvatarImage image={user.image} size="lg" />}
        {isEditing ? (
          <>
            <Form.Group controlId="avatar" className="mb-3">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Form.Group>
            <Button className="ps-1 pe-1" onClick={uploadAvatar}>
              {language.words?.Upload}
            </Button>
          </>
        ) : (
          <Button className="ps-1 pe-1" onClick={setIsEditing}>
            {language.words?.Edit}
          </Button>
        )}
      </div>
    </>
  );
};
