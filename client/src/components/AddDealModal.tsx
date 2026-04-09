import { useState, useEffect } from "react";
import { X, AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: any) => void;
  initialData?: any;
}

export default function AddDealModal({ isOpen, onClose, onSave, initialData }: AddDealModalProps) {
  const [formData, setFormData] = useState(initialData || {
    contact: "",
    organization: "",
    title: "",
    value: "0",
    funnel: "C - Interno",
    funnelId: 1,
    stage: "Prospecção",
    tags: "",
    probability: 0,
    owner: "Fernando Mancuso (Você)",
    origin: "",
    visibility: "Todos os usuários",
    phone: "",
    phoneType: "Comercial",
    email: "",
    emailType: "Comercial",
    address: "",
    potentialRating: "",
    openingDate: "",
    companySize: "",
    registrationStatus: "",
    cnpj: "",
    complement: "",
  });

  // Atualizar formData quando initialData mudar (abrir modal para editar)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        contact: "",
        organization: "",
        title: "",
        value: "0",
        funnel: "C - Interno",
        funnelId: 1,
        stage: "Prospecção",
        tags: "",
        probability: 0,
        owner: "Fernando Mancuso (Você)",
        origin: "",
        visibility: "Todos os usuários",
        phone: "",
        phoneType: "Comercial",
        email: "",
        emailType: "Comercial",
        address: "",
        potentialRating: "",
        openingDate: "",
        companySize: "",
        registrationStatus: "",
        cnpj: "",
        complement: "",
      });
    }
  }, [initialData, isOpen]);

  const [dealValue, setDealValue] = useState("4.455/56.000");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    if (!formData.title || formData.title.trim().length === 0) {
      setErrors({ title: "O título do negócio é obrigatório" });
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Adicionar negócio</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">Não adicionamos a palavra "negócio" ao título do seu negócio</p>
              <p className="text-xs text-blue-700 mt-1">Você pode ativar isso se necessário. Abra as <a href="#" className="underline">Configurações</a></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pessoa de contato</label>
                <Input
                  name="contact"
                  placeholder="Selecionar..."
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organização</label>
                <Input
                  name="organization"
                  placeholder="Selecionar..."
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título <span className="text-red-500">*</span>
                </label>
                <Input
                  name="title"
                  placeholder="Digite o título..."
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Negócio (R$)
                </label>
                <Input
                  name="value"
                  type="number"
                  placeholder="0.00"
                  value={formData.value}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Funil</label>
                <select
                  name="funnel"
                  value={formData.funnel}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      funnel: val,
                      funnelId: val === "Vendas" ? 2 : (val === "Marketing" ? 3 : 1)
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option>C - Interno</option>
                  <option>Vendas</option>
                  <option>Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pipeline stage</label>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 h-2 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 h-2 bg-gray-300 rounded-full"></div>
                </div>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option>Prospecção</option>
                  <option>Qualificação</option>
                  <option>Proposta</option>
                  <option>Negociação</option>
                  <option>Fechado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Etiqueta</label>
                <select
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option>Adicionar etiquetas</option>
                  <option>Urgente</option>
                  <option>VIP</option>
                  <option>Follow-up</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Probabilidade</label>
                <div className="flex items-center gap-2">
                  <Input
                    name="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proprietário</label>
                <select
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option>Fernando Mancuso (Você)</option>
                  <option>João Silva</option>
                  <option>Maria Santos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Canal de origem</label>
                <select
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option>Selecionar...</option>
                  <option>Email</option>
                  <option>Telefone</option>
                  <option>Website</option>
                  <option>Referência</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visível para</label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option>Todos os usuários</option>
                  <option>Apenas eu</option>
                  <option>Meu time</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm">PESSOA</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <div className="flex gap-2">
                    <Input 
                      name="phone"
                      placeholder="Telefone" 
                      className="flex-1" 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <select 
                      name="phoneType"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={formData.phoneType}
                      onChange={handleChange}
                    >
                      <option>Comercial</option>
                      <option>Celular</option>
                      <option>Residencial</option>
                    </select>
                  </div>
                </div>

                <button type="button" className="text-sm text-blue-600 hover:text-blue-700">+ Adicionar telefone</button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                  <div className="flex gap-2">
                    <Input 
                      name="email"
                      placeholder="E-mail" 
                      className="flex-1" 
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <select 
                      name="emailType"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={formData.emailType}
                      onChange={handleChange}
                    >
                      <option>Comercial</option>
                      <option>Pessoal</option>
                    </select>
                  </div>
                </div>

                <button type="button" className="text-sm text-blue-600 hover:text-blue-700">+ Adicionar e-mail</button>

                <h3 className="font-semibold text-gray-900 text-sm pt-4">ORGANIZAÇÃO</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                  <Input 
                    name="address"
                    placeholder="Endereço" 
                    className="w-full" 
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proprietário</label>
                  <select 
                    name="owner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={formData.owner}
                    onChange={handleChange}
                  >
                    <option>Fernando Mancuso (Você)</option>
                    <option>João Silva</option>
                    <option>Maria Santos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Classificação Potencial</label>
                  <select 
                    name="potentialRating"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={formData.potentialRating}
                    onChange={handleChange}
                  >
                    <option>Selecionar...</option>
                    <option>Alta</option>
                    <option>Média</option>
                    <option>Baixa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Abertura</label>
                  <Input 
                    name="openingDate"
                    type="date" 
                    className="w-full" 
                    value={formData.openingDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Porte da Empresa</label>
                  <select 
                    name="companySize"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={formData.companySize}
                    onChange={handleChange}
                  >
                    <option>Selecionar...</option>
                    <option>Pequena</option>
                    <option>Média</option>
                    <option>Grande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Situação Cadastral</label>
                  <select 
                    name="registrationStatus"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={formData.registrationStatus}
                    onChange={handleChange}
                  >
                    <option>Selecionar...</option>
                    <option>Ativa</option>
                    <option>Inativa</option>
                    <option>Pendente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                  <Input 
                    name="cnpj"
                    placeholder="CNPJ" 
                    className="w-full" 
                    value={formData.cnpj}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
                  <select 
                    name="tags"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={formData.tags}
                    onChange={handleChange}
                  >
                    <option>Selecionar...</option>
                    <option>Urgente</option>
                    <option>VIP</option>
                    <option>Follow-up</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complemento do Endereço</label>
                  <Input 
                    name="complement"
                    placeholder="Complemento" 
                    className="w-full" 
                    value={formData.complement}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deal Value Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <Upload className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">Use a importação de dados para adicionar negócios em lote e economizar tempo</p>
              <Button variant="link" className="text-blue-600 p-0 h-auto mt-1">
                <Upload size={16} className="mr-1" />
                Importação
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{dealValue}</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
