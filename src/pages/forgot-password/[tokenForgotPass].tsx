import { useRouter } from "next/router";
import React, { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";

const ForgotPassword = () => {
  const router = useRouter();
  const { tokenForgotPass } = router.query
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [msgError, setMsgError] = useState<string>();
  const [msgSuccess, setMsgSuccess] = useState<string>();

  const [typeInputPass, setTypeInputPass] = useState<string>("password")
  console.log({tokenForgotPass})

  const submitUser = async () => {
    if (!confirmPassword || !password) return setMsgError("Semua field wajib diisi.")
    try {
      // axios.defaults.withCredentials = true
      const changePass = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana-parent/session/change-password`,
        {
          forgotPassToken: tokenForgotPass,
          confirmPassword,
          password,
        },
        {
          withCredentials: true,
          headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        }
      );
      console.log({changePass})
      
      if (changePass?.status === 200) {
        setMsgSuccess(changePass?.data?.message);

        setTimeout(() => {
          router.push("/sign-in");
        }, 5000)
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
          <div className="text-3xl font-semibold text-white">Reset Password Parent</div>
          <div className="flex flex-col gap-4 w-[100%]">
            <div className="flex flex-col gap-2">
              <input
                className="h-10 w-full rounded-xl p-2 text-slate-800"
                placeholder="Password"
                type={typeInputPass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <input
              className="h-10 w-full rounded-xl p-2 text-slate-800"
              placeholder="Confirm Password"
              type={typeInputPass}
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            <div className="flex gap-4">
              <input type="checkbox" className="rounded-lg" onChange={(e) => {
                setTypeInputPass(e.target.checked ? "text" : "password")
              }}/>
              <p className="text-sm text-white">Lihat Password</p>
            </div>
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

export default ForgotPassword
