import React from 'react'
import logo from "../assets/Logo.svg"
import { Link } from 'react-router-dom'
import {toast} from "react-hot-toast"

const Navbar = (props) => {
  const isLoggedIn = props.isLoggedIn;
  const setIsLoggedIn = props.setIsLoggedIn;

  return (
    <div className="flex items-center justify-between px-6 py-4">

      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="Logo" width={160} />
      </Link>

      {/* Menu */}
      <nav>
        <ul className="flex gap-6">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      {/* Buttons */}
      <div className="flex gap-4">

        {!isLoggedIn && (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>

            <Link to="/signup">
              <button >Sign up</button>
            </Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <Link to="/">
              <button onClick={() => {setIsLoggedIn(false);
                toast.success("Logged Out")
              }}>
                Log out
              </button>
            </Link>

            <Link to="/dashboard">
              <button>Dashboard</button>
            </Link>
          </>
        )}

      </div>

    </div>
  )
}

export default Navbar