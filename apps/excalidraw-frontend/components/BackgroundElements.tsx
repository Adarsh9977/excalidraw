import { motion } from "framer-motion";

// Helper function to get random number between min and max
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

// Create a background element with randomized properties
const Element = ({ index }: { index: number }) => {
  const size = random(40, 200);
  const xPos = random(0, 100);
  const yPos = random(0, 100);
  const duration = random(20, 40);
  const delay = index * 0.5;
  
  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-violet-200/20 to-blue-200/20"
      style={{
        width: size,
        height: size,
        left: `${xPos}%`,
        top: `${yPos}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 0.3,
        x: random(-50, 50),
        y: random(-50, 50),
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        delay,
      }}
    ></motion.div>
  );
};

export const BackgroundElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <Element key={i} index={i} />
      ))}
    </div>
  );
};

// Export both as named and default export
export { BackgroundElements as default };
