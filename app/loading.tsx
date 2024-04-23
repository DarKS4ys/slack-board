import React from 'react'
import { FiLoader } from 'react-icons/fi'

export default function loading() {
  return (
    <div className="flex items-center justify-center w-full h-full text-center mx-auto">
    <FiLoader className='animate-spin' size={32}/>
    </div>
  )
}
