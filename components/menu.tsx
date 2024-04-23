import type { User } from '@clerk/nextjs/server'
import React from 'react'

export default function Menu({user}: {user: User | null}) {
  return (
    <div>menu</div>
  )
}
