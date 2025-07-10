
import React, { useState, useEffect } from 'react';
import FinanceHeader from '@/components/FinanceHeader';
import IncomePanel from '@/components/IncomePanel';
import ExpenseSection from '@/components/ExpenseSection';
import VisualAnalytics from '@/components/VisualAnalytics';
import { toast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  category?: string;
}

interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  type: 'salary' | 'freelance' | 'investment' | 'other';
}

const Index = () => {
  const [incomeData, setIncomeData] = useState<IncomeSource[]>([
    {
      id: '1',
      name: 'Salário Principal',
      amount: 5000,
      type: 'salary'
    },
    {
      id: '2',
      name: 'Freelance',
      amount: 1500,
      type: 'freelance'
    }
  ]);

  const [fixedExpenses, setFixedExpenses] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Aluguel',
      date: '2024-07-01',
      amount: 1200,
      type: 'debit'
    },
    {
      id: '2',
      description: 'Internet',
      date: '2024-07-01',
      amount: 89.90,
      type: 'debit'
    },
    {
      id: '3',
      description: 'Energia Elétrica',
      date: '2024-07-05',
      amount: 150,
      type: 'debit'
    }
  ]);

  const [variableExpenses, setVariableExpenses] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Padaria',
      date: '2024-07-10',
      amount: 37.90,
      type: 'debit',
      category: 'Alimentação'
    },
    {
      id: '2',
      description: 'Supermercado',
      date: '2024-07-08',
      amount: 250,
      type: 'credit',
      category: 'Alimentação'
    },
    {
      id: '3',
      description: 'Combustível',
      date: '2024-07-07',
      amount: 120,
      type: 'debit',
      category: 'Transporte'
    }
  ]);

  // Calculate financial metrics
  const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = [...fixedExpenses, ...variableExpenses].reduce((sum, expense) => sum + expense.amount, 0);
  const totalBalance = totalIncome - totalExpenses;
  const despesaPercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const monthlyChange = 8.6; // Mock data for percentage change

  // Auto-save to localStorage
  useEffect(() => {
    const financeData = {
      incomeData,
      fixedExpenses,
      variableExpenses,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('financeApp_data', JSON.stringify(financeData));
    console.log('Data auto-saved to localStorage');
  }, [incomeData, fixedExpenses, variableExpenses]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('financeApp_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.incomeData) setIncomeData(parsedData.incomeData);
        if (parsedData.fixedExpenses) setFixedExpenses(parsedData.fixedExpenses);
        if (parsedData.variableExpenses) setVariableExpenses(parsedData.variableExpenses);
        
        toast({
          title: "Dados carregados",
          description: "Seus dados financeiros foram restaurados com sucesso.",
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados salvos.",
          variant: "destructive",
        });
      }
    }
  }, []);

  const handleUpdateIncome = (newIncomeData: IncomeSource[]) => {
    setIncomeData(newIncomeData);
    toast({
      title: "Renda atualizada",
      description: "Suas informações de renda foram atualizadas com sucesso.",
    });
  };

  const handleUpdateFixedExpenses = (newExpenses: Transaction[]) => {
    setFixedExpenses(newExpenses);
    toast({
      title: "Despesas fixas atualizadas",
      description: "Suas despesas fixas foram atualizadas com sucesso.",
    });
  };

  const handleUpdateVariableExpenses = (newExpenses: Transaction[]) => {
    setVariableExpenses(newExpenses);
    toast({
      title: "Despesas variáveis atualizadas",
      description: "Suas despesas variáveis foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Controle Financeiro Pessoal
          </h1>
          <p className="text-gray-600">
            Gerencie suas finanças com visualizações em tempo real
          </p>
        </div>

        {/* Finance Header */}
        <FinanceHeader
          totalExpenses={totalExpenses}
          totalBalance={totalBalance}
          despesaPercentage={despesaPercentage}
          monthlyChange={monthlyChange}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Income Panel */}
          <div className="lg:col-span-1">
            <IncomePanel
              incomeData={incomeData}
              onUpdateIncome={handleUpdateIncome}
            />
          </div>

          {/* Expense Section */}
          <div className="lg:col-span-2">
            <ExpenseSection
              fixedExpenses={fixedExpenses}
              variableExpenses={variableExpenses}
              onUpdateFixedExpenses={handleUpdateFixedExpenses}
              onUpdateVariableExpenses={handleUpdateVariableExpenses}
            />
          </div>

          {/* Visual Analytics */}
          <div className="lg:col-span-1">
            <VisualAnalytics
              incomeData={incomeData}
              fixedExpenses={fixedExpenses}
              variableExpenses={variableExpenses}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2024 Personal Finance App - Desenvolvido com React e Tailwind CSS</p>
          <p className="mt-1">Dados salvos automaticamente no seu navegador</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
