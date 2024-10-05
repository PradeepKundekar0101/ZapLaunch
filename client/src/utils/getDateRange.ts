import { Project } from "@/types/data";
import moment from "moment";

export const getDateRange = (timePeriod:string,project:Project) => {
    const today = moment().toISOString(); 
    switch (timePeriod) {
      case "lastYear":
        return { from: moment().subtract(1, "year").toISOString(), to: today };
      case "lastMonth":
        return { from: moment().subtract(30, "days").toISOString(), to: today };
      case "lastWeek":
        return { from: moment().subtract(7, "days").toISOString(), to: today };
      case "lastDay":
        return { from: moment().subtract(1, "day").toISOString(), to: today };
      case "overall":
      default:
        return { from: moment(project.createdAt).add(-1, "day").toISOString(), to: today };
    }
  };
  