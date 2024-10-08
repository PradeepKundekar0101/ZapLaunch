import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const FaqAccordion = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className=" text-xl font-normal">
           What is ZapLaunch?
        </AccordionTrigger>
        <AccordionContent className=" text-left text-xl font-thin">
          ZapLaunch is a platform that lets you deploy your React applications
          from GitHub repositories in just a few clicks, with real-time log
          tracking and seamless cloud integration.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className=" text-xl font-normal">
          How does real-time logging work?
        </AccordionTrigger>
        <AccordionContent className=" text-left text-xl font-thin">
          Our platform streams your build logs in real-time using Redis Pub/Sub.
          The logs are also saved in Cassandra for future reference, so you can
          always check back for troubleshooting.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3" className=" text-xl font-normal">
        <AccordionTrigger className=" text-xl font-normal">
           Can I track visitor analytics for my
          deployed app?
        </AccordionTrigger>
        <AccordionContent className=" text-left text-xl font-thin">
          Yes! ZapLaunch provides visitor trends and geolocation data, giving
          you insights into where your app's users are coming from and how they
          interact with your site.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger className=" text-xl font-normal">
           What AWS services are integrated?
        </AccordionTrigger>
        <AccordionContent className=" text-left text-xl font-thin">
          ZapLaunch integrates with AWS SQS, ECS, Lambda, S3, and CloudFront
          to provide a scalable and efficient deployment solution for your React
          apps.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5">
        <AccordionTrigger className=" text-xl font-normal">
         Is ZapLaunch secure?
        </AccordionTrigger>
        <AccordionContent className=" text-left text-xl font-thin">
          Absolutely. All deployments use secure AWS infrastructure, and data in
          transit is encrypted. We ensure that your code and deployment are
          protected at every step.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FaqAccordion;
