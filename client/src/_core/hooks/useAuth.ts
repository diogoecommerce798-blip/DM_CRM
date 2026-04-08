import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } =
    options ?? {};
  const utils = trpc.useUtils();

  const finalRedirectPath = useMemo(() => {
    if (!redirectOnUnauthenticated) return null;
    return redirectPath || "/"; // Redireciona para home se não autenticado
  }, [redirectOnUnauthenticated, redirectPath]);

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Escuta mudanças na sessão do Supabase para atualizar o estado do tRPC
  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        meQuery.refetch();
      } else if (event === 'SIGNED_OUT') {
        utils.auth.me.setData(undefined, null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [meQuery, utils]);

  const logout = useCallback(async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    } catch (error: unknown) {
      console.error("Logout error:", error);
    }
  }, [utils]);

  const state = useMemo(() => {
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading,
      error: meQuery.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (!finalRedirectPath) return;
    if (window.location.pathname === finalRedirectPath) return;
    if (window.location.pathname === "/") return; // Não redireciona se já estiver na home

    window.location.href = finalRedirectPath
  }, [
    redirectOnUnauthenticated,
    finalRedirectPath,
    meQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
