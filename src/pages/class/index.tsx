import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useSessionUser } from "@/contexts/SessionUserContexts"
import { ScoreCourseStudentAllScore, ScoreCourseStudentDetailAllScore, ClassStudentList, TeacherNotes } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import moment from "moment";

const gparam = {
  page: 1,
  pageSize: 10,
}

const ClassPage = () => {
  const { state, axiosJWT } = useSessionUser()
  const [currentPage, setCurrentPage] = useState(1);
  const [teacherNote, setTeacherNote] = useState<TeacherNotes[]>();
  const [studentData, setStudentData] = useState<ClassStudentList[]>();
  const [totalData, setTotalData] = useState<number | null>();
  const [totalPages, setTotalPages] = useState<number>(10);
  const [nextPage, setNextPage] = useState<number | null>();

  useEffect(() => {
    fetchData()
  }, [currentPage])

  useEffect(() => {
    fetchTeacherNote()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana-parent/school-class/classmates?page=${gparam.page}&pageSize=${gparam.pageSize}`)

      if (response?.data?.statusCode === "000") {
        setStudentData(response?.data?.data?.listStudents);
        setTotalData(response?.data?.data?.totalData);
        setTotalPages(response?.data?.data?.totalPages);
        setNextPage(response?.data?.data?.nextPage);
      } else {
        throw Error("Fetch data error.")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchTeacherNote = async () => {
    try {
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana-parent/teacher-note`)

      if (response?.data?.statusCode === "000") {
        setTeacherNote(response?.data?.data);
      } else {
        throw Error("Fetch data error.")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const renderPaginationItems = () => {
    const paginationItems = [];

    paginationItems.push(
      <PaginationItem key="previous">
        <PaginationPrevious
          // href="#"
          className="rounded-xl hover:border-[1px] border-gray-400 cursor-pointer hover:bg-slate-300"
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1)
              gparam.page = currentPage - 1
            }
          }}
          isActive={currentPage !== 1}
        />
      </PaginationItem>
    );

    paginationItems.push(
      <PaginationItem key={currentPage}>
        <PaginationLink className="rounded-xl hover:border-[1px] border-gray-400 cursor-pointer hover:bg-slate-300" isActive onClick={() => {
          setCurrentPage(currentPage)
          gparam.page = currentPage
        }}>
          {currentPage}
        </PaginationLink>
      </PaginationItem>
    );

    for (let page = currentPage + 1; page <= currentPage + 2 && page <= totalPages; page++) {
      paginationItems.push(
        <PaginationItem key={page}>
          <PaginationLink className="rounded-xl hover:border-[1px] border-gray-400 cursor-pointer hover:bg-slate-300" href="#" onClick={() => {
            setCurrentPage(page)
            gparam.page = page
          }}>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    paginationItems.push(
      <PaginationItem key="next">
        <PaginationNext
          // href="#"
          className="rounded-xl hover:border-[1px] border-gray-400 cursor-pointer hover:bg-slate-300"
          onClick={() => {
            if (totalPages > currentPage) {
              setCurrentPage(currentPage + 1)
              gparam.page = currentPage + 1
            }
          }}
          isActive={currentPage !== totalPages}
        />
      </PaginationItem>
    );

    return paginationItems;
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8 w-[90%] mx-auto max-w-[1400px]">
        <h1 className="text-2xl font-semibold">Your Class</h1>
        <h1 className="text-2xl font-semibold">{teacherNote && teacherNote[0]?.school_class?.name}</h1>
      </div>

      <hr className="h-[2px] border-dotted w-[90%] mx-auto border-slate-300" />
      <Tabs defaultValue="classmate">
        <div className="my-2 w-[90%] mx-auto py-3 flex gap-14 items-center max-w-[1400px]">
          <TabsList className="w-full flex items-center gap-4 justify-start pl-0 min-w-[250px] overflow-y-hidden overflow-x-scroll">
            <TabsTrigger value="classmate" className="text-lg font-normal">
              View Classmate
            </TabsTrigger>
            <TabsTrigger value="teacherNote" className="text-lg font-normal">
              Teacher Note
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="classmate" className="w-full">
          <div className="w-[90%] mx-auto">
            <h2 className="font-semibold text-2xl my-5">Classmates</h2>
          </div>
          
          <div className="my-5 w-[90%] mx-auto rounded-xl shadow-xl flex gap-14 items-center max-w-[1400px]">
            <Table className="bg-white rounded-xl min-w-[350px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-7 text-xl py-3">Nama</TableHead>
                  <TableHead className="pl-7 text-xl py-3">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentData?.map((student: ClassStudentList) => {
                  return (
                    <TableRow>
                      <TableCell className="pl-7 py-3">
                        <div className="flex items-center gap-2 sm:gap-6">
                          <img src="/photo_profile.jpg" alt="" className="w-16 h-16 rounded-full object-cover" />
                          <h4 className="text-center text-lg ">{student.studentName}</h4>
                        </div>
                      </TableCell>
                      <TableCell className="pl-7 text-lg py-3">{student.student?.email}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex overflow-x-auto sm:justify-center mt-5">
            {totalData && (
              <Pagination>
                <PaginationContent>{renderPaginationItems()}</PaginationContent>
              </Pagination>
            )}
          </div>
        </TabsContent>
        <TabsContent value="teacherNote">
          <div className="w-[90%] mx-auto mt-5 flex flex-col gap-3">
            <h2 className="font-semibold text-2xl mb-5">Teacher's Note</h2>
            {teacherNote?.map((note: TeacherNotes) => (
              <div className="rounded-xl bg-white py-4 shadow-lg">
                <div className="flex items-center gap-4 px-4 ">
                  <img src="/photo_teacher.jpg" alt="" className="w-20 h-20 rounded-full object-cover" />
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-xl">{note.teacherName}.</h3>
                    <p className="font-normal">
                      Teacher | {note.school_class.name} <span className="ml-4">{moment(note.createdDate).format("LLL")}</span>
                    </p>
                  </div>
                </div>

                <h4 className="font-medium text-xl border-slate-400 mt-4 px-4 py-2">{note.title}</h4>
                <hr className="h-[2px] border-dotted w-[100%] mx-auto border-slate-300" />
                <p className="text-justify mt-2 px-4 py-2">
                  {note.body}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
    </Layout>
  );
};

export default ClassPage;
