import { useState } from 'react';
import axios from 'axios';
import { Upload, Wand2, Crop, Image, Sparkles, Download } from 'lucide-react';

function App() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputImage, setOutputImage] = useState(null);

  // Handle image upload
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

  // Remove background function using remove.bg API
  const removeBackground = async () => {
    if (!image) {
      setError("Nenhuma imagem foi carregada.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        {
          image_file_b64: image.split(',')[1],
        },
        {
          headers: {
            'X-Api-Key': 'wLLX4woSPA92dKyxr9bx6Ghu',
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      const base64Image = await arrayBufferToBase64(response.data);
      setOutputImage(base64Image);

    } catch (err) {
      setError("Erro ao remover o fundo: " + err.message);
      console.error("Erro ao chamar a API:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Enhance image using DeepAI API
  const enhanceImageWithDeepAI = async () => {
    if (!image) {
      setError("Nenhuma imagem carregada.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      const blob = await fetch(image).then((res) => res.blob());
      formData.append('image', blob);

      const response = await axios.post('https://api.deepai.org/api/torch-srgan', formData, {
        headers: {
          'api-key': '7052e5ed-2c52-4a53-8ace-f787b84a8c7d',
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.output_url;

      const imageResp = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      const base64Image = await arrayBufferToBase64(imageResp.data);
      setOutputImage(base64Image);

    } catch (err) {
      setError("Erro ao melhorar a imagem: " + err.message);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to convert ArrayBuffer to base64
  const arrayBufferToBase64 = (arrayBuffer) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(new Blob([arrayBuffer]));
    });
  };

  // Handle image download
  const handleDownload = () => {
    if (outputImage) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${outputImage}`;
      link.download = 'image.png';
      link.click();
    }
  };

  // Handle image sharing
  const handleShare = async () => {
    if (navigator.share && outputImage) {
      try {
        await navigator.share({
          title: 'Photogenie Image',
          text: 'Confira esta imagem processada no Photogenie!',
          url: `data:image/png;base64,${outputImage}`,
        });
      } catch (err) {
        console.error('Erro ao compartilhar a imagem:', err);
      }
    } else {
      alert('Compartilhamento não suportado no seu navegador.');
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

        {isProcessing && <div className="text-center text-xl">Processando...</div>}
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}

        {outputImage && (
          <div className="bg-[#2c2c3a] p-4 rounded mb-6">
            <img src={`data:image/png;base64,${outputImage}`} alt="Processed" className="max-w-full h-auto rounded" />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          <button className="bg-[#2c2c3a] p-4 rounded flex flex-col items-center hover:bg-[#00c2ff] hover:text-black transition">
            <Crop className="w-6 h-6 mb-1" />
            <span className="text-sm">Cortar</span>
          </button>
          <button
            className="bg-[#2c2c3a] p-4 rounded flex flex-col items-center hover:bg-[#00c2ff] hover:text-black transition"
            onClick={enhanceImageWithDeepAI}
          >
            <Sparkles className="w-6 h-6 mb-1" />
            <span className="text-sm">Melhorar</span>
          </button>
          <button
            className="bg-[#2c2c3a] p-4 rounded flex flex-col items-center hover:bg-[#00c2ff] hover:text-black transition"
            onClick={removeBackground}
          >
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

        {outputImage && (
          <div className="mt-8 flex gap-4">
            <button
              className="bg-[#00c2ff] text-black p-4 rounded flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
            <button
              className="bg-[#00c2ff] text-black p-4 rounded flex items-center gap-2"
              onClick={handleShare}
            >
              <Sparkles className="w-5 h-5" />
              <span>Compartilhar</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
