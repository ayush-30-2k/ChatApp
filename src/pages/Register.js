import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";


export const Register = () => {

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false
    });

    const navigate = useNavigate();

    const { name, password, email, error, loading } = data;

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true });
        if (!name || !email || !password) {
            setData({ ...data, error: "All Feilds are required" })
        }
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await setDoc(doc(db, 'users', result.user.uid), {
                uid: result.user.uid,
                name,
                email,
                createAt: Timestamp.fromDate(new Date()),
                isOnline: true,
            });
            setData({ name: '', email: '', password: '', error: null, loading: false });
            navigate("/");
        }
        catch (err) {
            setData({ ...data, error: err.message, loading: false });
        }
    };


    return (
        <>
            <section>
                <h3>Create An Account</h3>
                <form action="" className="form" onSubmit={handleSubmit}>
                    <div className="input_container">
                        <label htmlFor="">Name</label><br />
                        <input type="text" name='name' onChange={handleChange} />
                    </div>
                    <div className="input_container">
                        <label htmlFor="">Email</label><br />
                        <input type="text" name='email' onChange={handleChange} />
                    </div>
                    <div className="input_container">
                        <label htmlFor="">Password</label><br />
                        <input type="password" name='password' onChange={handleChange} />
                    </div>

                    <button className='btn' disabled={loading}>
                        {loading ? 'creating...' : 'Register'}
                    </button>
                </form>
                {error ? <h6 className='err'>{error}</h6> : null}
            </section>
        </>
    );
};
