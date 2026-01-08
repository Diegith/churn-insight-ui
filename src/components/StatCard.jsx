import { Users, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';

const icons = {
  users: <Users className="text-blue-600" />,
  alert: <AlertTriangle className="text-red-600" />,
  trending: <TrendingDown className="text-green-600" />,
  dollar: <DollarSign className="text-purple-600" />,
};

export const StatCard = ({ label, value, change, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <span className={`text-xs font-semibold ${change.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
          {change} vs mes anterior
        </span>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">{icons[icon]}</div>
    </div>
  </div>
);