import { useState } from "react";
import { Search, Filter, Plus, Download, Settings, Eye, Trash2, Edit2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Lead {
  id: number;
  name: string;
  status: "novo" | "em_progresso" | "qualificado" | "descartado";
  operation: string;
  contact: string;
  origin: string;
  email: string;
  phone: string;
  owner: string;
  openDate: string;
  cadastralStatus: string;
}

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "novo" | "em_progresso" | "qualificado" | "descartado">("all");
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);

  // Mock data
  const mockLeads: Lead[] = [
    {
      id: 1,
      name: "Lead FULL GERAL",
      status: "novo",
      operation: "Operação 1",
      contact: "João Silva",
      origin: "Website",
      email: "joao@empresa.com",
      phone: "(11) 98765-4321",
      owner: "Fernando Silva",
      openDate: "15 ago 2025",
      cadastralStatus: "Ativo",
    },
    {
      id: 2,
      name: "Lead FULL GERAL",
      status: "em_progresso",
      operation: "Operação 2",
      contact: "Maria Santos",
      origin: "Email",
      email: "maria@empresa.com",
      phone: "(11) 98765-4322",
      owner: "Ana Costa",
      openDate: "14 ago 2025",
      cadastralStatus: "Ativo",
    },
    {
      id: 3,
      name: "Lead FULL GERAL",
      status: "qualificado",
      operation: "Operação 3",
      contact: "Carlos Oliveira",
      origin: "Telefone",
      email: "carlos@empresa.com",
      phone: "(11) 98765-4323",
      owner: "Pedro Ferreira",
      openDate: "13 ago 2025",
      cadastralStatus: "Ativo",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo":
        return "bg-green-100 text-green-700";
      case "em_progresso":
        return "bg-yellow-100 text-yellow-700";
      case "qualificado":
        return "bg-blue-100 text-blue-700";
      case "descartado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "novo":
        return "Novo";
      case "em_progresso":
        return "Em Progresso";
      case "qualificado":
        return "Qualificado";
      case "descartado":
        return "Descartado";
      default:
        return status;
    }
  };

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const toggleSelectLead = (id: number) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map((lead) => lead.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Caixa de entrada de leads</h2>
          <p className="text-gray-500 mt-1">Gerencie seus leads</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={20} className="mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col md:flex-row items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                placeholder="Pesquisar no Pipeline"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Plus size={16} />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings size={16} />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => setFilterStatus("all")}
          className="flex items-center gap-2"
        >
          <Filter size={16} />
          Todos
        </Button>
        <Button
          variant={filterStatus === "novo" ? "default" : "outline"}
          onClick={() => setFilterStatus("novo")}
        >
          Novo
        </Button>
        <Button
          variant={filterStatus === "em_progresso" ? "default" : "outline"}
          onClick={() => setFilterStatus("em_progresso")}
        >
          Em Progresso
        </Button>
        <Button
          variant={filterStatus === "qualificado" ? "default" : "outline"}
          onClick={() => setFilterStatus("qualificado")}
        >
          Qualificado
        </Button>
        <Button
          variant={filterStatus === "descartado" ? "default" : "outline"}
          onClick={() => setFilterStatus("descartado")}
        >
          Descartado
        </Button>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Leads</CardTitle>
              <CardDescription>{filteredLeads.length} leads encontrados</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{selectedLeads.length} selecionados</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 w-12">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Operação</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Pessoa de contato</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Canal de origem</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">E-mail</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Proprietário</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data de abertura</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Situação Cadastral</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleSelectLead(lead.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{lead.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{lead.operation}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{lead.contact}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{lead.origin}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                        {lead.email}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{lead.phone}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{lead.owner}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{lead.openDate}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{lead.cadastralStatus}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum lead encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
