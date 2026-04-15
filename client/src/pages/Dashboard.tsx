import { BarChart3, TrendingUp, Users, DollarSign, Activity, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

export default function Dashboard() {
  const { data: dbDeals, isLoading: dealsLoading } = trpc.crm.listDeals.useQuery();
  const { data: dbContacts, isLoading: contactsLoading } = trpc.crm.listContacts.useQuery();
  const { data: dbStages, isLoading: stagesLoading } = trpc.crm.listStages.useQuery();

  const isLoading = dealsLoading || contactsLoading || stagesLoading;

  const { kpis, recentDeals, stats } = useMemo(() => {
    if (!dbDeals || !dbContacts || !dbStages) {
      return { kpis: [], recentDeals: [], stats: { contacts: 0, wonDeals: 0 } };
    }

    const totalRevenue = dbDeals.reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0);
    const openDeals = dbDeals.filter(d => d.status === "open").length;
    const totalContacts = dbContacts.length;
    
    // Won deals: status is won or in the last stage
    const lastStageId = dbStages.sort((a, b) => b.order - a.order)[0]?.id;
    const wonDeals = dbDeals.filter(d => d.status === "won" || d.stageId === lastStageId).length;
    const conversionRate = dbDeals.length > 0 ? (wonDeals / dbDeals.length) * 100 : 0;

    const kpiList = [
      {
        title: "Receita Total",
        value: `R$ ${totalRevenue.toLocaleString()}`,
        change: "+12.5%", // Estático por enquanto
        icon: DollarSign,
        color: "bg-green-100 text-green-600",
      },
      {
        title: "Oportunidades Abertas",
        value: String(openDeals),
        change: "+3",
        icon: TrendingUp,
        color: "bg-blue-100 text-blue-600",
      },
      {
        title: "Contatos",
        value: String(totalContacts),
        change: "+8",
        icon: Users,
        color: "bg-purple-100 text-purple-600",
      },
      {
        title: "Taxa de Conversão",
        value: `${conversionRate.toFixed(1)}%`,
        change: "+2.3%",
        icon: Activity,
        color: "bg-orange-100 text-orange-600",
      },
    ];

    const sortedDeals = [...dbDeals]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map(d => {
        const stage = dbStages.find(s => s.id === d.stageId)?.name || "N/A";
        const date = new Date(d.createdAt).toLocaleDateString();
        return {
          id: d.id,
          title: d.title,
          value: `R$ ${(parseFloat(d.value) || 0).toLocaleString()}`,
          stage,
          date
        };
      });

    return {
      kpis: kpiList,
      recentDeals: sortedDeals,
      stats: {
        contacts: totalContacts,
        wonDeals: wonDeals
      }
    };
  }, [dbDeals, dbContacts, dbStages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const upcomingTasks = [
    { id: 1, title: "Ligar para Cliente ABC", dueDate: "Hoje", priority: "high" },
    { id: 2, title: "Enviar proposta para XYZ", dueDate: "Amanhã", priority: "high" },
    { id: 3, title: "Reunião com gerente de vendas", dueDate: "Quarta", priority: "medium" },
    { id: 4, title: "Atualizar pipeline", dueDate: "Sexta", priority: "low" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Visão geral do seu CRM em tempo real</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${kpi.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
                  <span className="text-sm text-green-600 font-medium">{kpi.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Deals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Oportunidades Recentes</CardTitle>
            <CardDescription>Últimas oportunidades criadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeals.map((deal: any) => (
                <div key={deal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{deal.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{deal.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{deal.value}</p>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mt-1">
                      {deal.stage}
                    </span>
                  </div>
                </div>
              ))}
              {recentDeals.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhuma oportunidade encontrada</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Tarefas</CardTitle>
            <CardDescription>Suas atividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      {task.dueDate}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={24} />
            Estatísticas do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.contacts}</p>
              <p className="text-sm text-gray-600 mt-1">Contatos Totais</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.wonDeals}</p>
              <p className="text-sm text-gray-600 mt-1">Deals Fechados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-600 mt-1">Emails Enviados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">0</p>
              <p className="text-sm text-gray-600 mt-1">Chamadas Realizadas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

