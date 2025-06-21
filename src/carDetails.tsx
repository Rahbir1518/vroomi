import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { Car, Plus, Edit, Trash2, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { dbHelpers, setSupabaseSession } from './lib/supabase';

interface CarData {
  id?: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  license: string;
  seats: number;
  created_at?: string;
  updated_at?: string;
}

interface CarDetailsProps {
  onCarSelect?: (car: CarData) => void;
  selectedCarId?: string;
}

export default function CarDetails({ onCarSelect, selectedCarId }: CarDetailsProps) {
  const { user } = useUser();
  const [cars, setCars] = useState<CarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<CarData | null>(null);

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license: '',
    seats: 4
  });

  // 🛡 Setup Supabase session once per user login
  useEffect(() => {
    const setupSupabaseAuth = async () => {
      if (user) {
        try {
          const token = await (user as any).getToken?.({ template: 'supabase' });
          if (!token) throw new Error('No Supabase token returned by Clerk');

          await setSupabaseSession(token);
          setError('');
          loadCars(); // Load data after session is set
        } catch (err) {
          console.error('Supabase session error:', err);
          setError('Authentication failed. Please sign out and back in.');
        }
      }
    };

    setupSupabaseAuth();
  }, [user]);

  const loadCars = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const userCars = await dbHelpers.getCarsByUserId(user.id);
      setCars(userCars);
    } catch (err) {
      console.error('Error loading cars:', err);
      setError('Failed to load your cars');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      license: '',
      seats: 4
    });
    setEditingCar(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    setError('');

    try {
      if (editingCar) {
        const updatedCar = await dbHelpers.updateCar(editingCar.id!, formData);
        setCars(prev => prev.map(car => car.id === editingCar.id ? updatedCar : car));
        setSuccess('Car updated successfully!');
      } else {
        const newCar = await dbHelpers.createCar({ ...formData, user_id: user.id });
        setCars(prev => [...prev, newCar]);
        setSuccess('Car added successfully!');
      }

      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving car:', err);
      setError('Failed to save car. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (car: CarData) => {
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      license: car.license,
      seats: car.seats
    });
    setEditingCar(car);
    setShowForm(true);
  };

  const handleDelete = async (carId: string) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    setIsLoading(true);
    try {
      await dbHelpers.deleteCar(carId);
      setCars(prev => prev.filter(car => car.id !== carId));
      setSuccess('Car deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting car:', err);
      setError('Failed to delete car. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCarSelect = (car: CarData) => {
    onCarSelect?.(car);
  };

  if (isLoading && cars.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading your cars...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Success + Error Alerts */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Car className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Your Vehicles</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Car</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{editingCar ? 'Edit Car' : 'Add New Car'}</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={e => setFormData({ ...formData, make: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                <select
                  value={formData.seats}
                  onChange={e => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(seat => (
                    <option key={seat} value={seat}>{seat} {seat === 1 ? 'seat' : 'seats'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <input
                type="text"
                value={formData.license}
                onChange={e => setFormData({ ...formData, license: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : editingCar ? 'Update Car' : 'Add Car'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Car List */}
      {cars.length === 0 ? (
        <div className="text-center py-8">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cars added yet</h3>
          <p className="text-gray-600 mb-4">Add your first car to start offering rides</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Your First Car
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedCarId === car.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleCarSelect(car)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {car.year} {car.make} {car.model}
                    </h4>
                    <p className="text-sm text-gray-600">
                      License: {car.license} • {car.seats} seats available
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(car);
                    }}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(car.id!);
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
