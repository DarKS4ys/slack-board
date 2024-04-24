import React from 'react'
import { FiLoader } from 'react-icons/fi'

export default function loading() {
  return (
    <div className="flex items-center justify-center w-full h-screen text-center mx-auto">
    <FiLoader className='animate-spin' size={48}/>
    </div>
  )
}
