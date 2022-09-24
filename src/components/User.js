import React, { useState, useEffect } from 'react';
import Img from "../avatar.webp";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';

export const User = ({ user, selectUser, user1, chat }) => {
    const text = user.name;
    const user2 = user?.uid;
    const [data, setData] = useState('');
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    useEffect(() => {
        let unsub = onSnapshot(doc(db, 'lastMsg', id), doc => {
            setData(doc.data());
        });
        return () => unsub()
    }, [])

    const len = (str) => {
        let size = new Blob([str]).size;
        return size;
    }

    const Style = {
        fontSize: len(text) > 25 ? "0.66rem" : "default",
    }
    return (
        <>
            <div className={`user_wrapper ${chat.name === user.name && 'selected_user'}`} onClick={() => selectUser(user)}>
                <div className={`user_info ${len(text) > 20 ? 'col' : 'user_info'}`} >
                    <div className="user_detail">
                        <img src={user.avatar || Img} alt="avatar" className='avatar' />
                        <div className='wrap_msg_notif'>
                            <h4 style={Style}>{len(user.name) < 15 ? user.name : `${user.name.slice(0, 18)}....`} </h4>
                            {data && (
                                <>
                                    <p className={`truncate ${data.from === user1 ? 'meChat' : 'youChat'}`}>
                                        <strong>{data.from === user1 ? 'You: ' : null}</strong>
                                        {data.text}
                                    </p>
                                </>
                            )}
                        </div>
                        {data?.from !== user1 && data?.unread && <small className='unread'>New</small>}
                    </div>
                    <div className={`user_status ${user.isOnline ? 'online' : 'offline'}`}></div>
                </div>
            </div>
        </>
    )
}
