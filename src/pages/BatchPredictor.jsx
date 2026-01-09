import { useState } from 'react';
import api from '../services/api';
import { FileUp, Download, Loader2, FileCheck, FileText, Bot } from 'lucide-react';

const BatchPredictor = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // NUEVO: Estado para los campos del formulario
  const [formData, setFormData] = useState({
    modeloId: 1, // Valor por defecto
    descripcion: ''
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setCompleted(false);
    
    // Opcional: Si la descripción está vacía, prellenar con el nombre del archivo
    if (selectedFile && !formData.descripcion) {
      setFormData(prev => ({ ...prev, descripcion: `Carga masiva: ${selectedFile.name}` }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const payloadData = new FormData();
    
    // 1. Construimos el JSON con los datos capturados en el form
    const requestJson = {
      modeloId: parseInt(formData.modeloId), // Asegurar que sea número
      descripcion: formData.descripcion
    };

    // 2. Adjuntamos el archivo y el JSON
    payloadData.append('file', file);
    payloadData.append('request', new Blob([JSON.stringify(requestJson)], { type: 'application/json' }));

    try {
      const response = await api.post('/api/predicciones/batch', payloadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob' 
      });

      // Lógica de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resultado_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setCompleted(true);
    } catch (error) {
      console.error("Error en proceso batch:", error);
      alert("Error al procesar. Verifica que el modelo soporte batch y tu rol sea válido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Encabezado */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-6">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <FileUp size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Procesamiento Masivo</h2>
            <p className="text-sm text-slate-500">Ejecuta el modelo de IA sobre un conjunto de datos CSV.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Selector de Modelo */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Bot size={16} className="text-blue-500"/> Seleccionar Modelo
              </label>
              <select
                name="modeloId"
                value={formData.modeloId}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {/* Aquí podrías mapear modelos desde una API */}
                <option value="1">Churn XGBoost v1 (Default)</option>
                <option value="2">Random Forest Experimental</option>
              </select>
            </div>

            {/* 2. Input de Descripción */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-blue-500"/> Descripción del Proceso
              </label>
              <input 
                type="text" 
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Ej: Análisis campaña Q1 2026"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* 3. Zona de Carga de Archivo */}
          <div className={`border-2 border-dashed rounded-xl p-10 transition-all text-center group ${file ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}>
            <input 
              type="file" 
              id="csvFile" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <label htmlFor="csvFile" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
              {file ? (
                <div className="animate-in zoom-in duration-300">
                  <FileCheck size={48} className="text-emerald-500 mb-2 mx-auto" />
                  <span className="text-slate-800 font-bold text-lg block">{file.name}</span>
                  <span className="text-xs text-emerald-600 font-medium bg-emerald-100 px-3 py-1 rounded-full mt-2 inline-block">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ) : (
                <div className="group-hover:scale-105 transition-transform duration-300">
                  <FileUp size={48} className="text-slate-400 group-hover:text-blue-500 mb-3 mx-auto transition-colors" />
                  <span className="text-slate-600 font-medium block">Haz clic para buscar o arrastra tu archivo CSV</span>
                  <span className="text-xs text-slate-400 mt-1 block">Soporta archivos hasta 10MB</span>
                </div>
              )}
            </label>
          </div>

          {/* Botón de Acción */}
          <button
            type="submit"
            disabled={!file || loading}
            className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg ${
              loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-blue-200 hover:-translate-y-1'
            }`}
          >
            {loading ? (
              <><Loader2 className="animate-spin" /> Procesando Datos...</>
            ) : (
              <><Download size={20} /> Iniciar Análisis y Descargar</>
            )}
          </button>
        </form>

        {/* Mensaje de Éxito */}
        {completed && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="bg-emerald-100 p-2 rounded-full">
              <FileCheck size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-bold">¡Procesamiento completado!</p>
              <p className="text-xs text-emerald-600">El archivo de resultados se ha descargado automáticamente.</p>
            </div>
          </div>
        )}
      </div>

      {/* Guía de Formato (Visual) */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/60">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
           Estructura Esperada del CSV
        </h3>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs text-slate-600 bg-white">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-3 border-r border-slate-200">CreditScore</th>
                <th className="p-3 border-r border-slate-200">Geography</th>
                <th className="p-3 border-r border-slate-200">Age</th>
                <th className="p-3 bg-blue-50 text-blue-600 font-bold border-l-4 border-l-blue-200">...output (AI)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100">
                <td className="p-3 border-r border-slate-100 font-mono">650</td>
                <td className="p-3 border-r border-slate-100">France</td>
                <td className="p-3 border-r border-slate-100 font-mono">34</td>
                <td className="p-3 bg-blue-50/30 text-blue-500 italic">Churn: No (89%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BatchPredictor;