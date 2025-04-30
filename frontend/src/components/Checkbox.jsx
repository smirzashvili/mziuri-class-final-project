import React from 'react'

function Checkbox({additionalClassnames, ...props}) {
  return (
    <div className={`checkbox ${additionalClassnames ? additionalClassnames : ''}`}>
        <input
          {...props}
        />
        <span className="checkmark"></span>
    </div>
  )
}

export default Checkbox