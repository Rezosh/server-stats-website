import {
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/20/solid";

const includedFeatures = [
  "Premium Member Role",
  "Server Watcher",
  "Access to new features before everyone else",
  "Extra server slots",
];

export default function Pricing() {
  return (
    <section id='premium'>
      <div className='pt-12 sm:pt-16 lg:pt-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl'>
              Simple no-tricks pricing
            </h2>
            <p className='mt-4 text-xl text-slate-400'>
              Everything you need to survive the Ark. No hidden fees. No tricks.
              No BS. Just a simple monthly subscription.
            </p>
          </div>
        </div>
      </div>
      <div className='mt-8  pb-16 sm:mt-12 sm:pb-20 lg:pb-28'>
        <div className='relative'>
          <div className='absolute inset-0 h-1/2 ' />
          <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-lg overflow-hidden rounded-lg shadow-lg lg:flex lg:max-w-none'>
              <div className='flex-1 bg-slate-800/75 px-6 py-8 lg:p-12'>
                <h3 className='text-2xl font-bold text-slate-50 sm:text-3xl sm:tracking-tight'>
                  Premium Membership
                </h3>
                <p className='mt-6 text-base text-slate-400'>
                  Get the most out of Ark Server Stats with our premium
                  membership. You'll get access to all of our premium features
                  including access to new features before everyone else!
                </p>
                <div className='mt-8'>
                  <div className='flex items-center'>
                    <h4 className='flex-shrink-0  pr-4 text-base font-semibold text-blue-400'>
                      What's included
                    </h4>
                    <div className='flex-1 border-t-2 border-slate-200' />
                  </div>
                  <ul
                    role='list'
                    className='mt-8 space-y-5 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5 lg:space-y-0'>
                    {includedFeatures.map((feature) => (
                      <li
                        key={feature}
                        className='flex items-start lg:col-span-1'>
                        <div className='flex-shrink-0'>
                          <CheckCircleIcon
                            className='h-5 w-5 text-green-400'
                            aria-hidden='true'
                          />
                        </div>
                        <p className='ml-3 text-sm text-slate-300'>{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className='bg-slate-800 py-8 px-6 text-center lg:flex lg:flex-shrink-0 lg:flex-col lg:justify-center lg:p-12'>
                <p className='text-lg font-medium leading-6 text-slate-400'>
                  Monthly
                </p>
                <div className='mt-4 flex items-center justify-center text-5xl font-bold tracking-tight text-slate-50'>
                  <span>$5</span>
                  <span className='ml-3 text-xl font-medium tracking-normal text-slate-400'>
                    USD
                  </span>
                </div>
                <p className='mt-4 text-sm'>
                  <a
                    href='https://www.patreon.com/policy/legal'
                    className='font-medium text-slate-400 underline'>
                    Learn about our membership policy
                  </a>
                </p>
                <div className='mt-6'>
                  <div className='rounded-md shadow'>
                    <a
                      href='https://www.patreon.com/join/ArkServers/checkout?rid=3721601'
                      className='flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-500'>
                      Get Access
                      <ArrowTopRightOnSquareIcon className='ml-2 mr-2 h-5 w-5' />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
