import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { updateDoc, doc } from "firebase/firestore"
import { AuthContext } from '../context/auth';

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const handleSignOut = async () => {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            isOnline: false,
        });
        await signOut(auth);
        navigate('/login');
    }
    return (
        <nav>
            <h2>
                <Link to='/'>FunChat</Link>
            </h2>
            <div className='center'>
                {user ? (<>
                    <Link className='reg' to='/profile'>Profile</Link>
                    <button className='btn2' onClick={handleSignOut}>LogOut</button>
                </>)
                    :
                    <>
                        <Link className='reg' to='/register'>Register</Link>
                        <Link className='reg' to='/login'>Login</Link>
                    </>
                }
            </div>
        </nav>
    );
};
export default Navbar; 
