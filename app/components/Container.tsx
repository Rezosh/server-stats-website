export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className='mt-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-6'>
      {children}
    </div>
  );
}
