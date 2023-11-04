import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from "./Components/login";
import Home from './Components/Home';
import { auth, db } from './firebase'; // You'll need to import Firestore db
import { Navigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authUser = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => authUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Signup' element={<Signup />} />
        <Route
          path="/Home"
          element={user ? (
            <Home user={user} />
          ) : (
            <Navigate to="/" />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
