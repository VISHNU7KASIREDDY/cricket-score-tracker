import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-cricket-field text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold" onClick={closeMenu}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cricket-ball">
              <circle cx="16" cy="16" r="15" fill="currentColor" stroke="#FFF" strokeWidth="2"/>
              <path d="M16 31C24.2843 31 31 24.2843 31 16C31 7.71573 24.2843 1 16 1" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8.5 8.5L12.5 12.5M19.5 19.5L23.5 23.5M8.5 23.5L12.5 19.5M19.5 12.5L23.5 8.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>CricScore</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/new-match" 
              className={({ isActive }) => 
                isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"
              }
            >
              New Match
            </NavLink>
            <NavLink 
              to="/teams" 
              className={({ isActive }) => 
                isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"
              }
            >
              Teams
            </NavLink>
            <NavLink 
              to="/history" 
              className={({ isActive }) => 
                isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"
              }
            >
              History
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-cricket-field border-t border-green-800">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col space-y-3 py-3">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive ? "font-semibold border-l-4 border-white pl-2" : "pl-2 hover:text-gray-200"
                }
                onClick={closeMenu}
              >
                Home
              </NavLink>
              <NavLink 
                to="/new-match" 
                className={({ isActive }) => 
                  isActive ? "font-semibold border-l-4 border-white pl-2" : "pl-2 hover:text-gray-200"
                }
                onClick={closeMenu}
              >
                New Match
              </NavLink>
              <NavLink 
                to="/teams" 
                className={({ isActive }) => 
                  isActive ? "font-semibold border-l-4 border-white pl-2" : "pl-2 hover:text-gray-200"
                }
                onClick={closeMenu}
              >
                Teams
              </NavLink>
              <NavLink 
                to="/history" 
                className={({ isActive }) => 
                  isActive ? "font-semibold border-l-4 border-white pl-2" : "pl-2 hover:text-gray-200"
                }
                onClick={closeMenu}
              >
                History
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar