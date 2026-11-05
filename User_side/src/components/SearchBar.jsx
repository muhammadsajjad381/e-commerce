import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

function SearchBar({ placeholder = 'Search products...', className = '', onSearch }) {
  const [term, setTerm] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const query = term.trim()
    if (!query) return

    navigate(`/search?q=${encodeURIComponent(query)}`)
    if (onSearch) onSearch()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`items-center border border-gray-300 rounded-md overflow-hidden bg-white ${className}`}
    >
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 sm:px-4 py-2 outline-none text-sm"
      />
      <button
        type="submit"
        className="bg-orange-500 text-white px-3 sm:px-4 py-2 hover:bg-orange-600 transition"
      >
        <FiSearch size={18} />
      </button>
    </form>
  )
}

export default SearchBar    