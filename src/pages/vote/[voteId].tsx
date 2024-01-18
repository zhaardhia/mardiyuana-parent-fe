import Layout from "@/components/Layout";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import moment from "moment";
import { useSessionUser } from "@/contexts/SessionUserContexts";
import { EventVoteDetail, AllVoteEventVote } from "@/types"
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import ProgressVoteBar from "@/components/ProgressVoteBar";

const VoteDetail = () => {
  const router = useRouter();
  const { voteId } = router.query;

  const [voteChoosen, setVoteChoosen] = useState("");

  const { axiosJWT, state } = useSessionUser()
  const [event, setEvent] = useState<EventVoteDetail>()
  const [percentageAgree, setPercentageAgree] = useState<string>('')
  const [widthPercentageAgree, setWidthPercentageAgree] = useState<string>('w-[0%]')
  const [totalAgree, setTotalAgree] = useState<number>()

  const [percentageDisagree, setPercentageDisagree] = useState<string>('')
  const [widthPercentageDisagree, setWidthPercentageDisagree] = useState<string>('w-[0%]')
  const [totalDisagree, setTotalDisagree] = useState<number>()

  const [totalStudent, setTotalStudent] = useState<number>()

  const [loadingVote, setLoadingVote] = useState<boolean>(false)
  const userId = state?.userInfo?.userId

  React.useEffect(() => {
    if (voteId) fetchData()
  }, [voteId, userId])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_MARDIYUANA_UTIL}/event/detail-vote?id=${voteId}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
    })

    if (response?.status === 200) {
      setEvent(response?.data?.data)
      const findParentVote = response?.data?.data?.event_votes.find((vote: AllVoteEventVote) => vote.parentId === userId && vote.isAgree === "YES")

      setVoteChoosen(findParentVote ? "YES" : "NO")
      setWidthPercentageAgree(`w-[${response?.data?.data?.percentageAgree}]`)
      setPercentageAgree(response?.data?.data?.percentageAgree)
      setTotalAgree(response?.data?.data?.totalAgree)

      setWidthPercentageDisagree(`w-[${response?.data?.data?.percentageDisagree}]`)
      setPercentageDisagree(response?.data?.data?.percentageDisagree)
      setTotalDisagree(response?.data?.data?.totalDisagree)
      
      setTotalStudent(response?.data?.data?.totalStudent)
    }
  }

  const voteParent = async (voteChoose: string) => {
    setLoadingVote(true)
    await axiosJWT.post(`${process.env.NEXT_PUBLIC_MARDIYUANA_UTIL}/event/parent-vote`, 
    {
      eventId: voteId,
      isAgree: voteChoose
    }, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
    })

    setVoteChoosen(voteChoose)
    if (typeof totalAgree === "number" && totalStudent) {
      console.log("enter agree")
      const newPercentageAgree = ((voteChoose === "YES" ? totalAgree + 1 : totalAgree - 1) / totalStudent * 100).toFixed(0)
      console.log({total: ((voteChoose === "YES" ? totalAgree + 1 : totalAgree - 1) / totalStudent * 100).toFixed(0)})
      console.log({newPercentageAgree, voteChoose})
      setTotalAgree(voteChoose === "YES" ? totalAgree + 1 : totalAgree - 1)
      setPercentageAgree(`${newPercentageAgree}%`)
      setWidthPercentageAgree(`w-[${newPercentageAgree}%]`)
      console.log(`w-[${newPercentageAgree}%]`)
    }
    if (typeof totalDisagree === "number" && totalStudent) {
      console.log("enter disagree")
      const newPercentageDisagree = ((voteChoose === "NO" ? totalDisagree + 1 : totalDisagree - 1) / totalStudent * 100).toFixed(0)
      console.log({newPercentageDisagree, voteChoose})
      setTotalDisagree(voteChoose === "NO" ? totalDisagree + 1 : totalDisagree - 1)
      setPercentageDisagree(`${newPercentageDisagree}%`)
      setWidthPercentageDisagree(`w-[${newPercentageDisagree}%]`)
      console.log(`w-[${newPercentageDisagree}%]`)
    }
    
    
    setLoadingVote(false)
  }
  console.log({percentageAgree, percentageDisagree})
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8 w-[90%] mx-auto max-w-[1400px]">
        <h1 className="text-2xl font-semibold">Vote</h1>
        <p>{moment().format('llll')}</p>
      </div>

      <hr className="h-[2px] border-dotted w-[90%] mx-auto border-slate-300" />

      <div className="my-5 flex items-center w-[90%] mx-auto max-w-[1400px]">
        <Icon icon="formkit:arrowleft" className="cursor-pointer h-full w-10" onClick={() => router.back()} />
        <h2 className="font-semibold text-2xl w-full text-center mt-5">{event?.name}</h2>
      </div>

      <div className="h-[300px] mt-7">
        {event?.imageUrl ? (
          <img src={event?.imageUrl} alt="" className="h-full object-cover w-[90%] mx-auto rounded-xl" />
          ) : (
            <img src="/school_event.png" alt="" className="h-full object-cover w-[90%] mx-auto rounded-xl" />
          )
        }
      </div>

      <div className="my-8 flex flex-start w-[90%] mx-auto max-w-[1400px]">
        <p className="text-md text-left italic">
          Tanggal Mulai Event: {moment(event?.eventDate).format("DD MMMM YYYY")}
        </p>
      </div>

      <div className="my-8 flex items-center w-[90%] mx-auto max-w-[1400px]">
        <p className="text-lg text-justify indent-20">
          {event?.description}
        </p>
      </div>

      <div className="my-8 flex flex-start w-[90%] mx-auto max-w-[1400px]">
        <p className="text-md text-left italic">
          Ditulis tanggal: {moment(event?.createdDate).format("DD MMMM YYYYY")}
        </p>
      </div>

      <div className="my-8 flex flex-col w-[90%] mx-auto max-w-[1400px]">
        <h2 className="font-semibold text-2xl">Votes</h2>
        <p className="italic mb-3">Choose whether agree or disagree correspond to the vote</p>

        <div className="flex flex-col gap-2">
          <div
            className={`${
              voteChoosen === "YES" ? "border-green-500" : "border-transparent"
            } border p-1 transition-all rounded-full w-1/4`}
          >
            <button
              className="w-full h-8 bg-white rounded-full dark:bg-gray-700 cursor-pointer"
              onClick={() => {
                if (voteChoosen !== "YES") voteParent("YES")
              }}
              disabled={loadingVote}
            >
              <ProgressVoteBar percentage={percentageAgree} type="agree" widthPercentage={widthPercentageAgree}/>
              
            </button>
          </div>

          <div
            className={`${
              voteChoosen === "NO" ? "border-red-500" : "border-transparent"
            } border p-1 transition-all rounded-full w-1/4`}
          >
            <button
              className="w-full h-8 bg-white rounded-full dark:bg-gray-700 cursor-pointer"
              onClick={() => {
                if (voteChoosen !== "NO") voteParent("NO")
              }}
              disabled={loadingVote}
            >
              <ProgressVoteBar percentage={percentageDisagree} type="disagree" widthPercentage={widthPercentageDisagree}/>
            </button>
          </div>
        </div>
        {voteChoosen && (
          <p className={`${voteChoosen === "YES" ? "text-green-700" : "text-red-700"}`}>
            You've voted <span className="capitalize font-medium">{voteChoosen === "YES" ? "Agree" : "Disagree"}</span>
          </p>
        )}
      </div>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(VoteDetail), {
  ssr: false,
});
