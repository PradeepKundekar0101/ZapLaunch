import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { Deployment, Project } from "@/types/data";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, Github, Info, Rocket } from "lucide-react";

import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import LogsDrawer from "./LogsDrawer";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import moment from "moment";
import DeploymentCard from "./DeploymentCard";


const POLLING_INTERVAL = 2000;
const MAX_POLLING_TIME = 5 * 60 * 1000;

const Deployments = ({
  projectId,
  project,
}: {
  projectId: string;
  project: Project;
}) => {
  const api = useAxios();
  const queryClient = useQueryClient();

  const [logs, setLogs] = useState<string[]>([]);
  const [deploymentStatus, setDeploymentStatus] = useState("");
  const [currentDeploymentLogs, setCurrentDeploymentLogs] = useState<string[]>(
    []
  );
  const [currentDeploymentStatus, setCurrentDeploymentStatus] = useState<
    string | null
  >(null);

  const [currentDeploymentId, setCurrentDeploymentId] = useState<string>("");
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<
    string | null
  >(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const [showConfetti, setShowConfetti] = useState(false);

  const { data: deployments, isLoading } = useQuery({
    queryKey: ["deployments", projectId],
    queryFn: async () =>
      (await api.get(`/project/deploy/${projectId}`)).data?.data.deployments,
  });

  const deployMutation = useMutation({
    mutationFn: async () =>
      (await api.post(`/project/deploy/${projectId}`)).data?.data,
    onSuccess: (data) => {
      const newDeployment = data;
      queryClient.setQueryData(
        ["deployments", projectId],
        (oldData: Deployment[] | undefined) => [
          newDeployment,
          ...(oldData || []),
        ]
      );
      setSelectedDeploymentId(newDeployment.id);
      setCurrentDeploymentId(newDeployment.id);
      setIsDrawerOpen(true);
      setCurrentDeploymentStatus("STARTED");
      startPolling(newDeployment.id);
    },
    onError: (error: AxiosError) => {
      toast({
        //@ts-ignore
        title: error.response?.data?.message || "Failed",
        variant: "destructive",
      });
    },
  });
  const { data: logsData } = useQuery({
    queryKey: ["logs", selectedDeploymentId],
    queryFn: async () =>
      (await api.get(`/project/deploy/logs/${selectedDeploymentId}`)).data
        ?.data,
    enabled: !!selectedDeploymentId,
  });

  useEffect(() => {
    if (logsData && logsData.logs) {
      setLogs(logsData.logs);
      setDeploymentStatus(logsData.deploymentStatus);
    }
  }, [logsData]);

  const startPolling = (deploymentId: string) => {
    const pollDeploymentStatus = async () => {
      try {
        const { data } = await api.get(`/project/deploy/logs/${deploymentId}`);
        const updatedDeployment: { deploymentStatus: string; logs: string[] } =
          data?.data;

        if (updatedDeployment) {
          setCurrentDeploymentStatus(updatedDeployment.deploymentStatus);
          setCurrentDeploymentLogs(updatedDeployment.logs);

          queryClient.setQueryData(
            ["deployments", projectId],
            (oldData: Deployment[] | undefined) =>
              oldData?.map((deployment: Deployment) =>
                deployment.id === deploymentId
                  ? {
                      ...deployment,
                      status: updatedDeployment.deploymentStatus,
                    }
                  : deployment
              ) || []
          );
          if (updatedDeployment.deploymentStatus === "DEPLOYED") {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }
          if (
            updatedDeployment.deploymentStatus === "FAILED" ||
            updatedDeployment.deploymentStatus === "DEPLOYED"
          ) {
            if (pollingTimeoutRef.current) {
              clearTimeout(pollingTimeoutRef.current);
            }
          } else {
            pollingTimeoutRef.current = setTimeout(
              pollDeploymentStatus,
              POLLING_INTERVAL
            );
          }
        }
      } catch (error) {
        console.error("Error polling deployment status:", error);
        if (pollingTimeoutRef.current) {
          clearTimeout(pollingTimeoutRef.current);
        }
      } finally {
      }
    };

    pollDeploymentStatus();
    setTimeout(() => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    }, MAX_POLLING_TIME);
  };

  const handleViewLogs = (deploymentId: string) => {
    setSelectedDeploymentId(deploymentId);
    setIsDrawerOpen(true);
  };

  const handleDeploy = () => {
    deployMutation.mutate();
  };

  useEffect(() => {
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs, currentDeploymentLogs]);

  return (
    <Card className="relative overflow-hidden">
       <div className="blob absolute h-96 w-96 bg-green-600 blur-3xl opacity-10 top-0 left-10"></div>
       <div className="blob absolute h-96 w-96 bg-blue-600 blur-3xl opacity-10 bottom-0 right-10"></div>
      <div className=" text-white p-4 rounded-lg relative ">
        { moment(project.lastModified).isAfter(moment(project.lastDeployed)) && <Alert className="">
          <Info className="h-4 w-4" />
          <AlertTitle>Changes detected</AlertTitle>
          <AlertDescription>
            Changes detected in the settings, please redeploy the project
          </AlertDescription>
        </Alert>}
        <div className="flex justify-between items-center mb-4 mt-4">
          <div className="flex flex-col">

          <h2 className="text-xl font-semibold">
            Deployments
            </h2>
        
          </div>
          <div>
            {!isLoading && deployments?.length > 0 && (
              <Button
                onClick={handleDeploy}
                disabled={
                  deployMutation.isPending ||
                  currentDeploymentStatus === "STARTED" ||
                  currentDeploymentStatus == "IN_PROGRESS"
                }
              >
                {deployMutation.isPending ? "Deploying..." : "Deploy"}
              </Button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Github size={16} />
            <a className="" href={project.gitUrl}>
              {project.gitUrl.split("/").pop()}
            </a>
           { deployments && deployments?.length>0 && <a className="text-sm flex items-center" target="_blank" href={`http://${project.projectName}.localhost:3000`}><span className={`flex items-center ${currentDeploymentStatus=="DEPLOYED" || deployments?.length>0 && deployments[0].status==="DEPLOYED"&& "text-green-400"}`}>
             
              <ExternalLinkIcon className={`mr-1 `} size={16}/>  Visit site </span>  </a>}
          </div>
        </div>

        {isLoading ? (
          <div>Loading deployments...</div>
        ) : (
          <div className="space-y-2">
            {deployments?.length == 0 && (
              <div className=" w-full flex justify-center flex-col items-center space-y-2">
                <Rocket color="rgb(48, 110, 232)" size={70} />
                <h1 className="text-slate-300 text-xl font-normal">
                  Create your first deployment
                </h1>
                <Button
                  onClick={handleDeploy}
                  disabled={deployMutation.isPending}
                >
                  {deployMutation.isPending ? "Deploying..." : "Deploy"}
                </Button>
              </div>
            )}

            {
              deployments && deployments.length>0 && <>
              <h1 className=" my-2">Current Deployment</h1>
               <DeploymentCard deployment={deployments[0]} handleViewLogs={handleViewLogs}/>
              </>
            }
           
            {deployments && Array.isArray(deployments) && deployments.length>1 && <h1 className="my-2">Past Deployments</h1>}
            {deployments?.map((deployment: Deployment,ind:number) => ( ind>0 && <>
            <DeploymentCard deployment={deployment} handleViewLogs={handleViewLogs}/>
            </>
            ))}
          </div>
        )}

        <LogsDrawer
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          showConfetti={showConfetti}
          selectedDeploymentId={selectedDeploymentId}
          currentDeploymentId={currentDeploymentId}
          currentDeploymentStatus={currentDeploymentStatus}
          deploymentStatus={deploymentStatus}
          currentDeploymentLogs={currentDeploymentLogs}
          logContainerRef={logContainerRef}
          logs={logs}
        />
      </div>
    </Card>
  );
};

export default Deployments;
