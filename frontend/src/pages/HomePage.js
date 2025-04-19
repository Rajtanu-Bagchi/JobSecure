import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldCheckIcon, LockClosedIcon, BanknotesIcon, StarIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { theme } = useSelector(state => state.ui);

  const features = [
    {
      name: 'Verified Employers',
      description: 'All employers on our platform go through a strict verification process to ensure legitimacy.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Secure Payments',
      description: 'Our escrow system ensures you get paid for your work before releasing it to the client.',
      icon: BanknotesIcon,
    },
    {
      name: 'Scam Protection',
      description: 'Advanced scam detection systems help identify and prevent fraudulent activities.',
      icon: LockClosedIcon,
    },
    {
      name: 'Trustability Scores',
      description: 'Transparent rating system helps you identify reliable employers with good track records.',
      icon: StarIcon,
    },
  ];

  const testimonials = [
    {
      content: "JobSecure has completely changed how I approach freelancing. I no longer worry about getting scammed or not receiving payment for my work.",
      author: {
        name: 'Sarah Johnson',
        role: 'Graphic Designer',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      content: "As an employer, I appreciate how JobSecure helps build trust with freelancers. The verification process is thorough but worth it.",
      author: {
        name: 'Michael Chen',
        role: 'Startup Founder',
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      content: "The escrow payment system gives me peace of mind. I can focus on delivering quality work instead of worrying about payment issues.",
      author: {
        name: 'Priya Patel',
        role: 'Web Developer',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-secondary-900">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-5 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:col-span-2 lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#features" className="inline-flex space-x-6">
                <span className="rounded-full bg-primary-600/10 px-3 py-1 text-sm font-semibold leading-6 text-primary-600 dark:text-primary-400 ring-1 ring-inset ring-primary-600/10">
                  Secure Freelancing
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-6xl">
              Freelance with confidence on JobSecure
            </h1>
            <p className="mt-6 text-lg leading-8 text-secondary-600 dark:text-secondary-300">
              A secure and scam-resistant freelance marketplace designed to protect you from common threats like fake clients, non-payment, and identity fraud.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary text-base font-semibold leading-7"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-base font-semibold leading-7"
                  >
                    Get started
                  </Link>
                  <Link
                    to={isAuthenticated ? "/jobs" : "/register"}
                    className="text-base font-semibold leading-7 text-secondary-900 dark:text-white"
                  >
                    Browse Jobs <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-3 flex items-center justify-center">
            <img
              src={theme === 'light' ? '/assets/hero-image2.jpg' : '/assets/hero-image1.jpg'}
              alt="JobSecure platform screenshot"
              className="w-full h-auto object-contain rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">Work Securely</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-4xl">
              Everything you need for safe freelancing
            </p>
            <p className="mt-6 text-lg leading-8 text-secondary-600 dark:text-secondary-300">
              JobSecure provides comprehensive protection against common freelancing scams and ensures a safe environment for both freelancers and employers.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-secondary-900 dark:text-white">
                    <feature.icon className="h-5 w-5 flex-none text-primary-600 dark:text-primary-400" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-secondary-600 dark:text-secondary-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-secondary-50 dark:bg-secondary-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">How It Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-4xl">
              Simple, secure, and straightforward
            </p>
            <p className="mt-6 text-lg leading-8 text-secondary-600 dark:text-secondary-300">
              Our platform is designed to make freelancing safe and easy for everyone involved.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-secondary-900 dark:text-white">Create an Account</h3>
                <p className="mt-2 text-center text-secondary-600 dark:text-secondary-300">
                  Sign up and verify your identity through our secure verification process.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-secondary-900 dark:text-white">Find or Post Jobs</h3>
                <p className="mt-2 text-center text-secondary-600 dark:text-secondary-300">
                  Browse verified job listings or post your own project with escrow payment protection.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-secondary-900 dark:text-white">Work with Confidence</h3>
                <p className="mt-2 text-center text-secondary-600 dark:text-secondary-300">
                  Complete projects knowing your payment is secured and both parties are protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-4xl">
              Trusted by freelancers and employers
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col justify-between bg-white dark:bg-secondary-800 p-6 shadow-lg rounded-lg">
                <div>
                  <p className="text-lg text-secondary-600 dark:text-secondary-300">"{testimonial.content}"</p>
                </div>
                <div className="mt-6 flex items-center">
                  <img className="h-12 w-12 rounded-full" src={testimonial.author.imageUrl} alt="" />
                  <div className="ml-4">
                    <p className="text-base font-semibold text-secondary-900 dark:text-white">{testimonial.author.name}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">{testimonial.author.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 dark:bg-primary-700">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to freelance securely?
            <br />
            Join JobSecure today.
          </h2>
          <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
            <Link
              to="/register"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-secondary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started
            </Link>
            <Link to={isAuthenticated ? "/jobs" : "/register"} className="text-sm font-semibold leading-6 text-white">
              Browse jobs <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
