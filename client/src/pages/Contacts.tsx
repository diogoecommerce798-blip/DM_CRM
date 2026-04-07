import { useState } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Mail, Phone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  status: "active" | "inactive";
  createdAt: string;
}

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [showForm, setShowForm] = useState(false);

  // Mock data - será substituído por dados reais
  const mockContacts: Contact[] = [
    {
      id: 1,
      firstName: "João",
      lastName: "Silva",
      email: "joao.silva@empresa.com",
      phone: "(11) 98765-4321",
      jobTitle: "Gerente de Vendas",
      company: "Empresa ABC",
      status: "active",
      createdAt: "2026-03-15",
    },
    {
      id: 2,
      firstName: "Maria",
      lastName: "Santos",
      email: "maria.santos@empresa.com",
      phone: "(11) 98765-4322",
      jobTitle: "Diretora Financeira",
      company: "Empresa XYZ",
      status: "active",
      createdAt: "2026-03-10",
    },
    {
      id: 3,
      firstName: "Carlos",
      lastName: "Oliveira",
      email: "carlos.oliveira@empresa.com",
      phone: "(11) 98765-4323",
      jobTitle: "Analista de TI",
      company: "Empresa 123",
      status: "inactive",
      createdAt: "2026-02-28",
    },
  ];

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch =
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || contact.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Contatos</h2>
          <p className="text-gray-500 mt-1">Gerencie todos os seus contatos</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={20} className="mr-2" />
          Novo Contato
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                placeholder="Buscar por nome, email ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Todos
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                onClick={() => setFilterStatus("active")}
              >
                Ativos
              </Button>
              <Button
                variant={filterStatus === "inactive" ? "default" : "outline"}
                onClick={() => setFilterStatus("inactive")}
              >
                Inativos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contatos</CardTitle>
          <CardDescription>{filteredContacts.length} contatos encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cargo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Empresa</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} className="text-gray-400" />
                        {contact.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} className="text-gray-400" />
                        {contact.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{contact.jobTitle}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 size={16} className="text-gray-400" />
                        {contact.company}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          contact.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {contact.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
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

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum contato encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
