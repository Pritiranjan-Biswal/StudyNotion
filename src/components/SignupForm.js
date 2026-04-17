import React, { useState } from 'react'
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai"
import toast from 'react-hot-toast'
      const SignupForm = ({setIsLoggedIn}) => {
        const [formData, setFormData]=useState({
          firstName:"",
          lastName:"",
          email:"",
          password:"",
          confirmPassword:""
        })
        function  changeHandler(event) {
              setFormData((prevData) => (
                  {
                      ...prevData,
                      [event.target.name]: event.target.value
                  }
              ))
          }
        function  submiHandler(event) {
          event.preventDefault();
          if(formData.password != formData.confirmPassword) {
            toast.error("Password Don't match")
          }
          setIsLoggedIn(true);
        toast.success("Account Created Successfully")
       
        }
        

        const accountData= {
          ...formData
        }
        
          const [showPassword, setShowPassword]=useState(false)
        return (
          <div>
            {/* student-Instructor */}
            <div>
              <button>Student</button>
              <button>Instructor</button>
              </div>
              
          <form onSubmit={submiHandler}>
            <div>
             <label>
              <p>First Name<sup>*</sup></p>
              <input 
              required
              type='text'
              name='firstName'
              onChange={changeHandler}
              placeholder='Enter First Name'
              value={FormData.firstName}/>
            </label>

            <label>
              <p>Last Name<sup>*</sup></p>
              <input 
              required
              type='text'
              name='lastName'
              onChange={changeHandler}
              placeholder='Enter Last Name'
              value={FormData.lastName}/>
            </label>

            </div>



             <label>
              <p>Email Address<sup>*</sup></p>
              <input 
              required
              type='email'
              name='email'
              onChange={changeHandler}
              placeholder='Enter Email Address'
              value={FormData.email}/>
            </label>

              <div>
                <label>
              <p>Create Password<sup>*</sup></p>
              <input 
              required
              type={showPassword ? ("text") : ("password")}
              name='password'
              onChange={changeHandler}
              placeholder='Enter Password'
              value={FormData.password}/>
                <span onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? (<AiOutlineEye/>) :(<AiOutlineEyeInvisible/>)}
                    </span>
            </label>
                <label>
              <p>Confirm Password<sup>*</sup></p>
              <input 
              required
              type={showPassword ? ("text") : ("password")}
              name='confirmpassword'
              onChange={changeHandler}
              placeholder='Enter Confirm Password'
              value={FormData.confirmPassword}/>
                <span onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? (<AiOutlineEye/>) :(<AiOutlineEyeInvisible/>)}
                    </span>
            </label>

              </div>
              <button>
                Create Account
              </button>
             
          </form>
            
          </div>
        )
      }

      export default SignupForm



