import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface Content {
  id: string;
  title: string;
  description: string;
  type: string;
  fileUrl: string;
  createdAt: string;
}

interface IndustryDetail {
  id: string;
  name: string;
  description: string;
  content: Content[];
}

export default function IndustryDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useQuery(
    ['industry', id],
    async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/industries/${id}`);
      return response.data;
    },
    { enabled: !!id }
  );

  if (isLoading) return <div className="text-center py-20 text-slate-400">Loading...</div>;

  const industry: IndustryDetail = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">{industry?.name}</h1>
          <p className="text-slate-400 text-lg">{industry?.description}</p>
        </motion.div>

        <div className="grid gap-6">
          {industry?.content?.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 5 }}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-lg hover:border-blue-500 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2">{item.title}</h2>
                  <p className="text-slate-400">{item.description}</p>
                </div>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm ml-4">
                  {item.type}
                </span>
              </div>
              <div className="flex gap-3 items-center text-sm text-slate-400">
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
