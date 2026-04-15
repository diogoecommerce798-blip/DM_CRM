import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

export default function Reports() {
  const { data: dbDeals, isLoading: dealsLoading } = trpc.crm.listDeals.useQuery();
  const { data: dbStages, isLoading: stagesLoading } = trpc.crm.listStages.useQuery();
  const { data: dbUsers, isLoading: usersLoading } = trpc.crm.listUsers.useQuery();

  const isLoading = dealsLoading || stagesLoading || usersLoading;

  // Processar dados reais
  const {
    revenueData,
    dealsByStage,
    dealsByOwner,
    conversionData,
    totalRevenue,
    wonRevenue,
    prevMonthRevenue,
    prevMonthWonRevenue
  } = useMemo(() => {
    if (!dbDeals || !dbStages || !dbUsers) {
      return {
        revenueData: [],
        dealsByStage: [],
        dealsByOwner: [],
        conversionData: [],
        totalRevenue: 0,
        wonRevenue: 0,
        prevMonthRevenue: 0,
        prevMonthWonRevenue: 0
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Receita por Mês (últimos 6 meses)
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(now.getMonth() - (5 - i));
      return { 
        month: monthNames[d.getMonth()], 
        revenue: 0, 
        target: 50000, // Meta fixa por enquanto
        monthIdx: d.getMonth(),
        year: d.getFullYear()
      };
    });

    dbDeals.forEach(deal => {
      const dealDate = new Date(deal.createdAt);
      const val = parseFloat(deal.value) || 0;
      
      const monthIdx = dealDate.getMonth();
      const year = dealDate.getFullYear();
      
      const chartMonth = last6Months.find(m => m.monthIdx === monthIdx && m.year === year);
      if (chartMonth) {
        chartMonth.revenue += val;
      }
    });

    // 2. Deals por Estágio
    const stageMap = dbStages.reduce((acc, stage) => {
      acc[stage.id] = { stage: stage.name, deals: 0, revenue: 0 };
      return acc;
    }, {} as Record<number, any>);

    dbDeals.forEach(deal => {
      const val = parseFloat(deal.value) || 0;
      if (stageMap[deal.stageId]) {
        stageMap[deal.stageId].deals += 1;
        stageMap[deal.stageId].revenue += val;
      }
    });
    const dealsByStage = Object.values(stageMap);

    // 3. Deals por Vendedor
    const userMap = dbUsers.reduce((acc, user) => {
      acc[user.id] = { owner: user.name || user.email || `User ${user.id}`, deals: 0, revenue: 0 };
      return acc;
    }, {} as Record<number, any>);

    dbDeals.forEach(deal => {
      const val = parseFloat(deal.value) || 0;
      const ownerId = deal.ownerId || 1; // Default fallback
      if (userMap[ownerId]) {
        userMap[ownerId].deals += 1;
        userMap[ownerId].revenue += val;
      }
    });
    const dealsByOwner = Object.values(userMap);

    // 4. Funil de Conversão (Simplificado pela distribuição atual)
    const totalDeals = dbDeals.length || 1;
    const sortedStages = [...dbStages].sort((a, b) => a.order - b.order);
    const conversionData = [];
    for (let i = 0; i < sortedStages.length - 1; i++) {
      const currentStage = stageMap[sortedStages[i].id]?.deals || 0;
      const nextStage = stageMap[sortedStages[i+1].id]?.deals || 0;
      const rate = currentStage > 0 ? Math.round((nextStage / currentStage) * 100) : 0;
      conversionData.push({
        name: `${sortedStages[i].name} → ${sortedStages[i+1].name}`,
        value: Math.min(rate, 100)
      });
    }

    // KPI Calculations
    let totalRevenue = 0;
    let wonRevenue = 0;
    let prevMonthRevenue = 0;
    let prevMonthWonRevenue = 0;

    const lastMonthDate = new Date();
    lastMonthDate.setMonth(now.getMonth() - 1);

    dbDeals.forEach(deal => {
      const val = parseFloat(deal.value) || 0;
      const dealDate = new Date(deal.createdAt);
      const isWon = deal.status === "won" || deal.stageId === sortedStages[sortedStages.length - 1].id; // Se for o último estágio

      totalRevenue += val;
      if (isWon) wonRevenue += val;

      if (dealDate.getMonth() === lastMonthDate.getMonth() && dealDate.getFullYear() === lastMonthDate.getFullYear()) {
        prevMonthRevenue += val;
        if (isWon) prevMonthWonRevenue += val;
      }
    });

    return {
      revenueData: last6Months,
      dealsByStage,
      dealsByOwner,
      conversionData: conversionData.length > 0 ? conversionData : [
        { name: "Prospecção → Qualificação", value: 0 },
        { name: "Qualificação → Proposta", value: 0 },
        { name: "Proposta → Negociação", value: 0 },
        { name: "Negociação → Fechado", value: 0 },
      ],
      totalRevenue,
      wonRevenue,
      prevMonthRevenue,
      prevMonthWonRevenue
    };
  }, [dbDeals, dbStages, dbUsers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Relatórios e BI</h2>
          <p className="text-gray-500 mt-1">Análise de vendas e desempenho em tempo real</p>
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
            <CardTitle className="text-sm font-medium text-gray-600">Total em Pipeline (Oportunidades)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">R$ {totalRevenue.toLocaleString()}</span>
              {prevMonthRevenue > 0 && (
                <span className={`text-sm font-medium ${totalRevenue >= prevMonthRevenue ? "text-green-600" : "text-red-600"}`}>
                  {totalRevenue >= prevMonthRevenue ? "+" : ""}{((totalRevenue / prevMonthRevenue - 1) * 100).toFixed(1)}%
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Mês anterior: R$ {prevMonthRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Faturamento de negócios ganhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">R$ {wonRevenue.toLocaleString()}</span>
              {prevMonthWonRevenue > 0 && (
                <span className={`text-sm font-medium ${wonRevenue >= prevMonthWonRevenue ? "text-green-600" : "text-red-600"}`}>
                  {wonRevenue >= prevMonthWonRevenue ? "+" : ""}{((wonRevenue / prevMonthWonRevenue - 1) * 100).toFixed(1)}%
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Mês anterior: R$ {prevMonthWonRevenue.toLocaleString()}</p>
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
                <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Receita Real" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#10b981" name="Meta" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deals by Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Estágio</CardTitle>
            <CardDescription>Quantidade de negócios em cada etapa</CardDescription>
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
            <CardTitle>Desempenho por Vendedor</CardTitle>
            <CardDescription>Receita em pipeline por cada vendedor</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealsByOwner} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="owner" type="category" width={120} />
                <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#10b981" name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Taxas de Conversão do Funil</CardTitle>
            <CardDescription>Percentual de avanço entre estágios</CardDescription>
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
              {conversionData.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Sem dados de conversão suficientes</p>
              )}
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
                </tr>
              </thead>
              <tbody>
                {dealsByOwner.map((owner, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{owner.owner}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{owner.deals}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      R$ {owner.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      R$ {owner.deals > 0 ? (owner.revenue / owner.deals).toLocaleString() : "0"}
                    </td>
                  </tr>
                ))}
                {dealsByOwner.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">Nenhum dado disponível</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

