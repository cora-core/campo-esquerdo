"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useThemeClasses } from "@/hooks/useThemeClasses";

/*
 * /soundsystem — static page that slides up over the home page,
 * the same way BlogOverlay does for /blog. Styled like a blog post
 * (same wrapper, article width and .contentful-post-body typography).
 * Fully independent from the blog: no shared state, no Contentful calls.
 */
export function SoundSystemOverlay({ showSoundSystem }: { showSoundSystem: boolean }) {
  const { text, bg } = useThemeClasses();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {showSoundSystem && (
        <motion.div
          key="soundsystem-overlay"
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

          <div className="px-4 py-8 sm:px-8">
            <article className="mx-auto max-w-3xl space-y-6">
              <div className="contentful-post-body space-y-4 text-base sm:text-lg leading-relaxed">
                <h1>CAMPO ESQUERDO SOUND SYSTEM</h1>

                


                <p>
                  Campo Esquerdo Sound System é um hack, uma brecha no cistema. 1-A (UMA) ritmáquina de{" "}
                  {"<-desvio<-"} para expressões (contra)culturais, uma entidade sonora que se faz real™ por seu
                  desejo por autonomia. Infra_estrutura de expressão e acolhimento que reivindica o fazer
                  artístico como um direito básico. Os primeiros (6) módulos do sistema de som foram conspirados
                  entre 2025 e 2026 pela coletividade Campo Esquerdo com recursos da Lei Aldir Blanc durante a
                  Fase II; projetados com componentes de alta qualidade que equilibram peso (pressão) e definição
                  para uma escuta in_corporada.
                </p>
              
                <p>
                  Specs atuais (Julho,2026): 2 x subwoofers de 1000 W de potência; 2 x falantes de 12 polegadas
                  500w de potência, 2 x drivers de compressão 140w. Atende até 100-120 pessoas em espaço aberto.
                </p>

                <p>
                  O soundsystem foi produzido como infraestrutura coletiva sem fins lucrativos para iniciativas
                  fora da curva; ou seja, é nosso. Para usar o soundsystem, há os seguintes pré-requisitos:
                </p>

                <ul className="list-disc space-y-1 pl-6">
                  <li>Proposta do evento estar em ressonância com o projeto</li>
                  <li>Pagamento da uma diária de uma técnica associada ao projeto</li>
                  <li>Se responsabilizar pelo transporte (o sistema vive no centro do Rio de Janeiro)</li>
                  <li>Se responsabilizar por danos ao equipamento</li>
                </ul>

                <p>
                  Também é possível candidatar-se a tornar-se técnico associado e passar pelo treinamento
                  necessário para operar o equipamento. Para aplicar há os seguintes pré-requisitos:
                </p>

                <ul className="list-disc space-y-1 pl-6">
                  <li>ser mulher e/ou pessoa LGBTQIAPN+</li>
                  <li>provar experiência prévia como téc. de som e/ou produção musical</li>
                </ul>

              <img src="/sound1.jpg" alt="soundsystemv1" className="w-full h-auto" />

              </div>
            </article>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
