import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Register() {

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const repeatPasswordRef = useRef();

    const [errors, setErrors] = useState(null);
    const {setUser, setToken} = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault()
        setErrors(null);
        
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: repeatPasswordRef.current.value
        }

        axiosClient.post('/register', payload).then(({data}) => {
            setUser(data.user)
            setToken(data.token)
        }).catch(error => {
            const response = error.response;
            if (response && response.status == 422) {
                setErrors(response.data.errors);
            }
        })
    }

    return(
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Create your account</h1>
                    { errors && <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p>{errors[key][0]}</p>
                        ))}
                    </div>
                    }
                    <input ref={nameRef} type="text" placeholder="Full Name" />
                    <input ref={emailRef} type="email" placeholder="Email Address" />
                    <input ref={passwordRef} type="password" placeholder="Password" />
                    <input ref={repeatPasswordRef} type="password" placeholder="Repeat Password" />
                    <button className="btn btn-block">Register</button>
                    <p className="message">
                        Already registered ? <Link to={"/login"}>Sign in</Link> !
                    </p>
                </form>
            </div>
        </div>
    )
}