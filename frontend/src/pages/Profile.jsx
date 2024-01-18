import React, { useState, useEffect } from "react";
import Camera from "../assets/svg/Camera";
import Delete from "../assets/svg/Delete";
import { toast } from "react-toastify";
import { ChatState } from "../Contest/ChatProvider";
import axios from "axios";
import moment from "moment";

const Profile = () => {
  const [img, setImg] = useState();
  const [pic, setPic] = useState();
  const [userData, setUserData] = useState({});
  const [picLoading, setPicLoading] = useState(false);

  const { user } = ChatState();

  const defaultPic =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast("Please select an image!", {
        type: "warming",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatting-app");
      data.append("cloud_name", "mern-chat-application");
      fetch(
        "https://api.cloudinary.com/v1_1/mern-chat-application/image/upload",
        {
          method: "post",
          body: data,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setImg(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast("Please select an image!", {
        type: "warming",
      });
      setPicLoading(false);
      return;
    }
  };

  useEffect(() => {
    if (img || pic) {
      const UploadImg = async () => {
        try {
          setPicLoading(true);
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(
            `/api/user/update/${user._id} `,
            img ? { img } : { pic },
            config
          );
          setUserData(data);
          localStorage.setItem("userInfo", JSON.stringify(data));

          img
            ? toast("Profile picture updated", { type: "success" })
            : toast("Profile picture deleted successful", { type: "success" });

          setPicLoading(false);
          setImg("");
          setPic("");
        } catch (err) {
          console.log(err.message);
          setPicLoading(false);
        }
      };
      UploadImg();
    }
  }, [img, pic]);

  const deleteImage = () => {
    setPic(defaultPic);
  };

  return user ? (
    <section>
      <div className="profile_container">
        <div className="img_container">
          <img src={userData.pic || user.pic} alt="" />
          <div className="overlay">
            <label htmlFor="photo">
              <Camera />
            </label>
            {user.pic !== defaultPic && <Delete deleteImage={deleteImage} />}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="photo"
              onChange={(e) => postDetails(e.target.files[0])}
            />
          </div>
        </div>
        <div className="text_container">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
          <small>
            Joined on: {moment(user.createdAt).format("DD/MM/YYYY HH:mm")}
          </small>
        </div>
      </div>
    </section>
  ) : null;
};

export default Profile;
