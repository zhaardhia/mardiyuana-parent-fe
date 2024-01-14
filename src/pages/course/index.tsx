import Layout from "@/components/Layout";
import React, { useState } from "react";
import Select, { ActionMeta } from "react-select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { CourseList, Option, OptionEnrollmentCourseList, EnrollmentStudentOnCourseList } from "@/types"
import { useSessionUser } from "@/contexts/SessionUserContexts"
import moment from "moment";

const CoursePage = () => {
  const { axiosJWT } = useSessionUser()
  const [optionClasses, setOptionClasses] = useState<Option[]>()
  const [selectedClass, setSelectedClass] = useState<Option>();
  const [enrollmentStudent, setEnrollmentStudent] = useState<EnrollmentStudentOnCourseList>();
  const [courses, setCourses] = useState<CourseList[]>()
  const handleSelectClass = (option: Option | null, actionMeta: ActionMeta<Option>) => {
    option && setSelectedClass(option);
  };

  React.useEffect(() => {
    fetchData()
  }, [selectedClass])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana-parent/course${selectedClass ? `?academicYearId=${selectedClass.value}` : ""}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
    })
    console.log({response})
    if (response?.data?.statusCode === "000") {
      setCourses(response?.data?.data?.listCourse)
      setOptionClasses(response?.data?.data?.optionEnrollment?.map((enroll: OptionEnrollmentCourseList) => {
        return { label: `${enroll?.className} (${enroll.academicYear})`, value: enroll.academicYearId }
      }))

      if (!selectedClass) {
        const selected = response?.data?.data?.optionEnrollment?.find((enroll: OptionEnrollmentCourseList) => enroll.status === "ACTIVE")
        setSelectedClass(
          { label: `${selected?.className} (${selected.academicYear})`, value: selected.academicYearId }
        )
      }
      setEnrollmentStudent(response?.data?.data?.enrollment_student)
    }
  }
  console.log({enrollmentStudent})
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8 w-[90%] mx-auto max-w-[1400px]">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <p>{moment().format('llll')}</p>
      </div>

      <hr className="h-[2px] border-dotted w-[90%] mx-auto border-slate-300" />

      <div className="my-5 w-[90%] mx-auto py-3 flex gap-14 items-center max-w-[1400px]">
        <Select
          name="class"
          className="basic-single w-[50%] min-w-28 rounded-xl"
          value={selectedClass}
          classNamePrefix="select"
          isClearable={false}
          isSearchable={false}
          defaultValue={optionClasses && optionClasses[0]}
          options={optionClasses}
          placeholder="Pilih Kelas"
          onChange={handleSelectClass}
        />
      </div>

      <div className="w-[90%] mx-auto flex gap-14 items-center max-w-[1400px]">
        <Accordion type="single" collapsible className="w-full">
          {courses?.map((_: CourseList, idx) => (
            <AccordionItem value={`item-${idx}`} className="border-b border-slate-400" key={_.id}>
              <AccordionTrigger className="text-lg py-7">{_.name}</AccordionTrigger>
              <AccordionContent>
                <p className="text-base">
                  <span className="font-semibold">Guru</span>: {_.enrollment_teacher.teacherName}
                </p>
                <Link href={`/course/detail/${enrollmentStudent?.id}/${_.id}`} className="hover:underline text-blue-600">
                  More detail
                </Link>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Layout>
  );
};

export default CoursePage;
