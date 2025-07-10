
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface FinanceHeaderProps {
  totalExpenses: number;
  totalBalance: number;
  despesaPercentage: number;
  monthlyChange: number;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  totalExpenses,
  totalBalance,
  despesaPercentage,
  monthlyChange
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <div className="w-full mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance Display */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-none shadow-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total Despesas</p>
            <h1 className="text-4xl font-bold text-red-600 mb-2">
              {formatCurrency(totalExpenses)}
            </h1>
            <div className="flex items-center justify-center gap-2">
              {monthlyChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-red-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-500" />
              )}
              <span className={`text-sm font-medium ${monthlyChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}% vs mês anterior
              </span>
            </div>
          </div>
        </Card>

        {/* Balance Card */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-none shadow-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Saldo Total</p>
            <h2 className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(totalBalance)}
            </h2>
            <p className="text-sm text-gray-500">Disponível</p>
          </div>
        </Card>

        {/* Despero Indicator */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-100 border-none shadow-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Desespero</p>
            <div className="relative w-24 h-24 mx-auto mb-2">
              <div className="w-24 h-24 rounded-full border-8 border-gray-200"></div>
              <div 
                className="absolute top-0 left-0 w-24 h-24 rounded-full border-8 border-red-500 border-t-transparent transform -rotate-90"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((despesaPercentage / 100) * 2 * Math.PI - Math.PI/2)}% ${50 + 50 * Math.sin((despesaPercentage / 100) * 2 * Math.PI - Math.PI/2)}%, 50% 0%)`
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-red-600">{despesaPercentage.toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">Gastos vs Renda</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinanceHeader;
