import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../firebase';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add an isAuthenticated state

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setIsAuthenticated(true); 
        navigate('/Home');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode, errorMessage);
      });
  };
    
  return (
    <div className='flex items-center justify-center h-screen bg-[#F5F5F5] '>
    <div className=' shadow-lg shadow-slate-900 backdrop-blur-xl p-8
 border-[#e5e5e5]-50 rounded bg-white sm:w-full sm:p-4 md:w-auto  md:p-6 lg:w-1/3 lg:p-8 xl:w-1/4 xl:p-8 mx-auto'>
    <div>
        <h1 className='text-4xl	 text-center subpixel-antialiased font-bold'>LOGIN</h1>
  <form className="mt-8 space-y-4" action="#" method="POST">
    <label htmlFor="email"  > Email</label>
    <input 
      type="email"
      name="email"
      placeholder="Enter Email"
      id="email-address"
      required
      className="appearance-none rounded-none relative block 
              w-full px-3 py-2 border border-gray-300
              placeholder-gray-500 text-gray-900 rounded-t-md
              focus:outline-none focus:ring-indigo-500
              focus:border-indigo-500 focus:z-10 sm:text-sm md:text-base "
      onChange={(e) => setEmail(e.target.value)}
    />
    <br></br>
    <label htmlFor="password" className='py-2'> Password</label>
    <input 
      type="password"
      name="password"
      placeholder="Enter Password"
      id="password"
      required
      className="appearance-none rounded-none relative block
              w-full px-3 py-2 border border-gray-300
              placeholder-gray-500 text-gray-900 rounded-t-md
              focus:outline-none focus:ring-indigo-500
              focus:border-indigo-500 focus:z-10 sm:text-sm md:text-base"
      onChange={(e) => setPassword(e.target.value)}
    />
    <p className="  text-red-600 hover:text-blue-600 md:text-sm" ><a href="#">Forget Password ?</a></p>
   

    <button className="bg-blue-500 hover:bg-gray-100 font-semibold 
     py-2 px-9 w-full border border-blue-300 rounded shadow  sm:text-base md:text-lg" 
    type="submit" onClick={onLogin}>
Login
</button>

    
     <p className='px-7 '> Don't have account ? <a className="inline-block align-baseline 
      font-bold text-m text-white-500 
     text-blue-800 hover:text-red-600 " href="/Signup">Signup</a></p>
  </form>
</div>
</div>
</div>
);
}

export default Login;
