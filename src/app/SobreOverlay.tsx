"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useThemeClasses } from "@/hooks/useThemeClasses";

/*
 * /sobre — static page that slides up over the home page, same as /soundsystem.
 * Used by the SOBRE button on mobile (desktop keeps its SOBRE side panel; the URL
 * still works there so shared links don't break).
 */
export function SobreOverlay({ showSobre }: { showSobre: boolean }) {
  const { text, bg } = useThemeClasses();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {showSobre && (
        <motion.div
          key="sobre-overlay"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className={`fixed inset-0 z-50 overflow-auto ${bg} ${text}`}
        >
          <div className="relative left-4 top-4 z-50">
            <Link
              type="button"
              href="/"
              className="inline-flex items-center gap-2 border border-current bg-white px-3 py-2 text-sm uppercase tracking-[0.35em] transition hover:bg-black hover:text-white"
            >
              ← VOLTAR
            </Link>
          </div>
          <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:left-4 md:translate-x-0">
            <img src="/logo.png" alt="icon" className="h-[2.5em]" />
          </div>

          <div className="px-4 py-8 pb-24 sm:px-8">
            <article className="mx-auto max-w-3xl space-y-6">
              <div className="contentful-post-body space-y-4 text-base sm:text-lg leading-relaxed">
                <h1>SOBRE</h1>

                <p>
                  Campo Esquerdo é uma protocoletividade que fomenta novas estéticas, modos de produção e experiências nos campos da arte sonora, musical e do corpo. Ao desenhar infra_estruturas que permitam co-criação a partir de perspectivas humanas, técnicas e de outros seres vivos, sem hierarquias, Campo Esquerdo promove &quot;tecnologias&quot;, no plural. Dicotomias como arte em oposição à tecnologia, performance/festa, dança/escuta, coletividade/individualidade não têm lugar aqui, exceto se desmontadas e recombinadas em configurações irreconhecíveis.
                </p>

                <p>
                  O prefixo musical <span className="italic">left-field</span> literalmente, e como sátira, Campo Esquerdo, indica variantes excêntricas de um certo gênero musical. E indo um pouco além na interpretação, não é exatamente o fazer “experimental” que hoje muitas vezes existe em categorias demasiadamente solidificadas e limitantes para justificar o uso do termo. O &quot;Campo Esquerdo&quot; é, simplesmente, o abraço à estranheza. Pode ser música/performance excêntrica, que toma essa característica apenas por ser quem somos, em nossas inconformidades; ou o fazer artístico que deseja fabricar/simular um mundo xenofílico onde corpos dissidentes, mentes divergentes, possam existir sem a opressão da norma. Ou ainda, a curiosidade científica de observar o que acontece quando há permutações de tecnologias ainda não experimentadas. Campo esquerdo não é um evento de música experimental; é uma interface contracultural que promove novos formatos sonoros, e propõe outros parâmetros para relações imanentes nas experiências multidisciplinares.
                </p>

                <h2>Práxis</h2>

                <p>
                  Em sua concepção inicial, Campo Esquerdo tomou a forma de um evento que combina múltiplos elementos da cultura da música eletrônica em diálogo com formatos experimentais. Estes são: 1) elaborações rítmicas repetitivas e contínuas que produzem um espaço de liberdade corporal fora do tempo, comum em gêneros musicais associados às raves e aos clubs; 2) música ambiente e escuta profunda, mimetizando a proposta de espaços de escuta hi-fi; 3) a música experimental, onde ruído, silêncio e acaso se encontram para desafiar as tradições musicais convencionais e abrir novas possibilidades de escuta. A partir desses parâmetros, manifestou-se um espaço temporário de escuta ininterrupta focado em shows de música eletrônica left-field e performances na interseção entre corpo, tecnologia digital e som. Entre as apresentações, houve momentos de mediação: DJ sets como colagens sonoras, evitando quebras não intencionais ou mudanças bruscas de atmosfera. A intermediação existe como elemento fundamental da experiência Campo Esquerdo, pois a cultura DJ (e a artista DJ) em suas origens, é capaz de criar sentido entre distintas estéticas e grupos sociais, permitindo que seja criado tanto um ambiente conciso, fluido, como um solo para que as artistas autorais se sintam confortáveis em ousar ao máximo em suas apresentações.
                </p>

                <p>
                  O formato de experiência de escuta dá o conjunto de valores do projeto, mas não é um fim em si próprio. Nos meses após a primeira edição, surgiram questões críticas, como: como dar continuidade a essas experiências de forma alinhada a esses valores? Público, gratuito, horizontal, inovador, dissidente, estranho. Quais são as condições dignas para alcançar um estado de fluxo coletivo, capaz de transformar o projeto conforme as necessidades do que o compõe? Como uma tentativa de respondê-las, Campo Esquerdo toma uma nova forma. O que chamamos de <a href="https://youtu.be/m-hjfPRXNjA" style={{ color: '#76688D' }}>Campo Esquerdo Fase II.</a>
                </p>
              </div>
            </article>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
