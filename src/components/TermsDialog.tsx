import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Megaphone } from "lucide-react";

const TERMS_KEY = "water-sort-terms-accepted";

export function hasAcceptedTerms(): boolean {
  try {
    return localStorage.getItem(TERMS_KEY) === "1";
  } catch {
    return false;
  }
}

export function acceptTerms() {
  try {
    localStorage.setItem(TERMS_KEY, "1");
  } catch {}
}

export default function TermsDialog() {
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!hasAcceptedTerms()) setOpen(true);
  }, []);

  const handleAccept = () => {
    if (!agreed) return;
    acceptTerms();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          // Block all interaction with the app
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="menu-neon-frame-lg w-full max-w-md p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="neon-icon-cyan" size={26} />
              <h2 className="neon-text-cyan text-2xl font-bold tracking-wider">
                TERMOS DE USO
              </h2>
            </div>

            <p className="text-sm text-foreground/90 leading-relaxed">
              Bem-vindo(a) ao <strong>Water Sort Puzzle</strong>! Antes de jogar,
              leia e aceite nossos termos de uso.
            </p>

            <div className="rounded-lg border border-cyan-400/30 bg-cyan-400/5 p-3 text-xs text-foreground/80 leading-relaxed space-y-2">
              <p>
                <strong>1. Uso do app:</strong> este jogo é fornecido para
                entretenimento pessoal. Você concorda em utilizá-lo de forma
                responsável.
              </p>
              <p>
                <strong>2. Dados locais:</strong> seu progresso, configurações e
                preferências são salvos apenas no seu dispositivo
                (localStorage).
              </p>
              <p>
                <strong>3. Propriedade:</strong> todo o conteúdo, design e
                código pertencem aos seus respectivos autores.
              </p>
              <p>
                <strong>4. Sem garantias:</strong> o app é fornecido "como
                está", sem garantias de funcionamento ininterrupto.
              </p>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 p-3">
              <Megaphone className="text-amber-300 shrink-0 mt-0.5" size={20} />
              <p className="text-xs text-amber-100 leading-relaxed">
                <strong>Aviso de Anúncios:</strong> este aplicativo pode exibir
                anúncios (Ads) durante o uso para manter o jogo gratuito.
              </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none p-2 rounded-lg hover:bg-cyan-400/5 transition">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 accent-cyan-400 cursor-pointer"
              />
              <span className="text-sm text-foreground/90">
                Li e aceito os termos e o uso de anúncios
              </span>
            </label>

            <motion.button
              whileHover={agreed ? { scale: 1.02 } : {}}
              whileTap={agreed ? { scale: 0.98 } : {}}
              onClick={handleAccept}
              disabled={!agreed}
              className="menu-neon-frame py-3 px-6 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span className="neon-text-cyan text-lg font-bold tracking-wider">
                ACEITAR E JOGAR
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
