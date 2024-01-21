import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Select, { ActionMeta } from "react-select";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import moment from "moment";
import ModalCumScore from "@/components/score/ModalCumScore";
import { ScoreCourseStudentAllScore, ScoreCourseStudentDetailAllScore } from "@/types"
import { useSessionUser } from "@/contexts/SessionUserContexts"
type Option = { value: string; label: string };

const ScorePage = () => {
  const router = useRouter();
  const { axiosJWT } = useSessionUser()
  const [academicYearId, setAcademicYearId] = useState<string>()
  const [optionAcademicYear, setOptionAcademicYear] = useState<Option[]>()
  const [scoreCourseData, setScoreCourseData] = useState<ScoreCourseStudentAllScore[]>()
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<Option>();
  const handleSelectClass = (option: Option | null, actionMeta: ActionMeta<Option>) => {
    option && setSelectedAcademicYear(option);
  };

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana-parent/score-course/score-course-student${academicYearId ? `?academicYearId=${academicYearId}` : ""}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
    })
    console.log({response})
    if (response?.status === 200) {
      setOptionAcademicYear(response?.data?.data?.optionAcademicYear)
      setAcademicYearId(response?.data?.data?.optionAcademicYear[0].academicYearId)
      setSelectedAcademicYear(response?.data?.data?.optionAcademicYear[0])
      setScoreCourseData(response?.data?.data?.scoreCourseStudent)
    }
  }

  console.log({scoreCourseData})
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8 w-[90%] mx-auto max-w-[1400px]">
        <h1 className="text-2xl font-semibold">Nilai</h1>
        <p>{moment().format("llll")}</p>
      </div>

      <hr className="h-[2px] border-dotted w-[90%] mx-auto border-slate-300" />

      <div className="my-5 w-[90%] mx-auto py-3 flex gap-14 items-center max-w-[1400px]">
        <Select
          name="class"
          className="basic-single w-[18%] min-w-28 rounded-xl"
          value={selectedAcademicYear}
          classNamePrefix="select"
          isClearable={false}
          isSearchable={false}
          defaultValue={selectedAcademicYear}
          options={optionAcademicYear}
          placeholder="Pilih Kelas"
          onChange={handleSelectClass}
        />
      </div>

      <div className="w-[90%] mx-auto flex gap-14 rounded-xl shadow-xl items-center max-w-[1400px]">
        <Table className="bg-white rounded-xl ">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xl py-3 text-left">Mata Pelajaran</TableHead>
              <TableHead className="text-xl py-3 text-center">Tugas</TableHead>
              <TableHead className="text-xl py-3 text-center">Ulangan Harian</TableHead>
              <TableHead className="text-xl py-3 text-center">Ulangan Tengah Semester</TableHead>
              <TableHead className="text-xl py-3 text-center">Ulangan Akhir Semester</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scoreCourseData?.map((_: ScoreCourseStudentAllScore, idx) => {
              return (
                <TableRow className="group">
                  <TableCell className="text-lg py-3 text-left">{_.name}</TableCell>
                  {_.scoreCourseStudentDetail?.map((scoreType: ScoreCourseStudentDetailAllScore) => {
                    return (
                      <TableCell className="text-lg py-3 text-center">
                        <div className="flex justify-center items-start">
                          <p>{scoreType.scoreMean}</p>
                          <ModalCumScore type={scoreType.scoreCourseType} subject={_.name} scoreList={scoreType.scoreCourseDetail} />
                        </div>
                      </TableCell>
                    )
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default ScorePage;
