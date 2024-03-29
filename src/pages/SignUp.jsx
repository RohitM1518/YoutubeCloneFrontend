import { Try } from '@mui/icons-material'
import React, { useState } from 'react'
import { set, useForm } from "react-hook-form"
import {Logo,Button,Input} from "../components/index.js"
import { Link,useNavigate } from 'react-router-dom'
import {useDispatch} from 'react-redux'
import { loginFailure, loginStart, loginSuccess } from '../redux/userSlice.js'
import axios from 'axios'

const SignUp = () => {
    const [error, setError] = useState("")
    const { register, handleSubmit } = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const create = async (data,event) => {
        event.preventDefault();
        dispatch(loginStart())
        console.log("Data is",data)
        setError("")
        try {
            if(data.password != data.confirmPassword){
                setError("Password and Confirm Password do not match.")
                return;
            }
            const formData = new FormData();
            formData.append("fullname", data.fullname);
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("avatar", data.avatar[0]); // Assuming avatar is a single file
            formData.append("coverImage", data.coverImage[0]); // Assuming coverImage is a single file
            formData.append("password", data.password);

            const res = await axios.post('http://localhost:8000/api/v1/users/register',formData)
            sessionStorage.setItem('refreshToken',res.data.data.refreshToken)
            dispatch(loginSuccess(res.data.data))
            navigate("/")
        } catch (error) {
            setError(error.message)
            dispatch(loginFailure())
        }
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <div className={`mx-auto w-full max-w-lg bg-custom-gray-2 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" textColor='text-black' />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight text-white">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-white/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Log In
                    </Link>
                </p>
                {error && <p className='text-red-500 text-center'>{error}</p>}
                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name:"
                            placeholder="Enter your full name"
                            {...register("fullname", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Username:"
                            placeholder="Enter Username"
                            {...register("username", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^[^\s]+$/.test(value) ||
                                        "Username should not contain Spaces",
                                    //above not understanding code is called as RegEx(Regular Expression)
                                }
                            })}
                        />
                        <Input label='Email:' placeholder='Enter your Email'
                            type='email'
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",

                                    //above not understanding code is called as RegEx(Regular Expression)
                                }
                            })
                            } />
                        <Input label='Avatar:' placeholder='Enter your Email'
                            type='file' accept="image/*"
                            {...register("avatar", {
                                required: true,
                            })
                            } />
                        <Input label='Cover Image:' placeholder='Enter your Email'
                            type='file' accept="image/*"
                            {...register("coverImage", {
                                required: true,
                            })
                            } />
                        <Input
                            label="Password"
                            placeholder="Enter Your Password"
                            type="password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Confirm Password"
                            placeholder="Enter Confirm Password"
                            type="password"
                            {...register("confirmPassword", {
                                required: true,
                            })}
                        />
                        <Button text="Sign up" style='text-white' type='submit'/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp