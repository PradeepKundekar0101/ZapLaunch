import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import { useAppSelector } from "@/store/hooks";
import { Project } from "@/types/data";
import { useQuery } from "@tanstack/react-query";
import { Grid, List, PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import Loader from "@/components/ui/loader";
import { useState } from "react";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";

const Dashboard = () => {
  const api = useAxios();
  const [layout, setLayout] = useState("grid");
  const [sortBy, setSortBy] = useState("lastModified");
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return (await api.get("/project/" + user?.id)).data?.data;
    },
  });

  const sortedProjects = projects?.projects?.sort((a: Project, b: Project) => {
    if (sortBy === "lastDeployed") {
      return (
        new Date(b.lastDeployed || 0).getTime() -
        new Date(a.lastDeployed || 0).getTime()
      );
    } else if (sortBy === "createdAt") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return (
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      );
    }
  });
  console.log(sortedProjects);
  return (
    <section className="">
      <div className="flex justify-between border-b-[0.5px] border-b-[#292929] py-10">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user?.avatarUrl} alt={user?.userName} />
            <AvatarFallback>{user?.userName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1>{user?.fullName}</h1>
        </div>
        <div>
          <Button
            onClick={() => {
              navigate("/new");
            }}
            className=" flex items-center"
          >
            New <PlusCircle className="ml-1" size={20}></PlusCircle>{" "}
          </Button>
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <div className=" flex items-center space-x-4">
          <h1 className=" text-md text-slate-500">
            {isLoading && "Loading..."}
            {projects &&
              projects.projects &&
              projects.projects?.length + " projects"}
          </h1>
          <span className=" border-l-[1px] pl-4 border-[#292929]">
            <Select
              defaultValue={"lastModified"}
              onValueChange={(value) => setSortBy(value)}
            >
              <div className="flex items-center">
                <SelectTrigger className="w-[200px] text-slate-400">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={"lastDeployed"} value={"lastDeployed"}>
                    <span className="flex justify-between w-full">
                      Last Deployed
                    </span>
                  </SelectItem>
                  <SelectItem key={"createdAt"} value={"createdAt"}>
                    <span className="flex justify-between w-full">
                      Creation Date
                    </span>
                  </SelectItem>
                  <SelectItem key={"lastModified"} value={"lastModified"}>
                    <span className="flex justify-between w-full">
                      Last Modified
                    </span>
                  </SelectItem>
                </SelectContent>
              </div>
            </Select>
          </span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => {
              setLayout("list");
            }}
          >
            <List size={20} color={`${layout === "list" ? "white" : "grey"}`} />
          </button>
          <button
            onClick={() => {
              setLayout("grid");
            }}
          >
            <Grid size={20} color={`${layout === "grid" ? "white" : "grey"}`} />
          </button>
        </div>
      </div>

      <div
        className={`mt-5 ${
          layout === "list"
            ? "flex flex-col space-y-3"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        }`}
      >
        {isLoading && <Loader />}
        {!isLoading && sortedProjects?.length === 0 && (
          <div className="text-slate-400 text-center py-10">
            <h1 className="text-xl font-semibold">No projects found</h1>
            <p className="mt-2">Please create a new project to get started.</p>
          </div>
        )}
        {sortedProjects?.map((project: Project) => (
          <Link
            key={project.id}
            className={`bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
              layout === "list" ? "p-4" : "p-6"
            }`}
            to={`/project/${project.id}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">
                {project.projectName}
              </h2>
              <div
                className={`w-3 h-3 rounded-full ${
                  project.isLive ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Created: {moment(project.createdAt).format("MMMM D, YYYY")}</p>
              <p>
                Last deployed:{" "}
                {project.lastDeployed
                  ? moment(project.lastDeployed).fromNow()
                  : "Never"}
              </p>
            </div>
            <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
              <span>{project.gitUrl.split("/").pop()}</span>
              <span>{moment(project.lastModified).fromNow()}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
