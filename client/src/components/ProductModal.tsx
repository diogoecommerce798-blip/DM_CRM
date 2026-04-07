import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Product {
  id?: number;
  name: string;
  code: string;
  price: number;
  category: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product;
  isEditing?: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  isEditing = false,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Product>(
    product || {
      name: "",
      code: "",
      price: 0,
      category: "",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome do produto é obrigatório";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Código do produto é obrigatório";
    }

    if (formData.price <= 0) {
      newErrors.price = "Preço deve ser maior que zero";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Categoria é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      setFormData({ name: "", code: "", price: 0, category: "" });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData(
      product || {
        name: "",
        code: "",
        price: 0,
        category: "",
      }
    );
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados do produto"
              : "Preencha os dados do novo produto"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input
              id="name"
              placeholder="Ex: Agenda 2024"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="code">Código do Produto</Label>
            <Input
              id="code"
              placeholder="Ex: PROD-001"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              placeholder="Ex: Agendas"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={errors.category ? "border-red-500" : ""}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isEditing ? "Atualizar" : "Criar"} Produto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
