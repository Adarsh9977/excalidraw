'use client'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Sparkles, Palette } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BackgroundCircle {
  width: number;
  height: number;
  left: string;
  top: string;
}

const HeroSection = ({ token }: { token: string | undefined }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [backgroundCircles, setBackgroundCircles] = useState<BackgroundCircle[]>(
    [...Array(6)].map(() => ({
      width: 50,
      height: 50,
      left: '0%',
      top: '0%'
    }))
  );
  const router = useRouter();

  useEffect(() => {
    setBackgroundCircles(
      [...Array(6)].map(() => ({
        width: Math.random() * 300 + 50,
        height: Math.random() * 300 + 50,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }))
    );
  }, []);

  return (
    <div className="relative overflow-hidden bg-black py-12 lg:py-24 flex items-center justify-center">
      <Image
        src="https://res.cloudinary.com/dwfqmux0y/image/upload/v1757872061/Hero_Gradients_003_u292xl.png"
        alt="image"
        fill
        className="absolute inset-0 object-center object-bottom"
        priority
      />
      {/* Animated background elements */}
      {/* <div className="absolute inset-0 overflow-hidden opacity-80 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-300"
            style={{
              width: backgroundCircles[i].width,
              height: backgroundCircles[i].height,
              left: backgroundCircles[i].left,
              top: backgroundCircles[i].top
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 0.4,
              x: 0,
              y: 0,
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.5,
            }}
          />
        ))}
      </div> */}

      <div className="container mx-auto px-4 relative z-10 ">
        <div className="flex flex-col lg:flex-row items-center gap-12 w-full">
          <div className="flex flex-col text-center items-center justify-center  space-y-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 border border-[#202020] text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Sparkles size={16} className="animate-pulse" />
                Collaborative Drawing Made Simple
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white tracking-tighter">
                Sketch ideas together,{" "}
                <span className="text-[#0b7d53]">Beautifully</span>
              </h1>
              <p className="mt-6 text-lg leading-tight text-balance text-gray-600 dark:text-primary">
                A virtual whiteboard that gives your diagrams a natural, hand-drawn feel.
                Collaborate in real-time and bring your ideas to life with our intuitive sketching tool.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap flex-col items-center justify-center gap-10 pt-4 "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                size="lg"
                className=" text-white rounded-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => {
                  if (token) {
                    router.push('/dashboard');
                  } else {
                    router.push('/signin');
                  }
                }}
              >
                Start Sketching
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Button>
              <div className="p-3 lg:p-6 rounded-3xl border bg-neutral-900/20 backdrop-blur-2xl backdrop-saturation-200 w-full lg:w-[1000px] lg:h-[550px] relative [box-shadow:0_-20px_160px_0_#126759]">
                <Image
                  src="https://res.cloudinary.com/dwfqmux0y/image/upload/v1757872247/hero-image_yndsk9.png"
                  alt="image"
                  width={1000}
                  height={400}
                  className="w-full h-full"
                  priority
                />
              </div>
            </motion.div>

          </div>


        </div>

      </div>
    </div>
  );
};

export default HeroSection;