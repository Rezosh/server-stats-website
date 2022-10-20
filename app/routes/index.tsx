import { MetaFunction } from "@remix-run/node";
import Pricing from "~/components/Pricing";
import ServerSearchCombobox from "../components/ServerSearchCombobox";

export default function Index() {
  return (
    <>
      <div className='flex flex-col h-full justify-center -mt-20'>
        <div className='flex items-center justify-center flex-col'>
          <h1 className='font-bold text-slate-300 text-5xl md:text-7xl'>
            Ark Server Stats
          </h1>
          <h2 className='text-slate-300 text-xl md:text-2xl mt-2'>
            Search Once. Stay Informed.
          </h2>
          <div className=' w-2/3 md:w-1/3'>
            <ServerSearchCombobox />
          </div>
        </div>
      </div>
      <Pricing />
    </>
  );
}

export const meta: MetaFunction = () => ({
  title: "Home",
  description: "Search for Ark servers and stay informed.",
});
