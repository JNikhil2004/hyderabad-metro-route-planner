import { Train, MapPin, ArrowRight } from 'lucide-react';

const StationCard = ({ station, onClick }) => {
  const lineColors = {
    'Red': 'border-l-red-500 bg-red-50',
    'Blue': 'border-l-blue-500 bg-blue-50',
    'Green': 'border-l-green-500 bg-green-50'
  };

  const badgeColors = {
    'Red': 'bg-red-100 text-red-700',
    'Blue': 'bg-blue-100 text-blue-700',
    'Green': 'bg-green-100 text-green-700'
  };

  return (
    <div 
      onClick={onClick}
      className={`border-l-4 ${lineColors[station.line] || 'border-l-slate-400'} rounded-r-xl p-4 hover:shadow-md transition cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-slate-400" />
          <div>
            <h4 className="font-semibold text-slate-800">{station.station_name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColors[station.line]}`}>
                {station.line} Line
              </span>
              <span className="text-xs text-slate-500">Zone {station.fare_zone}</span>
            </div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-slate-300" />
      </div>
      {station.connections && station.connections.length > 0 && (
        <div className="mt-2 text-xs text-slate-500">
          Connects to: {station.connections.slice(0, 3).join(', ')}
          {station.connections.length > 3 && '...'}
        </div>
      )}
    </div>
  );
};

export default StationCard;
