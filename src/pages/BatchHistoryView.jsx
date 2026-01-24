import { useState, useEffect } from 'react';
import api from '../services/api'; 
import { 
  FileSpreadsheet, // Icono para indicar que es un CSV/Excel
  Calendar, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  Download,
  Loader2
} from 'lucide-react';

const BatchHistoryView = () => {
  // Estados
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); 
  const [meta, setMeta] = useState({
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
    size: 10
  });

  // Función para obtener datos
  const fetchBatchHistory = async (pageNumber) => {
    setLoading(true);
    try {
      // Asumiendo que tu controller está en /api/predicciones
      const response = await api.get(`/api/predicciones/batch?page=${pageNumber}&size=10&sort=fechaSolicitud,desc`);
      const data = response.data;

      setBatches(data.content);
      setMeta({
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        first: data.first,
        last: data.last,
        size: data.size,
        number: data.number
      });
    } catch (error) {
      console.error("Error cargando historial batch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchHistory(page);
  }, [page]);

  // Formato de fecha
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Badge de estado
  const getStatusBadge = (estado) => {
    if (estado === 'COMPLETADA') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={12} /> Procesado
        </span>
      );
    } else if (estado === 'ERROR') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
          <XCircle size={12} /> Error
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
        <Loader2 size={12} className="animate-spin" /> Procesando
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="text-emerald-600" />
            Historial de Cargas Masivas
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestión y descarga de reportes generados desde archivos CSV.
          </p>
        </div>
        
        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">
          Archivos procesados: <span className="text-slate-900 font-bold">{meta.totalElements}</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="animate-spin text-emerald-500 mx-auto h-8 w-8 mb-2" />
            <p className="text-slate-400">Cargando archivos...</p>
          </div>
        ) : batches.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileSpreadsheet className="mx-auto h-12 w-12 mb-3 opacity-20" />
            <p>No se han realizado cargas masivas aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-xs font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4 w-16 text-center">ID</th>
                  <th className="p-4">Archivo / Descripción</th>
                  <th className="p-4 w-48">Fecha Carga</th>
                  <th className="p-4 w-40">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map((item) => (
                  <tr key={item.idSolicitud} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4 text-center font-mono text-slate-400 font-bold">
                      #{item.idSolicitud}
                    </td>
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-50 p-2 rounded text-emerald-600 mt-0.5">
                          <FileSpreadsheet size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">
                            {item.descripcion || "Sin nombre"}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Reporte CSV
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {formatDate(item.fechaSolicitud)}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(item.estado)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {!loading && batches.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Página <span className="text-slate-900 font-bold">{meta.number + 1}</span> de <span className="text-slate-900 font-bold">{meta.totalPages}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={meta.first}
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
              >
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
              
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={meta.last}
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
              >
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchHistoryView;