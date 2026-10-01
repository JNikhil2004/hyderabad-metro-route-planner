import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Train, Users, TrendingUp, MapPin, 
  Plus, Edit2, Trash2, Save, X, Search 
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const AdminDashboardPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stations');
  const [stations, setStations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [editingStation, setEditingStation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStation, setNewStation] = useState({ station_name: '', line: 'Red', fare_zone: 1, connections: '' });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [stationsRes, statsRes] = await Promise.all([
        api.get('/stations/'),
        api.get('/stations/stats/overview')
      ]);
      setStations(stationsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setToast({ message: 'Failed to load admin data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStation = async (e) => {
    e.preventDefault();
    try {
      const connections = newStation.connections.split(',').map(c => c.trim()).filter(Boolean);
      await api.post('/stations/', { ...newStation, connections });
      setToast({ message: 'Station added successfully', type: 'success' });
      setShowAddForm(false);
      setNewStation({ station_name: '', line: 'Red', fare_zone: 1, connections: '' });
      fetchData();
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to add station', type: 'error' });
    }
  };

  const handleUpdateStation = async (e) => {
    e.preventDefault();
    try {
      const connections = editingStation.connections;
      await api.put(`/stations/${editingStation.id}`, { ...editingStation, connections });
      setToast({ message: 'Station updated successfully', type: 'success' });
      setEditingStation(null);
      fetchData();
    } catch (err) {
      setToast({ message: 'Failed to update station', type: 'error' });
    }
  };

  const handleDeleteStation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this station?')) return;
    try {
      await api.delete(`/stations/${id}`);
      setToast({ message: 'Station deleted', type: 'success' });
      fetchData();
    } catch (err) {
      setToast({ message: 'Failed to delete station', type: 'error' });
    }
  };

  const lineColors = {
    'Red': 'bg-red-100 text-red-700',
    'Blue': 'bg-blue-100 text-blue-700',
    'Green': 'bg-green-100 text-green-700'
  };

  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <Train className="h-5 w-5 text-red-600" />
              <span className="text-sm text-slate-500">Total Stations</span>
            </div>
            <span className="text-3xl font-bold text-slate-800">{stats.total_stations || 0}</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-slate-500">Red Line</span>
            </div>
            <span className="text-3xl font-bold text-slate-800">{stats.red_line_stations || 0}</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-500">Blue Line</span>
            </div>
            <span className="text-3xl font-bold text-slate-800">{stats.blue_line_stations || 0}</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-slate-500">Green Line</span>
            </div>
            <span className="text-3xl font-bold text-slate-800">{stats.green_line_stations || 0}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('stations')}
              className={`px-6 py-4 font-medium transition ${activeTab === 'stations' ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Stations
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 font-medium transition ${activeTab === 'analytics' ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Analytics
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'stations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Manage Stations</h2>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
                  >
                    <Plus className="h-4 w-4" />
                    Add Station
                  </button>
                </div>

                {showAddForm && (
                  <form onSubmit={handleAddStation} className="bg-slate-50 rounded-xl p-6 mb-6 space-y-4">
                    <h3 className="font-semibold text-slate-700">Add New Station</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Station Name"
                        value={newStation.station_name}
                        onChange={(e) => setNewStation({...newStation, station_name: e.target.value})}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        required
                      />
                      <select
                        value={newStation.line}
                        onChange={(e) => setNewStation({...newStation, line: e.target.value})}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                      >
                        <option value="Red">Red Line</option>
                        <option value="Blue">Blue Line</option>
                        <option value="Green">Green Line</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Fare Zone (1-5)"
                        min="1"
                        max="5"
                        value={newStation.fare_zone}
                        onChange={(e) => setNewStation({...newStation, fare_zone: parseInt(e.target.value)})}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Connections (comma-separated station names)"
                      value={newStation.connections}
                      onChange={(e) => setNewStation({...newStation, connections: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <div className="flex gap-3">
                      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                        <Save className="h-4 w-4" /> Save
                      </button>
                      <button type="button" onClick={() => setShowAddForm(false)} className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                        <X className="h-4 w-4" /> Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Station</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Line</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Zone</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-600">Connections</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stations.map((station) => (
                        <tr key={station.id} className="border-b border-slate-100 hover:bg-slate-50">
                          {editingStation?.id === station.id ? (
                            <td colSpan="5" className="py-4 px-4">
                              <form onSubmit={handleUpdateStation} className="flex flex-wrap gap-3 items-center">
                                <input
                                  type="text"
                                  value={editingStation.station_name}
                                  onChange={(e) => setEditingStation({...editingStation, station_name: e.target.value})}
                                  className="px-3 py-1 border border-slate-200 rounded-lg text-sm"
                                />
                                <select
                                  value={editingStation.line}
                                  onChange={(e) => setEditingStation({...editingStation, line: e.target.value})}
                                  className="px-3 py-1 border border-slate-200 rounded-lg text-sm"
                                >
                                  <option value="Red">Red</option>
                                  <option value="Blue">Blue</option>
                                  <option value="Green">Green</option>
                                </select>
                                <input
                                  type="number"
                                  value={editingStation.fare_zone}
                                  onChange={(e) => setEditingStation({...editingStation, fare_zone: parseInt(e.target.value)})}
                                  className="px-3 py-1 border border-slate-200 rounded-lg text-sm w-20"
                                />
                                <button type="submit" className="text-green-600 hover:text-green-700">
                                  <Save className="h-4 w-4" />
                                </button>
                                <button type="button" onClick={() => setEditingStation(null)} className="text-slate-400 hover:text-slate-600">
                                  <X className="h-4 w-4" />
                                </button>
                              </form>
                            </td>
                          ) : (
                            <>
                              <td className="py-3 px-4 font-medium text-slate-800">{station.station_name}</td>
                              <td className="py-3 px-4">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${lineColors[station.line]}`}>
                                  {station.line}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600">{station.fare_zone}</td>
                              <td className="py-3 px-4 text-sm text-slate-500 max-w-xs truncate">
                                {station.connections?.join(', ')}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => setEditingStation(station)}
                                  className="text-blue-500 hover:text-blue-700 mr-3"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStation(station.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600">Analytics Coming Soon</h3>
                <p className="text-slate-400 mt-2">Route statistics and search analytics will be available here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
