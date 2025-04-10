import { useState } from 'react';
import { Sparkles } from 'lucide-react';

function PremiumButton() {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  return (
    <div>
      <button
        onClick={toggleModal}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm hover:scale-105 transition-transform"
      >
        <Sparkles size={18} /> Edição Premium com IA
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl max-w-md w-full shadow-xl relative">
            <h2 className="text-xl font-bold mb-4 text-center">✨ Ferramentas Premium</h2>
            <ul className="space-y-2 text-left text-sm text-white">
              <li>✔ Remoção avançada de fundo</li>
              <li>✔ Aprimorar nitidez com IA</li>
              <li>✔ Transformar em anime ou desenho</li>
              <li>✔ Upscale profissional</li>
              <li>✔ Geração de imagem com IA</li>
              <li>✔ Edição automática com 1 clique</li>
            </ul>
            <div className="mt-6 text-center">
              <button
                onClick={toggleModal}
                className="px-4 py-2 rounded-lg text-sm bg-zinc-700 text-white hover:bg-zinc-600 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PremiumButton;
