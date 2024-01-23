import React, { useState } from 'react'
import moment from "moment"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useSessionUser } from "@/contexts/SessionUserContexts"
import { ReminderCourseList, InitialCourseData } from "@/types"
import Link from 'next/link';

interface ReminderProps {
  initialCourseData: InitialCourseData | undefined
}
const Reminder: React.FC<ReminderProps> = ({ initialCourseData }) => {
  const router = useRouter();
  const { courseId, enrollmentId } = router.query;
  console.log({courseId});

  const { axiosJWT } = useSessionUser()
  const [reminderCourses, setReminderCourses] = useState<ReminderCourseList[]>()
  const [courseSectionId, setCourseSectionId] = useState<string | undefined>(initialCourseData?.course?.course_sections[0]?.id)
  
  React.useEffect(() => {
    if (courseId && enrollmentId) fetchData()
  }, [courseSectionId, enrollmentId])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana-parent/course/reminder-courses?courseSectionId=${courseSectionId}&id=${enrollmentId}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
    })
    console.log({response})
    if (response?.status === 200) {
      setReminderCourses(response?.data?.data || [])
      console.log("ganti")
    }
  }
  console.log({reminderCourses, initialCourseData})
  return (
    <Tabs defaultValue="bab 1" className="w-full overflow-x-hidden">
      <TabsList className="w-full flex items-center gap-4 justify-start pl-0 min-w-[500px] overflow-y-hidden overflow-x-scroll md:pr-0 sm:pr-10 pr-52">
        {initialCourseData?.course?.course_sections?.sort((a, b) => a.numberSection - b.numberSection).map((_, idx) => (
          <TabsTrigger
            value={`bab ${idx + 1}`}
            className="text-base font-normal bg-gray-300 rounded-xl border-none data-[state=active]:bg-[#2F9757] data-[state=active]:text-white data-[state=active]:font-medium px-5"
            onClick={() => {
              setCourseSectionId(_.id)
            }}
          >
            Bab {_.numberSection + 1}
          </TabsTrigger>
        ))}
      </TabsList>
      {initialCourseData?.course?.course_sections?.map((_, idx) => (
        <TabsContent value={`bab ${idx + 1}`} className="mt-10">
          <h2 className="font-semibold text-3xl mb-2">{_.name}</h2>

          {reminderCourses?.map((reminder: ReminderCourseList) => (
            <Link href={`/reminder/${reminder.id}`}>
              <div
                className="hover:bg-slate-50 mt-5 py-4 px-5 lg:px-10 bg-white rounded-[6px] flex items-center gap-5 shadow-lg cursor-pointer"
                // onClick={() => router.push(`/discussion/${courseId}`)}
              >
                <img src="/photo_teacher.jpg" alt="" className="w-20 h-20 rounded-full object-cover" />
                {/* <div className="flex flex-col lg:flex-row lg:items-center ">
                  <div className="flex flex-col lg:w-1/5">
                    <h3 className="font-semibold text-lg lg:text-xl">{reminder?.teacherName}</h3>
                    <p>Teacher | {reminder?.className}</p>
                    <p className="text-sm lg:text-base">{moment(reminder?.createdDate).format("LLL")}</p>
                  </div>
                  <div className="text-lg lg:text-2xl font-normal lg:ml-10 w-full lg:w-2/3">
                    {reminder?.title}
                  </div>
                </div> */}
                <div className="flex flex-col ">
                  <div className="flex flex-col ">
                    <h3 className="font-semibold text-lg lg:text-xl">{reminder?.teacherName}</h3>
                    <p className="text-sm text-gray-400">{moment(reminder?.createdDate).format("LLL")}</p>
                  </div>
                  <div className="text-lg lg:text-xl font-normal w-full">
                    {reminder?.title}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {!reminderCourses || reminderCourses.length < 1 && (
            <p>Belum ada data reminder pada bab ini</p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default Reminder
