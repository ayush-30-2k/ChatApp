import React, { useEffect, useRef } from 'react';
import Moment from "react-moment";

export const Message = ({ msg, user1 }) => {
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [msg]);

    return (
        <>
            <div className={`message_wrapper ${msg.from === user1 ? 'own' : ""}`} ref={scrollRef}>
                <p className={msg.from === user1 ? 'me' : "friend "}>
                    {msg.text ? msg.text : (
                        msg.media ? <img src={msg.media} alt={msg.text} /> : null)
                    }
                    <br />
                    <small>
                        <Moment fromNow>{msg.createAt.toDate()}</Moment>
                    </small>
                </p>
            </div>
        </>
    );
};
