import React, { useEffect, useState } from "react";
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   onSnapshot,
//   addDoc,
//   Timestamp,
//   orderBy,
//   setDoc,
//   doc,
//   getDoc,
//   updateDoc,
//   getDocs,
// } from "firebase/firestore";
// import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
// import { getAuth } from "firebase/auth";
// import app from "../firebase/Config";
// import User from "../components/User";
// import MessageForm from "../components/MessageForm";
// import Message from "../components/Message";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [search, setSearch] = useState("");

  // const db = getFirestore(app);
  // const auth = getAuth(app);
  // const storage = getStorage(app);

  // const user1 = auth.currentUser.uid;

  // useEffect(() => {
  //   const usersRef = collection(db, "users");
  //   // create query object
  //   const q = query(usersRef, where("id", "not-in", [user1]));
  //   // execute query
  //   const unsub = onSnapshot(q, (querySnapshot) => {
  //     let users = [];
  //     querySnapshot.forEach((doc) => {
  //       users.push(doc.data());
  //     });
  //     setUsers(users);
  //   });
  //   return () => unsub();
  // }, []);

  // const selectUser = async (user) => {
  //   setChat(user);

  //   const user2 = user.id;
  //   const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

  //   const msgsRef = collection(db, "messages", id, "chat");
  //   const q = query(msgsRef, orderBy("createdAt", "asc"));

  //   onSnapshot(q, (querySnapshot) => {
  //     let msgs = [];
  //     querySnapshot.forEach((doc) => {
  //       msgs.push(doc.data());
  //     });
  //     setMsgs(msgs);
  //   });
  //   // get last message b/w logged in user and selected user
  //   const docSnap = await getDoc(doc(db, "lastMsg", id));
  //   // if last message exists and message is from selcted user
  //   if (docSnap.data() && docSnap.data().from !== user1) {
  //     // update last message doc, set unread to false
  //     await updateDoc(doc(db, "lastMsg", id), { unread: false });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const user2 = chat.id;

    // const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    // let url;
    // if (img) {
    //   const imgRef = ref(
    //     storage,
    //     `images/${new Date().getTime()} -${img.name}`
    //   );
    //   const snap = await uploadBytes(imgRef, img);
    //   const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
    //   url = dlUrl;
    // }
    // setImg("");

    // await addDoc(collection(db, "messages", id, "chat"), {
    //   text,
    //   from: user1,
    //   to: user2,
    //   createdAt: Timestamp.fromDate(new Date()),
    //   media: url || "",
    // });

    // await setDoc(doc(db, "lastMsg", id), {
    //   text,
    //   from: user1,
    //   to: user2,
    //   createdAt: Timestamp.fromDate(new Date()),
    //   media: url || "",
    //   unread: true,
    // });

    // setText("");
  };

  return (
    <div className="home_container">
      <div className="users_container">
        <input
          type="text"
          placeholder="Search or add new chat"
          className="search"
          // onKeyDown={handleKey}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* {users.map((user) => (
          <User
            key={user.id}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))} */}
      </div>
      <div className="messages_container">
        {/* {chat ? (
          <>
            <div className="messages_user">
              <h3>{chat.name}</h3>
              <div
                className={`user_status2 ${
                  chat.isOnline ? "online" : "offline"
                }`}
              ></div>
            </div>
            <div className="messages">
              {msgs.length
                ? msgs.map((msg, i) => (
                    <Message key={i} msg={msg} user1={user1} chat={chat} />
                  ))
                : null}
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
            />
          </>
        ) : (
          <h3 className="no_conv">Select a user to start conversation</h3>
        )} */}
      </div>
    </div>
  );
};

export default Home;
