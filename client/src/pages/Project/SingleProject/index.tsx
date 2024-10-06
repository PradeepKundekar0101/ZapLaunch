import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import Deployments from "./Deployments";
import Variables from "./Variables";
import Settings from "./Settings";
import Loader from "@/components/ui/loader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChartNoAxesColumn, GanttChart, List, SettingsIcon } from "lucide-react";
import Metrics from "@/pages/Metrics";


const SingleProject = () => {

  const { projectId } = useParams();
  const api = useAxios();

  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () =>
      (await api.get("/project/singleProject/" + projectId)).data?.data
        ?.project,
  });
  return (
    <section className="">
     

      {isProjectLoading ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb className="my-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to={"/dashboard"}>Projects</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">
                  {project?.projectName}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div>
         
            <Tabs defaultValue="deployment" onChange={()=>{}} className="w-full">
              <div className=" flex w-full justify-between">
                <TabsList>
                  <TabsTrigger value="deployment">
                    <span className="mr-1">Deployments</span>
                    <List size={20} />
                  </TabsTrigger>
                  <TabsTrigger value="metrics">
                    <span className="mr-1">Metrics</span>
                    <ChartNoAxesColumn size={20} />
                  </TabsTrigger>
                  <TabsTrigger value="variable"><span className="mr-1">
                  
                    Variables  </span> <GanttChart size={20}/> </TabsTrigger>
                  <TabsTrigger value="setting"><span className="mr-1">Settings</span><SettingsIcon size={20}/></TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="deployment">
                <Deployments projectId={projectId!} project={project!}  />
              </TabsContent>
              <TabsContent value="metrics">
                <Metrics  project={project!} />
              </TabsContent>
              <TabsContent value="variable">
                <Variables project={project!} />
              </TabsContent>
              <TabsContent value="setting">
                <Settings project={project!} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}

    </section>
  );
};

export default SingleProject;
