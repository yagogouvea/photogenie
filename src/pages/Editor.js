// Editor.js - com integrações reais: DeepAI + Remove.bg
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, Wand2, Sparkles, Crop, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PremiumButton from '../components/PremiumButton';

function Editor() {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedImage = localStorage.getItem('uploadedImage');
    if (storedImage) {
      setImage(storedImage);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'imagem.png';
      link.click();
    }
  };

  const handleImproveImage = async () => {
    if (!image || isProcessing) return;

    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append('image', await fetch(image).then(res => res.blob()));

      const response = await axios.post(
        'https://api.deepai.org/api/torch-srgan',
        formData,
        {
          headers: {
            'Api-Key': '7052e5ed-2c52-4a53-8ace-f787b84a8c7d',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.output_url) {
        const improvedImageResponse = await fetch(response.data.output_url);
        const improvedBlob = await improvedImageResponse.blob();
        const improvedUrl = URL.createObjectURL(improvedBlob);
            setImage(improvedUrl);
        localStorage.setItem('uploadedImage', improvedUrl);
      }
    } catch (error) {
      console.error('Erro ao melhorar imagem:', error);
      alert('Erro ao melhorar imagem.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveBackground = async () => {
    if (!image || isProcessing) return;

    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append('image_file', await fetch(image).then(res => res.blob()));
      formData.append('size', 'auto');

      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          headers: {
            'X-Api-Key': 'wLLX4woSPA92dKyxr9bx6Ghu',
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        }
      );

      const blob = response.data;
      const url = URL.createObjectURL(blob);
      setImage(url);
      localStorage.setItem('uploadedImage', url);
    } catch (error) {
      console.error('Erro ao remover fundo:', error);
      alert('Erro ao remover fundo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e2e] text-white flex flex-col">
      <header className="bg-[#1e1e2e] border-b border-[#2c2c3a] px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <ArrowLeft className="cursor-pointer" onClick={() => navigate('/')} />
          <h1 className="text-xl font-bold text-[#00c2ff]">Editor Photogenie</h1>
        </div>
        <PremiumButton />
      </header>

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 p-6">
        {image && (
          <div className="bg-[#2c2c3a] p-4 rounded-xl shadow-md max-w-2xl w-full flex justify-center">
            <img
              src={image}
              alt="preview"
              className="max-h-[500px] w-auto rounded-lg object-contain"
            />
          </div>
        )}

        <div className="flex flex-col items-center gap-4 w-full md:w-64">
          <button className="bg-[#2c2c3a] w-full p-4 rounded-xl flex flex-col items-center hover:bg-[#00c2ff] hover:text-black">
            <Crop className="w-6 h-6 mb-1" />
            <span className="text-sm">Cortar</span>
          </button>

          <button
            onClick={handleImproveImage}
            disabled={isProcessing}
            className="bg-[#2c2c3a] w-full p-4 rounded-xl flex flex-col items-center hover:bg-[#00c2ff] hover:text-black disabled:opacity-50"
          >
            <Sparkles className="w-6 h-6 mb-1" />
            <span className="text-sm">Melhorar</span>
          </button>

          <button
            onClick={handleRemoveBackground}
            disabled={isProcessing}
            className="bg-[#2c2c3a] w-full p-4 rounded-xl flex flex-col items-center hover:bg-[#00c2ff] hover:text-black disabled:opacity-50"
          >
            <Wand2 className="w-6 h-6 mb-1" />
            <span className="text-sm">Remover fundo</span>
          </button>

          <button className="bg-[#2c2c3a] w-full p-4 rounded-xl flex flex-col items-center hover:bg-[#00c2ff] hover:text-black">
            <ImageIcon className="w-6 h-6 mb-1" />
            <span className="text-sm">Filtros</span>
          </button>

          <button className="bg-[#2c2c3a] w-full p-4 rounded-xl flex flex-col items-center hover:bg-[#00c2ff] hover:text-black">
            <Sparkles className="w-6 h-6 mb-1" />
            <span className="text-sm">Efeitos</span>
          </button>

          <button
            onClick={handleDownload}
            className="bg-[#00c2ff] w-full p-4 text-black rounded-xl flex items-center justify-center gap-2 mt-2"
          >
            <Download className="w-5 h-5" />
            Download
          </button>
        </div>
      </main>
    </div>
  );
}

export default Editor;
