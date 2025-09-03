"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import AnimatedArrows from "./BGArrows";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import BouncingText from "@/components/BouncingText";

/* Simple breakpoint hook (md: 768px) */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

export default function Home() {
  const isMobile = useIsMobile(768);

  /* ——— general stuff ——— */
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openColumns, setOpenColumns] = useState([false, false, false, false, false]);
  const [openRows, setOpenRows] = useState([false, false, false, false, false]);
  const controls = useAnimation();
  const sobreContainerRef = useRef<HTMLDivElement>(null);
  const mentoriasRef = useRef<HTMLDivElement>(null);
  const { text, border, bg } = useThemeClasses();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / (windowHeight * 0.5), 1);
      setScrollProgress(progress);

      if (progress > 0.3 && !isOpen) {
        controls.start("open");
      } else if (progress <= 0.3 && isOpen) {
        controls.start("closed");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, controls]);

  useEffect(() => {
    const handleSobreScroll = () => { };

    const sobreContainer = sobreContainerRef.current;
    if (sobreContainer) {
      sobreContainer.addEventListener("scroll", handleSobreScroll);
    }

    return () => {
      if (sobreContainer) {
        sobreContainer.removeEventListener("scroll", handleSobreScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      controls.start("open");
    } else {
      controls.start("closed");
    }
  }, [isOpen, controls]);

  const openSobre = () => {
    setIsOpen(true);
  };

  const openSite = () => {
    setIsOpen(false);
  };

  const toggleColumn = (index: number) => {
    const newOpenColumns = [...openColumns];
    newOpenColumns[index] = !newOpenColumns[index];
    setOpenColumns(newOpenColumns);
  };

  const toggleRow = (index: number) => {
    const newOpenRows = [...openRows];
    newOpenRows[index] = !newOpenRows[index];
    setOpenRows(newOpenRows);
  };

  const getBorderColorValue = () => {
    const match = border.match(/border-\[(#.*)\]/);
    return match ? match[1] : "#9fce98";
  };

  /* ——— MOBILE stuff ——— */
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnimatedArrows />
        <div className={`font-ui-gothic flex items-center border min-h-[10vh] pl-2 text-[3rem] ${text} ${border}`}>
          CAMPO ESQUERDO 2025 MAM-RJ
        </div>

        {/* SITE (top) */}
        <div id="site" className="flex flex-col border-l border-r">
          <div className={`items-center border-b min-h-[5vh] pl-2 text-lg flex items-center ${text} ${border}`} onClick={openSite}>
            <span>SITE</span>
          </div>
          <div className={`p-2 min-h-[40vh] ${text}`} style={{ height: '40vh' }}>
            {/* Pass isMobile prop to BouncingText */}
            <BouncingText isMobile={true} />
          </div>
          <div className={`border-t min-h-[5vh] pl-2 flex items-center ${text} ${border}`}></div>
        </div>

        {/* SOBRE (below) */}
        <div id="sobre" className={`flex flex-col border-t ${text} ${border}`} onClick={openSobre}>
          <div className={`border-b pl-2 min-h-[5vh] flex items-center text-lg ${text} ${border}`}>
            SOBRE
          </div>

          <div ref={sobreContainerRef} className="overflow-y-auto">
            <div>
              <div className={`text-sm ${text}`}>
                <span className="mb-2 pl-2">
                  Campo Esquerdo é uma plataforma cultural que fomenta a experimentação de novas estéticas, modos de produção e experiências nos campos da arte sonora, musical e do corpo. Ao desenhar estruturas que permitam a criação conjunta entre perspectivas humanas, artefatuais, digitais e de outros seres vivos sem estabelecer hierarquias, Campo Esquerdo promove "Tecnologias", no plural. Dicotomias entre arte/tecnologia, show/festa, pista/casa, dança /inércia, coletividade/individualidade não tem lugar aqui, exceto se desmontadas e recombinadas em configurações irreconhecíveis.
                </span>
                <br />
                <div className="h-4" />
                <span className="pl-2">
                  O prefixo musical "left-field", literalmente, e como sátira, Campo Esquerdo, indica variantes expandidas, singulares, ou "edgy", de um certo gênero musical. E indo um pouco além na interpretação, não é exatamente o fazer experimental, que hoje existe em categorias demasiadamente solidificadas para justificar o uso do nome. O "Campo Esquerdo" é, simplesmente, o abraço, a estranheza. Pode ser música/performance esquisita, que existe apenas porque somos quem somos, em nossas inconformidades; ou o fazer artístico que deseja um mundo xenomorfo, com as regras que corpos dissidentes, mentes divergentes, possam existir sem a opressão da norma. Ainda, a curiosidade cientifiao de observar o que acontece quando há combinações, permutações de tecnologias ainda não experimentadas. Campo esquerdo não é um evento de música experimental, é alternativa cultural que promove novos formatos musicais, e propõe outros parâmetros para relações que se formam em experiências multidisciplinares.
                </span>
                <br />
                <div className="h-4" />
                <div id="praxis" className={` text-sm ${text}`}>
                  <span className="text-base pl-2">Práxis</span>
                  <br />
                  <div className="h-4" />
                  <span className="pl-2">
                    Em sua concepção inicial, campo esquerdo tomou forma de um evento num formato que combina elementos da cultura da música eletrônica: com construções musicais continuas em um espaço de suspensão do tempo, e de livre movimento (club/rave); da música ambiente, escuta profunda, mimetizando a proposta bares de escuta hi-fi japoneses; e da música experimental: onde sons, silêncio e acaso se encontram para desafiar as tradições musicais convencionais e abrir novas possibilidades de composição musical.
                  </span>
                  <span>
                    Assim, manifestou-se pela primeira vez, em um "espaço efêmero de escuta ininterrupta" focado em shows de música eletrônica left-field e performances na interseção entre corpo, tecnologia digital e som. Entre as apresentações, houve momentos de mediação, DJ sets como colagem sonoras, evitando quebras não intencionais ou mudanças bruscas de atmosfera entre as apresentações. A mediação existe como elemento fundamental da experiência, pois acreditamos que a cultura DJ, a pessoa DJ, em suas origens, é capaz de criar sentido entre distintas estéticas, e grupos sociais, permitindo que seja criado tanto um ambiente conciso, fluido, assim como prepara o solo para que as artistas autorais se sintam confortáveis de ousar ao máximo em suas apresentações.
                  </span>
                  <br />
                  <div className="h-4" />
                  <span className="pl-2">
                    O formato de experiência de escuta dá o conjunto de valores do projeto, mas não é um fim em si próprio. Nos meses após a primeira edição, surgiram questões criticas como: como dar continuidade a essas experiências de forma alinhada a esses valores? Publico, gratuito, horizontal, inovador, dissidente, (estranho). Quais são as condições dignas para alcançar um estado de fluxo coletivo, capaz de transformar o projeto conforme as necessidades delo que o compõe? Como uma tentativa de respondê-las, Campo Esquerdo toma uma nova forma. O que chamamos de Campo Esquerdo Fase II.
                  </span>
                </div>
              </div>

              <div className="relative">
                <div
                  ref={mentoriasRef}
                  className={`sticky top-0 border-b border-t flex items-center min-h-[5vh] text-lg pl-2 ${bg} z-10 ${text} ${border}`}
                >
                  CAMPO ESQUERDO FASE II
                </div>

                {/* Mobile rows for FASE II */}
                <div className="flex flex-col">
                  {/* Mari Herzer Row */}
                  <motion.div
                    className={`border-b ${text} cursor-pointer relative overflow-hidden`}
                    onClick={() => toggleRow(0)}
                    initial={false}
                    animate={{ height: openRows[0] ? "auto" : "3rem" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="flex h-12 items-center justify-between px-4">
                      <span className="whitespace-nowrap">MARI HERZER</span>
                    </div>
                    <AnimatePresence>
                      {openRows[0] && (
                        <motion.div
                          className="px-4 pb-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-gray-200 h-48 w-full mb-4 flex items-center justify-center">
                            Image Placeholder
                          </div>
                          <p className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Kaloan Row */}
                  <motion.div
                    className={`border-b ${text} cursor-pointer relative overflow-hidden`}
                    onClick={() => toggleRow(1)}
                    initial={false}
                    animate={{ height: openRows[1] ? "auto" : "3rem" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="flex h-12 items-center justify-between px-4">
                      <span className="whitespace-nowrap">KALOAN</span>
                    </div>
                    <AnimatePresence>
                      {openRows[1] && (
                        <motion.div
                          className="px-4 pb-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-gray-200 h-48 w-full mb-4 flex items-center justify-center">
                            Image Placeholder
                          </div>
                          <p className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Valesuchi Row */}
                  <motion.div
                    className={`border-b ${text} cursor-pointer relative overflow-hidden`}
                    onClick={() => toggleRow(2)}
                    initial={false}
                    animate={{ height: openRows[2] ? "auto" : "3rem" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="flex h-12 items-center justify-between px-4">
                      <span className="whitespace-nowrap">VALESUCHI</span>
                    </div>
                    <AnimatePresence>
                      {openRows[2] && (
                        <motion.div
                          className="px-4 pb-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-gray-200 h-48 w-full mb-4 flex items-center justify-center">
                            Image Placeholder
                          </div>
                          <p className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Capetini Row */}
                  <motion.div
                    className={`border-b ${text} cursor-pointer relative overflow-hidden`}
                    onClick={() => toggleRow(3)}
                    initial={false}
                    animate={{ height: openRows[3] ? "auto" : "3rem" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="flex h-12 items-center justify-between px-4">
                      <span className="whitespace-nowrap">CAPETINI</span>
                    </div>
                    <AnimatePresence>
                      {openRows[3] && (
                        <motion.div
                          className="px-4 pb-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-gray-200 h-48 w-full mb-4 flex items-center justify-center">
                            Image Placeholder
                          </div>
                          <p className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Numa Gama Row */}
                  <motion.div
                    className={`border-b ${text} cursor-pointer relative overflow-hidden`}
                    onClick={() => toggleRow(4)}
                    initial={false}
                    animate={{ height: openRows[4] ? "auto" : "3rem" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="flex h-12 items-center justify-between px-4">
                      <span className="whitespace-nowrap">NUMA GAMA</span>
                    </div>
                    <AnimatePresence>
                      {openRows[4] && (
                        <motion.div
                          className="px-4 pb-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-gray-200 h-48 w-full mb-4 flex items-center justify-center">
                            Image Placeholder
                          </div>
                          <p className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ——— DESKTOP LAYOUT ——— */
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedArrows />
      <div className={`font-ui-gothic flex items-center border min-h-[10vh] pl-2 text-[3rem] ${text} ${border}`}>
        CAMPO ESQUERDO 2025 MAM-RJ / MUSEU DE ARTE MODERNA
      </div>
      <div className="flex flex-1 relative">
        <div
          id="site"
          className="flex flex-col transition-all duration-500"
          style={{
            width: isOpen ? "15%" : "85%"
          }}
          onClick={openSite}
        >
          <div className={`items-center border-b border-l min-h-[5vh] pl-2 text-lg flex items-center ${text} ${border}`}>
            <span>SITE</span>
          </div>
          <div id="sitespace" className={`flex-1 p-2 min-h-[80vh] border-l ${text} ${border}`} style={{ height: '80vh' }}>
            {/* Pass isMobile prop to BouncingText */}
            <BouncingText isMobile={false} />
          </div>
          <div className={`border-t border-l border-b min-h-[5vh] pl-2 flex items-center ${text} ${border}`}></div>
        </div>

        <motion.div
          id="sobre"
          className="flex flex-col absolute right-0 top-0 h-full border-l"
          style={{ borderLeftColor: getBorderColorValue() }}
          initial="closed"
          animate={controls}
          variants={{
            open: { width: "85%" },
            closed: { width: "15%" }
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 1
          }}
          onClick={openSobre}
        >
          <div className={`border-b pl-2 min-h-[5vh] flex items-center text-lg  ${text} ${border}`}>
            <motion.span
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 1
              }}
            >
              SOBRE
            </motion.span>
          </div>

          <div
            ref={sobreContainerRef}
            className={isOpen ? "overflow-y-auto" : "overflow-hidden"}
            style={{ height: 'calc(100% - 5vh)' }}
          >
            <motion.div
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 1
              }}
            >
              <div className={`text-sm min-h-[80vh] max-h-[80vh]  ${text}`}><span className="mb-2 pl-2">Campo Esquerdo é uma plataforma cultural que fomenta a experimentação de novas estéticas, modos de produção e experiências nos campos da arte sonora, musical e do corpo. Ao desenhar estruturas que permitam a criação conjunta entre perspectivas humanas, artefatuais, digitais e de outros seres vivos sem estabelecer hierarquias, Campo Esquerdo promove "Tecnologias", no plural. Dicotomias entre arte/tecnologia, show/festa, pista/casa, dança /inércia, coletividade/individualidade não tem lugar aqui, exceto se desmontadas e recombinadas em configurações irreconhecíveis. </span>
                <br /><div className="h-4" />
                <span className="pl-2">
                  O prefixo musical "left-field", literalmente, e como sátira, Campo Esquerdo, indicates variantes expandidas, singulares, ou "edgy", de um certo gênero musical. E indo um pouco além na interpretação, não é exatamente o fazer experimental, que hoje exists em categorias demasiadamente solidificadas para justificar o uso do nome. O "Campo Esquerdo" é, simplesmente, o abraço, a estranheza. Pode ser música/performance esquisita, que existe apenas porque somos quem somos, em nossas inconformidades; ou o fazer artístico que deseja um mundo xenomorfo, com as regras que corpos dissidentes, mentes divergentes, possam existir sem a opressão da norma. Ainda, a curiosidade cientifiao de observar o que acontece quando há combinações, permutações de tecnologias ainda não experimentadas. Campo esquerdo não é um evento de música experimental, é alternativa cultural que promove novos formatos musicais, e propõe outros parâmetros para relações que se formam em experiências multidisciplinares. </span> <br /><div className="h-4" />
                <div id="praxis" className={` text-sm ${text}`}>
                  <span className="text-base pl-2">Práxis</span><br /><div className="h-4" />
                  <span className="pl-2">Em sua concepção inicial, campo esquerdo tomou forma de um evento num formato que combina elementos da cultura da música eletrônica: com construções musicais continuas em um espaço de suspensão do tempo, e de livre movimento (club/rave); da música ambiente, escuta profunda, mimetizando a proposta bares de escuta hi-fi japoneses; e da música experimental: onde sons, silêncio и acaso se encontram para desafiar as tradições musicais convencionais e abrir novas possibilidades de composição musical. </span>
                  <span>Assim, manifestou-se pela primeira vez, em um "espaço efêmero de escuta ininterrupta" focado em shows de música eletrônica left-field e performances na interseção entre corpo, tecnologia digital e som. Entre as apresentações, houve momentos de mediação, DJ sets como colagem sonoras, evitando quebras não intencionais ou mudanças bruscas de atmosfera entre as apresentações. A mediação existe como elemento fundamental da experiência, pois acreditamos que a cultura DJ, a pessoa DJ, em suas origens, é capaz de criar sentido entre distintas estéticas, e grupos sociais, permitindo que seja criado tanto um ambiente conciso, fluido, assim como prepara o solo para que as artistas autorais se sintam confortáveis de ousar ao máximo em suas apresentações.  </span><br /><div className="h-4" />
                  <span className="pl-2">O formato de experiência de escuta dá o conjunto de valores do projeto, mas não é um fim em si próprio. Nos meses após a primeira edição, surgiram questões criticas como: como dar continuidade a essas experiências de forma alinhada a esses valores? Publico, gratuito, horizontal, inovador, dissidente, (estranho). Quais são as condições dignas para alcançar um estado de fluxo coletivo, capable de transformar o projeto conforme as necessidades delo que o compõe? Como uma tentativa de respondê-las, Campo Esquerdo toma uma nova forma. O que chamamos de Campo Esquerdo Fase II.</span>
                </div>
              </div>

<div className="relative">
  <div 
    ref={mentoriasRef}
    className={`sticky top-0 border-b border-t flex items-center min-h-[5vh] text-lg pl-2 ${bg} z-10 ${text} ${border}`}
  >
    CAMPO ESQUERDO FASE II
  </div>

  {isOpen && (
    <div className="flex h-full" style={{ height: 'calc(100vh - 15vh)' }}>
      {/* Names column container - now using flex-row for side-by-side layout */}
      <div className="flex flex-row h-full w-full">
        {/* Mari Herzer Column */}
        <motion.div
          className={`border-r h-full flex flex-col ${text} cursor-pointer relative overflow-hidden`}
          onClick={() => {
            const newOpenColumns = [false, false, false, false, false];
            newOpenColumns[0] = !openColumns[0];
            setOpenColumns(newOpenColumns);
          }}
          initial={false}
          animate={{ width: openColumns[0] ? "20rem" : "4rem" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex h-full pt-6 justify-start">
            <div className="flex items-start justify-center" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
              <span className="whitespace-nowrap">MARI HERZER</span>
            </div>
          </div>
          <AnimatePresence>
            {openColumns[0] && (
              <motion.div
                className="absolute left-16 top-0 bottom-0 right-0 flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <div className="flex-1 p-4 overflow-hidden">
                  <div className="bg-gray-200 h-48 w-full mb-4 flex items-center justify-center">
                    Image Placeholder
                  </div>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Kaloan Column */}
        <motion.div
          className={`border-r h-full flex flex-col ${text} cursor-pointer relative overflow-hidden`}
          onClick={() => {
            const newOpenColumns = [false, false, false, false, false];
            newOpenColumns[1] = !openColumns[1];
            setOpenColumns(newOpenColumns);
          }}
          initial={false}
          animate={{ width: openColumns[1] ? "20rem" : "4rem" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex h-full pt-6 justify-start">
            <div className="flex items-start justify-center" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
              <span className="whitespace-nowrap">KALOAN</span>
            </div>
          </div>
          <AnimatePresence>
            {openColumns[1] && (
              <motion.div
                className="absolute left-16 top-0 bottom-0 right-0 flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <div className="flex-1 p-4 overflow-hidden">
                  <div className="bg-gray-200 h-48 w-full mb-4 flex items-center justify-center">
                    Image Placeholder
                  </div>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Valesuchi Column */}
        <motion.div
          className={`border-r h-full flex flex-col ${text} cursor-pointer relative overflow-hidden`}
          onClick={() => {
            const newOpenColumns = [false, false, false, false, false];
            newOpenColumns[2] = !openColumns[2];
            setOpenColumns(newOpenColumns);
          }}
          initial={false}
          animate={{ width: openColumns[2] ? "20rem" : "4rem" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex h-full pt-6 justify-start">
            <div className="flex items-start justify-center" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
              <span className="whitespace-nowrap">VALESUCHI</span>
            </div>
          </div>
          <AnimatePresence>
            {openColumns[2] && (
              <motion.div
                className="absolute left-16 top-0 bottom-0 right-0 flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <div className="flex-1 p-4 overflow-hidden">
                  <div className="bg-gray-200 h-48 w-full mb-4 flex items-center justify-center">
                    Image Placeholder
                  </div>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Capetini Column */}
        <motion.div
          className={`border-r h-full flex flex-col ${text} cursor-pointer relative overflow-hidden`}
          onClick={() => {
            const newOpenColumns = [false, false, false, false, false];
            newOpenColumns[3] = !openColumns[3];
            setOpenColumns(newOpenColumns);
          }}
          initial={false}
          animate={{ width: openColumns[3] ? "20rem" : "4rem" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex h-full pt-6 justify-start">
            <div className="flex items-start justify-center" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
              <span className="whitespace-nowrap">CAPETINI</span>
            </div>
          </div>
          <AnimatePresence>
            {openColumns[3] && (
              <motion.div
                className="absolute left-16 top-0 bottom-0 right-0 flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <div className="flex-1 p-4 overflow-hidden">
                  <div className="bg-gray-200 h-48 w-full mb-4 flex items-center justify-center">
                    Image Placeholder
                  </div>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Numa Gama Column */}
        <motion.div
          className={`border-r h-full flex flex-col ${text} cursor-pointer relative overflow-hidden`}
          onClick={() => {
            const newOpenColumns = [false, false, false, false, false];
            newOpenColumns[4] = !openColumns[4];
            setOpenColumns(newOpenColumns);
          }}
          initial={false}
          animate={{ width: openColumns[4] ? "20rem" : "4rem" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex h-full pt-6 justify-start">
            <div className="flex items-start justify-center" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
              <span className="whitespace-nowrap">NUMA GAMA</span>
            </div>
          </div>
          <AnimatePresence>
            {openColumns[4] && (
              <motion.div
                className="absolute left-16 top-0 bottom-0 right-0 flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <div className="flex-1 p-4 overflow-hidden">
                  <div className="bg-gray-200 h-48 w-full mb-4 flex items-center justify-center">
                    Image Placeholder
                  </div>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )}
</div>
              
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
