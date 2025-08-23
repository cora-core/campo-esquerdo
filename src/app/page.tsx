"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import AnimatedArrows from "./BGArrows";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { span } from "framer-motion/client";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
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
    const handleSobreScroll = () => {};

    const sobreContainer = sobreContainerRef.current;
    if (sobreContainer) {
      sobreContainer.addEventListener('scroll', handleSobreScroll);
    }
    
    return () => {
      if (sobreContainer) {
        sobreContainer.removeEventListener('scroll', handleSobreScroll);
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

  const getBorderColorValue = () => {
    const match = border.match(/border-\[(#.*)\]/);
    return match ? match[1] : '#9fce98';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedArrows />
      <div className={`font-ui-gothic flex items-center border min-h-[10vh] pl-2 text-[3rem] ${text} ${border}`}>
  CAMPO ESQUERDO 2025 MAM-RJ
</div>      <div className="flex flex-1 relative">
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
          <div className={`flex-1 p-2 min-h-[80vh] border-l ${text} ${border}`}>
            <span></span>
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
            className="overflow-y-auto"
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
              <div className={`text-sm min-h-[80vh] max-h-[80vh]  ${text}`}><span className="mb-2 pl-2">Campo Esquerdo é uma plataforma cultural que fomenta a experimentação de novas estéticas, modos de produção e experiências nos campos da arte sonora, musical e do corpo. Ao desenhar estruturas que permitam a criação conjunta entre perspectivas humanas, artefatuais, digitais e de outros seres vivos sem estabelecer hierarquias, Campo Esquerdo promove “Tecnologias”, no plural. Dicotomias entre arte/tecnologia, show/festa, pista/casa, dança /inércia, coletividade/individualidade não tem lugar aqui, exceto se desmontadas e recombinadas em configurações irreconhecíveis. </span>
                <br  /><div className="h-4" />
<span className="pl-2">
O prefixo musical “left-field”, literalmente, e como sátira, Campo Esquerdo, indica variantes expandidas, singulares, ou “edgy”, de um certo gênero musical. E indo um pouco além na interpretação, não é exatamente o fazer experimental, que hoje existe em categorias demasiadamente solidificadas para justificar o uso do nome. O “Campo Esquerdo” é, simplesmente, o abraço, a estranheza. Pode ser música/performance esquisita, que existe apenas porque somos quem somos, em nossas inconformidades; ou o fazer artístico que deseja um mundo xenomorfo, com as regras que corpos dissidentes, mentes divergentes, possam existir sem a opressão da norma. Ainda, a curiosidade cientifiao de observar o que acontece quando há combinações, permutações de tecnologias ainda não experimentadas. Campo esquerdo não é um evento de música experimental, é alternativa cultural que promove novos formatos musicais, e propõe outros parâmetros para relações que se formam em experiências multidisciplinares. </span> <br  /><div className="h-4" />
<div id="praxis" className={` text-sm ${text}`}>
                <span className="text-base pl-2">Práxis</span><br  /><div className="h-4" />
<span className="pl-2">Em sua concepção inicial, campo esquerdo tomou forma de um evento num formato que combina elementos da cultura da música eletrônica: com construções musicais continuas em um espaço de suspensão do tempo, e de livre movimento (club/rave); da música ambiente, escuta profunda, mimetizando a proposta bares de escuta hi-fi japoneses; e da música experimental: onde sons, silêncio e acaso se encontram para desafiar as tradições musicais convencionais e abrir novas possibilidades de composição musical. </span>
<span>Assim, manifestou-se pela primeira vez, em um “espaço efêmero de escuta ininterrupta” focado em shows de música eletrônica left-field e performances na interseção entre corpo, tecnologia digital e som. Entre as apresentações, houve momentos de mediação, DJ sets como colagem sonoras, evitando quebras não intencionais ou mudanças bruscas de atmosfera entre as apresentações. A mediação existe como elemento fundamental da experiência, pois acreditamos que a cultura DJ, a pessoa DJ, em suas origens, é capaz de criar sentido entre distintas estéticas, e grupos sociais, permitindo que seja criado tanto um ambiente conciso, fluido, assim como prepara o solo para que as artistas autorais se sintam confortáveis de ousar ao máximo em suas apresentações.  </span><br  /><div className="h-4" />
<span className="pl-2">O formato de experiência de escuta dá o conjunto de valores do projeto, mas não é um fim em si próprio. Nos meses após a primeira edição, surgiram questões criticas como: como dar continuidade a essas experiências de forma alinhada a esses valores? Publico, gratuito, horizontal, inovador, dissidente, (estranho). Quais são as condições dignas para alcançar um estado de fluxo coletivo, capaz de transformar o projeto conforme as necessidades do que o compõe? Como uma tentativa de respondê-las, Campo Esquerdo toma uma nova forma. O que chamamos de Campo Esquerdo Fase II.</span>


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
                  <>
                    <p className={`mt-4 ${text}`}>Scroll down to see the drawer open gradually.</p>
                    <div className={`h-[200vh] mt-4 flex items-center justify-center ${text}`}>
                      <p>Keep scrolling...</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
