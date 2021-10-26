import Image from "next/image";
import {
  SearchIcon,
  PlusCircleIcon,
  UserGroupIcon,
  HeartIcon,
  PaperAirplaneIcon,
  MenuIcon,
} from "@heroicons/react/outline";
import { HomeIcon } from "@heroicons/react/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";

const Header = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const router = useRouter();

  return (
    <div className="shadow-md border-b bg-white sticky top-0 z-50">
      {/* Left  */}
      <div className="flex justify-between bg-white max-w-6xl mx-5 lg:mx-auto">
        <div
          onClick={() => {
            router.push("/");
          }}
          className="relative hidden lg:inline-grid w-24 cursor-pointer"
        >
          <Image
            src="https://links.papareact.com/ocw"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="relative lg:hidden w-10 flex-shrink-0 cursor-pointer">
          <Image
            src="https://links.papareact.com/jjm"
            layout="fill"
            objectFit="contain"
          />
        </div>
        {/* Middle */}

        <div className="mt-1 p-3 relative max-w-xs ">
          <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 rounded-md
            focus:ring-black focus:border-black
            "
            type="text"
            placeholder="Search"
          />
        </div>
        {/* right */}
        {session ? (
          <div className="flex items-center justify-end space-x-4">
            <HomeIcon
              onClick={() => {
                router.push("/");
              }}
              className="navBtn"
            />
            <MenuIcon className="h-6 md:hidden cursor-pointer" />
            <div className="relative navBtn">
              <PaperAirplaneIcon className="navBtn" />
              <div
                className="absolute -top-2 -right-2 text-xs w-5 h-5 bg-red-500 rounded-full
             flex justify-center items-center animate-pulse text-white
            "
              >
                3
              </div>
            </div>
            <PlusCircleIcon onClick={() => setOpen(true)} className="navBtn" />
            <UserGroupIcon className="navBtn" />
            <HeartIcon className="navBtn" />
            <img
              onClick={signOut}
              src={session.user?.image}
              alt="profile pic"
              className="h-10 rounded-full cursor-pointer"
            />
          </div>
        ) : (
          <button onClick={signIn}>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default Header;
