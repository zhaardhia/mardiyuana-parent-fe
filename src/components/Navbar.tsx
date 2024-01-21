import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSessionUser } from "@/contexts/SessionUserContexts";

const Navbar = () => {
  const { state, axiosJWT } = useSessionUser()
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const logout = async () => {
    try {
      await axiosJWT.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana-parent/session/logout-user`, {
        withCredentials: true,
        headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
      })
      router.push("/sign-in")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <nav className="fixed z-50 backdrop-blur-lg w-full bg-white">
      <div className="flex justify-between py-3 px-5 text-xl w-full mx-auto items-center">
        <Link href="/" className="flex gap-3">
          <Image src={"/my_logo.png"} width={25} height={20} alt={"mardiyuana logo"} />
          SMP Mardi Yuana
        </Link>
        <div className="flex items-center gap-3 p-2">
          <p className="cursor-default text-base hidden sm:block">Selamat Datang, {state?.userInfo?.name}</p>
          <div
            className="cursor-pointer"
            onClick={() => {
              setShowDropdown((prev) => !prev);
            }}
          >
            <img src="/photo_profile.jpg" alt="" className="w-10 h-10 rounded-full object-cover" />
            <div
              className={`py-2 px-1 w-1/12 min-w-28 flex flex-col bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all duration-200 absolute rounded-xl font-medium text-base top-14 right-6 z-10 ${
                showDropdown ? "opacity-100 translate-y-2" : "opacity-0 pointer-events-none"
              }`}
            >
              <button
                className="py-2 px-2 hover:bg-gray-100"
                disabled={!showDropdown}
                onClick={() => router.push(`/profile/32131h`)}
              >
                Profile
              </button>
              <button
                className="py-2 px-2 hover:bg-gray-100"
                disabled={!showDropdown}
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
