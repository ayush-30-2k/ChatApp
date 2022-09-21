import React, { useEffect, useState } from 'react';
import { db, auth, storage } from "../firebase";
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    Timestamp,
    orderBy,
    setDoc,
    doc,
    getDoc,
    updateDoc,
} from 'firebase/firestore';
import { User } from '../components/User';
import { MessageForm } from '../components/MessageForm';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Message } from '../components/Message';
import { Profile } from './Profile';

export const Home = () => {
    const [users, setUsers] = useState([]);
    const [chat, setChat] = useState("");
    const [text, setText] = useState('');
    const [img, setImg] = useState("");
    const [msgs, setMsgs] = useState([]);

    const user1 = auth.currentUser.uid;
    useEffect(() => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("uid", "not-in", [user1]));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            setUsers(users);
        });
        return () => unsub();
    }, []);


    const selectUser = async (user) => {
        setChat(user);
        const user2 = user.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

        const msgsRef = collection(db, 'messages', id, 'chat');
        const q = query(msgsRef, orderBy('createAt', 'asc'));

        onSnapshot(q, querySnapshot => {
            let msgs = [];
            querySnapshot.forEach(doc => {
                msgs.push(doc.data());
            });
            setMsgs(msgs);
        });

        const docSnap = await getDoc(doc(db, 'lastMsg', id));

        if (docSnap.data() && docSnap.data().from !== user1) {
            await updateDoc(doc(db, 'lastMsg', id), { unread: false })
        }

    };


    const handleSubmit = async e => {
        e.preventDefault();
        const user2 = chat.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        let url;
        if (img) {
            const imgRef = ref(
                storage,
                `images/${new Date().getTime()} - ${img.name}`
            );
            const snap = await uploadBytes(imgRef, img)
            const dlurl = await getDownloadURL(ref(storage, snap.ref.fullPath));
            url = dlurl;
        }


        await addDoc(collection(db, 'messages', id, 'chat'), {
            text,
            from: user1,
            to: user2,
            createAt: Timestamp.fromDate(new Date()),
            media: url || "",
        });

        await setDoc(doc(db, 'lastMsg', id), {
            text,
            from: user1,
            to: user2,
            createAt: Timestamp.fromDate(new Date()),
            media: url || "",
            unread: true,
        });

        setText("");
    }

    const len = (str) => {
        let size = new Blob([str]).size;
        return size;
    }
    const name = chat.name;
    return <div className="home_container">
        <div className="user_container">
            {users.map((user) => (
                <User key={user.uid} user={user} selectUser={selectUser} user1={user1} chat={chat} />,
                <Profile key={user.uid} user3={user} />
            ))}
        </div>
        <div className="message_container">
            {chat ? (
                <>
                    <div className='chat_user'>
                        <h2>{len(name) < 15 ? name : `${name.slice(0, 18)}....`}</h2>
                    </div>
                    <div className="messages">
                        {
                            msgs.length ?
                                msgs.map((msg, i) =>
                                    <Message
                                        key={i}
                                        msg={msg}
                                        user1={user1}
                                    />)
                                : null
                        }
                    </div>
                    <MessageForm
                        handleSubmit={handleSubmit}
                        text={text}
                        setText={setText}
                        setImg={setImg}
                    />
                </>
            ) : (
                <h3 className='defalt'>Select a User to start Conversation</h3>
            )}
        </div>
    </div>;
};