
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  category?: string;
}

interface ExpenseSectionProps {
  fixedExpenses: Transaction[];
  variableExpenses: Transaction[];
  onUpdateFixedExpenses: (expenses: Transaction[]) => void;
  onUpdateVariableExpenses: (expenses: Transaction[]) => void;
}

const ExpenseSection: React.FC<ExpenseSectionProps> = ({
  fixedExpenses,
  variableExpenses,
  onUpdateFixedExpenses,
  onUpdateVariableExpenses
}) => {
  const [activeTab, setActiveTab] = useState<'fixed' | 'variable'>('fixed');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editValues, setEditValues] = useState<Partial<Transaction>>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const currentExpenses = activeTab === 'fixed' ? fixedExpenses : variableExpenses;
  const updateExpenses = activeTab === 'fixed' ? onUpdateFixedExpenses : onUpdateVariableExpenses;

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditValues(transaction);
  };

  const handleSave = () => {
    if (!editingId || !editValues) return;

    const updatedExpenses = currentExpenses.map(expense =>
      expense.id === editingId ? { ...expense, ...editValues } : expense
    );

    updateExpenses(updatedExpenses);
    setEditingId(null);
    setEditValues({});
  };

  const handleDelete = (id: string) => {
    const updatedExpenses = currentExpenses.filter(expense => expense.id !== id);
    updateExpenses(updatedExpenses);
  };

  const handleAdd = () => {
    if (!editValues.description || !editValues.amount || !editValues.date) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: editValues.description || '',
      date: editValues.date || '',
      amount: Number(editValues.amount) || 0,
      type: editValues.type || 'debit',
      category: editValues.category || ''
    };

    updateExpenses([...currentExpenses, newTransaction]);
    setEditValues({});
    setIsAdding(false);
  };

  const totalFixed = fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalVariable = variableExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Gerenciamento de Despesas</h3>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-gray-600">Despesas Fixas</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totalFixed)}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-600">Despesas Variáveis</p>
          <p className="text-xl font-bold text-orange-600">{formatCurrency(totalVariable)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('fixed')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'fixed'
              ? 'bg-white text-gray-900 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Despesas Fixas ({fixedExpenses.length})
        </button>
        <button
          onClick={() => setActiveTab('variable')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'variable'
              ? 'bg-white text-gray-900 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Despesas Variáveis ({variableExpenses.length})
        </button>
      </div>

      {/* Add Transaction Form */}
      {isAdding && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h4 className="font-medium mb-3">Nova Transação</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Descrição"
              value={editValues.description || ''}
              onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
            />
            <Input
              type="date"
              value={editValues.date || ''}
              onChange={(e) => setEditValues({ ...editValues, date: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Valor (R$)"
              value={editValues.amount || ''}
              onChange={(e) => setEditValues({ ...editValues, amount: Number(e.target.value) })}
            />
            <select
              value={editValues.type || 'debit'}
              onChange={(e) => setEditValues({ ...editValues, type: e.target.value as 'credit' | 'debit' })}
              className="p-2 border rounded"
            >
              <option value="debit">Débito</option>
              <option value="credit">Crédito</option>
            </select>
            {activeTab === 'variable' && (
              <Input
                placeholder="Categoria"
                value={editValues.category || ''}
                onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
              />
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <Button onClick={handleAdd} size="sm" className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4" />
            </Button>
            <Button onClick={() => setIsAdding(false)} size="sm" variant="outline">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="space-y-2">
        {currentExpenses.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            {editingId === transaction.id ? (
              <div className="flex-1 grid grid-cols-4 gap-2">
                <Input
                  value={editValues.description || ''}
                  onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                  className="text-sm"
                />
                <Input
                  type="date"
                  value={editValues.date || ''}
                  onChange={(e) => setEditValues({ ...editValues, date: e.target.value })}
                  className="text-sm"
                />
                <Input
                  type="number"
                  value={editValues.amount || ''}
                  onChange={(e) => setEditValues({ ...editValues, amount: Number(e.target.value) })}
                  className="text-sm"
                />
                <div className="flex gap-1">
                  <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button onClick={() => setEditingId(null)} size="sm" variant="outline">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div>
                    <p className="font-medium text-gray-800">{transaction.description}</p>
                    {transaction.category && (
                      <p className="text-xs text-gray-500">{transaction.category}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                  <p className={`font-semibold ${transaction.type === 'credit' ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(transaction.amount)}
                  </p>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.type === 'credit' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'credit' ? 'Crédito' : 'Débito'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(transaction)} size="sm" variant="ghost">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleDelete(transaction.id)} size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {currentExpenses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma transação encontrada</p>
          <p className="text-sm">Clique em "Nova Transação" para começar</p>
        </div>
      )}
    </Card>
  );
};

export default ExpenseSection;
