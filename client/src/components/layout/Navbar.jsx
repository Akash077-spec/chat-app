import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="p-4 bg-blue-500 text-white flex justify-between">
      <Link to="/chat" className="text-xl font-bold">ChatApp</Link>
      {user && (
        <div className="flex space-x-4">
          <Link to="/profile">Profile</Link>
          <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      )}
    </nav>
  );
}