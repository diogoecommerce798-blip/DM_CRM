import { useState } from "react";
import { Plus, Edit2, Trash2, Zap, Play, Pause, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Workflow {
  id: number;
  name: string;
  trigger: string;
  status: "active" | "inactive" | "paused";
  executions: number;
  lastRun: string;
  actions: string[];
}

interface WorkflowExecution {
  id: number;
  workflowId: number;
  workflowName: string;
  status: "success" | "failed" | "pending";
  executedAt: string;
  duration: string;
}

export default function Automation() {
  const [activeTab, setActiveTab] = useState("workflows");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 1,
      name: "Boas-vindas para novo lead",
      trigger: "Novo lead criado",
      status: "active",
      executions: 245,
      lastRun: "12 de mar de 2026, 14:30",
      actions: ["Enviar email", "Criar tarefa", "Notificar vendedor"],
    },
    {
      id: 2,
      name: "Lembrete de proposta pendente",
      trigger: "Deal em estágio 'Proposta' há 3 dias",
      status: "active",
      executions: 89,
      lastRun: "11 de mar de 2026, 09:15",
      actions: ["Enviar email", "Criar tarefa"],
    },
    {
      id: 3,
      name: "Atualizar score de lead",
      trigger: "Lead abre email",
      status: "paused",
      executions: 156,
      lastRun: "10 de mar de 2026, 16:45",
      actions: ["Atualizar campo customizado", "Notificar vendedor"],
    },
    {
      id: 4,
      name: "Fechar deal automaticamente",
      trigger: "Deal em estágio 'Fechado - Ganho'",
      status: "inactive",
      executions: 45,
      lastRun: "08 de mar de 2026, 11:20",
      actions: ["Criar fatura", "Enviar confirmação", "Atualizar CRM"],
    },
  ]);

  const [executions, setExecutions] = useState<WorkflowExecution[]>([
    {
      id: 1,
      workflowId: 1,
      workflowName: "Boas-vindas para novo lead",
      status: "success",
      executedAt: "12 de mar de 2026, 14:30",
      duration: "2.3s",
    },
    {
      id: 2,
      workflowId: 2,
      workflowName: "Lembrete de proposta pendente",
      status: "success",
      executedAt: "12 de mar de 2026, 09:00",
      duration: "1.8s",
    },
    {
      id: 3,
      workflowId: 1,
      workflowName: "Boas-vindas para novo lead",
      status: "failed",
      executedAt: "11 de mar de 2026, 16:45",
      duration: "0.5s",
    },
    {
      id: 4,
      workflowId: 3,
      workflowName: "Atualizar score de lead",
      status: "success",
      executedAt: "11 de mar de 2026, 14:20",
      duration: "1.2s",
    },
  ]);

  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    trigger: "",
    actions: [] as string[],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "paused":
        return "bg-yellow-100 text-yellow-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "paused":
        return "Pausado";
      case "inactive":
        return "Inativo";
      default:
        return status;
    }
  };

  const getExecutionStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getExecutionStatusLabel = (status: string) => {
    switch (status) {
      case "success":
        return "Sucesso";
      case "failed":
        return "Falha";
      case "pending":
        return "Pendente";
      default:
        return status;
    }
  };

  const handleCreateWorkflow = () => {
    if (newWorkflow.name && newWorkflow.trigger && newWorkflow.actions.length > 0) {
      const workflow: Workflow = {
        id: workflows.length + 1,
        name: newWorkflow.name,
        trigger: newWorkflow.trigger,
        status: "inactive",
        executions: 0,
        lastRun: "-",
        actions: newWorkflow.actions,
      };
      setWorkflows([...workflows, workflow]);
      setNewWorkflow({ name: "", trigger: "", actions: [] });
      setIsModalOpen(false);
    }
  };

  const toggleWorkflowStatus = (id: number) => {
    setWorkflows(
      workflows.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "active" ? "inactive" : "active" }
          : w
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Automação</h2>
          <p className="text-gray-500 mt-1">Crie e gerencie workflows automáticos</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Zap size={16} />
            <span className="hidden sm:inline">Workflows</span>
          </TabsTrigger>
          <TabsTrigger value="executions" className="flex items-center gap-2">
            <Clock size={16} />
            <span className="hidden sm:inline">Execuções</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Zap size={16} />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
        </TabsList>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Workflows</h3>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus size={16} className="mr-2" />
              Novo Workflow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Workflows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workflows.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Workflows Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workflows.filter((w) => w.status === "active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Execuções
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workflows.reduce((sum, w) => sum + w.executions, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{workflow.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Trigger:</span> {workflow.trigger}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {workflow.actions.map((action, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-4 text-xs text-gray-600">
                        <span>Execuções: {workflow.executions}</span>
                        <span>Última execução: {workflow.lastRun}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          workflow.status
                        )}`}
                      >
                        {getStatusLabel(workflow.status)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleWorkflowStatus(workflow.id)}
                      >
                        {workflow.status === "active" ? (
                          <>
                            <Pause size={14} className="mr-1" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play size={14} className="mr-1" />
                            Ativar
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-600"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Executions Tab */}
        <TabsContent value="executions" className="space-y-4">
          <h3 className="text-lg font-semibold">Histórico de Execuções</h3>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Workflow
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Data/Hora
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Duração</th>
                    </tr>
                  </thead>
                  <tbody>
                    {executions.map((execution) => (
                      <tr key={execution.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {execution.workflowName}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getExecutionStatusColor(
                              execution.status
                            )}`}
                          >
                            {getExecutionStatusLabel(execution.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {execution.executedAt}
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{execution.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <h3 className="text-lg font-semibold">Templates de Workflow</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Boas-vindas automáticas</CardTitle>
                <CardDescription>Enviar email de boas-vindas para novo lead</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Usar Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Acompanhamento de proposta</CardTitle>
                <CardDescription>Lembrar vendedor sobre propostas pendentes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Usar Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Atualizar lead score</CardTitle>
                <CardDescription>Aumentar score quando lead interage com email</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Usar Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Fechar deal automaticamente</CardTitle>
                <CardDescription>Criar fatura quando deal é fechado</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Workflow Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Workflow</DialogTitle>
            <DialogDescription>Crie um novo workflow automático</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workflow-name">Nome do Workflow</Label>
              <Input
                id="workflow-name"
                placeholder="Ex: Boas-vindas para novo lead"
                value={newWorkflow.name}
                onChange={(e) =>
                  setNewWorkflow({ ...newWorkflow, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="trigger">Trigger (Gatilho)</Label>
              <select
                id="trigger"
                value={newWorkflow.trigger}
                onChange={(e) =>
                  setNewWorkflow({ ...newWorkflow, trigger: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione um trigger</option>
                <option value="Novo lead criado">Novo lead criado</option>
                <option value="Deal em estágio específico">Deal em estágio específico</option>
                <option value="Lead abre email">Lead abre email</option>
                <option value="Contato criado">Contato criado</option>
                <option value="Tarefa concluída">Tarefa concluída</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="actions">Ações</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newWorkflow.actions.includes("Enviar email")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewWorkflow({
                          ...newWorkflow,
                          actions: [...newWorkflow.actions, "Enviar email"],
                        });
                      } else {
                        setNewWorkflow({
                          ...newWorkflow,
                          actions: newWorkflow.actions.filter((a) => a !== "Enviar email"),
                        });
                      }
                    }}
                  />
                  <span className="text-sm">Enviar email</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newWorkflow.actions.includes("Criar tarefa")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewWorkflow({
                          ...newWorkflow,
                          actions: [...newWorkflow.actions, "Criar tarefa"],
                        });
                      } else {
                        setNewWorkflow({
                          ...newWorkflow,
                          actions: newWorkflow.actions.filter((a) => a !== "Criar tarefa"),
                        });
                      }
                    }}
                  />
                  <span className="text-sm">Criar tarefa</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newWorkflow.actions.includes("Notificar usuário")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewWorkflow({
                          ...newWorkflow,
                          actions: [...newWorkflow.actions, "Notificar usuário"],
                        });
                      } else {
                        setNewWorkflow({
                          ...newWorkflow,
                          actions: newWorkflow.actions.filter((a) => a !== "Notificar usuário"),
                        });
                      }
                    }}
                  />
                  <span className="text-sm">Notificar usuário</span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateWorkflow}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Criar Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
