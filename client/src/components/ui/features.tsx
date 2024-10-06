import { cn } from "@/lib/utils";
import {
  Rocket,
  Server,
  GitBranch,
  ClipboardCheck,
  TrendingUp,
  ShieldCheck,
  RefreshCcw,
  UserCheck,
} from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Effortless Deployment",
      description:
        "Deploy your React applications with just a few clicks, no DevOps expertise required.",
      icon: <Rocket />,
    },
    {
      title: "GitHub Integration",
      description:
        "Seamlessly connect your GitHub repositories, select branches, and deploy instantly.",
      icon: <GitBranch />,
    },
    {
      title: "Real-time Build Logs",
      description:
        "Monitor your deployments in real-time with live logs directly from the build container.",
      icon: <Server />,
    },
    {
      title: "Customizable Build Commands",
      description:
        "Run custom install and build commands, giving you full control over the deployment process.",
      icon: <ClipboardCheck />,
    },
    {
      title: "Scalable Infrastructure",
      description:
        "Powered by AWS, ensuring scalability, reliability, and performance under any load.",
      icon: <TrendingUp />,
    },
    {
      title: "Security First",
      description:
        "Encrypted connections and secure AWS architecture protect your deployments and data.",
      icon: <ShieldCheck />,
    },
    {
      title: "100% Uptime",
      description:
        "With distributed architecture and robust infrastructure, we ensure maximum uptime.",
      icon: <RefreshCcw />,
    },
    {
      title: "Visitor Analytics",
      description:
        "Track user trends and geolocation data to gain insights into your app's performance.",
      icon: <UserCheck />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
