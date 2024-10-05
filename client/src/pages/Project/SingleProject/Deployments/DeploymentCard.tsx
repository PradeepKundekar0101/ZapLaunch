import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Deployment } from "@/types/data";
import { getStatusColor } from "@/utils/getStatusColor";

const DeploymentCard = ({
  deployment,
  handleViewLogs,
}: {
  deployment: Deployment;
  handleViewLogs: any;
}) => {
  return (
    <Card>
      <div key={deployment?.id} className=" p-3 rounded-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span
              className={`font-medium ${getStatusColor(deployment?.status)}`}
            >
              {deployment?.status?.toUpperCase()}
            </span>
            <span className="text-sm">
              {deployment?.title || deployment?.id}
            </span>
          </div>
          <div className="flex items-center ">
            <Button
              className="p-0"
              variant="ghost"
              size="sm"
              onClick={() => handleViewLogs(deployment?.id)}
            >
              View logs
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {new Date(deployment?.createdAt).toLocaleString()} via GitHub
        </div>
      </div>
    </Card>
  );
};

export default DeploymentCard;
