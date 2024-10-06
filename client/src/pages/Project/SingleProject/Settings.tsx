import { useState, useEffect } from "react";
import useAxios from "@/hooks/useAxios";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Branch, Project } from "@/types/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GitBranch, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Loader from "@/components/ui/loader";

const Settings = ({ project }: { project: Project }) => {
  const api = useAxios();
  const { projectId } = useParams();
  const [selectedBranch, setSelectedBranch] = useState<string>(project.branch);
  const [installCommand, setInstallCommand] = useState<string>(project.installCommand || "");
  const [projectName, setProjectName] = useState<string>(project.projectName);
  const [buildCommand, setBuildCommand] = useState<string>(
    project.buildCommand || ""
  );
  const [srcDir, setSrcDir] = useState<string>(project.srcDir||"/");

  const { data: branches, isLoading: isBranchesLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: async () =>
      (await api.get(`/project/github/branches/${projectId}`))?.data,
    enabled: !!project,
  });
  useEffect(() => {
    if (!selectedBranch && branches && branches.length > 0) {
      setSelectedBranch(branches[0].name);
    }
  }, [branches]);

  const updateProjectMutation = useMutation({
    mutationKey: ["updateProject"],
    mutationFn: async () => {
      return await api.put(`/project/${project?.id}`, {
        branch: selectedBranch,
        installCommand,
        buildCommand,
        projectId,
        projectName,
        srcDir
      });
    },
    onSuccess: () => {
      toast({ title: "Project updated successfully", variant: "default" });
    },
    onError: () => {
      toast({ title: "Failed to update project", variant: "destructive" });
    },
  });


  const deleteProjectMutation = useMutation({
    mutationKey: ["deleteProject"],
    mutationFn: async () => {
      return await api.delete(`/project/${project?.id}`);
    },
    onSuccess: () => {
      toast({ title: "Project deleted successfully", variant: "destructive" });
    },
    onError: () => {
      toast({ title: "Failed to delete project", variant: "destructive" });
    },
  });


  const handleSave = () => {
    updateProjectMutation.mutate();
  };

  const handleDelete = () => {
    // if (window.confirm("Are you sure you want to delete this project?")) {
      // deleteProjectMutation.mutate();
    // }
  };

  // if (isBranchesLoading) return <div>Loading branches...</div>;

  return (
    <Card className="p-4  shadow-md relative">
      <Button
        className="absolute top-4 right-4"
        onClick={handleSave}
        variant="default"
        disabled={updateProjectMutation.isPending}
      >
        Save
      </Button>

      <h1 className="text-2xl font-bold mb-6">Project Settings</h1>

      <div className="mb-6">
        <div className="mb-4">
          <p>Project Name</p>
          <Input
            disabled
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="project Name"
          />
        </div>
        <div className="mb-4">
          <h1 className="text-xl font-semibold mb-2">Source</h1>
          <p className=" text-slate-400">Branch</p>
          {
            isBranchesLoading?<Loader/>:<Select
            defaultValue={selectedBranch}
            onValueChange={(value) => setSelectedBranch(value)}
          >
            <div className="flex items-center space-x-1">
              <GitBranch className=" inline" />
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches &&
                  Array.isArray(branches) &&
                  branches.map((branch: Branch) => (
                    <SelectItem
                      className="w-full"
                      key={branch.name}
                      value={branch.name}
                    >
                      <span className="flex justify-between w-full">
                        {branch.name}
                      </span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </div>
          </Select>
          }
           <div className="my-4">
          <p className=" text-slate-400">Source Directory</p>
          <Input
            value={srcDir}
            onChange={(e) => setSrcDir(e.target.value)}
            placeholder="/"
          />
        </div>
          
        </div>
      </div>

      {/* Commands Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Commands</h2>

        <div className="mb-4">
          <p className=" text-slate-400">Custom install command</p>
          <Input
            value={installCommand}
            onChange={(e) => setInstallCommand(e.target.value)}
            placeholder="npm install"
          />
        </div>
        <div>
          <p className="text-slate-400">Custom build command</p>
          <Input
            value={buildCommand}
            onChange={(e) => setBuildCommand(e.target.value)}
            placeholder="npm run build"
          />
        </div>
      </div>

      {/* Danger Zone: Delete Project */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2 text-red-600">Danger</h2>
        <AlertDialog>
          <AlertDialogTrigger>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteProjectMutation.isPending}
            >
              Delete Project <Trash className="ml-2" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default Settings;
