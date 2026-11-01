"use client"
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import AnimatedArrows from "./BGArrows";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import BouncingText from "@/components/BouncingText";
import StickyWrapper from "@/components/StickyWrapper";
import { ContentHub } from "@/components/ContentHub";
import { BlogOverlay } from "./BlogOverlay";
import { SoundSystemOverlay } from "./SoundSystemOverlay";
import { SobreOverlay } from "./SobreOverlay";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Blogbutton from "@/components/Blogbutton";
import { useContentHub } from "@/contexts/ContentHubContext";
import EmailSignup from "@/components/EmailSignup";




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
  const pathname =usePathname()
  const isBlogOpen = pathname === '/blog'
  const isSoundSystemOpen = pathname === '/soundsystem'
  const isSobreOpen = pathname === '/sobre'
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openColumns, setOpenColumns] = useState([false, false, false, false, false]);
  const [openRows, setOpenRows] = useState([false, false, false, false, false]);
  const controls = useAnimation();
  const sobreContainerRef = useRef<HTMLDivElement>(null);
  const mentoriasRef = useRef<HTMLDivElement>(null);
  const eventosRef = useRef<HTMLDivElement>(null);
  const { text, border, bg } = useThemeClasses();
  const { openContentHub } = useContentHub();
  const [isEmailOpen, setIsEmailOpen] = useState(false);

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
        <AnimatedArrows slow={isOpen}/>

        <Link
            type="button"
            href="/blog"
            className="absolute tick-stroke size-animation left-2 top-1/2 z-2 px-2 py-2 font-msgothic uppercase"
          >
           
          </Link>

        <div className={`font-ui-gothic top-0 flex border-1 items-center min-h-[5vh] text-2xl bg-white ${text} marquee-container`}>
        
          <div className=" flex-shrink-0 flex items-center min-h-[5vh] text-2xl pl-2 ${bg} z-10 ${text} ${border}">
            <span className="marquee-content inline-flex items-center">
              CAMPO<img src="/logo.png" alt="icon" className="ml-1 mr-1 h-[1em] w-auto inline" />ESQUERDO<img src="/logo.png" alt="icon" className="ml-1 mr-1 h-[1em] w-auto inline" />CAMPO<img src="/logo.png" alt="icon" className="ml-1 mr-1 h-[1em] w-auto inline" />ESQUERDO<img src="/logo.png" alt="icon" className="ml-1 mr-1 h-[1em] w-auto inline" />CAMPO<img src="/logo.png" alt="icon" className="ml-1 mr-1 h-[1em] w-auto inline" />ESQUERDO<img src="/logo.png" alt="icon" className="ml-1 mr-1 h-[1em] w-auto inline" />CAMPO<img src="/logo.png" alt="icon" className="ml-1 mr-1 h-[1em] w-auto inline" />ESQUERDO<img src="/logo.png" alt="icon" className="ml-1 mr-1 h-[1em] w-auto inline" />
            </span>
           
          </div>
        </div>

       
        {/* Mobile top bar */}
        <div className={`flex border-l border-r border-b bg-white ${border}`}>
          <Link href="/sobre" className={`font-msgothic flex-1 border-r inline-flex items-center justify-center whitespace-nowrap min-h-[5vh] px-2 text-xl uppercase bg-white transition hover:bg-black hover:text-white ${text} ${border}`}>
            SOBRE
          </Link>
          <Link href="/soundsystem" className={`font-msgothic flex-1 inline-flex items-center justify-center whitespace-nowrap min-h-[5vh] px-2 text-xl uppercase bg-white transition hover:bg-black hover:text-white ${text} ${border}`}>
            SOUND SYSTEM
          </Link>
        </div>

        <div id="site" className="flex flex-col border-l border-r">
          <div className={`p-2 min-h-[72vh] ${text}`} style={{ height: '40vh' }}>
            <Blogbutton isMobile={true} /> 
          </div> 


        </div>


       
        {/* Mobile bottom bar */}
        <div className={`flex border-l border-r border-t bg-white ${border}`}>
          <Link href="/blog" className={`font-msgothic flex-1 border-r inline-flex items-center justify-center whitespace-nowrap min-h-[5vh] px-2 text-xl uppercase bg-white transition hover:bg-black hover:text-white ${text} ${border}`}>
            ESCRITOS
          </Link>
          <button type="button" onClick={() => setIsEmailOpen(true)} className={`font-msgothic flex-1 inline-flex items-center justify-center whitespace-nowrap min-h-[5vh] px-2 text-xl uppercase bg-white transition hover:bg-black hover:text-white ${text} ${border}`}>
            NEWSLETTER
          </button>
        </div>

        <div className="relative">
          <div
            ref={eventosRef}
            className={`font-msgothic overflow-hidden sticky sticky-border-transparent top-0 border-b border-t flex items-center min-h-[5vh] text-2xl pl-2 ${bg} z-10 ${text} ${border}`}
          >
             <div className="marquee-content flex-shrink-0">INFOS + INFOS + INFOS + INFOS + INFOS + INFOS + INFOS + INFOS +  </div>
          </div>

          <div className="bg-white mobile-no-padding">
            <ContentHub />
          </div>
        </div>

        
        <BlogOverlay showBlog={isBlogOpen} />
        <SoundSystemOverlay showSoundSystem={isSoundSystemOpen} />
        <SobreOverlay showSobre={isSobreOpen} />
        <EmailSignup isOpen={isEmailOpen} onClose={() => setIsEmailOpen(false)} />
      </div>
    );
  }

  /* ——— DESKTOP LAYOUT ——— */
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedArrows slow={isOpen}/>
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
          <div className={`items-center border-b border-l min-h-[5vh] max-h-[5vh] pl-2 text-lg flex bg-white ${text} ${border}`}>
            <span><img src="/logo.png" alt="icon" className="ml-2 h-[1.5em] w-auto" /></span>
          </div>
          <div id="sitespace" className={`flex-1 min-h-[80vh] border-l ${text} ${border}`} style={{ height: '80vh' }}>
            <BouncingText isMobile={false} />

          </div>
          <div className={`border-t border-l border-b min-h-[5vh] flex bg-white ${text} ${border}`}>
            <Link
              type="button"
              href="/blog"
              className="font-msgothic flex-1 inline-flex items-center justify-center whitespace-nowrap border-l-1 bg-transparent text-[clamp(16px,1.46vw,3rem)] uppercase transition hover:bg-black hover:text-white"
            >
              ESCRITOS
            </Link>
            <Link
              type="button"
              href="/soundsystem"
              className="font-msgothic flex-1 inline-flex items-center justify-center whitespace-nowrap border-l-1 bg-transparent text-[clamp(16px,1.46vw,3rem)] uppercase transition hover:bg-black hover:text-white"
            >
              SOUND SYSTEM
            </Link>
            <button
              type="button"
              onClick={() => openContentHub('calendar')}
              className="font-msgothic flex-1 inline-flex items-center justify-center whitespace-nowrap border-l-1 bg-transparent text-[clamp(16px,1.46vw,3rem)] uppercase transition hover:bg-black hover:text-white"
            >
              CALENDÁRIO
            </button>
            <button
              type="button"
              onClick={() => setIsEmailOpen(true)}
              className="font-msgothic flex-1 inline-flex items-center justify-center whitespace-nowrap border-l-1 bg-transparent text-[clamp(16px,1.46vw,3rem)] uppercase transition hover:bg-black hover:text-white"
            >
              NEWSLETTER
            </button>
          </div>
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

              <div className={`sobre-text-container min-h-[80vh] max-h-[80vh] ${text}`}>


                <p className="mb-4 pl-2">Campo Esquerdo é uma protocoletividade que fomenta novas estéticas, modos de produção e experiências nos campos da arte sonora, musical e do corpo. Ao desenhar infra_estruturas que permitam co-criação a partir de perspectivas humanas, técnicas e de outros seres vivos, sem hierarquias, Campo Esquerdo promove &quot;tecnologias&quot;, no plural. Dicotomias como arte em oposição à tecnologia, performance/festa, dança/escuta, coletividade/individualidade não têm lugar aqui, exceto se desmontadas e recombinadas em configurações irreconhecíveis.</p>
                <p className="mb-4 pl-2">
                  O prefixo musical <span className="italic">left-field</span> literalmente, e como sátira, Campo Esquerdo, indica variantes excêntricas de um certo gênero musical. E indo um pouco além na interpretação, não é exatamente o fazer “experimental” que hoje muitas vezes existe em categorias demasiadamente solidificadas e limitantes para justificar o uso do termo. O &quot;Campo Esquerdo&quot; é, simplesmente, o abraço à estranheza. Pode ser música/performance excêntrica, que toma essa característica apenas por ser quem somos, em nossas inconformidades; ou o fazer artístico que deseja fabricar/simular um mundo xenofílico onde corpos dissidentes, mentes divergentes, possam existir sem a opressão da norma. Ou ainda, a curiosidade científica de observar o que acontece quando há permutações de tecnologias ainda não experimentadas. Campo esquerdo não é um evento de música experimental; é uma interface contracultural que promove novos formatos sonoros, e propõe outros parâmetros para relações imanentes nas experiências multidisciplinares.
                </p>
                <p className="mb-4 pl-2">Práxis</p>
                <p className="mb-4 pl-2">
                  Em sua concepção inicial, Campo Esquerdo tomou a forma de um evento que combina múltiplos elementos da cultura da música eletrônica em diálogo com formatos experimentais. Estes são: 1) elaborações rítmicas repetitivas e contínuas que produzem um espaço de liberdade corporal fora do tempo, comum em gêneros musicais associados às raves e aos clubs; 2) música ambiente e escuta profunda, mimetizando a proposta de espaços de escuta hi-fi; 3) a música experimental, onde ruído, silêncio e acaso se encontram para desafiar as tradições musicais convencionais e abrir novas possibilidades de escuta. A partir desses parâmetros, manifestou-se um espaço temporário de escuta ininterrupta focado em shows de música eletrônica left-field e performances na interseção entre corpo, tecnologia digital e som. Entre as apresentações, houve momentos de mediação: DJ sets como colagens sonoras, evitando quebras não intencionais ou mudanças bruscas de atmosfera. A intermediação existe como elemento fundamental da experiência Campo Esquerdo, pois a cultura DJ (e a artista DJ) em suas origens, é capaz de criar sentido entre distintas estéticas e grupos sociais, permitindo que seja criado tanto um ambiente conciso, fluido, como um solo para que as artistas autorais se sintam confortáveis em ousar ao máximo em suas apresentações.
                </p>
                <p className="mb-4 pl-2">
                  O formato de experiência de escuta dá o conjunto de valores do projeto, mas não é um fim em si próprio. Nos meses após a primeira edição, surgiram questões críticas, como: como dar continuidade a essas experiências de forma alinhada a esses valores? Público, gratuito, horizontal, inovador, dissidente, estranho. Quais são as condições dignas para alcançar um estado de fluxo coletivo, capaz de transformar o projeto conforme as necessidades do que o compõe? Como uma tentativa de respondê-las, Campo Esquerdo toma uma nova forma. O que chamamos de <a href="https://youtu.be/m-hjfPRXNjA" style={{ color: '#76688D' }}>Campo Esquerdo Fase II.</a>
                </p>

              </div>

              <div className="relative">
                
