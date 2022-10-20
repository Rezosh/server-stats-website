type Props = {
  children: string;
};

export default function SubText({ children }: Props) {
  return <p className='mt-2 text-sm md:text-base text-slate-300'>{children}</p>;
}
