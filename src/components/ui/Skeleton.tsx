import React from 'react'
import { cn } from '@/utils/helpers'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  style,
  ...props
}) => {
  const baseStyles = 'bg-gray-200 overflow-hidden'
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-xl',
  }

  const animations = {
    pulse: 'animate-pulse-subtle',
    wave: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[wave_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent',
    none: '',
  }

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        animations[animation],
        className
      )}
      style={{
        width: width || undefined,
        height: height || undefined,
        ...style,
      }}
      {...props}
    />
  )
}

export default Skeleton