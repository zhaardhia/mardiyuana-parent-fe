import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Session from "@/components/course/Session";
import Reminder from "@/components/course/Reminder";
import Score from "@/components/course/Score";
import { useSessionUser } from "@/contexts/SessionUserContexts"
import { InitialCourseData } from "@/types/course"

const CourseDetail = () => {
  const router = useRouter();
  const { courseId, enrollmentId } = router.query;
  // console.log({courseId});

  const { axiosJWT } = useSessionUser()
  // const [optionClasses, setOptionClasses] = useState<Option[]>()
  // const [selectedClass, setSelectedClass] = useState<Option>();
  // const [enrollmentStudent, setEnrollmentStudent] = useState<EnrollmentStudentOnCourseList>();
  const [courseInitial, setCourseInitial] = useState<InitialCourseData>()
  // const handleSelectClass = (option: Option | null, actionMeta: ActionMeta<Option>) => {
  //   option && setSelectedClass(option);
  // };

  React.useEffect(() => {
    if (courseId && enrollmentId) fetchData()
  }, [courseId, enrollmentId])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana-parent/course/initial-data?courseId=${courseId}&id=${enrollmentId}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
    })
    console.log({response})
    if (response?.data?.statusCode === "000") {
      setCourseInitial(response?.data?.data)
    }
  }
  // console.log({course})
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8 w-[90%] mx-auto max-w-[1400px]">
        <Icon icon="formkit:arrowleft" className="cursor-pointer h-full w-10" onClick={() => router.back()} />
        <h1 className="text-2xl font-semibold">{courseInitial?.course.name}</h1>
      </div>

      <hr className="h-[2px] border-dotted w-[90%] mx-auto border-slate-300" />

      <div className="my-4 w-[90%] mx-auto flex gap-14 items-center max-w-[1400px]">
        <div className="flex items-center gap-4">
          <img src="/photo_teacher.jpg" alt="" className="w-20 h-20 rounded-full object-cover" />
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold">{courseInitial?.teacherData.teacherName}</h3>
            <p>Guru | Class {courseInitial?.class.name}</p>
          </div>
        </div>
      </div>

      <hr className="h-[2px] border-dotted w-[90%] mx-auto border-slate-300" />

      <div className="my-4 w-[90%] mx-auto flex gap-14 items-center max-w-[1400px]">
        <Tabs defaultValue="session" className="w-full overflow-x-hidden">
          <TabsList className="w-full flex items-center gap-4 justify-start pl-0 mb-3 min-w-[300px] overflow-x-scroll overflow-y-hidden">
            <TabsTrigger value="session" className="text-lg font-normal">
              Sesi
            </TabsTrigger>
            <TabsTrigger value="discussion" className="text-lg font-normal">
              Reminder
            </TabsTrigger>
            <TabsTrigger value="scoring" className="text-lg font-normal">
              Nilai
            </TabsTrigger>
          </TabsList>

          <TabsContent value="session">
            <Session />
          </TabsContent>

          <TabsContent value="discussion">
            <Reminder initialCourseData={courseInitial} />
          </TabsContent>

          <TabsContent value="scoring">
            <Score />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CourseDetail;
