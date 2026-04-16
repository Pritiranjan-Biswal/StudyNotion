import React, { useState } from 'react'
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai"

const SignupForm = () => {
    const {formData, setFormData}=useState({
        email:"", password:""
    })
    const [showPassword, setShowPassword]=useState(false)
    function  changeHandler(event) {
        setFormData((prevData) => (
            {
                ...prevData,
                [event.target.name]: event.target.value
            }
        ))
    }
  return (
    <form>
      <label>
        <p>Email Address<sup>*</sup></p>
        <input required
        type='text'
        value={formData.email}
        onChange={changeHandler}
        placeholder='Enter email id' />
      </label>
      <label>
        <p>Password<sup>*</sup></p>
        <input required
        type={showPassword ? ("text") : (" password")}
        value={formData.password}
        onChange={changeHandler}
        placeholder='Enter Password' />
      </label>

      <span onClick={() => setShowPassword((prev) => !prev)}>
        {showPassword ? (<AiOutlineEye/>) :(<AiOutlineEyeInvisible/>)}
      </span>
      <Link to ="#">
      <p>Forgot Password</p>
      </Link>
    </form>
  )
}

export default SignupForm
