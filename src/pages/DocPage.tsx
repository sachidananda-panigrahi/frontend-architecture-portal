import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, GitBranch } from 'lucide-react';
import { documents } from '../data/documents';
import { renderSection } from '../components/DocElements';

export function DocPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const allDocs = documents;
  const docIndex = allDocs.findIndex((d) => d.id === id);
  const doc = allDocs[docIndex];
  const prev = docIndex > 0 ? allDocs[docIndex - 1] : null;
  const next = docIndex < allDocs.length - 1 ? allDocs[docIndex + 1] : null;

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-slate-300 mb-2">Document not found</h2>
        <p className="text-slate-500 text-sm mb-6">No document with id "{id}"</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-lg bg-hira-700 text-white text-sm hover:bg-hira-600 transition-colors"
        >
          Back to diagram
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-950">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-slate-500 mb-6"
        >
          <Link to="/" className="hover:text-slate-300 transition-colors flex items-center gap-1">
            <GitBranch size={11} />
            Diagram
          </Link>
          <span>/</span>
          <span className="text-slate-400">{doc.category}</span>
          <span>/</span>
          <span className="text-slate-300">{doc.title}</span>
        </motion.div>

        {/* title block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{doc.icon}</span>
            <div>
              <div className="text-xs text-hira-400 font-medium uppercase tracking-wide mb-0.5">
                {doc.category}
              </div>
              <h1 className="text-2xl font-bold text-white leading-tight">{doc.title}</h1>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-6 border-l-2 border-hira-700 pl-4">
            {doc.description}
          </p>
        </motion.div>

        {/* sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {doc.sections.map((section, idx) => renderSection(section, idx))}
        </motion.div>

        {/* prev / next nav */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
          {prev ? (
            <button
              onClick={() => navigate(`/docs/${prev.id}`)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-slate-600 mb-0.5">Previous</div>
                <span>{prev.icon} {prev.title}</span>
              </div>
            </button>
          ) : <div />}

          {next ? (
            <button
              onClick={() => navigate(`/docs/${next.id}`)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group text-right"
            >
              <div>
                <div className="text-xs text-slate-600 mb-0.5">Next</div>
                <span>{next.icon} {next.title}</span>
              </div>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
