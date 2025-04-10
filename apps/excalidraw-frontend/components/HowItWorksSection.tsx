'use client'
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Create a whiteboard",
    description:
      "Start with a blank canvas or choose one of our templates. Name your whiteboard and set permissions.",
  },
  {
    number: "02",
    title: "Invite collaborators",
    description:
      "Generate a link and share it with your team. Decide who can view or edit your whiteboard.",
  },
  {
    number: "03",
    title: "Sketch together",
    description:
      "Draw, add shapes, write notes, and create diagrams in real-time. See who's working on what part.",
  },
  {
    number: "04",
    title: "Export and share",
    description:
      "Export your finished whiteboard as an image or PDF. Share it with stakeholders or embed in documents.",
  },
];

interface StepItemProps {
  number: string;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
}

const StepItem = ({ number, title, description, isActive, isCompleted }: StepItemProps) => {
  return (
    <motion.div
      className={cn(
        "relative pl-14 pb-8",
        isCompleted ? "text-gray-800 dark:text-primary" : isActive ? "text-gray-900 dark:text-primary" : "text-gray-800 dark:text-primary"
      )}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Step number or check icon */}
      <div className="absolute left-0 top-0">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold",
            isCompleted
              ? "bg-violet-600 border-violet-600 text-white"
              : isActive
              ? "border-violet-600 text-violet-600"
              : "border-gray-500 text-gray-500"
          )}
        >
          {isCompleted ? <Check className="h-5 w-5" /> : number}
        </div>
      </div>
      
      {/* Vertical line connecting steps */}
      {number !== "04" && (
        <div
          className={cn(
            "absolute left-5 top-10 w-0.5 h-full -ml-px",
            isCompleted ? "bg-violet-600" : "bg-gray-400"
          )}
        />
      )}
      
      {/* Step content */}
      <h3 className={cn(
        "text-xl font-bold mb-2",
        isCompleted || isActive ? "" : "text-gray-700 dark:text-primary"
      )}>
        {title}
      </h3>
      <p className={cn(
        "text-base",
        isCompleted ? "text-gray-600 dark:text-primary" : isActive ? "text-gray-600 dark:text-primary" : "text-gray-500 dark:text-primary"
      )}>
        {description}
      </p>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  // For demo purposes, let's say steps 1-2 are completed, step 3 is active
  return (
    <section className="py-24 bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-700">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-primary"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              How it works
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 dark:text-primary"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Get started in minutes, no complicated setup required
            </motion.p>
          </div>
          
          <div className="space-y-2">
            {steps.map((step, index) => (
              <StepItem
                key={step.number}
                {...step}
                isActive={index === 2}
                isCompleted={index < 2}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;