import { useState } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Mail, Phone, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AddContactModal from "@/components/AddContactModal";

export default function Contacts() {
  const utils = trpc.useUtils();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);

  const { data: contacts, isLoading } = trpc.crm.listContacts.useQuery();

  const createMutation = trpc.crm.createContact.useMutation({
    onSuccess: () => {
      utils.crm.listContacts.invalidate();
      setIsModalOpen(false);
      toast.success("Contato criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar contato: ${error.message}`);
    },
  });

  const updateMutation = trpc.crm.updateContact.useMutation({
    onSuccess: () => {
      utils.crm.listContacts.invalidate();
      setEditingContact(null);
      setIsModalOpen(false);
      toast.success("Contato atualizado!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar contato: ${error.message}`);
    },
  });

  const deleteMutation = trpc.crm.deleteContact.useMutation({
    onSuccess: () => {
      utils.crm.listContacts.invalidate();
      toast.success("Contato excluído.");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir contato: ${error.message}`);
    },
  });

  const handleSave = (formData: any) => {
    if (editingContact) {
      updateMutation.mutate({ ...formData, id: editingContact.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredContacts = (contacts || []).filter((contact) => {
    const fullName = `${contact.firstName} ${contact.lastName || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || contact.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Contatos</h2>
          <p className="text-gray-500 mt-1">Gerencie todos os seus contatos</p>
        </div>
        <Button 
          onClick={() => {
            setEditingContact(null);
            setIsModalOpen(true);
          }} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={20} className="mr-2" />
          Novo Contato
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar por nome, email ou cargo..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
                className={filterStatus === "all" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("active")}
                className={filterStatus === "active" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                Ativos
              </Button>
              <Button
                variant={filterStatus === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("inactive")}
                className={filterStatus === "inactive" ? "bg-blue-600 hover:bg-blue-700" : ""}
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
          <CardTitle className="text-lg">Lista de Contatos</CardTitle>
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
                        {contact.email || "-"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} className="text-gray-400" />
                        {contact.phone || "-"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{contact.jobTitle || "-"}</td>
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => {
                            setEditingContact(contact);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (window.confirm("Tem certeza que deseja excluir este contato?")) {
                              deleteMutation.mutate(contact.id);
                            }
                          }}
                        >
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

      <AddContactModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        onSave={handleSave}
        contact={editingContact}
        isEditing={!!editingContact}
      />
    </div>
  );
}
