
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Check, X } from 'lucide-react';

interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  type: 'salary' | 'freelance' | 'investment' | 'other';
}

interface IncomePanelProps {
  incomeData: IncomeSource[];
  onUpdateIncome: (incomeData: IncomeSource[]) => void;
}

const IncomePanel: React.FC<IncomePanelProps> = ({ incomeData, onUpdateIncome }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; amount: string }>({ name: '', amount: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [newIncome, setNewIncome] = useState<{ name: string; amount: string; type: string }>({ 
    name: '', 
    amount: '', 
    type: 'other' 
  });

  const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const handleEdit = (income: IncomeSource) => {
    setEditingId(income.id);
    setEditValues({ name: income.name, amount: income.amount.toString() });
  };

  const handleSave = () => {
    if (!editingId) return;
    
    const updatedIncome = incomeData.map(income => 
      income.id === editingId 
        ? { ...income, name: editValues.name, amount: parseFloat(editValues.amount) || 0 }
        : income
    );
    
    onUpdateIncome(updatedIncome);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({ name: '', amount: '' });
  };

  const handleAdd = () => {
    if (!newIncome.name || !newIncome.amount) return;

    const newIncomeItem: IncomeSource = {
      id: Date.now().toString(),
      name: newIncome.name,
      amount: parseFloat(newIncome.amount),
      type: newIncome.type as IncomeSource['type']
    };

    onUpdateIncome([...incomeData, newIncomeItem]);
    setNewIncome({ name: '', amount: '', type: 'other' });
    setIsAdding(false);
  };

  return (
    <Card className="p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Renda Mensal</h3>
        <Button
          onClick={() => setIsAdding(true)}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </Button>
      </div>

      <div className="mb-6">
        <p className="text-2xl font-bold text-green-600 mb-2">
          {formatCurrency(totalIncome)}
        </p>
        <p className="text-sm text-gray-500">Total mensal</p>
      </div>

      <div className="space-y-3">
        {incomeData.map((income) => (
          <div key={income.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            {editingId === income.id ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={editValues.name}
                  onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                  placeholder="Nome da renda"
                  className="text-sm"
                />
                <Input
                  type="number"
                  value={editValues.amount}
                  onChange={(e) => setEditValues({ ...editValues, amount: e.target.value })}
                  placeholder="Valor"
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button onClick={handleCancel} size="sm" variant="outline">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-medium text-gray-800">{income.name}</p>
                  <p className="text-sm text-green-600 font-semibold">{formatCurrency(income.amount)}</p>
                </div>
                <Button onClick={() => handleEdit(income)} size="sm" variant="ghost">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        ))}

        {isAdding && (
          <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="space-y-2">
              <Input
                value={newIncome.name}
                onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
                placeholder="Nome da renda"
                className="text-sm"
              />
              <Input
                type="number"
                value={newIncome.amount}
                onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                placeholder="Valor (R$)"
                className="text-sm"
              />
              <select
                value={newIncome.type}
                onChange={(e) => setNewIncome({ ...newIncome, type: e.target.value })}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="salary">Salário</option>
                <option value="freelance">Freelance</option>
                <option value="investment">Investimento</option>
                <option value="other">Outro</option>
              </select>
              <div className="flex gap-2">
                <Button onClick={handleAdd} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check className="w-3 h-3" />
                </Button>
                <Button onClick={() => setIsAdding(false)} size="sm" variant="outline">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default IncomePanel;
