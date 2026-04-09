import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Notes() {
  const utils = trpc.useUtils();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<{ id: number; title: string; content: string | null } | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: notes, isLoading } = trpc.crm.listNotes.useQuery();

  const createMutation = trpc.crm.createNote.useMutation({
    onSuccess: () => {
      utils.crm.listNotes.invalidate();
      setIsModalOpen(false);
      setTitle("");
      setContent("");
      toast.success("Nota criada com sucesso!");
    },
  });

  const updateMutation = trpc.crm.updateNote.useMutation({
    onSuccess: () => {
      utils.crm.listNotes.invalidate();
      setEditingNote(null);
      toast.success("Nota atualizada!");
    },
  });

  const deleteMutation = trpc.crm.deleteNote.useMutation({
    onSuccess: () => {
      utils.crm.listNotes.invalidate();
      toast.success("Nota excluída.");
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("O título é obrigatório.");
      return;
    }

    if (editingNote) {
      updateMutation.mutate({ id: editingNote.id, title, content });
    } else {
      createMutation.mutate({ title, content });
    }
  };

  const startEdit = (note: any) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content || "");
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Minhas Notas</h1>
          <p className="text-muted-foreground">Gerencie seus lembretes e anotações rápidas.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingNote(null);
            setTitle("");
            setContent("");
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Nota
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingNote ? "Editar Nota" : "Criar Nova Nota"}</DialogTitle>
              <DialogDescription>
                Adicione um título e o conteúdo da sua anotação.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input 
                  placeholder="Ex: Reunião de hoje" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Conteúdo</label>
                <Textarea 
                  placeholder="Digite sua nota aqui..." 
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                <CardTitle className="text-lg font-semibold pr-8">
                  {note.title}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(note)}>
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:text-red-600" 
                    onClick={() => {
                      if (confirm("Deseja realmente excluir esta nota?")) {
                        deleteMutation.mutate(note.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {note.content || "Sem conteúdo."}
                </p>
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                <span className="text-[10px] text-gray-400">
                  Criada em: {new Date(note.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-muted-foreground">Nenhuma nota encontrada. Crie sua primeira nota clicando no botão acima!</p>
          </div>
        )}
      </div>
    </div>
  );
}
