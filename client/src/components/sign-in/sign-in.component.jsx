import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth} from "./../../AuthContext/authContext";
import { UserContext } from '../../UserContext/UserContext';


const SignIn = () => {
    const [signInMethod, setSignInMethod] = useState('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const phoneNumberInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);

    useEffect(() => {
        if (signInMethod === 'phone') {
            phoneNumberInputRef.current?.focus();
        }
    }, [signInMethod]);

    useEffect(() => {
        if (signInMethod === 'email') {
            emailInputRef.current?.focus();
        }
    }, [signInMethod]);

    const handleSuccessfulLogin = (data) => {
        console.log('Login data received:', data);

        // Store the auth token
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            console.log('Auth token stored');
        }
        
       // Store user data and update UserContext
       if (data.data && data.data.user) {
        const userData = data.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData); // Update UserContext
        console.log('User data stored and context updated:', userData);
    
        // Update the login status
        login();
        console.log('Auth context updated');
    
        // Navigate to homepage
        console.log('Attempting navigation to home');
        navigate('/', { replace: true });
    }
    };

    const sendEmailLoginData = async (email, password) => {
        try {
            console.log('Attempting to connect to:', 'http://localhost:8000/manyama/users/login');
            
            const response = await fetch('http://localhost:8000/manyama/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
    
            console.log('Response received:', response.status);
    
            const data = await response.json();
            
            if (!response.ok) {
                console.error('Server responded with error:', data);
                throw new Error(data.message || 'Failed to sign in');
            }
    
            console.log('Login successful:', data);
            return data;
        } catch (error) {
            console.error('Login request failed:', error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
            }
            throw error;
        }
    };
    
    const sendPhoneLoginData = async (phoneNumber, password) => {
        try {
            const response = await fetch('http://localhost:8000/manyama/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber,
                    password,
                }),
                credentials: 'include',
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to sign in');
            }

            return data;
        } catch (error) {
            throw new Error(error.message || 'Error signing in with phone');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
    
        try {
            const formData = new FormData(e.target);
            const email = formData.get('email');
            const password = formData.get('password');
            const phoneNumber = formData.get('phoneNumber');
    
            console.log('Sign in method:', signInMethod);
            console.log('Email:', email);
            console.log('Phone Number:', phoneNumber);
    
            // Validation
            if (signInMethod === 'email') {
                if (!email) {
                    throw new Error('Please provide your email');
                }
                if (!password) {
                    throw new Error('Please provide your password');
                }
            } else {
                if (!phoneNumber) {
                    throw new Error('Please provide your phone number');
                }
                if (!password) {
                    throw new Error('Please provide your password');
                }
            }
    
            let result;
            if (signInMethod === 'email') {
                result = await sendEmailLoginData(email, password);
            } else {
                result = await sendPhoneLoginData(phoneNumber, password);
            }
    
            console.log('Login successful:', result);
            
            handleSuccessfulLogin(result);
    
        } catch (error) {
            setError(error.message);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    // 1. Add error display
    const errorAlert = error && (
        <div className="mt-4 p-3 text-sm text-red-500 bg-red-50 rounded-xl">
            {error}
        </div>
    );

    // 2. Update the submit button to show loading state
    const submitButton = (
        <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full px-8 py-4 mt-5 text-base font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-pj hover:bg-gray-600 disabled:opacity-50"
        >
            {loading ? 'Signing in...' : 'Sign in'}
        </button>
    );

    // 3. Update input fields to add name attribute
    const emailInput = (
        <input
        ref={emailInputRef}
            type="email"
            id="email"
            name="email"
            placeholder="Email address"
            className="block w-full px-4 py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-400 rounded-xl focus:border-gray-900 focus:ring-gray-900 caret-gray-900"
        />
    );
    

    return (
        <section className="py-12 bg-gray-50 sm:py-16 lg:py-20">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="relative max-w-md mx-auto lg:max-w-lg">
                    <div className="absolute -inset-2">
                        <div className="w-full h-full mx-auto rounded-3xl opacity-30 blur-lg filter bg-custom-gradient"></div>
                    </div>

                    <div className="relative overflow-hidden bg-white shadow-xl rounded-xl">
                        <div className="px-4 py-6 sm:px-8">
                            <div className="flex items-center justify-between">
                                <h1 className="text-xl font-bold text-gray-900 font-pj">Sign in</h1>

                                <p className="text-base font-normal text-gray-900 font-pj">
                                    Don’t have an account? 
                                    <Link to="/signup" title="" className="font-bold rounded hover:underline focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
                                        Join now
                                    </Link>
                                </p>
                            </div>

                            <form action="#" method="POST" className="mt-12" onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                {signInMethod === 'phone' ? (
    <div>
        <label htmlFor="phoneNumber" className="text-base font-medium text-gray-900 font-pj text-left block"> 
            Phone Number 
        </label>
        <div className="mt-2.5">
            <input 
                type="number" 
                name="phoneNumber" 
                id="phoneNumber" 
                ref={phoneNumberInputRef}
                placeholder="Phone Number" 
                autoComplete='tel-national' 
                className="block w-full px-4 py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-400 rounded-xl focus:border-gray-900 focus:ring-gray-900 caret-gray-900" 
            />
        </div>
    </div>
) : (
    <div>
        <label htmlFor="email" className="text-base font-medium text-gray-900 font-pj text-left block">
            Email
        </label>
        <div className="mt-2.5">
            {emailInput}
        </div>
    </div>
)}

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="password" className="text-base font-medium text-gray-900 font-pj">
                                                Password
                                            </label>

                                            <a
                                                href="#"
                                                title=""
                                                className="text-base font-medium text-gray-500 rounded font-pj hover:text-gray-900 hover:underline focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                                            >
                                                Forgot Password?
                                            </a>
                                        </div>
                                        <div className="mt-2.5">
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                placeholder="Password (min. 8 characters)"
                                                className="block w-full px-4 py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-400 rounded-xl focus:border-gray-900 focus:ring-gray-900 caret-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative flex items-center mt-4">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                            />
                                        </div>

                                        <div className="ml-3 text-base">
                                            <label htmlFor="terms" className="font-normal text-gray-900 font-pj">
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {submitButton}
                            </form>
                            
                            {errorAlert}

                            {/* Google Sign in and other social media sign in */}
                            <svg className="w-auto h-4 mx-auto mt-8 text-gray-300" viewBox="0 0 172 16" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 11 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 46 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 81 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 116 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 151 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 18 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 53 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 88 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 123 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 158 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 25 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 60 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 95 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 130 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 165 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 32 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 67 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 102 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 137 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 172 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 39 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 74 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 109 1)" />
<line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 144 1)" />
</svg>                      

                           

{signInMethod === 'email' ? (
    <a
href="#"
title=""
className="
    flex
    items-center
    justify-center
    w-full
    px-8
    py-4
    mt-8
    text-base
    font-bold
    text-gray-900
    transition-all
    duration-200
    bg-gray-100
    border border-transparent
    rounded-xl
    hover:bg-gray-200
    focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200
    font-pj
"
role="button"
onClick={() => setSignInMethod('phone')}
>
<svg height="34px" version="1.1" viewBox="0 0 24 24" width="34px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" ><title/><desc/><defs/><g fill="none" fillRule="evenodd" id="miu" stroke="none" strokeWidth="1"><g id="Artboard-1" transform="translate(-791.000000, -587.000000)"><g id="slice" transform="translate(215.000000, 119.000000)"/><path d="M797,590 L797,608 C797,610 798.846154,610 798.846154,610 L807.153846,610 C807.153846,610 809,610 809,608 L809,590 C809,588 807.153846,588 807.153846,588 L798.846154,588 C798.846154,588 797,588 797,590 Z M807.153846,589 C807.254104,589 807.469162,589.03883 807.664111,589.144427 C807.938653,589.293138 808.076923,589.517826 808.076923,590 L808.076923,608 C808.076923,608.482174 807.938653,608.706862 807.664111,608.855573 C807.469162,608.96117 807.254104,609 807.153846,609 L798.846154,609 C798.745896,609 798.530838,608.96117 798.335889,608.855573 C798.061347,608.706862 797.923077,608.482174 797.923077,608 L797.923077,590 C797.923077,589.517826 798.061347,589.293138 798.335889,589.144427 C798.530838,589.03883 798.745896,589 798.846154,589 L807.153846,589 Z M803,608.5 C803.509801,608.5 803.923077,608.052285 803.923077,607.5 C803.923077,606.947715 803.509801,606.5 803,606.5 C802.490199,606.5 802.076923,606.947715 802.076923,607.5 C802.076923,608.052285 802.490199,608.5 803,608.5 L803,608.5 Z M800.89658,589.5 C800.783764,589.5 800.692308,589.596554 800.692308,589.721103 L800.692308,589.779668 C800.692308,589.901779 800.784502,590.00077 800.89658,590.00077 L805.10342,590.00077 C805.216236,590.00077 805.307692,589.904217 805.307692,589.779668 L805.307692,589.721103 C805.307692,589.598991 805.215498,589.5 805.10342,589.5 L800.89658,589.5 Z M797.923077,590.5 L797.923077,591.5 L808.076923,591.5 L808.076923,590.5 L797.923077,590.5 Z M797.923077,605 L797.923077,606 L808.076923,606 L808.076923,605 L797.923077,605 Z" fill="#000000" id="device-smart-phone-vertical-outline-stroke"/></g></g></svg>

Sign in using my phone number
</a>): (
    <a
href="#"
title=""
className="
    flex
    items-center
    justify-center
    w-full
    px-8
    py-4
    mt-8
    text-base
    font-bold
    text-gray-900
    transition-all
    duration-200
    bg-gray-100
    border border-transparent
    rounded-xl
    hover:bg-gray-200
    focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200
    font-pj
"
role="button"
onClick={() => setSignInMethod('email')}
>
@ Sign in using email
</a>
)}






<a
href="#"
title=""
className="
    flex
    items-center
    justify-center
    w-full
    px-8
    py-4
    mt-8
    text-base
    font-bold
    text-gray-900
    transition-all
    duration-200
    bg-gray-100
    border border-transparent
    rounded-xl
    hover:bg-gray-200
    focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200
    font-pj
"
role="button"
>
<svg className="w-5 h-5 mr-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M19.2436 8.26113L11.0858 8.26074C10.7256 8.26074 10.4336 8.5527 10.4336 8.91293V11.519C10.4336 11.8791 10.7256 12.1712 11.0858 12.1712H15.6798C15.1767 13.4767 14.2378 14.57 13.0399 15.2647L14.9988 18.6557C18.1411 16.8384 19.9988 13.6497 19.9988 10.0803C19.9988 9.57203 19.9613 9.20871 19.8864 8.79961C19.8295 8.48879 19.5596 8.26113 19.2436 8.26113Z"
        fill="#167EE6"
    />
    <path
        d="M9.99957 16.0871C7.75137 16.0871 5.78871 14.8587 4.73461 13.041L1.34375 14.9955C3.06934 17.9862 6.30191 20.0001 9.99957 20.0001C11.8135 20.0001 13.5251 19.5117 14.9996 18.6606V18.6559L13.0407 15.2649C12.1447 15.7846 11.1078 16.0871 9.99957 16.0871Z"
        fill="#12B347"
    />
    <path d="M15 18.6603V18.6557L13.0411 15.2646C12.1451 15.7843 11.1083 16.0868 10 16.0868V19.9998C11.8139 19.9998 13.5256 19.5114 15 18.6603Z" fill="#0F993E" />
    <path d="M3.91305 10.0002C3.91305 8.89207 4.21547 7.85531 4.73504 6.95934L1.34418 5.00488C0.488359 6.47469 0 8.18164 0 10.0002C0 11.8188 0.488359 13.5258 1.34418 14.9956L4.73504 13.0411C4.21547 12.1452 3.91305 11.1084 3.91305 10.0002Z" fill="#FFD500" />
    <path
        d="M9.99957 3.91305C11.4656 3.91305 12.8123 4.43398 13.8641 5.30051C14.1236 5.51426 14.5007 5.49883 14.7384 5.26113L16.5849 3.41465C16.8546 3.14496 16.8354 2.70352 16.5473 2.45359C14.785 0.924726 12.492 0 9.99957 0C6.30191 0 3.06934 2.01395 1.34375 5.00465L4.73461 6.9591C5.78871 5.14141 7.75137 3.91305 9.99957 3.91305Z"
        fill="#FF4B26"
    />
    <path d="M13.8645 5.30051C14.124 5.51426 14.5012 5.49883 14.7389 5.26113L16.5854 3.41465C16.855 3.14496 16.8358 2.70352 16.5477 2.45359C14.7854 0.924688 12.4925 0 10 0V3.91305C11.466 3.91305 12.8127 4.43398 13.8645 5.30051Z" fill="#D93F21" />
</svg>
Sign in with Google
</a>

<a
href="#"
title=""
className="
    flex
    items-center
    justify-center
    w-full
    px-8
    py-4
    mt-8
    text-base
    font-bold
    text-gray-900
    transition-all
    duration-200
    bg-gray-100
    border border-transparent
    rounded-xl
    hover:bg-gray-200
    focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200
    font-pj
"
role="button"
>
    <svg className="w-6 h-6 text-[#2563EB]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                            </svg> Sign in with Facebook
</a>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignIn;



