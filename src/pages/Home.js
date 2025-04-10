// Home.js
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Upload } from 'lucide-react';

function Home() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('uploadedImage', reader.result);
        navigate('/editor');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e2e] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-8">Photogenie</h1>
      <label className="flex items-center gap-2 bg-[#00c2ff] text-black px-6 py-3 rounded cursor-pointer">
        <Upload className="w-5 h-5" />
        <span>Enviar imagem</span>
        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>
    </div>
  );
}

export default Home;