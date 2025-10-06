"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import AnimatedArrows from "./BGArrows";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import BouncingText from "@/components/BouncingText";
import StickyWrapper from "@/components/StickyWrapper";
import { SimpleCalendar } from "@/components/SimpleCalendar";

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
  const eventosRef = useRef<HTMLDivElement>(null);
  const { text, border, bg } = useThemeClasses();

  // Track manual open state to prevent auto-close
  const manualOpenRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / (windowHeight * 0.5), 1);
      setScrollProgress(progress);

      // Only auto-open/close if not manually controlled
      if (!manualOpenRef.current) {
        if (progress > 0.3 && !isOpen) {
          controls.start("open");
        } else if (progress <= 0.3 && isOpen) {
          controls.start("closed");
        }
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
    manualOpenRef.current = true;
    setIsOpen(true);
  };

  const openSite = () => {
    manualOpenRef.current = true;
    setIsOpen(false);
  };

  const getBorderColorValue = () => {
    const match = border.match(/border-\[(#.*)\]/);
    return match ? match[1] : "#000000ff";
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

  /* ——— MOBILE stuff ——— */
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnimatedArrows />
        <div className={`font-ui-gothic top-0 border-b border-t flex items-center min-h-[5vh] text-lg pl-2 bg-white ${text} ${border}`}>
          CAMPO ESQUERDO
        </div>

        {/* SITE (top) */}
        <div id="site" className="flex flex-col border-l border-r">
          <div className={`p-2 min-h-[76vh] ${text}`} style={{ height: '40vh' }}>
            <BouncingText isMobile={true} />
          </div>
        </div>

        {/* SOBRE (below) */}
        <div>
          <div className={`font-ui-gothic sticky top-0 border-b border-t flex items-center min-h-[5vh] text-lg pl-2 bg-white ${text} ${border}`}>
            SOBRE
          </div>

          <div ref={sobreContainerRef} className="font-msgothic leading-[16px] overflow-y-auto bg-white ">
            <div>
              <div className={`font-msgothic leading-[16px] overflow-y-auto bg-white ${text}`}>
                <span className="mb-2 pl-2">
                  <br /> Campo Esquerdo é uma plataforma cultural que fomenta a experimentação de novas estéticas, modos de produção e experiências nos campos da arte sonora, musical e do corpo. Ao desenhar estruturas que permitam a criação conjunta entre perspectivas humanas, artefatuais, digitais e de outros seres vivos sem estabelecer hierarquias, Campo Esquerdo promove "Tecnologias", no plural. Dicotomias entre arte/tecnologia, show/festa, pista/casa, dança /inércia, coletividade/individualidade não tem lugar aqui, exceto se desmontadas e recombinadas em configurações irreconhecíveis.
                </span>
                <br />
                <div className="h-4" />
                <span className="pl-2">
                  O prefixo musical "left-field", literalmente, e como sátira, Campo Esquerdo, indica variantes expandidas, singulares, ou "edgy", de um certo gênero musical. E indo um pouco além na interpretação, não é exatamente o fazer experimental, que hoje existe em categorias demasiadamente solidificadas para justificar o uso do nome. O "Campo Esquerdo" é, simplesmente, o abraço, a estranheza. Pode ser música/performance esquisita, que existe apenas porque somos quem somos, em nossas inconformidades; ou o fazer artístico que deseja um mundo xenomorfo, com as regras que corpos dissidentes, mentes divergentes, possam existir sem a opressão da norma. Ainda, a curiosidade cientifiao de observar o que acontece quando há combinações, permutações de tecnologias ainda não experimentadas. Campo esquerdo não é um evento de música experimental, é alternativa cultural que promove novos formatos musicais, e propõe outros parâmetros para relações que se formam em experiências multidisciplinares.
                </span>
                <br />
                <div className="h-4" />
                <div id="praxis" className={` font-msgothic leading-[16px] overflow-y-auto bg-white  ${text}`}>
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
                    O formato de experiência de escuta dá o conjunto de valores do projeto, mas não é um fim em si próprio. Nos meses após a primeira edição, surgiram questões criticas como: como dar continuidade a essas experiências de forma alinhada a esses valores? Publico, gratuito, horizontal, inovador, dissidente, (estranho). Quais são as condições dignas para alcançar um estado de fluxo coletivo, capaz de transformar o projeto conforme as necessidades delo que o compõe? Como uma tentativa de respondê-las, Campo Esquerdo toma uma nova forma. O que chamamos de Campo Esquerdo Fase II. <br />
                    <br /></span>
                </div>
              </div>

              <div className="relative">
                <div
                  ref={mentoriasRef}
                  className={`font-msgothic sticky top-0 border-b border-t flex items-center min-h-[5vh] text-lg pl-2 ${bg} z-10 ${text} ${border}`}
                >
                  CAMPO ESQUERDO FASE II
                </div>

                <div className="flex flex-col">


                  <div className={`font-msgothic leading-[16px] overflow-y-auto bg-white ${text}`}>
                    <span className="mb-2 pl-2">  <br /> Campo Esquerdo busca abrir espaços e criar estruturas porque acreditamos que para que floresçam novas linguagens artísticas e experiências, é necessário proporcionar condições materiais que permitam que isso aconteça. Mesmo que haja circunstâncias que estejam muito além do alcance de um projeto de nicho, pensamos que o formato mínimo viável para a sua continuidade, com um impacto alinhado a seus valores, contém: eventos públicos gratuitos recorrentes (cultura como direito), autonomia técnica e de equipamentos (sistema de som próprio), e uma comunidade engajada e dignamente compensada. Por isso, em vez de seguir realizando eventos com cobrança de ingressos (o que delegaria a responsabilidade do financiamento ao público), seguimos uma via mais paciente.    </span>
                    <br /><div className="h-4" />
                    <span className="pl-2">
                      Por meio de fundos da Lei Aldir Blanc, e em parceria com o MAM-Rio, A Fase II, busca criar a estrutura necessária para dar continuidade ao campo esquerdo por meio de quatro passos:  </span> <br />  <br />
                    <span className="pl-2"> 1-Residência artística semipresencial com chamada aberta para artistas sonoras e do corpo, com acompanhamento das artistas que fizeram parte das interações passadas do projeto.  <br />  <br />
                      <span className="pl-2"> 2-Ciclo de Seminários e Oficinas abertos ao público no Museu de Arte Moderna do Rio de Janeiro com artistas e pesquisadores, convidados. </span>  <br /> <br />
                      <span className="pl-2"> 3-Construção de um sistema de som que será usado nas próximas manifestações do projeto </span>  <br /> <br />
                      <span className="pl-2"> 4-Apresentação dos trabalhos dos artistas selecionados na residência artística numa experiência de escuta aos moldes do primeiro Campo Esquerdo em 2023: "Espaço efêmero de escuta ininterrupta".  </span>  <br /> <br /></span>
                  </div>
                  <div className="font-msgothic text-sm max-w-[80vh] px-4 py-6 text-[21px] leading-[16px] mt-8 text-center mx-auto">
                    <p className="mb-4">
                      Para fazer parte da residência, inscreva-se na chamada aberta aqui:
                    </p>
                    <div className="mb-4 flex justify-center">
                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfAlhyPX9oKMl6cMtd9-Ka9T_sC8cSqvdqmq9AXpiiNu5T1UA/viewform?usp=dialog"
                        target="_blank"
                        rel="noopener noreferrer"
                      >  <br />
                        <img src="/inscrevabutton.png" alt="Inscreva-se" className="w-full max-w-[200px]" />  <br />
                      </a>
                    </div>
                    <p>
                      Se não deseja ou não possa participar da residência, porém tem interesse de contribuir voluntariamente para o projeto, escreva um email para: <a href="mailto:campo.esquerdo@gmail.com" className="underline">campo.esquerdo@gmail.com</a>
                    </p>
                  </div>

                </div>


              </div>

              {/* EVENTOS Section for Mobile */}
              <div className="relative">
                <div
                  ref={eventosRef}
                  className={`font-msgothic sticky top-0 border-b border-t flex items-center min-h-[5vh] text-lg pl-2 ${bg} z-10 ${text} ${border}`}
                >
                  EVENTOS
                </div>

                <div className=" bg-white">
                  <SimpleCalendar />
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
      <div className={`font-ui-gothic flex items-center border min-h-[10vh] pl-2 text-[3rem] 2xl:text-[6rem] bg-white overflow-hidden ${text} ${border}`}>
        CAMPO
        <img src="/logo.png" alt="icon" className="ml-2 h-[1em] w-auto" />
        ESQUERDO
        <img src="/logo.png" alt="icon" className="ml-2 h-[1em] w-auto" />
        CAMPO
        <img src="/logo.png" alt="icon" className="ml-2 h-[1em] w-auto" />
        ESQUERDO
        <img src="/logo.png" alt="icon" className="ml-2 h-[1em] w-auto" />
        CAMPO
        <img src="/logo.png" alt="icon" className="ml-2 h-[1em] w-auto" />
        ESQUERDO
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
          <div className={`items-center border-b border-l min-h-[5vh] max-h-[5vh] pl-2 text-lg flex items-center bg-white ${text} ${border}`}>
            <span><img src="/logo.png" alt="icon" className="ml-2 h-[1.5em] w-auto" /></span>
          </div>
          <div id="sitespace" className={`flex-1 p-2 min-h-[80vh] border-l ${text} ${border}`} style={{ height: '80vh' }}>
            <BouncingText isMobile={false} />
          </div>
          <div className={`border-t border-l border-b min-h-[5vh] pl-2 flex items-center bg-white ${text} ${border}`}></div>
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
          <div className={`font-msgothic border-b pl-2 min-h-[5vh] flex items-center text-[clamp(16px,1.46vw,3rem)] leading-[16px] ${text} ${border}`}>
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
            style={{ height: 'calc(100% - 5vh)', backgroundColor: 'rgba(255, 255, 255, 1)' }}

          >
            <motion.div
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 45,
                mass: 1
              }}
            >

              <div className={`font-msgothic text-sm min-h-[80vh] max-h-[80vh] min-w-[152vh] min-w-mbp13 min-w-mba13 text-mbp13 text-mba13 laptop1600 desktop1920 ultrawide2560 columns-2 gap-8 px-4 py-6 text-[21px] leading-[16px] ${text}`}>


                <span className="mb-2 pl-2"> Campo Esquerdo é uma plataforma cultural que fomenta novas estéticas, modos de produção e experiências nos campos da arte sonora, musical e do corpo. Ao desenhar estruturas que permitam co-criação a partir de perspectivas humanas, técnicas e de outros seres vivos, sem hierarquias, Campo Esquerdo promove "tecnologias", no plural. Dicotomias como arte/tecnologia, show/festa, dança/inércia, coletividade/individualidade não têm lugar aqui, exceto se desmontadas e recombinadas em configurações irreconhecíveis.  </span>
                <br /><div className="h-4" />



                <span className="pl-2">
                  O prefixo musical <span className="italic">left-field</span> literalmente, e como sátira, Campo Esquerdo, indica variantes expandidas, singulares, ou "edgy", de um certo gênero musical. E indo um pouco além na interpretação, não é exatamente o fazer experimental, que hoje muitas vezes existe em categorias demasiadamente solidificadas para justificar o uso do termo. O "Campo Esquerdo" é, simplesmente, o abraço à estranheza. Pode ser música/performance esquisita, que toma essa característica apenas por ser quem somos, em nossas inconformidades; ou o fazer artístico que deseja construir um mundo xenomorfo, com as regras que corpos dissidentes, mentes divergentes, possam existir sem a opressão da norma. Ou ainda, a curiosidade científica de observar o que acontece quando há permutações de tecnologias ainda não experimentadas. Campo esquerdo não é um evento de música experimental, é uma frente cultural que promove novos formatos sonoros, e propõe outros parâmetros para relações imanentes nas experiências multidisciplinares.  </span> <br /><div className="h-4" />

                <span className="pl-2"><br /><br /><br /><br /><br /><br /><br /><br />Práxis</span><br /><div className="h-4" />
                <span className="pl-2">Em sua concepção inicial, Campo Esquerdo  tomou a forma de um evento que combina múltiplos elementos da cultura da música eletrônica: suspensões espaço-temporais através de tensionamentos do gênero club/rave  construções musicais contínuas em um espaço de suspensão do tempo, e de livre movimento (club/rave); música ambiente e escuta profunda, mimetizando a proposta espaços de escuta hi-fi; e, sobretudo, da música experimental, onde sons, silêncio e acaso se encontram para desafiar as tradições musicais convencionais, e abre novas possibilidades de composição musical.  </span>
                <span>A partir desses parâmetros, manifesta-se um espaço efêmero de escuta ininterrupta focado em shows de música eletrônica left-field e performances na interseção entre corpo, tecnologia digital e som. Entre as apresentações, houve momentos de mediação e DJ sets como colagens sonoras, evitando quebras não intencionais ou mudanças bruscas de atmosfera. A mediação existe como elemento fundamental da experiência, pois acreditamos que a cultura DJ (e a pessoa DJ) em suas origens, é capaz de criar sentido entre distintas estéticas e grupos sociais, permitindo que seja criado tanto um ambiente conciso, fluido, como um solo para que as artistas autorais se sintam confortáveis em ousar ao máximo em suas apresentações.    </span><br />
                <div className="h-4" />
                <span className="pl-2">O formato de experiência de escuta dá o conjunto de valores do projeto, mas não é um fim em si próprio. Nos meses após a primeira edição, surgiram questões críticas como: como dar continuidade a essas experiências de forma alinhada a esses valores? Público, gratuito, horizontal, inovador, dissidente, estranho. Quais são as condições dignas para alcançar um estado de fluxo coletivo, capaz de transformar o projeto conforme as necessidades do que o compõe? Como uma tentativa de respondê-las, Campo Esquerdo toma uma nova forma. O que chamamos de Campo Esquerdo Fase II.</span>

              </div>

              <div className="relative">
                <StickyWrapper><div
                  ref={mentoriasRef}
                  className={`font-msgothic text-[clamp(21px,1.46vw,3rem)] leading-[16px] sticky top-0 border-b border-t flex items-center min-w-[50vh] max-w-auto min-h-[5vh] max-h-[10vh] pl-2 ${bg} z-10 ${text} ${border} sticky-border-transparent`}
                >
                  CAMPO ESQUERDO FASE II
                </div>  </StickyWrapper>

                {isOpen && (
                  <div className="flex h-full" style={{ height: 'calc(100vh - 15vh)' }}>
                    <div className="flex flex-col">

                      <div className={`font-msgothic text-sm  min-w-[152vh] min-w-mbp13 min-w-mba13 text-mbp13 text-mba13 laptop1600 desktop1920 ultrawide2560 columns-2 gap-8 px-4 py-6 text-[21px] leading-[16px] ${text}`}>
                        <span className="mb-2 pl-2"> Campo Esquerdo busca abrir espaços e criar estruturas porque acreditamos que para que floresçam novas linguagens artísticas e experiências, é necessário proporcionar condições materiais que permitam que isso aconteça. Mesmo que haja circunstâncias que estejam muito além do alcance de um projeto de nicho, pensamos que o formato mínimo viável para a sua continuidade, com um impacto alinhado a seus valores, contém: eventos públicos gratuitos recorrentes (cultura como direito), autonomia técnica e de equipamentos (sistema de som próprio), e uma comunidade engajada e dignamente compensada. Por isso, em vez de seguir realizando eventos com cobrança de ingressos (o que delegaria a responsabilidade do financiamento ao público), seguimos uma via mais paciente.    </span>
                        <br /><div className="h-4" />
                        <span className="pl-2">
                          Por meio de fundos da Lei Aldir Blanc, e em parceria com o MAM-Rio, A Fase II, busca criar a estrutura necessária para dar continuidade ao campo esquerdo por meio de quatro passos:  </span> <br />  <br />
                        <span className="pl-2"> 1 - Residência artística semipresencial com chamada aberta para artistas sonoras e do corpo, com acompanhamento das artistas que fizeram parte das interações passadas do projeto.  <br />  <br />
                          <span className="pl-2"> 2 - Ciclo de Seminários e Oficinas abertos ao público no Museu de Arte Moderna do Rio de Janeiro com artistas e pesquisadores, convidados. </span>  <br /> <br />
                          <span className="pl-2"> 3 - Construção de um sistema de som que será usado nas próximas manifestações do projeto </span>  <br /> <br />
                          <span className="pl-2"> 4 - Apresentação dos trabalhos dos artistas selecionados na residência artística numa experiência de escuta aos moldes do primeiro Campo Esquerdo em 2023: "Espaço efêmero de escuta ininterrupta".  </span>  <br /> <br /></span>
                      </div>
                      <div className="font-msgothic text-sm max-w-[80vh] px-4 py-6 text-[21px] leading-[16px] min-w-mbp13 min-w-mba13 text-mbp13 text-mba13 laptop1600 desktop1920 ultrawide2560 mt-8  mx-auto">
                        <p className="mb-4 flex justify-center">
                          Para fazer parte da residência, inscreva-se na chamada aberta aqui:
                        </p>
                        <div className="mb-4 flex justify-center">
                          <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSfAlhyPX9oKMl6cMtd9-Ka9T_sC8cSqvdqmq9AXpiiNu5T1UA/viewform?usp=dialog"
                            target="_blank"
                            rel="noopener noreferrer"
                          >  <br />
                            <img src="/inscrevabutton.png" alt="Inscreva-se" className="w-full max-w-[200px]" />  <br />
                          </a>
                        </div>
                        <div className="mb-4 mx-auto justify-center max-w-[80vh]">
                          Se não deseja ou não possa participar da residência, porém tem interesse de contribuir voluntariamente para o projeto, escreva um email para: <a href="mailto:campo.esquerdo@gmail.com" className="underline">campo.esquerdo@gmail.com</a> </div>

                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* EVENTOS Section for Desktop */}
              <div className="relative">
                <StickyWrapper>
                  <div
                    ref={eventosRef}
                    className={`font-msgothic text-[clamp(21px,1.46vw,3rem)] leading-[16px] sticky top-0 border-b border-t flex items-center min-w-[50vh] max-w-auto min-h-[5vh] max-h-[10vh] pl-2 ${bg} z-10 ${text} ${border} sticky-border-transparent`}
                  >
                    EVENTOS
                  </div>
                </StickyWrapper>

                {isOpen && (
                  <div className="p-6 bg-white">
                    <SimpleCalendar />
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
