import React, { useState, useEffect } from 'react';
import { Camera } from '../components/svg/Camera';
import Img from "../avatar.webp";
import { storage, db, auth } from '../firebase';
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { Trash } from '../components/svg/Trash';
import { useNavigate } from "react-router-dom";

export const Profile = (user3) => {
    const [img, setImg] = useState("");
    const [user, setUser] = useState();

    const navigate = useNavigate("");
    useEffect(() => {
        getDoc(doc(db, 'users', auth.currentUser.uid)).then((docSnap) => {
            if (docSnap.exists) {
                setUser(docSnap.data());
            }
        });
        if (img) {
            const imageUpload = async () => {
                const imageRef = ref(
                    storage,
                    `avatar/${new Date().getTime()} - ${img.name}`
                );
                try {
                    if (user.avatarPath) {
                        await deleteObject(ref(storage, user.avatarPath));
                    }
                    const snap = await uploadBytes(imageRef, img);
                    const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

                    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                        avatar: url,
                        avatarPath: snap.ref.fullPath,
                    });
                    setImg("");
                } catch (err) {
                    console.log(err.message);
                }
            };
            imageUpload();
        }
    }, [img]);

    const deleteImage = async () => {
        try {
            const confirm = window.confirm('delete avatar?');
            if (confirm) {
                await deleteObject(ref(storage, user.avatarPath));

                await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    avatar: '',
                    avatarPath: '',
                });
                navigate('/');
            }
        } catch (err) {
            console.log(err.message);
        }

    }
    // setuser4(user.email);
    // console.log(user4);
    const Style = {

    }


    return user ? (
        <div>
            <section className='section'>
                <div className="prof">
                    <div className='image_container'>
                        <img src={user.avatar ? user.avatar : Img} alt='avatar' />
                        <div className='overlay'>
                            <div>
                                <label className='cam' htmlFor='photo'>
                                    <Camera />
                                </label>
                                {user.avatar ? <Trash deleteImage={deleteImage} /> : null}
                                <input
                                    type="file"
                                    accept='image/*'
                                    style={{ display: "none" }}
                                    id='photo'
                                    onChange={(e) => setImg(e.target.files[0])}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 style={Style}>{user.name}</h1>
                        <h4 style={{ color: "grey", marginTop: "0.2rem", marginBottom: "0.5rem" }}>{user.email}</h4>
                        <hr style={{ width: "100%" }} />
                        <h6 style={{ marginTop: "0.5rem" }}>Joined On - {user.createAt.toDate().toDateString()}</h6>
                    </div>
                </div>
            </section>
        </div>
    ) : null;
}
