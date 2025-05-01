import { FaGithub, FaTwitter } from 'react-icons/fa'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cricket-ball mr-2">
                <circle cx="16" cy="16" r="15" fill="currentColor" stroke="#FFF" strokeWidth="2"/>
                <path d="M16 31C24.2843 31 31 24.2843 31 16C31 7.71573 24.2843 1 16 1" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8.5 8.5L12.5 12.5M19.5 19.5L23.5 23.5M8.5 23.5L12.5 19.5M19.5 12.5L23.5 8.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-lg font-semibold">CricScore</span>
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center md:text-left">
              © {currentYear} CricScore. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Cricket scoring made simple
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer