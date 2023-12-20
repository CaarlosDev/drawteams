import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Login() {

    const [errors, setErrors] = useState(null);
    const {setUser, setToken} = useStateContext();

    const emailRef = useRef();
    const passwordRef = useRef();

    const onSubmit = (ev) => {
        ev.preventDefault()
        setErrors(null);

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }

        axiosClient.post('/login', payload).then(({data}) => {
            setUser(data.user)
            setToken(data.token)
        }).catch(error => {
            const response = error.response;
            if (response && response.status == 422) {
                if (response.data.errors) {
                    const errors = [];
                    Object.keys(response.data.errors).forEach(key => {
                        errors.push(response.data.errors[key]);
                    });
                    setErrors(errors);
                } else if (response.data.message) {
                    setErrors(response.data.message)
                }
            }
        })
    }

    return(
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Login into your account</h1>
                    { errors && <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key]}</p>
                        ))}
                    </div>
                    }
                    <input ref={emailRef} type="email" placeholder="Email" />
                    <input ref={passwordRef} type="password" placeholder="Password" />
                    <button className="btn btn-block">Login</button>
                    <p className="message">
                        Not registered ? <Link to={"/register"}>Create an account</Link> !
                    </p>
                </form>
            </div>
        </div>
    )
}