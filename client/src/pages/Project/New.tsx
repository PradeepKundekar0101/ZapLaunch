import { useState } from "react";
import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import { Cross2Icon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/ui/loader";

const New = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [projectCreateError, setProjectCreateError] = useState<null | string>(
    null
  );
  const [repoSelected, setRepoSelected] = useState<null | {
    id: number;
    name: string;
    url: string;
  }>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  
  const {
    data: repos = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return (await api.get("/project/github/repos")).data;
    },
  });

  const { mutate, isPending: isProjectCreating } = useMutation({
    mutationKey: ["projectDeploy"],
    mutationFn: async () => {
      return await api.post("/project/", {
        projectName,
        gitUrl: repoSelected?.url,
      });
    },
    onSuccess: (data) => {
      toast({ title: data.data.message });
      navigate("/project/" + data?.data?.data?.projectId);
    },
    onError: (error: any) => {
      setProjectCreateError(
        error.response?.data?.message || "Something went wrong"
      );
    },
  });

  const handleCreateProject = () => {
    if (projectName.length < 6) {
      toast({ title: "Min 6 characters required", variant: "destructive" });
      return;
    }
    if (!isValidProjectName(projectName)) {
      toast({ title: "Valid project name", variant: "destructive" });
      return;
    }
    mutate();
  };

  const isValidProjectName = (projectName: string): boolean => {
    if (projectName.length === 0) return true;
    const regex = /^[a-z0-9]+$/;
    return regex.test(projectName);
  };

  // Filter repositories based on search term
  const filteredRepos = Array.isArray(repos) && repos?.filter((repo:any) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="flex justify-center min-h-screen bg-[#0B0A12] text-white">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6Zm1 14V7h12v12H7ZM28 5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H28Zm1 14V7h12v12H29ZM5 28a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V28Zm2 1v12h12V29H7Zm29-1a1 1 0 1 0-2 0v6h-6a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6v-6Z"
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient
                id="gradient"
                x1="5.76"
                y1="42.747"
                x2="43"
                y2="20.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#B814B8" />
                <stop offset="1" stopColor="#500CE4" />
              </linearGradient>
            </defs>
          </svg>
          <h1 className="text-3xl font-bold mt-4">New Project</h1>
          <h2 className="text-sm text-gray-400 mt-2">
            Deploy your app to production effortlessly
          </h2>
          <h3>
            {currentStep >= 2 && "Deploy from your repo"}{" "}
            <span>{repoSelected && repoSelected.name}</span>
          </h3>
        </div>

        <div className="bg-[#181823] rounded-lg shadow-lg overflow-hidden">
          {currentStep === 1 && (
            <div>
              <Button
                className="flex items-center space-x-2 w-full justify-center py-6 bg-transparent hover:bg-[#232331] transition-colors"
                onClick={() => setCurrentStep(2)}
              >
                <GitHubLogoIcon color="white" className="mr-2" />
                <span className="text-white">Deploy from GitHub repo</span>
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Select a repository to deploy
                  </h2>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentStep(1)}
                  >
                    <Cross2Icon className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                  placeholder="Search repo..."
                  className="mb-2"
                />

                {isLoading ? (
                  <Loader />
                ) : error ? (
                  <div className="text-red-500 text-center">
                    {error.message}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredRepos && filteredRepos.length > 0 ? (
                      filteredRepos.map((repo:any) => (
                        <Button
                          key={repo.id}
                          className="w-full justify-between text-left bg-[#232331] hover:bg-[#2C2C3A] transition-colors"
                          onClick={() => {
                            setCurrentStep(3);
                            setRepoSelected({
                              id: repo.id,
                              name: repo.name,
                              url: repo.html_url,
                            });
                          }}
                        >
                          <span className="truncate text-white">
                            {repo.name}
                          </span>
                          {repo.private && (
                            <span className="text-xs bg-gray-300 px-2 py-1 rounded ml-2">
                              Private
                            </span>
                          )}
                        </Button>
                      ))
                    ) : (
                      <div className="text-gray-400 text-center">
                        No repositories found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Almost done</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCurrentStep(1);
                      setRepoSelected(null);
                    }}
                  >
                    <Cross2Icon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col space-y-4">
                  <Input
                    onChange={(e) => setProjectName(e.target.value)}
                    value={projectName}
                    placeholder="Give your project a name"
                  />
                  <span
                    className={`text-[12px] ${
                      !isValidProjectName(projectName)
                        ? "text-red-500"
                        : "text-slate-600"
                    }`}
                  >
                    Project name must contain only lowercase characters and numbers without spaces
                  </span>
                  <Button
                    disabled={isProjectCreating}
                    className="w-full  transition-colors"
                    onClick={handleCreateProject}
                  >
                    {isProjectCreating ? (
                      <Loader sm />
                    ) : (
                      <span>Create Project</span>
                    )}
                  </Button>

                  {projectCreateError && (
                    <span className="text-red-500 text-center">
                      {projectCreateError}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default New;
