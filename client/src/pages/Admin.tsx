import { useState } from "react";
import { Plus, Edit2, Trash2, Settings, Users, Package, Lock, Bell, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: number;
  name: string;
  code: string;
  price: number;
  category: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  status: "active" | "inactive";
  lastLogin: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Agenda 2024 Meia Capa com Laminação", code: "PROD-001", price: 45.90, category: "Agendas" },
    { id: 2, name: "Agenda 2024 Meia Capa com Laminação", code: "PROD-002", price: 45.90, category: "Agendas" },
    { id: 3, name: "Bloco Adhesivo Leve com Capa", code: "PROD-003", price: 12.50, category: "Blocos" },
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Fernando Mancuso", email: "fernando@empresa.com", role: "admin", status: "active", lastLogin: "12 de mar de 2026, 10:30" },
    { id: 2, name: "Ana Costa", email: "ana@empresa.com", role: "manager", status: "active", lastLogin: "12 de mar de 2026, 09:15" },
    { id: 3, name: "João Silva", email: "joao@empresa.com", role: "user", status: "active", lastLogin: "11 de mar de 2026, 14:45" },
  ]);

  const [companyData, setCompanyData] = useState({
    name: "Maju Personalizados 21",
    email: "contato@majupersonalizados.com.br",
    phone: "(21) 3333-3333",
    address: "Rua das Flores, 123 - Rio de Janeiro, RJ",
    cnpj: "12.345.678/0001-90",
  });

  const [userPreferences, setUserPreferences] = useState({
    theme: "light",
    language: "pt-BR",
    notifications: true,
    emailNotifications: true,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Administração</h2>
          <p className="text-gray-500 mt-1">Gerencie produtos, usuários e configurações</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package size={16} />
            <span className="hidden sm:inline">Produtos</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            <span className="hidden sm:inline">Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Settings size={16} />
            <span className="hidden sm:inline">Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock size={16} />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette size={16} />
            <span className="hidden sm:inline">Interface</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
        </TabsList>

        {/* Produtos Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Gerenciar Produtos</h3>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus size={16} className="mr-2" />
              Novo Produto
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Código</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoria</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Preço</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{product.name}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{product.code}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{product.category}</td>
                        <td className="py-3 px-4 text-right text-gray-900 font-medium">R$ {product.price.toFixed(2)}</td>
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

        {/* Usuários Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Gerenciar Usuários</h3>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus size={16} className="mr-2" />
              Novo Usuário
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Função</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Último Acesso</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{user.email}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm capitalize">{user.role}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {user.status === "active" ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{user.lastLogin}</td>
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

        {/* Empresa Tab */}
        <TabsContent value="company" className="space-y-4">
          <h3 className="text-lg font-semibold">Configurações da Empresa</h3>

          <Card>
            <CardHeader>
              <CardTitle>Dados Gerais</CardTitle>
              <CardDescription>Informações básicas da sua empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
                  <Input value={companyData.name} onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                  <Input value={companyData.cnpj} onChange={(e) => setCompanyData({ ...companyData, cnpj: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input value={companyData.email} onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <Input value={companyData.phone} onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                  <Input value={companyData.address} onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })} />
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança Tab */}
        <TabsContent value="security" className="space-y-4">
          <h3 className="text-lg font-semibold">Segurança</h3>

          <Card>
            <CardHeader>
              <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
              <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-gray-900">Autenticação de dois fatores</p>
                  <p className="text-sm text-gray-600 mt-1">Proteja sua conta com 2FA</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Ativar</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Atualize sua senha regularmente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
                <Input type="password" placeholder="Digite sua senha atual" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                <Input type="password" placeholder="Digite a nova senha" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
                <Input type="password" placeholder="Confirme a nova senha" />
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Alterar Senha</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferências Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <h3 className="text-lg font-semibold">Preferências de Interface</h3>

          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>Customize a aparência da interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                <select value={userPreferences.theme} onChange={(e) => setUserPreferences({ ...userPreferences, theme: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                <select value={userPreferences.language} onChange={(e) => setUserPreferences({ ...userPreferences, language: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Salvar Preferências</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Navegação</CardTitle>
              <CardDescription>Customize o menu lateral</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Pistas</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Leads</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Negócios</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Campanhas</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Contatos</span>
              </label>
              <Button className="bg-green-600 hover:bg-green-700 text-white mt-4">Salvar Navegação</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <h3 className="text-lg font-semibold">Configurações de Notificações</h3>

          <Card>
            <CardHeader>
              <CardTitle>Notificações de Desktop</CardTitle>
              <CardDescription>Receba notificações na sua área de trabalho</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Notificações de novos leads</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Notificações de mudança de estágio</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Notificações de tarefas atribuídas</span>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificações por Email</CardTitle>
              <CardDescription>Receba notificações por email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Resumo diário de atividades</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Alertas de oportunidades importantes</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Notificações de comentários</span>
              </label>
              <Button className="bg-green-600 hover:bg-green-700 text-white mt-4">Salvar Notificações</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
