import { useState, useRef } from "react";
import { Upload, Trash2, Edit2, Check, X, Loader2, Image as ImageIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");

  const { data: photos, isLoading } = trpc.crm.listOpportunityPhotos.useQuery({ opportunityId });

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !supabase) return;

    setIsUploading(true);
    const BUCKET_NAME = "opportunity-photos";

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${opportunityId}/${fileName}`;

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
          fileName: file.name,
          filePath,
          publicUrl,
        });
      }
    } catch (error: any) {
      console.error("Erro no upload:", error);
      toast.error(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (photo: any) => {
    if (!supabase) return;
    
    try {
      // 1. Delete from Storage
      const { error: storageError } = await supabase.storage
        .from("opportunity-photos")
        .remove([photo.filePath]);

      if (storageError) {
        console.error("Erro ao deletar do storage:", storageError);
        // Continuamos para deletar do banco mesmo se falhar no storage (ex: arquivo já não existe)
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500">Carregando fotos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div 
        className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
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
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
          {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {isUploading ? "Enviando fotos..." : "Fazer upload de fotos"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Arraste e solte ou clique para selecionar (PNG, JPG, WebP)
        </p>
        <Button variant="outline" className="mt-6 gap-2" disabled={isUploading}>
          <Plus size={16} /> Selecionar arquivos
        </Button>
      </div>

      {/* Grid Section */}
      {photos && photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden group border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img 
                  src={photo.publicUrl} 
                  alt={photo.fileName} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-9 w-9 bg-white/90 hover:bg-white text-gray-900"
                    onClick={() => window.open(photo.publicUrl, "_blank")}
                  >
                    <ImageIcon size={18} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-9 w-9 bg-red-500/90 hover:bg-red-500"
                    onClick={() => handleDelete(photo)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 truncate" title={photo.fileName}>
                    {photo.fileName}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                    {format(new Date(photo.uploadedAt), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>

                <div className="relative pt-2 border-t border-gray-100">
                  {editingId === photo.id ? (
                    <div className="flex gap-1 items-center">
                      <Input 
                        value={editDescription} 
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Adicionar descrição..."
                        className="h-8 text-xs"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateDescription(photo.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleUpdateDescription(photo.id)}
                      >
                        <Check size={14} />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-gray-400 hover:text-gray-500 hover:bg-gray-50"
                        onClick={() => setEditingId(null)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex items-start justify-between group/desc cursor-pointer min-h-[1.5rem]"
                      onClick={() => startEditing(photo)}
                    >
                      <p className={`text-xs ${photo.description ? 'text-gray-600 italic' : 'text-gray-400 italic'}`}>
                        {photo.description || "Sem descrição..."}
                      </p>
                      <Edit2 size={12} className="text-gray-400 opacity-0 group-hover/desc:opacity-100 ml-2 mt-0.5" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-xl bg-white">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <ImageIcon size={32} />
          </div>
          <h4 className="text-lg font-medium text-gray-900">Nenhuma foto ainda</h4>
          <p className="text-gray-500 max-w-xs mt-1">
            Faça upload das fotos do negócio para manter tudo organizado em um só lugar.
          </p>
        </div>
      )}
    </div>
  );
}
