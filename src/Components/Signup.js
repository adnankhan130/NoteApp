import React,{useState} from 'react';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const navigate = useNavigate();
  const [email,setEmail]= useState('');
  const [password, setPassword] = useState("");
  const [name , setName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async(e) =>{
    e.preventDefault()
    try {
      if (password.length < 6) {
        throw new Error('Password should be at least 6 characters');
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
      alert('Successfully signed up');
      navigate('/');
    }
    catch(error){
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already registered. Please use a different email address.');
      } else {
        setError(error.message);
      }
  }
  }
  return (
    <div className='flex items-center justify-center  h-screen bg-[#B744AC]'>
    <div className=' shadow-lg shadow-slate-900 backdrop-blur-xl p-8
 border-[#e5e5e5]-50 rounded bg-white sm:w-full sm:p-4 md:w-auto  md:p-6 lg:w-1/3 lg:p-8 xl:w-1/4 xl:p-8 mx-auto'>
    <h1 className='text-4xl	text-center 	 subpixel-antialiased font-bold'>SIGNUP</h1>
       <form className="mt-8 space-y-5" >
       {error && <p className="text-red-500">{error}</p>}
       <label htmlFor="name">Name</label>
      <input type='name' value={name} name='name' placeholder='Enter Name' 
      className="appearance-none rounded-none relative block
      w-full px-3 py-2 border border-gray-300
      placeholder-gray-500 text-gray-900 rounded-t-md
      focus:outline-none focus:ring-indigo-500
      focus:border-indigo-500 focus:z-10 sm:text-sm md:text-base"
      onChange={(e)=>setName(e.target.value)}/>

      <label htmlFor="email">Email</label>
      <input type='email' value={email} name='email' placeholder='Email' 
      className="appearance-none rounded-none relative block
      w-full px-3 py-2 border border-gray-300
      placeholder-gray-500 text-gray-900 rounded-t-md
      focus:outline-none focus:ring-indigo-500
      focus:border-indigo-500 focus:z-10 sm:text-sm md:text-base"
      onChange={(e)=>setEmail(e.target.value)}/>

      <label htmlFor="password">Password</label>
      <input type='password' name='password' placeholder='Password'
      className="appearance-none rounded-none relative block
      w-full px-3 py-2  border border-gray-300
      placeholder-gray-500 text-gray-900 rounded-t-md
      focus:outline-none focus:ring-indigo-500
      focus:border-indigo-500 focus:z-10 sm:text-sm"
      onChange={(e)=>setPassword(e.target.value)}/>

      
      <button className="bg-blue-500 hover:bg-gray-100 font-semibold 
         py-2 px-9 w-full border border-blue-300 rounded shadow  sm:text-base md:text-lg" 
         type='submit' onClick={handleSubmit}
      >Signup</button>
      <p className='px-7'> Already have account ?  <a className="inline-block align-baseline 
          font-bold text-m text-white-500 
         text-blue-800 hover:text-red-600" href="/">Login</a></p>
    </form>
    </div>
    </div>
  );
}

export default Signup;
