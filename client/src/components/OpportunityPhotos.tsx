import { useState, useRef, useMemo } from "react";
import { 
  Upload, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Loader2, 
  Image as ImageIcon, 
  Plus, 
  Maximize2, 
  Filter, 
  Package,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OpportunityPhotosProps {
  opportunityId: number;
}

export default function OpportunityPhotos({ opportunityId }: OpportunityPhotosProps) {
  const utils = trpc.useUtils();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>("all");
  const [uploadProductId, setUploadProductId] = useState<string>("none");
  const [previewPhoto, setPreviewPhoto] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Queries
  const { data: photos, isLoading: photosLoading } = trpc.crm.listOpportunityPhotos.useQuery({ 
    opportunityId,
    productId: selectedProductId !== "all" ? parseInt(selectedProductId) : undefined
  });
  
  const { data: products } = trpc.crm.listDealProducts.useQuery(opportunityId);

  // Mutations
  const addPhotoMutation = trpc.crm.addOpportunityPhoto.useMutation({
    onSuccess: () => {
      utils.crm.listOpportunityPhotos.invalidate({ opportunityId });
      toast.success("Foto adicionada com sucesso!");
    },
  });

  const updateDescriptionMutation = trpc.crm.updateOpportunityPhotoDescription.useMutation({
    onSuccess: () => {
      utils.crm.listOpportunityPhotos.invalidate({ opportunityId });
      setEditingId(null);
      toast.success("Descrição atualizada!");
    },
  });

  const deletePhotoMutation = trpc.crm.deleteOpportunityPhoto.useMutation({
    onSuccess: () => {
      utils.crm.listOpportunityPhotos.invalidate({ opportunityId });
      toast.success("Foto removida!");
    },
  });

  // Handlers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !supabase) return;

    setIsUploading(true);
    setUploadProgress(0);
    const BUCKET_NAME = "opportunity-photos";

    try {
      const totalFiles = files.length;
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${opportunityId}/${fileName}`;

        // Update progress
        setUploadProgress(Math.round(((i) / totalFiles) * 100));

        // 1. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        // 3. Save to Database via TRPC
        await addPhotoMutation.mutateAsync({
          opportunityId,
          productId: uploadProductId !== "none" ? parseInt(uploadProductId) : undefined,
          fileName: file.name,
          filePath,
          publicUrl,
        });
        
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }
    } catch (error: any) {
      console.error("Erro no upload:", error);
      toast.error(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (photo: any) => {
    if (!supabase) return;
    
    if (!confirm("Tem certeza que deseja excluir esta foto?")) return;

    try {
      // 1. Delete from Storage
      const { error: storageError } = await supabase.storage
        .from("opportunity-photos")
        .remove([photo.filePath]);

      if (storageError) {
        console.error("Erro ao deletar do storage:", storageError);
      }

      // 2. Delete from Database
      await deletePhotoMutation.mutateAsync(photo.id);
    } catch (error: any) {
      toast.error(`Erro ao deletar: ${error.message}`);
    }
  };

  const startEditing = (photo: any) => {
    setEditingId(photo.id);
    setEditDescription(photo.description || "");
  };

  const handleUpdateDescription = async (id: string) => {
    await updateDescriptionMutation.mutateAsync({ id, description: editDescription });
  };

  if (photosLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500">Carregando galeria...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
            <Filter size={18} />
          </div>
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger className="w-full sm:w-[220px] bg-gray-50 border-none">
              <SelectValue placeholder="Filtrar por produto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os produtos</SelectItem>
              {products?.map((p: any) => (
                <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={uploadProductId} onValueChange={setUploadProductId}>
            <SelectTrigger className="w-full sm:w-[200px] border-dashed">
              <Package size={16} className="mr-2 text-gray-400" />
              <SelectValue placeholder="Vincular a produto..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem produto</SelectItem>
              {products?.map((p: any) => (
                <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700 gap-2 whitespace-nowrap"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Adicionar fotos
          </Button>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* Drag & Drop Upload Zone (Always visible if no photos) */}
      {(!photos || photos.length === 0) && (
        <div 
          className="border-2 border-dashed border-gray-200 rounded-2xl p-16 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-100/50 transition-all cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
            {isUploading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Upload className="w-10 h-10" />}
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {isUploading ? "Enviando fotos..." : "Fazer upload de fotos"}
          </h3>
          <p className="text-gray-500 mt-2 text-center max-w-sm">
            Arraste e solte ou clique para selecionar fotos (PNG, JPG, WebP). 
            As fotos serão vinculadas ao negócio.
          </p>
          <Button variant="outline" className="mt-8 gap-2 px-8" disabled={isUploading}>
            <Plus size={18} /> Selecionar arquivos
          </Button>
        </div>
      )}

      {/* Photo Grid */}
      {photos && photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
          
          {photos.map((photo) => {
            const product = products?.find((p: any) => p.id === photo.productId);
            
            return (
              <Card key={photo.id} className="overflow-hidden group border-gray-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md rounded-xl bg-white">
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-50 border-b border-gray-100">
                  <img 
                    src={photo.publicUrl} 
                    alt={photo.fileName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-10 w-10 bg-white/95 hover:bg-white text-gray-900 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                      onClick={() => setPreviewPhoto(photo)}
                    >
                      <Maximize2 size={18} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-10 w-10 bg-red-500/95 hover:bg-red-500 text-white rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
                      onClick={() => handleDelete(photo)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>

                  {/* Product Badge */}
                  {product && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded text-[10px] font-bold text-gray-700 flex items-center gap-1 shadow-sm">
                      <Package size={10} />
                      {product.name}
                    </div>
                  )}
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-gray-900 truncate flex-1" title={photo.fileName}>
                        {photo.fileName}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">
                      {format(new Date(photo.uploadedAt), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>

                  {/* Inline Description Editing */}
                  <div className="relative pt-3 border-t border-gray-100">
                    {editingId === photo.id ? (
                      <div className="flex gap-1 items-center">
                        <Input 
                          value={editDescription} 
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Adicionar descrição..."
                          className="h-8 text-xs bg-gray-50 border-blue-200"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateDescription(photo.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 shrink-0"
                          onClick={() => handleUpdateDescription(photo.id)}
                        >
                          <Check size={14} />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="flex items-start justify-between group/desc cursor-pointer min-h-[1.5rem] rounded-md hover:bg-gray-50 p-1 -m-1 transition-colors"
                        onClick={() => startEditing(photo)}
                      >
                        <p className={`text-xs leading-relaxed ${photo.description ? 'text-gray-600' : 'text-gray-400 italic'}`}>
                          {photo.description || "Adicionar uma descrição..."}
                        </p>
                        <Edit2 size={12} className="text-gray-400 opacity-0 group-hover/desc:opacity-100 ml-2 mt-0.5 shrink-0" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Full Screen Preview Dialog */}
      <Dialog open={!!previewPhoto} onOpenChange={() => setPreviewPhoto(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/95 border-none">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/60 to-transparent flex flex-row items-center justify-between text-white border-none">
            <div>
              <DialogTitle className="text-white text-lg font-bold">{previewPhoto?.fileName}</DialogTitle>
              {previewPhoto?.description && (
                <p className="text-sm text-gray-300 mt-1">{previewPhoto.description}</p>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setPreviewPhoto(null)}
              className="text-white hover:bg-white/20"
            >
              <X size={24} />
            </Button>
          </DialogHeader>
          <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
            {previewPhoto && (
              <img 
                src={previewPhoto.publicUrl} 
                alt={previewPhoto.fileName} 
                className="max-w-full max-h-[90vh] object-contain shadow-2xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
