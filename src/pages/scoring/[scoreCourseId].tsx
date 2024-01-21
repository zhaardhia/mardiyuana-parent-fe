import Layout from "@/components/Layout";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useSessionUser } from "@/contexts/SessionUserContexts"
import { ScoreCourseById, ScoreCourseTypeConstant } from "@/types"
import moment from "moment";
import { scoreCourses } from "@/lib/constant";
const ScoreCourseDetailPage = () => {
  const router = useRouter();
  const { scoreCourseId } = router.query;
  const { axiosJWT } = useSessionUser()
  const [scoreCourseDetail, setScoreCourseDetail] = useState<ScoreCourseById>()
  console.log({scoreCourseId})
  useEffect(() => {
    if (scoreCourseId) fetchData()
  }, [scoreCourseId])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana-parent/score-course/detail?id=${scoreCourseId}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
    })
    console.log({response})
    if (response?.status === 200) {
      setScoreCourseDetail(response?.data?.data)
    }
  }
  console.log({scoreCourseDetail})
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8 w-[90%] mx-auto max-w-[1400px]">
        <Icon icon="formkit:arrowleft" className="cursor-pointer h-full w-10" onClick={() => router.back()} />
        <h1 className="text-2xl font-semibold">{scoreCourseDetail?.course?.name}</h1>
      </div>

      <hr className="h-[2px] border-dotted w-[90%] mx-auto border-slate-300" />

      <div className="my-4 w-[90%] mx-auto flex flex-col max-w-[1400px]">
        <h2 className="mb-7 font-semibold text-2xl">{scoreCourses[scoreCourseDetail?.type as keyof ScoreCourseTypeConstant]}: {scoreCourseDetail?.title}</h2>

        <div className="p-4 border border-slate-400 rounded-xl bg-white">
          {/* <div className="flex items-center gap-4">
            <img src="/photo_teacher.jpg" alt="" className="w-20 h-20 rounded-full object-cover" />
            <div className="flex flex-col">
              <h3 className="font-semibold text-xl">{scoreCourseDetail?.teacherName}.</h3>
              <p className="font-normal">
                Teacher | {scoreCourseDetail?.className} <span className="ml-4">{moment(scoreCourseDetail?.createdDate).format("LLL")}</span>
              </p>
            </div>
          </div> */}

          <h4 className="font-medium text-xl underline mt-4">{scoreCourseDetail?.title}</h4>

          <p className="text-justify mt-2">
            {scoreCourseDetail?.body}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ScoreCourseDetailPage;
