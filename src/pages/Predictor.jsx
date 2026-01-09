import { useState } from 'react';
import api from '../services/api';
import { 
  BrainCircuit, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Wallet
} from 'lucide-react';

const Predictor = () => {
  const [formData, setFormData] = useState({
    modeloId: 1,
    descripcion: '',
    // Campos del modelo (PascalCase como lo requiere el backend/ML)
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
    const { name, value, type } = e.target;
    // Conversión estricta de tipos numéricos
    const val = type === 'number' || name === 'modeloId' ? parseFloat(value) : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Payload formateado para el Backend Java
    const payload = {
      modeloId: formData.modeloId,
      descripcion: formData.descripcion || `Consulta individual ${new Date().toLocaleTimeString()}`,
      requestJson: {
        CreditScore: formData.CreditScore,
        Geography: formData.Geography,
        Gender: formData.Gender,
        Age: formData.Age,
        Tenure: formData.Tenure,
        Balance: formData.Balance,
        NumOfProducts: formData.NumOfProducts,
        HasCrCard: parseInt(formData.HasCrCard),
        IsActiveMember: parseInt(formData.IsActiveMember),
        EstimatedSalary: formData.EstimatedSalary
      }
    };

    try {
      const response = await api.post('/api/predicciones/individual', payload);
      const data = response.data;
      console.log("Datos recibidos del backend:", data);
      console.log("Respuesta del backend:", data.prediccion_id);
      let mlResult = { prediction: "Desconocido", probability: 0, confidence: "N/A", top_features: [] };

      // LÓGICA DE PARSEO ROBUSTA
      // Verificamos si resultadoJson existe (Java suele enviarlo como camelCase 'resultadoJson')
      const jsonString = data.resultadoJson || data.resultado_json;

      if (jsonString) {
        try {
          // Si ya es objeto, úsalo. Si es string, paréalo.
          mlResult = (typeof jsonString === 'string') ? JSON.parse(jsonString) : jsonString;
        } catch (err) {
          console.error("Error parseando el JSON interno de ML:", err);
        }
      } else {
        console.warn("El backend no devolvió el campo resultadoJson");
      }

      setResult({
        meta: data,      // Metadatos (ID, fechas, etc.)
        analysis: mlResult // Resultado puro del ML (prediction, probability, features)
      });

    } catch (error) {
      console.error("Error en la predicción:", error);
      alert("No se pudo procesar la predicción. Verifica la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BrainCircuit className="text-blue-600" />
          Analizador de Riesgo Individual
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Ingresa los datos demográficos y financieros para evaluar la probabilidad de Churn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLUMNA IZQUIERDA: FORMULARIO --- */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Referencia</label>
            <input 
              name="descripcion" 
              type="text" 
              onChange={handleChange} 
              placeholder="Ej: Cliente VIP - Caso #402"
              className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500 p-2.5 text-sm border transition-all" 
            />
          </div>

          {/* Sección Demográfica */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2 border-b pb-2">
              <User size={14} /> Datos Personales
            </h3>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Credit Score</label>
              <input name="CreditScore" type="number" defaultValue={650} onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border text-sm" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">País</label>
                <select name="Geography" onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border text-sm bg-white">
                  <option value="France">Francia</option>
                  <option value="Spain">España</option>
                  <option value="Germany">Alemania</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Género</label>
                <select name="Gender" onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border text-sm bg-white">
                  <option value="Male">Masculino</option>
                  <option value="Female">Femenino</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Edad</label>
                <input name="Age" type="number" defaultValue={30} onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Antigüedad</label>
                <input name="Tenure" type="number" defaultValue={5} onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border text-sm" />
              </div>
            </div>
          </div>

          {/* Sección Financiera */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2 border-b pb-2">
              <Wallet size={14} /> Financiero
            </h3>

            <div>
              <label className="text-sm font-medium text-slate-700">Balance (€)</label>
              <input name="Balance" type="number" step="0.01" defaultValue={0} onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="text-sm font-medium text-slate-700">Salario Est.</label>
                <input name="EstimatedSalary" type="number" step="0.01" defaultValue={50000} onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border text-sm" />
               </div>
               <div>
                <label className="text-sm font-medium text-slate-700">Productos</label>
                <input name="NumOfProducts" type="number" defaultValue={1} onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border text-sm" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">¿Tarjeta Crédito?</label>
                <select name="HasCrCard" onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border text-sm bg-white">
                  <option value={1}>Sí</option>
                  <option value={0}>No</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">¿Activo?</label>
                <select name="IsActiveMember" onChange={handleChange} className="w-full rounded-lg border-slate-300 p-2 border text-sm bg-white">
                  <option value={1}>Sí</option>
                  <option value={0}>No</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="md:col-span-2 mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit size={20} />}
            {loading ? 'Analizando Perfil...' : 'Calcular Probabilidad de Fuga'}
          </button>
        </form>


        {/* --- COLUMNA DERECHA: RESULTADO --- */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center relative overflow-hidden h-full min-h-[400px]">
            
            {/* Estado Inicial */}
            {!result && !loading && (
              <div className="text-center space-y-4 animate-in fade-in duration-700">
                <div className="bg-slate-800 p-5 rounded-full inline-block shadow-inner ring-1 ring-slate-700">
                  <BrainCircuit size={48} className="text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-300">Esperando Datos</h3>
                  <p className="text-slate-500 text-sm mt-2 px-4">
                    Complete el formulario para que el modelo XGBoost procese la solicitud.
                  </p>
                </div>
              </div>
            )}

            {/* Estado Cargando */}
            {loading && (
               <div className="text-center space-y-4">
                  <Loader2 size={50} className="animate-spin text-blue-500 mx-auto" />
                  <p className="text-blue-400 font-mono text-sm animate-pulse">Consultando Modelo de IA...</p>
               </div>
            )}

            {/* Estado Resultado */}
            {result && result.analysis && (
              <div className="w-full space-y-6 animate-in fade-in zoom-in duration-500">
                
                {/* 1. Icono y Veredicto */}
                <div className="flex flex-col items-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl mb-4 transition-colors duration-500 ${
                      // LÓGICA DE COLOR: Verde si "Va a continuar", Rojo para cualquier otra cosa
                      result.analysis.prediction === 'Va a continuar'
                        ? 'bg-emerald-500 shadow-emerald-500/40 ring-4 ring-emerald-500/20'
                        : 'bg-rose-500 shadow-rose-500/40 ring-4 ring-rose-500/20' 
                    }`}>
                    {result.analysis.prediction === 'Va a continuar'
                      ? <CheckCircle2 size={48} className="text-white drop-shadow-md" />
                      : <AlertCircle size={48} className="text-white drop-shadow-md" /> 
                    }
                  </div>
                  
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-center leading-tight">
                    {result.analysis.prediction === 'Va a continuar'
                      ? 'Cliente Fiel' 
                      : 'Riesgo de Fuga'}
                  </h2>
                  
                  <p className="text-slate-400 text-xs mt-2 font-mono bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    {result.analysis.prediction}
                  </p>
                </div>

                {/* 2. Barra de Probabilidad */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 relative overflow-hidden group hover:border-slate-600 transition-colors">
                  <div 
                    className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-out ${
                      result.analysis.prediction === 'Va a continuar' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${(result.analysis.probability * 100)}%` }}
                  />
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                        Probabilidad Estimada
                      </p>
                      <p className={`text-5xl font-mono tracking-tighter ${
                        result.analysis.prediction === 'Va a continuar' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {(result.analysis.probability * 100).toFixed(1)}%
                      </p>
                    </div>
                    
                    {/* Badge de Confianza */}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Confianza</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        result.analysis.confidence === 'Alta' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {result.analysis.confidence || 'Media'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Factores Clave (Top Features) */}
                {result.analysis.top_features && result.analysis.top_features.length > 0 && (
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-3 flex items-center gap-2">
                      <BrainCircuit size={12}/> Factores determinantes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.analysis.top_features.map((feature, index) => (
                        <span key={index} className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-lg font-mono border border-slate-600">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Auditoría */}
                <div className="text-[10px] text-slate-500 font-mono text-center pt-2">
                  ID Transacción: #{result.meta.prediccion_id} • {result.meta.fecha_respuesta ? new Date(result.meta.fecha_respuesta).toLocaleTimeString() : 'Ahora'}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictor;