import React from 'react'

const IconButton = ({
    icon,
    onClick,
    selectedShape
} : {
    icon: React.ReactNode,
    onClick: () => void,
    selectedShape: boolean
}) => {
  return (
    <div className={`pointer  cursor-pointer rounded-2xl border border-primary p-2 text-primary ${selectedShape ? 'bg-primary text-white dark:text-black border-black' : 'bg-transparent'}`} onClick={onClick}>
      {icon}
    </div>
  )
}

export default IconButton
