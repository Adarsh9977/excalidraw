'use client'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    content:
      "This whiteboard tool has transformed how our team brainstorms ideas. The hand-drawn style gives our diagrams a personal touch that clients love.",
    author: "Sarah Johnson",
    role: "Product Manager at Acme Inc.",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    content:
      "I use this for my UX wireframes and it's perfect. The collaborative features mean I can work with clients in real-time, even when we're remote.",
    author: "Michael Chen",
    role: "UX Designer at DesignCraft",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
  },
  {
    content:
      "As a teacher, this has been invaluable for my virtual classroom. The students love the interactive nature and it makes learning more engaging.",
    author: "Emily Torres",
    role: "High School Computer Science Teacher",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-24 bg-white overflow-hidden dark:bg-gradient-to-b dark:from-violet-900/50 dark:to-violet-900/90">
      <div className="container mx-auto px-4 relative">
        <div className="absolute top-0 left-0 -translate-x-1/2 translate-y-1/2">
          <div className="w-72 h-72 bg-violet-100 rounded-full opacity-30 blur-3xl"></div>
        </div>
        
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            What our users say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of teams already sketching together
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-accent rounded-xl p-8 md:p-12 shadow-lg border border-gray-100 dark:border-accent/10"
            >
              <div className="text-violet-500 mb-6">
                <Quote size={40} />
              </div>
              
              <p className="text-xl md:text-2xl text-gray-700 dark:text-primary italic mb-8">
                "{testimonials[currentIndex].content}"
              </p>
              
              <div className="flex items-center">
                <div className="mr-4">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].author}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-violet-400">{testimonials[currentIndex].author}</p>
                  <p className="text-gray-600 dark:text-gray-400">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? "bg-violet-600" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrow navigation */}
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;