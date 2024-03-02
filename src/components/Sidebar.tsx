import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

const Sidebar = () => {
  const [sidebarActive, setSidebarActive] = useState<boolean>();
  const { pathname } = useRouter();

  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="absolute items-center p-2 top-[85px] border border-slate-400 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={() => setSidebarActive(!sidebarActive)}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed left-0 top-[4rem] sm:top-0  z-40 w-[10rem] h-screen transition-transform ${
          sidebarActive ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full py-4 sm:py-0 relative overflow-y-auto gradient-sidebar flex flex-col gap-20 text-white">
          <div className="flex justify-end pr-3">
            <button
              data-drawer-target="default-sidebar"
              data-drawer-toggle="default-sidebar"
              aria-controls="default-sidebar"
              type="button"
              className={`inline-flex justify-end w-fit items-center p-2 mt-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 bg-slate-500`}
              onClick={() => setSidebarActive(!sidebarActive)}
            >
              {/* <span className="sr-only">Open sidebar</span> */}
              <Icon icon="pajamas:close" width={20} className="text-white" />
            </button>
          </div>

          <ul className="font-medium">
            <li className={pathname === "/" ? "bg-white text-black" : "text-white"}>
              <Link href="/" className="flex items-center p-3 rounded-lg hover:underline gap-2">
                <Icon icon="material-symbols:dashboard" width={20} /> Beranda
              </Link>
            </li>
            <li className={pathname === "/course" ? "bg-white text-black" : "text-white"}>
              <Link href="/course" className="flex items-center p-3 rounded-lg hover:underline gap-2">
                <Icon icon="iconoir:book-solid" width={20} /> Pelajaran
              </Link>
            </li>
            <li className={pathname === "/score" ? "bg-white text-black" : "text-white"}>
              <Link href="/score" className="flex items-center p-3 rounded-lg hover:underline gap-2">
                <Icon icon="octicon:graph-16" width={20} />
                Nilai
              </Link>
            </li>
            <li className={pathname === "/class" ? "bg-white text-black" : "text-white"}>
              <Link href="/class" className="flex items-center p-3 rounded-lg hover:underline gap-2">
                <Icon icon="streamline:class-lesson" width={20} />
                Kelas
              </Link>
            </li>
          </ul>
          <div className="absolute bottom-0 pb-4 px-3 flex flex-col w-full gap-2">
            <div className="flex gap-2 items-center">
              <a href="https://www.instagram.com/smpmardiyuanacilegon" target="_blank" >
                <Icon icon="mdi:instagram" width={22} />
              </a>
              <a href=" https://www.youtube.com/@smpmardiyuanacilegon" target="_blank">
                <Icon icon="mdi:youtube" width={25} />
              </a>
            </div>
            <div>
              <p className="text-sm font-thin">&copy; 2024 Mardiyuana</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
