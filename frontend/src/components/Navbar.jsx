import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, handleLogout } = useContext(AuthContext);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-xl font-bold">OpportuneX</div>
      <div>
        {user ? (
          <>
            <span className="mr-4">{user.name}</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <a href="/login" className="bg-blue-500 px-3 py-1 rounded">Login</a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
