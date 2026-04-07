import { useState } from "react";
import { Plus, Edit2, Trash2, Mail, Send, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

interface Campaign {
  id: number;
  name: string;
  status: "draft" | "scheduled" | "active" | "completed";
  recipients: number;
  opens: number;
  clicks: number;
  conversions: number;
  createdAt: string;
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  category: string;
  usageCount: number;
}

export default function Marketing() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: "Promoção de Primavera",
      status: "active",
      recipients: 1250,
      opens: 450,
      clicks: 125,
      conversions: 32,
      createdAt: "12 de mar de 2026",
    },
    {
      id: 2,
      name: "Newsletter Mensal",
      status: "completed",
      recipients: 2100,
      opens: 890,
      clicks: 210,
      conversions: 45,
      createdAt: "05 de mar de 2026",
    },
    {
      id: 3,
      name: "Black Friday 2026",
      status: "draft",
      recipients: 0,
      opens: 0,
      clicks: 0,
      conversions: 0,
      createdAt: "01 de mar de 2026",
    },
  ]);

  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 1,
      name: "Boas-vindas",
      subject: "Bem-vindo à nossa empresa!",
      category: "Onboarding",
      usageCount: 156,
    },
    {
      id: 2,
      name: "Recuperação de Carrinho",
      subject: "Você deixou algo no carrinho",
      category: "E-commerce",
      usageCount: 89,
    },
    {
      id: 3,
      name: "Confirmação de Pedido",
      subject: "Seu pedido foi confirmado",
      category: "E-commerce",
      usageCount: 234,
    },
    {
      id: 4,
      name: "Promoção Especial",
      subject: "Oferta exclusiva para você",
      category: "Promoção",
      usageCount: 45,
    },
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    template: "",
    recipients: "",
    scheduledDate: "",
  });

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    category: "",
    content: "",
  });

  const handleCreateCampaign = () => {
    if (newCampaign.name && newCampaign.template && newCampaign.recipients) {
      const campaign: Campaign = {
        id: campaigns.length + 1,
        name: newCampaign.name,
        status: "draft",
        recipients: parseInt(newCampaign.recipients),
        opens: 0,
        clicks: 0,
        conversions: 0,
        createdAt: new Date().toLocaleDateString("pt-BR"),
      };
      setCampaigns([...campaigns, campaign]);
      setNewCampaign({ name: "", template: "", recipients: "", scheduledDate: "" });
      setIsModalOpen(false);
    }
  };

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.subject && newTemplate.category) {
      const template: EmailTemplate = {
        id: templates.length + 1,
        name: newTemplate.name,
        subject: newTemplate.subject,
        category: newTemplate.category,
        usageCount: 0,
      };
      setTemplates([...templates, template]);
      setNewTemplate({ name: "", subject: "", category: "", content: "" });
      setIsTemplateModalOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "scheduled":
        return "bg-yellow-100 text-yellow-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativa";
      case "completed":
        return "Concluída";
      case "scheduled":
        return "Agendada";
      case "draft":
        return "Rascunho";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Marketing</h2>
          <p className="text-gray-500 mt-1">Gerencie campanhas e templates de email</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Send size={16} />
            <span className="hidden sm:inline">Campanhas</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Mail size={16} />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="hidden sm:inline">Relatórios</span>
          </TabsTrigger>
        </TabsList>

        {/* Campanhas Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Campanhas de Email</h3>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus size={16} className="mr-2" />
              Nova Campanha
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Campanhas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaigns.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Campanhas Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.filter((c) => c.status === "active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Taxa de Abertura Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.length > 0
                    ? (
                        (campaigns.reduce((sum, c) => sum + (c.opens / c.recipients) * 100, 0) /
                          campaigns.length) | 0
                      ).toFixed(1)
                    : 0}
                  %
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">
                        Destinatários
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Aberturas</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Cliques</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Conversões</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{campaign.name}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              campaign.status
                            )}`}
                          >
                            {getStatusLabel(campaign.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {campaign.recipients}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">{campaign.opens}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{campaign.clicks}</td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {campaign.conversions}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button variant="ghost" size="sm" className="text-blue-600">
                              <Edit2 size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Templates de Email</h3>
            <Button
              onClick={() => setIsTemplateModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus size={16} className="mr-2" />
              Novo Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                  <CardDescription className="text-xs">{template.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {template.subject}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Usado {template.usageCount}x
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-semibold">Relatórios de Desempenho</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Emails Enviados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.recipients, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total de Aberturas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.opens, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total de Cliques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.clicks, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total de Conversões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.conversions, 0)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Campaign Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Campanha</DialogTitle>
            <DialogDescription>Crie uma nova campanha de email</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="campaign-name">Nome da Campanha</Label>
              <Input
                id="campaign-name"
                placeholder="Ex: Promoção de Primavera"
                value={newCampaign.name}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="template">Template</Label>
              <select
                id="template"
                value={newCampaign.template}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, template: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione um template</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recipients">Número de Destinatários</Label>
              <Input
                id="recipients"
                type="number"
                placeholder="1000"
                value={newCampaign.recipients}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, recipients: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="scheduled-date">Data de Agendamento</Label>
              <Input
                id="scheduled-date"
                type="date"
                value={newCampaign.scheduledDate}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, scheduledDate: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCampaign}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Criar Campanha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Template</DialogTitle>
            <DialogDescription>Crie um novo template de email</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-name">Nome do Template</Label>
              <Input
                id="template-name"
                placeholder="Ex: Boas-vindas"
                value={newTemplate.name}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="template-subject">Assunto</Label>
              <Input
                id="template-subject"
                placeholder="Ex: Bem-vindo à nossa empresa!"
                value={newTemplate.subject}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, subject: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="template-category">Categoria</Label>
              <select
                id="template-category"
                value={newTemplate.category}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Onboarding">Onboarding</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Promoção">Promoção</option>
                <option value="Notificação">Notificação</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateTemplate}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Criar Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