{/* 
                {isOpen && (
                  <div className="flex flex-col">

                      <div className={`sobre-text-container ${text}`}>
                        <span className="mb-2 pl-2"> Campo Esquerdo busca abrir espaços e criar infra_estruturas porque acreditamos que para que floresçam novas linguagens artísticas e experiências, é necessário proporcionar condições materiais que permitam que isso aconteça. Mesmo que haja circunstâncias que estejam muito além do alcance de um projeto de nicho, pensamos que o formato mínimo viável para a sua continuidade, com um impacto alinhado a seus valores, contém: eventos públicos gratuitos recorrentes (cultura como direito), autonomia técnica e de equipamentos (sistema de som próprio), e uma comunidade engajada e dignamente compensada. Por isso, em vez de seguir realizando eventos com cobrança de ingressos (o que delegaria a responsabilidade do financiamento ao público), seguimos uma via mais paciente.    </span>
                        <br /><div className="h-4" />
                        <span className="pl-2">
                          Por meio de fundos da Lei Aldir Blanc, e em parceria com o MAM-Rio, A Fase II, busca criar a infra_estrutura necessária para dar continuidade ao campo esquerdo por meio de quatro passos:  </span> <br />  <br />
                        <span className="pl-2"> 1 - Residência artística semipresencial com chamada aberta para artistas sonoras e do corpo, com acompanhamento das artistas que fizeram parte das interações passadas do projeto.  <br />  <br />
                          <span className="pl-2"> 2 - Ciclo de Seminários e Oficinas abertos ao público no Museu de Arte Moderna do Rio de Janeiro com artistas e pesquisadores, convidados. </span>  <br /> <br />
                          <span className="pl-2"> 3 - Construção de um sistema de som que será usado nas próximas manifestações do projeto </span>  <br /> <br />
                          <span className="pl-2"> 4 - Apresentação dos trabalhos dos artistas selecionados na residência artística numa experiência de escuta aos moldes do primeiro Campo Esquerdo em 2023: "Espaço efêmero de escuta ininterrupta".  </span>  <br /> <br /></span>
                      </div>
                      <div className="font-msgothic mt-4 mb-8 mx-auto px-4 text-center" style={{ maxWidth: '50rem' }}>
                        <p className="mb-4">
                          Para fazer parte da residência, inscreva-se na chamada aberta aqui:
                        </p>
                        <div className="mb-4 flex justify-center gap-4">
                         
                          <a
                            href="/editalcampoesquerdo.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img src="/editalbotao.png" alt="Informações" className="w-full max-w-[200px]" />
                          </a>

                          <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img src="/inscrevabutton.png" alt="Inscreva-se" className="w-full max-w-[200px]" />
                          </a>
                           
                        </div>
                        <p>
                          Se não deseja ou não possa participar da residência, porém tem interesse de contribuir voluntariamente para o projeto, escreva um email para: <a href="mailto:campo.esquerdo@gmail.com" className="underline">campo.esquerdo@gmail.com</a>
                        </p>
                      </div>

                  </div>
                )} */}
              </div>
                
              {/* ++++++ Section for Desktop */}
               <div className="relative">
                <StickyWrapper>
                  <div
                    ref={eventosRef}
                    className={`font-msgothic text-[clamp(21px,1.46vw,3rem)] leading-[16px] sticky sticky-border-transparent top-0 border-b border-t flex items-center min-w-[50vh] max-w-auto min-h-[5vh] max-h-[10vh] pl-2 ${bg} z-10 ${text} ${border} sticky-border-transparent`}
                  >
                    +++++++++
                  </div>
                </StickyWrapper>
      
              </div> *

            
                  
            </motion.div>
          </div>
        </motion.div>
      </div>
      <BlogOverlay showBlog={isBlogOpen} />
      <SoundSystemOverlay showSoundSystem={isSoundSystemOpen} />
      <SobreOverlay showSobre={isSobreOpen} />
      {/* Floating content hub (desktop). Only opened by the bouncing text and the CALENDÁRIO button. */}
      <ContentHub variant="standalone" />
      <EmailSignup isOpen={isEmailOpen} onClose={() => setIsEmailOpen(false)} />
    </div>
  );
}
