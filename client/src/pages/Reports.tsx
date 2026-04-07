import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";

export default function Reports() {
  // Mock data for charts
  const revenueData = [
    { month: "Jan", revenue: 45000, target: 50000 },
    { month: "Fev", revenue: 52000, target: 50000 },
    { month: "Mar", revenue: 48000, target: 50000 },
    { month: "Abr", revenue: 61000, target: 60000 },
    { month: "Mai", revenue: 55000, target: 60000 },
    { month: "Jun", revenue: 67000, target: 65000 },
  ];

  const dealsByStage = [
    { stage: "Prospecção", deals: 45, revenue: 125000 },
    { stage: "Qualificação", deals: 28, revenue: 95000 },
    { stage: "Proposta", deals: 18, revenue: 180000 },
    { stage: "Negociação", deals: 12, revenue: 220000 },
    { stage: "Fechado", deals: 8, revenue: 350000 },
  ];

  const dealsByOwner = [
    { owner: "Fernando Silva", deals: 24, revenue: 450000 },
    { owner: "Ana Costa", deals: 18, revenue: 380000 },
    { owner: "Pedro Ferreira", deals: 15, revenue: 320000 },
    { owner: "Maria Santos", deals: 12, revenue: 280000 },
  ];

  const conversionData = [
    { name: "Prospecção → Qualificação", value: 62 },
    { name: "Qualificação → Proposta", value: 64 },
    { name: "Proposta → Negociação", value: 67 },
    { name: "Negociação → Fechado", value: 67 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Relatórios e BI</h2>
          <p className="text-gray-500 mt-1">Análise de vendas e desempenho</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={20} />
            Filtrar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Download size={20} />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Faturamento Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">R$ 14.997</span>
              <span className="text-sm text-green-600 font-medium">+12.5%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Mês anterior: R$ 13.300</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Faturamento de negócios ganhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">R$ 502.934</span>
              <span className="text-sm text-green-600 font-medium">+8.3%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Mês anterior: R$ 464.500</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Mês</CardTitle>
            <CardDescription>Comparação entre receita real e meta</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Receita Real" />
                <Line type="monotone" dataKey="target" stroke="#10b981" name="Meta" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deals by Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Status de negócios por vendedor</CardTitle>
            <CardDescription>Distribuição de deals por estágio</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealsByStage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="deals" fill="#3b82f6" name="Quantidade de Deals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deals by Owner */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho de negócios por vendedor</CardTitle>
            <CardDescription>Receita gerada por cada vendedor</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealsByOwner} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="owner" type="category" width={120} />
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#10b981" name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Previsão do faturamento por mês</CardTitle>
            <CardDescription>Taxa de conversão por estágio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Vendas por Vendedor</CardTitle>
          <CardDescription>Detalhamento completo de performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vendedor</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Deals</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Receita</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Ticket Médio</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Taxa Conversão</th>
                </tr>
              </thead>
              <tbody>
                {dealsByOwner.map((owner, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{owner.owner}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{owner.deals}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      R$ {(owner.revenue / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      R$ {(owner.revenue / owner.deals / 1000).toFixed(1)}k
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {Math.round((owner.deals / 50) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
