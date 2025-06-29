import React from 'react'

const Navbar = () => {
  return (

    <nav className='bg-gray-400 p-5'>
        <div className='flex justify-between'>
            <div>
                <h2 className='text-2xl'>AudioBook</h2>
            </div>
            <div>
                <h3>profile image</h3>
            </div>
        </div>
    </nav>
  )
}

export default Navbar