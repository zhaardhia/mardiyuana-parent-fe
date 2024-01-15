import { useRouter } from "next/router";
import React, { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";

const RequestForgotPassword = () => {
  const [email, setConfirmPassword] = useState<string>("");
  const [msgError, setMsgError] = useState<string>();
  const [msgSuccess, setMsgSuccess] = useState<string>();

  const submitUser = async () => {
    if (!email) return setMsgError("Semua field wajib diisi.")
    try {
      // axios.defaults.withCredentials = true
      const changePass = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana-parent/session/access-change-password`,
        {
          email,
        },
        {
          headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        }
      );
      console.log({changePass})
      
      if (changePass?.data?.statusCode === "000") {
        setMsgSuccess(changePass?.data?.message);
      }
      
      setMsgError('');
    } catch (error: any) {
      console.error(error.response.data.message);
      setMsgError(error.response.data.message);
    }
  };

  return (
    <div className="flex md:flex-row flex-col items-center justify-center bg-login-color h-screen lg:gap-36 md:gap-20 ">
      <div className="lg:w-[448px] md:w-[320px] w-[15rem] p-10 items-center justify-center flex">
        <img className="w-[300px]" src="/LogoMY.png" />
      </div>
      <div className="flex items-center md:w-auto w-full">
        <div className="2xl:px-16 lg:px-12 px-5 lg:w-[448px] md:w-[400px] w-[90%] bg-white h-[30rem] rounded-lg bg-login-card border-0 flex flex-col justify-center items-center gap-10 md:mx-0 mx-auto">
          <div className="text-3xl font-semibold text-white">Forgot Password Parent</div>
          <div className="flex flex-col gap-4 w-[100%]">
            <input
              className="h-10 w-full rounded-xl p-2 text-slate-800"
              placeholder="Email"
              type="email"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={email}
            />
          </div>
          <p className={cn("text-red-500 text-start text-sm", msgError ? "block" : "hidden")}>{msgError}</p>
          <p className={cn("text-green-500 text-start text-sm", msgSuccess ? "block" : "hidden")}>{msgSuccess}</p>
          <button
            className="text-xl bg-green-400 hover:bg-green-500 rounded-xl px-6 py-2"
            onClick={submitUser}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default RequestForgotPassword
