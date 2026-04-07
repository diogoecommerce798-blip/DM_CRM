import { BarChart3, TrendingUp, Users, DollarSign, Activity, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  // Mock data - será substituído por dados reais do banco
  const kpis = [
    {
      title: "Receita Total",
      value: "R$ 125.430",
      change: "+12.5%",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Oportunidades Abertas",
      value: "24",
      change: "+3",
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Contatos",
      value: "156",
      change: "+8",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Taxa de Conversão",
      value: "32.5%",
      change: "+2.3%",
      icon: Activity,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const recentDeals = [
    { id: 1, title: "Contrato com Empresa X", value: "R$ 45.000", stage: "Negociação", date: "2 dias atrás" },
    { id: 2, title: "Projeto de Consultoria", value: "R$ 32.000", stage: "Proposta", date: "5 dias atrás" },
    { id: 3, title: "Implementação de Software", value: "R$ 28.500", stage: "Qualificação", date: "1 semana atrás" },
  ];

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
        <p className="text-gray-500 mt-1">Visão geral do seu CRM</p>
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
              {recentDeals.map((deal) => (
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
            Estatísticas do Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">42</p>
              <p className="text-sm text-gray-600 mt-1">Contatos Adicionados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">18</p>
              <p className="text-sm text-gray-600 mt-1">Deals Fechados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">156</p>
              <p className="text-sm text-gray-600 mt-1">Emails Enviados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">89</p>
              <p className="text-sm text-gray-600 mt-1">Chamadas Realizadas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
