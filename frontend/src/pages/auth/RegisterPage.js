import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser, reset } from '../../store/slices/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { UserPlusIcon } from '@heroicons/react/24/solid';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .test('is-valid-domain', 'Only Gmail and ProtonMail accounts are allowed', (value) => {
      if (!value) return true;
      const validDomains = ['gmail.com', 'protonmail.com'];
      const domain = value.split('@')[1];
      return validDomains.includes(domain);
    })
    .test('is-valid-email-format', 'Invalid email format', (value) => {
      if (!value) return true;
      
      // Basic format validation
      const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!basicRegex.test(value)) {
        return false;
      }

      // More comprehensive validation
      const strictRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(gmail\.com|protonmail\.com)$/;
      if (!strictRegex.test(value)) {
        return false;
      }

      return true;
    })
    .test('no-common-fake-patterns', 'Email appears to be invalid', (value) => {
      if (!value) return true;
      
      // Check for common invalid patterns
      const invalidPatterns = [
        /^(admin|info|support|contact|test|fake|noreply)@/i,
        /^[a-z]{1,2}@/i,  // Very short local parts are often fake
        /^[0-9]+@/,       // Only numbers in local part
        /^[a-z]+[0-9]{4,}@/i  // Simple name followed by many numbers
      ];

      return !invalidPatterns.some(pattern => pattern.test(value));
    })
    .test('valid-gmail-length', 'Gmail usernames must be at least 6 characters', (value) => {
      if (!value || !value.includes('@gmail.com')) return true;
      
      const username = value.split('@')[0];
      return username.length >= 6;
    })
    .test('no-repeating-chars', 'Email appears to be invalid', (value) => {
      if (!value) return true;
      
      const username = value.split('@')[0];
      const repeatingChars = /(.)\1{4,}/;  // Same character repeated 5+ times
      return !repeatingChars.test(username);
    }),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  userType: Yup.string()
    .oneOf(['freelancer', 'employer'], 'Please select a valid user type')
    .required('Please select whether you are a freelancer or employer'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated, error } = useSelector(state => state.auth);
  const [verificationSent, setVerificationSent] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    // Reset auth state on component unmount
    return () => {
      dispatch(reset());
    };
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    // Show error toast if registration fails
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (values) => {
    // Store email for verification step
    setEmail(values.email);
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, agreeToTerms, ...userData } = values;
    
    dispatch(registerUser(userData))
      .unwrap()
      .then(() => {
        setVerificationSent(true);
        toast.success('Registration successful! Please verify your email.');
      })
      .catch((error) => {
        // Error is handled by the useEffect above
      });
  };

  // Verification code form
  const [verificationCode, setVerificationCode] = useState('');
  
  const handleVerification = (e) => {
    e.preventDefault();
    
    // Here you would dispatch an action to verify the email with the code
    console.log('Verifying code:', verificationCode);
    
    // For demo purposes, we'll just simulate success
    toast.success('Email verified successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center">
            <UserPlusIcon className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-secondary-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-secondary-600 dark:text-secondary-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-secondary-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!verificationSent ? (
            <div className="space-y-6">
              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  userType: '',
                  agreeToTerms: false,
                }}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        Full Name
                      </label>
                      <div className="mt-1">
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          className={`input-field ${
                            errors.name && touched.name ? 'border-red-500' : ''
                          }`}
                        />
                        <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        Email address
                      </label>
                      <div className="mt-1">
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className={`input-field ${
                            errors.email && touched.email ? 'border-red-500' : ''
                          }`}
                        />
                        <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                        <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                          For security reasons, we only accept Gmail and ProtonMail accounts.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        Password
                      </label>
                      <div className="mt-1">
                        <Field
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          className={`input-field ${
                            errors.password && touched.password ? 'border-red-500' : ''
                          }`}
                        />
                        <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        Confirm Password
                      </label>
                      <div className="mt-1">
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          className={`input-field ${
                            errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''
                          }`}
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        I am a:
                      </label>
                      <div className="mt-2 flex space-x-4">
                        <div className="flex items-center">
                          <Field
                            id="userType-freelancer"
                            name="userType"
                            type="radio"
                            value="freelancer"
                            className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <label htmlFor="userType-freelancer" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                            Freelancer
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Field
                            id="userType-employer"
                            name="userType"
                            type="radio"
                            value="employer"
                            className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <label htmlFor="userType-employer" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                            Employer
                          </label>
                        </div>
                      </div>
                      <ErrorMessage name="userType" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div className="flex items-center">
                      <Field
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${
                          errors.agreeToTerms && touched.agreeToTerms ? 'border-red-500' : ''
                        }`}
                      />
                      <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                        I agree to the{' '}
                        <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                          terms and conditions
                        </Link>
                      </label>
                    </div>
                    <ErrorMessage name="agreeToTerms" component="div" className="mt-1 text-sm text-red-600" />

                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary flex justify-center items-center"
                      >
                        {isLoading ? (
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : null}
                        Create Account
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-secondary-800 text-secondary-500 dark:text-secondary-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => toast.info("Google sign-up will be implemented in the production version")}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-secondary-700 hover:bg-gray-50 dark:hover:bg-secondary-600"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                    Sign up with Google
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white">Verify your email</h3>
                <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                  We've sent a verification code to {email}. Please enter it below to complete your registration.
                </p>
              </div>
              <form onSubmit={handleVerification} className="space-y-6">
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Verification Code
                  </label>
                  <div className="mt-1">
                    <input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="input-field"
                      placeholder="Enter 6-digit code"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full btn-primary"
                  >
                    Verify Email
                  </button>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Resend code
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
