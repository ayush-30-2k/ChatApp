import React from 'react';
import { Attachment } from './svg/Attachment';
import { Send } from './svg/Send';

export const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
    return (
        <div className='typing_form_div'>
            <form className='message_form' onSubmit={handleSubmit}>
                <label htmlFor='img'><Attachment /></label>
                <input
                    onChange={(e) => setImg(e.target.files[0])}
                    type="file"
                    id="img"
                    accept='image/*'
                    style={{ display: "none" }}
                />
                <div>
                    <input
                        type="text"
                        placeholder='Enter Message'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div>
                    <button className='btn-message'>
                        <Send />
                    </button>
                </div>
            </form>
        </div>
    );
}
