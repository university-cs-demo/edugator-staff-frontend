import AdminLayout from "components/layouts/AdminLayout";
import {
  DownloadIcon,
  Pencil2Icon,
  PlusIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { Trash, UsersThree } from "phosphor-react";
import ActionButton from "components/shared/Buttons/ActionButton";
import { Download } from "tabler-icons-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { NextRoutes } from "constants/navigationRoutes";
import { AddStudentModal } from "components/shared/Modals/AddStudentModal";
import { useRouter } from "next/router";
import { useGetCourseEnrollments } from "hooks/enrollments/useGetCourseEnrollments";
import { useGetCourseInvitations } from "hooks/invitations/useGetCourseInvitations";
import { useCancelInvitation } from "hooks/invitations/useCancelInvitation";
import { useDeleteEnrollment } from "hooks/enrollments/useDeleteEnrollment";
import InvitiationsTable from "components/course/roster/InvitiationsTable";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import EnrollmentsTable from "components/course/roster/EnrollmentsTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const RosterControls = () => {
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);

  return (
    <div className="flex gap-2 w-full sm:w-fit">
      <AddStudentModal
        open={addStudentModalOpen}
        setOpen={setAddStudentModalOpen}
      />
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button variant="outline" className="bg-slate-50" size={"icon"}>
            <DownloadIcon className="w-4 h-4" strokeWidth={1.5} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Download Roster</TooltipContent>
      </Tooltip>
      <Button
        variant="default"
        className="gap-2"
        onClick={() => {
          setAddStudentModalOpen(true);
        }}
      >
        <PlusIcon className="w-4 h-4" strokeWidth={1.5} />
        <p>Add Students</p>
      </Button>
    </div>
  );
};

const RosterPage = () => {
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [tableView, setTableView] = useState<"enrollments" | "invitations">(
    "enrollments"
  );

  const {
    data: enrollmentsData,
    isFetching: enrollmentsFetching,
    isError: enrollmentsError,
    error: enrollmentsErrorData,
  } = useGetCourseEnrollments();

  const {
    data: invitationData,
    isFetching: invitationFetching,
    isError: invitationError,
    error: invitationErrorData,
  } = useGetCourseInvitations();

  const numStudents = enrollmentsFetching ? null : enrollmentsData?.length ?? 0;
  const numInvitations = invitationFetching
    ? null
    : invitationData?.length ?? 0;

  const numEntries = tableView === "enrollments" ? numStudents : numInvitations;

  return (
    <div className="h-screen pb-12 min-h-screen w-full text-slate-800 bg-white relative">
      <div className="p-6 lg:p-12 w-full h-full !overflow-y-auto">
        <div className="w-full max-w-7xl flex flex-col">
          <div className="flex space-x-6 items-center">
            <div className="w-14 h-14 min-w-[3.5rem] rounded-md bg-slate-300 ring-1 flex items-center justify-center ring-offset-1 ring-offset-slate-200 ring-slate-400/70 shadow-inner">
              <UsersThree
                size={36}
                weight="duotone"
                className="text-slate-100"
              />
            </div>
            <div className="flex flex-col space-y-[2px] justify-center">
              <h1 className="text-[26px] font-medium font-dm">Roster</h1>
              <p className="font-dm text-slate-600 text-sm max-w-4xl text-left">
                Manage your course roster to add students and collaborators.
              </p>
            </div>
          </div>
          <Tabs
            className=""
            value={tableView}
            onValueChange={(value) =>
              setTableView(value as "enrollments" | "invitations")
            }
          >
            <div className="w-full flex justify-between !mt-8 items-end">
              <TabsList className="h-full p-0 rounded-none space-x-0 shrink-0 bg-transparent">
                <TabsTrigger
                  value="enrollments"
                  className="px-4 py-2 h-full ring-0 w-fit !bg-transparent !shadow-none rounded-none border-b data-[state=active]:border-b-2 data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-500"
                >
                  Enrollments
                </TabsTrigger>
                <TabsTrigger
                  value="invitations"
                  className="px-3 py-2 h-full ring-0 w-fit !bg-transparent !shadow-none rounded-none border-b data-[state=active]:border-b-2 data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-500"
                >
                  Active Invitations
                </TabsTrigger>
              </TabsList>
              <div className="w-full h-full border-b"></div>
            </div>

            <TabsContent value="enrollments" className="mt-8">
              <EnrollmentsTable />
            </TabsContent>
            <TabsContent value="invitations" className="mt-8">
              <InvitiationsTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

RosterPage.getLayout = (page: React.ReactNode) => (
  <AdminLayout pageTitle="Roster">{page}</AdminLayout>
);

export default RosterPage;
