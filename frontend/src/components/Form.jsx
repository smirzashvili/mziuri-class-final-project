import React from 'react'

function Form({onSubmit, children, ...props}) {
  return (
    <form onSubmit={onSubmit} className="form"  {...props}>
      {children}
    </form>
  )
}

export default Form