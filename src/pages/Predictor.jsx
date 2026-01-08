import { useState } from 'react';
import api from '../services/api';
import { BrainCircuit, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Predictor = () => {
  const [formData, setFormData] = useState({
    modeloId: 1,
    descripcion: '',
    // Campos requeridos por el modelo de ML dentro de requestJson
    CreditScore: 650,
    Geography: 'France',
    Gender: 'Male',
    Age: 30,
    Tenure: 5,
    Balance: 0,
    NumOfProducts: 1,
    HasCrCard: 1,
    IsActiveMember: 1,
    EstimatedSalary: 50000
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convertimos a número si el campo es numérico para evitar errores en el modelo
    const val = e.target.type === 'number' ? parseFloat(value) : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setResult(null);

  // Estructura exacta para PrediccionIndividualRequest
  const payload = {
    modeloId: formData.modeloId,
    descripcion: formData.descripcion || `Consulta individual ${new Date().toLocaleDateString()}`,
    requestJson: {
      CreditScore: formData.CreditScore,
      Geography: formData.Geography,
      Gender: formData.Gender,
      Age: formData.Age,
      Tenure: formData.Tenure,
      Balance: formData.Balance,
      NumOfProducts: formData.NumOfProducts,
      HasCrCard: formData.HasCrCard,
      IsActiveMember: formData.IsActiveMember,
      EstimatedSalary: formData.EstimatedSalary
    }
  };

  try {
    // URL actualizada según tu PrediccionController
    const response = await api.post('/api/predicciones/individual', payload);
    
    // Asumiendo que PrediccionResponse contiene los campos de resultado
    // Si tu API devuelve un objeto Prediccion, podrías necesitar acceder a response.data.resultado
    setResult(response.data); 
  } catch (error) {
    console.error("Error en la predicción:", error);
    alert("No se pudo procesar la predicción. Verifica los permisos de tu rol.");
  } finally {
    setLoading(false);
  }
};

const handleBatchUpload = async (file) => {
  const formData = new FormData();
  
  // El objeto 'request' según PrediccionBatchRequest de tu Java
  const batchRequest = {
    modeloId: 1,
    descripcion: "Carga masiva desde UI"
  };

  formData.append('file', file);
  formData.append('request', new Blob([JSON.stringify(batchRequest)], {
    type: 'application/json'
  }));

  try {
    const response = await api.post('/api/predicciones/batch', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert("Archivo recibido. Procesando...");
  } catch (error) {
    console.error("Error en carga batch", error);
  }
};

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-800">Analizador de Churn</h1>
        <p className="text-slate-500">Evaluación basada en el perfil financiero del cliente.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Entrada */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase">Descripción de la consulta</label>
            <input name="descripcion" type="text" onChange={handleChange} placeholder="Ej: Evaluación cliente premium"
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Credit Score</label>
              <input name="CreditScore" type="number" defaultValue={650} onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">País (Geography)</label>
              <select name="Geography" onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border">
                <option value="France">Francia</option>
                <option value="Spain">España</option>
                <option value="Germany">Alemania</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Género</label>
              <select name="Gender" onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border">
                <option value="Male">Masculino</option>
                <option value="Female">Femenino</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Edad</label>
              <input name="Age" type="number" defaultValue={30} onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Antigüedad (Tenure)</label>
              <input name="Tenure" type="number" defaultValue={5} onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Balance en cuenta</label>
              <input name="Balance" type="number" defaultValue={0} onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Número de Productos</label>
              <input name="NumOfProducts" type="number" defaultValue={1} onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">¿Tiene Tarjeta de Crédito?</label>
              <select name="HasCrCard" onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border">
                <option value={1}>Sí</option>
                <option value={0}>No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">¿Es Miembro Activo?</label>
              <select name="IsActiveMember" onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border">
                <option value={1}>Sí</option>
                <option value={0}>No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Salario Estimado</label>
              <input name="EstimatedSalary" type="number" defaultValue={50000} onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="md:col-span-2 mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-200">
            {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit size={20} />}
            {loading ? 'Consultando al Modelo...' : 'Calcular Probabilidad de Fuga'}
          </button>
        </form>

        {/* Panel de Resultado */}
        <div className="bg-slate-900 text-white p-8 rounded-xl shadow-xl flex flex-col justify-center items-center relative overflow-hidden">
          {!result && !loading && (
            <div className="text-center space-y-4">
              <div className="bg-slate-800 p-4 rounded-full inline-block">
                <BrainCircuit size={40} className="text-slate-500" />
              </div>
              <p className="text-slate-400">Complete los datos y presione calcular para obtener el análisis de IA.</p>
            </div>
          )}

          {result && (
            <div className="w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${result.prevision === 'Va a cancelar' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                {result.prevision === 'Va a cancelar' ? <AlertCircle size={40} /> : <CheckCircle2 size={40} />}
              </div>
              
              <div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                   {result.prevision === 'Va a cancelar' ? 'Riesgo Alto' : 'Seguro'}
                </h2>
                <p className="text-slate-400 text-sm mt-1">Veredicto del Modelo ChurnInsight</p>
              </div>

              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <p className="text-5xl font-mono text-blue-400">{(result.probabilidad * 100).toFixed(1)}%</p>
                <p className="text-xs uppercase tracking-widest text-slate-500 mt-2">Probabilidad de Deserción</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictor;