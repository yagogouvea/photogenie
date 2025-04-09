import { useState } from 'react';
import { Upload, Wand2, Crop, Image, Sparkles } from 'lucide-react';

function App() {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e2e] text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Wand2 className="text-[#00c2ff] w-6 h-6" />
          <h1 className="text-2xl font-bold">Photogenie</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="mb-6">
          <label className="flex items-center gap-2 bg-[#00c2ff] text-black px-4 py-2 rounded cursor-pointer w-fit">
            <Upload className="w-5 h-5" />
            <span>Enviar imagem</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        {image && (
          <div className="bg-[#2c2c3a] p-4 rounded mb-6">
            <img src={image} alt="Preview" className="max-w-full h-auto rounded" />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button className="bg-[#2c2c3a] p-4 rounded flex flex-col items-center hover:bg-[#00c2ff] hover:text-black transition">
            <Crop className="w-6 h-6 mb-1" />
            <span className="text-sm">Cortar</span>
          </button>
          <button className="bg-[#2c2c3a] p-4 rounded flex flex-col items-center hover:bg-[#00c2ff] hover:text-black transition">
            <Sparkles className="w-6 h-6 mb-1" />
            <span className="text-sm">Melhorar</span>
          </button>
          <button className="bg-[#2c2c3a] p-4 rounded flex flex-col items-center hover:bg-[#00c2ff] hover:text-black transition border border-[#00c2ff]">
            <Wand2 className="w-6 h-6 mb-1" />
            <span className="text-sm">Remover fundo</span>
          </button>
          <button className="bg-[#2c2c3a] p-4 rounded flex flex-col items-center hover:bg-[#00c2ff] hover:text-black transition">
            <Image className="w-6 h-6 mb-1" />
            <span className="text-sm">Filtros</span>
          </button>
          <button className="bg-[#2c2c3a] p-4 rounded flex flex-col items-center hover:bg-[#00c2ff] hover:text-black transition">
            <Sparkles className="w-6 h-6 mb-1" />
            <span className="text-sm">Efeitos</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
