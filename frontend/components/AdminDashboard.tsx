import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Plus, Trash2, Upload as UploadIcon } from 'lucide-react';
import IndustryForm from './IndustryForm';
import ContentForm from './ContentForm';

interface Industry {
  id: string;
  name: string;
  description: string;
}

export default function AdminDashboard() {
  const [showIndustryForm, setShowIndustryForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: industries = [] } = useQuery('admin-industries', async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/industries`);
    return response.data;
  });

  const deleteIndustryMutation = useMutation(
    (id: string) => axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/industries/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-industries');
      },
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400">Manage industries and content</p>
          </div>
          <button
            onClick={() => setShowIndustryForm(!showIndustryForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Industry
          </button>
        </div>

        {/* Industry Form */}
        {showIndustryForm && <IndustryForm onClose={() => setShowIndustryForm(false)} />}

        {/* Content Form */}
        {showContentForm && selectedIndustry && (
          <ContentForm industryId={selectedIndustry} onClose={() => setShowContentForm(false)} />
        )}

        {/* Industries List */}
        <div className="grid gap-6">
          {industries.map((industry: Industry) => (
            <div
              key={industry.id}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-lg hover:border-blue-500 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-white">{industry.name}</h2>
                  <p className="text-slate-400">{industry.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedIndustry(industry.id);
                      setShowContentForm(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                  >
                    <UploadIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteIndustryMutation.mutate(industry.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
