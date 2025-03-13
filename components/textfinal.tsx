import { Button } from "@heroui/react";
import { useMotionValue, motion, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

export const Letras = ({
  setText,
}: {
  setText: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="relative">
      <Button
        onPress={() => setText(true)} // Actualizar el estado al hacer clic
        className="absolute top-0 right-0 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white font-bold py-2 px-4 rounded-full hover:shadow-xl hover:shadow-pink-500 m-4"
      >
        See other Style
      </Button>

      <section className=" h-screen place-content-center bg-[#F7F9F7] items-center text-[#000000]">
        <div className="mx-auto max-w-5xl px-16 md:px-0">
          <Link
            heading="GitHub"
            subheading="Explore my projects and contributions"
            imgSrc="links/git.webp"
            href="https://github.com/Toowaa"
          />
          <Link
            heading="LinkedIn"
            subheading="Connect with me professionally"
            imgSrc="links/linked.webp"
            href="https://www.linkedin.com/in/brahanbonilla"
          />
          <Link
            heading="Gmail Direct"
            subheading="Let's collaborate—reach out!"
            imgSrc="links/correo.webp"
            href="mailto:brahanbonilla@gmail.com"
          />
          <Link
            heading="Curriculum"
            subheading="Discover my experience and skills"
            imgSrc="links/curri.webp"
            href="https://drive.google.com/file/d/1UMDeXWUUV0VzqySmlfc2IWXSLfXe-XJS/view?usp=sharing"
          />
        </div>
      </section>
    </div>
  );
};

const Link = ({
  heading,
  imgSrc,
  subheading,
  href,
}: {
  heading: string;
  imgSrc: string;
  subheading: string;
  href: string;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "70%"]);

  const handleMouseMove = (e: React.MouseEvent): void => {
    if (!ref.current) return; // Verifica que el ref no sea null
  
    const rect = ref.current?.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
  
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
  
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
  
    x.set(xPct);
    y.set(yPct);
  };
  
  return (
    <motion.a
      href={href}
      ref={ref}
      onMouseMove={handleMouseMove}
      initial="initial"
      whileHover="whileHover"
      className="group relative items-center justify-between  py-4 transition-colors duration-500  md:py-8"
    >
      <div>
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -26 },
          }}
          transition={{
            type: "spring",
            staggerChildren: 0.075,
            delayChildren: 0.25,
          }}
          className="relative z-10 block text-4xl font-bold text- transition-colors duration-500 group-hover:text-[#C5283D] md:text-6xl"
        >
          {heading.split("").map((l, i) => (
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: 16 },
              }}
              transition={{ type: "spring" }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          ))}
        </motion.span>
        <span className="relative z-10 mt-2 block text-base text-neutral-500 transition-colors duration-500 group-hover:text-neutral-50">
          {subheading}
        </span>
      </div>

      <motion.img
        style={{
          top,
          left,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={{
          initial: { scale: 0, rotate: "-12.5deg" },
          whileHover: { scale: 1, rotate: "12.5deg" },
        }}
        transition={{ type: "spring" }}
        src={imgSrc}
        className="absolute z-0 h-24 w-32 rounded-lg object-cover md:h-48 md:w-64"
        alt={`Image representing a link for ${heading}`}
      />
    </motion.a>
  );
};
