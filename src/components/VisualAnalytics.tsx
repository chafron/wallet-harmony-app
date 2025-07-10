
import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

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

interface VisualAnalyticsProps {
  incomeData: IncomeSource[];
  fixedExpenses: Transaction[];
  variableExpenses: Transaction[];
}

const VisualAnalytics: React.FC<VisualAnalyticsProps> = ({
  incomeData,
  fixedExpenses,
  variableExpenses
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  // Generate daily expense data for the line chart
  const generateDailyData = () => {
    const allExpenses = [...fixedExpenses, ...variableExpenses];
    const dailyExpenses: { [key: string]: number } = {};

    // Initialize with current month days
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const day = i.toString().padStart(2, '0');
      dailyExpenses[day] = 0;
    }

    // Aggregate expenses by day
    allExpenses.forEach(expense => {
      const date = new Date(expense.date);
      const day = date.getDate().toString().padStart(2, '0');
      dailyExpenses[day] += expense.amount;
    });

    return Object.entries(dailyExpenses)
      .slice(0, 15) // Show first 15 days for better visualization
      .map(([day, amount]) => ({
        day: `${day}`,
        amount: amount,
        formattedAmount: formatCurrency(amount)
      }));
  };

  // Income vs Expenses comparison
  const getIncomeVsExpensesData = () => {
    const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = [...fixedExpenses, ...variableExpenses].reduce((sum, expense) => sum + expense.amount, 0);

    return [
      {
        name: 'Renda',
        amount: totalIncome,
        fill: '#10b981'
      },
      {
        name: 'Despesas',
        amount: totalExpenses,
        fill: '#ef4444'
      }
    ];
  };

  // Credit vs Debit breakdown
  const getCreditDebitData = () => {
    const allExpenses = [...fixedExpenses, ...variableExpenses];
    const creditTotal = allExpenses.filter(exp => exp.type === 'credit').reduce((sum, exp) => sum + exp.amount, 0);
    const debitTotal = allExpenses.filter(exp => exp.type === 'debit').reduce((sum, exp) => sum + exp.amount, 0);

    return [
      {
        name: 'Crédito',
        value: creditTotal,
        fill: '#3b82f6'
      },
      {
        name: 'Débito',
        value: debitTotal,
        fill: '#f97316'
      }
    ];
  };

  // Category breakdown for variable expenses
  const getCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {};
    
    variableExpenses.forEach(expense => {
      const category = expense.category || 'Outros';
      categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
    });

    const colors = ['#8b5cf6', '#06b6d4', '#84cc16', '#f59e0b', '#ef4444'];
    
    return Object.entries(categoryTotals).map(([category, amount], index) => ({
      name: category,
      value: amount,
      fill: colors[index % colors.length],
      percentage: ((amount / variableExpenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100).toFixed(1)
    }));
  };

  const dailyData = generateDailyData();
  const incomeVsExpensesData = getIncomeVsExpensesData();
  const creditDebitData = getCreditDebitData();
  const categoryData = getCategoryData();

  return (
    <div className="space-y-6">
      {/* Daily Spending Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tendência de Gastos Diários</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'Gastos']}
              labelFormatter={(label) => `Dia ${label}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Income vs Expenses */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Renda vs Despesas</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={incomeVsExpensesData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" stroke="#64748b" fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), '']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="amount" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Credit vs Debit Pie Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Crédito vs Débito</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={creditDebitData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {creditDebitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), '']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {creditDebitData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.fill }}
              ></div>
              <span className="text-sm text-gray-600">
                {item.name}: {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Despesas por Categoria</h3>
          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.fill }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{category.percentage}%</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatCurrency(category.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default VisualAnalytics;
