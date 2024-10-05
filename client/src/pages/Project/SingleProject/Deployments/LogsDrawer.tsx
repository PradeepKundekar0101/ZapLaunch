import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import Loader from '@/components/ui/loader';
import { formatLogs } from '@/utils/formatLogs'
import { getStatusColor } from '@/utils/getStatusColor'

import Confetti from "react-confetti";



const LogsDrawer = ({isDrawerOpen,setIsDrawerOpen,showConfetti,selectedDeploymentId,currentDeploymentId,currentDeploymentStatus,deploymentStatus,currentDeploymentLogs,logContainerRef,logs}:any) => {
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
                <span
                  className={` ${getStatusColor(
                    currentDeploymentStatus
                  )}`}
                >
                  Status: {currentDeploymentStatus}
                </span>
                {currentDeploymentStatus !== "FAILED" &&
                  currentDeploymentStatus !== "DEPLOYED" && <Loader sm />}
              </div>
            )
          ) : (
            <div className="flex items-center space-x-1">
              <span className={` ${getStatusColor(deploymentStatus)}`}>
                Status: {deploymentStatus}
              </span>
              {deploymentStatus !== "FAILED" &&
                deploymentStatus !== "DEPLOYED" && <Loader sm />}
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
  )
}

export default LogsDrawer