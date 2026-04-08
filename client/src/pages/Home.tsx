import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Building2, BarChart3, Users, Target } from "lucide-react";

export default function Home() {
  const loginUrl = getLoginUrl();
  const oauthMissing = loginUrl === "/auth-error";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur border-b border-blue-100">
        <div className="flex items-center gap-2">
          <Building2 className="w-7 h-7 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">DM° CRM</span>
        </div>
        {!oauthMissing ? (
          <a href={loginUrl}>
            <Button variant="default" size="sm">Entrar</Button>
          </a>
        ) : (
          <Button variant="outline" size="sm" disabled title="Configure VITE_OAUTH_PORTAL_URL e VITE_APP_ID no Vercel">
            Login indisponível
          </Button>
        )}
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-8">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Gerencie seus clientes com <span className="text-blue-600">inteligência</span>
          </h1>
          <p className="text-lg text-gray-600">
            CRM completo com pipeline de vendas, gestão de contatos, campanhas de marketing e muito mais.
          </p>
          {oauthMissing ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 text-sm text-left">
              <strong>Configuração pendente:</strong> As variáveis de ambiente OAuth não estão configuradas no Vercel.
              <br />
              Acesse <strong>Settings → Environment Variables</strong> e defina{" "}
              <code className="bg-amber-100 px-1 rounded">VITE_OAUTH_PORTAL_URL</code> e{" "}
              <code className="bg-amber-100 px-1 rounded">VITE_APP_ID</code>.
            </div>
          ) : (
            <a href={loginUrl}>
              <Button size="lg" className="mt-2">
                Começar agora
              </Button>
            </a>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full mt-4">
          {[
            { icon: Users, title: "Contatos & Leads", desc: "Organize e acompanhe todos os seus contatos e oportunidades." },
            { icon: Target, title: "Pipeline de Vendas", desc: "Visualize e gerencie negócios com drag-and-drop intuitivo." },
            { icon: BarChart3, title: "Relatórios", desc: "Dashboards e métricas para tomar decisões baseadas em dados." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-5 shadow-sm border border-blue-100 text-left">
              <Icon className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} DM° CRM
      </footer>
    </div>
  );
}
