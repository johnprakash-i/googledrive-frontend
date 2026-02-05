import { useContext } from 'react'
import { DriveContext } from '@/context/DriveContext'

export function useDrive() {
  const context = useContext(DriveContext)
  if (context === undefined) {
    throw new Error('useDrive must be used within a DriveProvider')
  }
  return context
}