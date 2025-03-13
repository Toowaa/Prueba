import { Button } from "@heroui/react";
import { motion } from "framer-motion";
export const Textver1 = ({ setText }: { setText: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className="relative">
      
      <Button         onPress={() => setText(false)} // Actualizar el estado al hacer clic
        className="absolute top-0 right-0 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-bold py-2 px-4 rounded-full hover:shadow-xl hover:shadow-pink-500 m-4">
        See other Style
      </Button>

     
      <section className="grid h-screen place-content-center gap-2 bg-green-300 text-black">
        <FlipLink href="https://github.com/Toowaa">GitHub</FlipLink>
        <FlipLink href="https://www.linkedin.com/in/brahanbonilla/">Linkedln</FlipLink>
        <FlipLink href="mailto:brahanbonilla@gmail.com/">Gmail</FlipLink>
        <FlipLink href="https://drive.google.com/file/d/1UMDeXWUUV0VzqySmlfc2IWXSLfXe-XJS/view?usp=sharing">Curriculum</FlipLink>
      </section>
    </div>
  );
};

const DURATION = 0.25;
const STAGGER = 0.050;

const FlipLink = ({ children, href }: { children: string; href: string }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl"
      style={{
        lineHeight: 0.75,
      }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
              },
              hovered: {
                y: "-110%",
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: "100%",
              },
              hovered: {
                y: 0,
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};