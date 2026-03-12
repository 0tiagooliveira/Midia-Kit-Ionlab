import { MANUAIS } from '../constants';
import ManualCard from '../components/ManualCard';
import { motion } from 'motion/react';

export default function Manuais() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Manuais</h1>
        <p className="text-gray-500 max-w-2xl">
          Documentação técnica, guias de usuário e manuais de identidade visual da IonLab em formato PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MANUAIS.map((manual, idx) => (
          <motion.div
            key={manual.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <ManualCard manual={manual} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
