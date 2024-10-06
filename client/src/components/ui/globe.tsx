import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";

export function GlobeContainer() {
  const features = [
    {
      title: "Global Content Delivery with AWS CloudFront",
      description:
        "Leverage AWS CloudFront's extensive network of edge locations to deliver your content with ultra-low latency and high transfer speeds to users worldwide.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-1 border-b lg:border-none",
    },
  ];
  
  return (
    <div className="relative z-20 max-w-7xl mx-auto">
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-1 mt-12 xl:border rounded-md dark:border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="lg:w-1/2">
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </div>
                <div className="lg:w-1/2 h-[400px] relative">
                  {feature.skeleton}
                </div>
              </div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto",
        "text-neutral-500 font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-full w-full flex items-center justify-center relative bg-transparent dark:bg-transparent ">
      <Globe className="w-full h-full" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 7,
      baseColor: [0.1, 0.16, 0.23],
      markerColor: [0, 1, 0],
      glowColor: [0, 0.3, 0.6],
      markers: [
        { location: [37.7749, -122.4194], size: 0.03 },
        { location: [40.7128, -74.0060], size: 0.03 }, 
        { location: [51.5074, -0.1278], size: 0.03 },  // London
        { location: [35.6762, 139.6503], size: 0.03 }, // Tokyo
        { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
        { location: [19.0760, 72.8777], size: 0.03 },  // Mumbai
        { location: [-23.5505, -46.6333], size: 0.03 }, // São Paulo
        { location: [52.5200, 13.4050], size: 0.03 },  // Berlin
        { location: [1.3521, 103.8198], size: 0.03 },  // Singapore
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        maxWidth: "100%",
        aspectRatio: 1
      }}
      className={className}
    />
  );
};