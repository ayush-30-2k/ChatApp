import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";


export const LogIn = () => {

    const [data, setData] = useState({
        email: "",
        password: "",
        error: null,
        loading: false
    });

    const navigate = useNavigate();

    const { password, email, error, loading } = data;

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true });
        if (!email || !password) {
            setData({ ...data, error: "All Feilds are required" })
        }
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateDoc(doc(db, 'users', result.user.uid), {
                isOnline: true,
            });
            setData({ email: '', password: '', error: null, loading: false });
            navigate("/");
        }
        catch (err) {
            setData({ ...data, error: err.message, loading: false });
        }
    };


    return (
        <>
            <section>
                <h3>Login to Your Account</h3>
                <form action="" className="form" onSubmit={handleSubmit}>
                    <div className="input_container">
                        <label htmlFor="">Email</label><br />
                        <input type="text" name='email' onChange={handleChange} />
                    </div>
                    <div className="input_container">
                        <label htmlFor="">Password</label><br />
                        <input type="password" name='password' onChange={handleChange} />
                    </div>

                    <button className='btn' disabled={loading}>
                        {loading ? 'logging in...' : 'Login'}
                    </button>
                </form>
                {error ? <h6 className='err'>{error}</h6> : null}
            </section>
        </>
    );
};
