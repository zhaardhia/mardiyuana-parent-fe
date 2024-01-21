import React, { useState } from 'react'
import Layout from '@/components/Layout'
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
import { useRouter } from "next/router";
import moment from "moment";
import { useSessionUser } from "@/contexts/SessionUserContexts"
import { AnnouncementData } from "@/types"
import Link from 'next/link';

const gparam = {
  page: 1,
  pageSize: 10,
}

const Announcement = () => {
  const router = useRouter();
  const { axiosJWT } = useSessionUser()
  const [currentPage, setCurrentPage] = useState(1);
  const [announcement, setAnnouncement] = useState<AnnouncementData[]>()
  // const [title, setAnnouncement] = useState<AnnouncementData[]>()
  const [totalData, setTotalData] = useState<number | null>();
  const [totalPages, setTotalPages] = useState<number>(10);
  const [nextPage, setNextPage] = useState<number | null>();

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_MARDIYUANA_UTIL}/announcement?page=${gparam.page}&pageSize=${gparam.pageSize}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
    })
    console.log({response})
    if (response?.status === 200) {
      setAnnouncement(response?.data?.data?.announcements)
      setTotalData(response?.data?.data?.totalData)
      setTotalPages(response?.data?.data?.totalPages)
      setNextPage(response?.data?.data?.nextPage)
    }
  }

  const renderPaginationItems = () => {
    const paginationItems = [];

    paginationItems.push(
      <PaginationItem key="previous">
        <PaginationPrevious
          // href="#"
          className="rounded-xl cursor-pointer hover:bg-slate-100"
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
        <PaginationLink className="rounded-xl hover:border-[1px] border-gray-300 cursor-pointer hover:bg-slate-100" isActive onClick={() => {
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
          <PaginationLink className="rounded-xl cursor-pointer hover:bg-slate-100" href="#" onClick={() => {
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
          className="rounded-xl cursor-pointer hover:bg-slate-100"
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
        <h1 className="text-2xl font-semibold">Pengumuman</h1>
        <p>{moment().format("llll")}</p>
      </div>

      <hr className="h-[2px] border-dotted w-[90%] mx-auto border-slate-300" />

      <div className="w-[90%] mx-auto flex gap-14 rounded-xl shadow-xl items-center max-w-[1400px] mt-10">
        <Table className="bg-white rounded-xl overflow-x-scroll">
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg py-3 text-left w-[20rem]">Judul</TableHead>
              <TableHead className="text-lg py-3 text-left w-[25rem]">Deskripsi</TableHead>
              <TableHead className="text-lg py-3 text-left w-[20rem]">Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcement?.map((_: AnnouncementData, idx) => {
              return (
                <TableRow className="group">
                  <TableCell className="text-md py-3 text-left w-[20rem] hover:underline"><Link href={`/announcement/${_.id}`}>{_.title}</Link></TableCell>
                  <TableCell className="text-md py-3 text-left max-w-[30rem] truncate">{_.body}</TableCell>
                  <TableCell className="text-md py-3 text-left w-[20rem]">{moment(_.createdDate).format("LLL")}</TableCell>
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
    </Layout>
  )
}

export default Announcement
