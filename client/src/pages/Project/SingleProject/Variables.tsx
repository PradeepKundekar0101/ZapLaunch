import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Project } from "@/types/data";
import { useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { toast } from "@/hooks/use-toast";

const Variables = ({ project }: { project: Project }) => {
  const { projectId } = useParams();
  const api = useAxios();
  const [variables, setVariables] = useState<
    Array<{ key: string; value: string }>
  >(() => {
    try {
      return (
        JSON.parse(typeof project?.env === "string" ? project.env : "[]") || []
      );
    } catch (error) {
      return [];
    }
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateEnv"],
    mutationFn: async () => {
      return await api.put("/project/env/" + projectId, {
        env: JSON.stringify(variables),
        projectId,
      });
    },
    onSuccess: (data) => {
      console.log(data);
      toast({
        title:
          "Updated environment variable, please redeploy the project to see the changes",
        variant: "default",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({ title: "Failed to update", variant: "destructive" });
    },
  });
  useEffect(() => {
    if (project.env) {
      setVariables(JSON.parse(project.env));
    }
  }, [project]);

  const addVariable = () => {
    setVariables([...variables, { key: "", value: "" }]);
  };

  const updateVariable = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedVariables = variables.map((variable, i) =>
      i === index ? { ...variable, [field]: value } : variable
    );
    setVariables(updatedVariables);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const saveVariables = () => {
    mutate();
  };

  return (
    <Card className="w-full  ">
      <div className=" text-white p-4 rounded-lg">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-semibold"> Environment Variables</h2>
        </div>
      </div>

      <div className="p-4">
        {
          variables.length===0 && <h1 className="text-slate-300">No Variables found</h1>
        }
        {variables.map((variable, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <Input
              placeholder="Key"
              value={variable.key}
              onChange={(e) => updateVariable(index, "key", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              value={variable.value}
              onChange={(e) => updateVariable(index, "value", e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeVariable(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="mt-4 space-x-2">
          <Button onClick={addVariable}>Add Entry</Button>
          <Button
            disabled={isPending}
            onClick={saveVariables}
            variant="outline"
          >
            {isPending ? (
              <span>
                <h1>Saving changes...</h1>
              </span>
            ) : (
              <h1>Save Changes</h1>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Variables;
