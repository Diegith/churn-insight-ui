import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api'; 
import { 
  Activity, 
  Calendar, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Code,
  User,
  Layers,
  X
} from 'lucide-react';

const ResultsView = () => {
  const [searchParams] = useSearchParams();
  
  // Estados
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); 
  const [selectedJson, setSelectedJson] = useState(null);
  const [meta, setMeta] = useState({
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
    size: 10
  });

  // Capturamos filtros de la URL
  const batchId = searchParams.get('batchId');
  const individualId = searchParams.get('individualId');

  // Cargar datos
  const fetchResults = async (pageNumber) => {
    setLoading(true);
    try {
      // Construimos la URL base apuntando a tu PrediccionController
      let url = `/api/predicciones/resultados?page=${pageNumber}&size=10&sort=fechaCreacion,desc`;
      
      // Si hay filtros en la URL, los agregamos a la petición
      if (batchId) url += `&batchId=${batchId}`;
      if (individualId) url += `&individualId=${individualId}`;

      const response = await api.get(url);
      const data = response.data;

      setResults(data.content);
      setMeta({
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        first: data.first,
        last: data.last,
        size: data.size,
        number: data.number
      });
    } catch (error) {
      console.error("Error cargando resultados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(page);
    // Reiniciamos la búsqueda si cambian los filtros
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, batchId, individualId]);

  // Helpers de formato (Fechas)
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Helper para interpretar el JSON dinámico
  const renderPredictionValue = (json) => {
    if (!json) return <span className="text-slate-400">N/A</span>;
    
    // Ajusta estas claves según lo que devuelva tu Python
    const prediction = json.prediction ?? json.Exited ?? json.resultado; 
    const probability = json.probability ?? json.probabilidad ?? 0;

    // Lógica visual: Churn = 1 (Rojo), No Churn = 0 (Verde)
    const isChurn = Number(prediction) === 1 || prediction === 'Yes' || prediction === 'Exited';
    
    return (
      <div className="flex flex-col">
        <span className={`font-bold text-xs px-2 py-0.5 rounded w-fit ${isChurn ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {isChurn ? 'RIESGO ALTO' : 'CLIENTE SEGURO'}
        </span>
        <span className="text-xs text-slate-500 mt-1">
          Valor: <strong>{String(prediction)}</strong> 
          {probability > 0 && ` (${(Number(probability) * 100).toFixed(1)}%)`}
        </span>
      </div>
    );
  };

  const getOriginBadge = (item) => {
    // 🔍 DEBUG: Si sigue fallando, descomenta esta línea y mira la consola del navegador (F12)
    // console.log("Analizando item:", item);

    // Intenta encontrar el ID en varias estructuras posibles
    // 1. Objeto completo (item.solicitudBatch.id)
    // 2. Campo plano (item.solicitudBatchId)
    // 3. Campo con otro nombre (item.idSolicitudBatch)
    const batchId = item.solicitudBatch?.id || item.solicitudBatchId || item.idSolicitudBatch;
    const individualId = item.solicitudIndividual?.id || item.solicitudIndividualId || item.idSolicitudIndividual;

    // CASO BATCH
    if (batchId) {
      return (
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 uppercase tracking-wide">
            <Layers size={12} /> Batch
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
             ID: {batchId}
          </span>
        </div>
      );
    }

    // CASO INDIVIDUAL
    if (individualId) {
      return (
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wide">
            <User size={12} /> Individual
          </span>
           <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
             ID: {individualId}
          </span>
        </div>
      );
    }

    // FALLBACK (Si no encuentra nada)
    return (
      <span className="text-slate-300 text-xs italic">
        Desconocido
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-orange-500" />
            {batchId ? `Resultados del Lote #${batchId}` : 'Auditoría de Predicciones'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {batchId 
              ? 'Visualizando únicamente las predicciones de esta carga masiva.'
              : 'Historial completo de todas las inferencias generadas por el modelo.'}
          </p>
        </div>
        
        {/* Estadísticas / Filtro Activo */}
        <div className="flex items-center gap-3">
          {(batchId || individualId) && (
             <a href="/resultados" className="text-xs text-red-500 hover:underline flex items-center gap-1">
                <X size={12} /> Borrar filtros
             </a>
          )}
          <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">
            Total registros: <span className="text-slate-900 font-bold">{meta.totalElements}</span>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Activity className="animate-spin text-orange-400 mx-auto h-8 w-8 mb-2" />
            <p className="text-slate-400">Analizando datos...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Search className="mx-auto h-12 w-12 mb-3 opacity-20" />
            <p>No hay resultados registrados con estos criterios.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-xs font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4 w-16 text-center">ID</th>
                  <th className="p-4 w-32">Origen</th>
                  <th className="p-4">Resultado Predicción</th>
                  <th className="p-4 w-48">Fecha Creación</th>
                  <th className="p-4 w-24 text-center">Raw Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-center font-mono text-slate-400 font-bold">
                      #{item.id}
                    </td>
                    <td className="p-4">
                      {getOriginBadge(item)}
                    </td>
                    <td className="p-4">
                      {renderPredictionValue(item.resultadoJson)}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {formatDate(item.fechaCreacion)}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedJson(item.resultadoJson)}
                        className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-all"
                        title="Ver JSON crudo"
                      >
                        <Code size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {!loading && results.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Página <span className="text-slate-900 font-bold">{meta.number + 1}</span> de <span className="text-slate-900 font-bold">{meta.totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={meta.first}
                className="p-2 rounded-lg hover:bg-white border hover:border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={meta.last}
                className="p-2 rounded-lg hover:bg-white border hover:border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para ver JSON Crudo */}
      {selectedJson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Code size={18} className="text-blue-500"/> JSON Respuesta
              </h3>
              <button onClick={() => setSelectedJson(null)} className="text-slate-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-slate-900 overflow-auto max-h-[400px]">
              <pre className="text-xs font-mono text-emerald-400">
                {JSON.stringify(selectedJson, null, 2)}
              </pre>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
              <button 
                onClick={() => setSelectedJson(null)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ResultsView;