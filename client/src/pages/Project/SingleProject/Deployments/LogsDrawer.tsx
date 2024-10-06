import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import Loader from "@/components/ui/loader";
import { formatLogs } from "@/utils/formatLogs";
import { getStatusColor } from "@/utils/getStatusColor";
import Confetti from "react-confetti";

const LogsDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  showConfetti,
  selectedDeploymentId,
  currentDeploymentId,
  currentDeploymentStatus,
  deploymentStatus,
  currentDeploymentLogs,
  logContainerRef,
  logs,
}: any) => {
  const [elapsedTime, setElapsedTime] = useState(0); // State to track elapsed time

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    // Start the timer if the status is not "FAILED" or "DEPLOYED"
    if (
      currentDeploymentStatus &&
      currentDeploymentStatus !== "FAILED" &&
      currentDeploymentStatus !== "DEPLOYED"
    ) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      // Stop the timer if deployment is finished
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentDeploymentStatus]);

  // Format the elapsed time in hh:mm:ss
  const formatElapsedTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent>
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
            recycle={false}
          />
        )}
        <DrawerHeader>
          <DrawerTitle>Deployment Logs</DrawerTitle>
          <DrawerDescription>
            Logs for deployment {selectedDeploymentId}
            {selectedDeploymentId === currentDeploymentId ? (
              currentDeploymentStatus && (
                <div className="flex items-center space-x-1">
                  <span className={`${getStatusColor(currentDeploymentStatus)}`}>
                    Status: {currentDeploymentStatus}
                  </span>
                  {currentDeploymentStatus !== "FAILED" &&
                    currentDeploymentStatus !== "DEPLOYED" && (
                      <>
                        <Loader sm />
                        <span>{formatElapsedTime(elapsedTime)}</span> {/* Timer */}
                      </>
                    )}
                </div>
              )
            ) : (
              <div className="flex items-center space-x-1">
                <span className={` ${getStatusColor(deploymentStatus)}`}>
                  Status: {deploymentStatus}
                </span>
                {deploymentStatus !== "FAILED" &&
                  deploymentStatus !== "DEPLOYED" && (
                    <>
                      <Loader sm />
                      <span>{formatElapsedTime(elapsedTime)}</span> {/* Timer */}
                    </>
                  )}
              </div>
            )}
          </DrawerDescription>
        </DrawerHeader>
        <div ref={logContainerRef} className="p-4 h-[60vh] overflow-auto">
          {selectedDeploymentId === currentDeploymentId ? (
            <pre className="whitespace-pre-wrap text-sm">
              {currentDeploymentLogs.length > 0
                ? formatLogs(currentDeploymentLogs)
                : "No logs available"}
            </pre>
          ) : (
            <pre className="whitespace-pre-wrap text-sm">
              {logs.length > 0 ? formatLogs(logs) : "No logs available"}
            </pre>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default LogsDrawer;
