import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { Avatar3D } from "@/components/Avatar3D";
import { AvatarCustomizer } from "@/components/AvatarCustomizer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon, User, LogOut } from "lucide-react";

interface AvatarConfig {
  bodyType: string;
  eyeStyle: string;
  mouthStyle: string;
  hairStyle: string;
  accessory: string;
  bodyColor: string;
  hairColor: string;
  accessoryColor: string;
}

const defaultConfig: AvatarConfig = {
  bodyType: "sphere",
  eyeStyle: "dots",
  mouthStyle: "smile",
  hairStyle: "straight",
  accessory: "none",
  bodyColor: "#4ECDC4",
  hairColor: "#8B4513",
  accessoryColor: "#333333"
};

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [config, setConfig] = useState<AvatarConfig>(defaultConfig);
  const [user, setUser] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        loadUserAvatar(session.user.id);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          loadUserAvatar(session.user.id);
        } else {
          setUser(null);
          setConfig(defaultConfig);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserAvatar = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("avatars")
        .select("config")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      
      if (data?.config) {
        setConfig({ ...defaultConfig, ...(data.config as unknown as AvatarConfig) });
      }
    } catch (error) {
      console.error("Error loading avatar:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      
      toast({
        title: "Bem-vindo!",
        description: "Você está conectado. Agora pode salvar seu avatar!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao conectar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Desconectado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao desconectar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Conecte-se primeiro",
        description: "Você precisa estar conectado para salvar seu avatar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("avatars")
        .upsert({
          user_id: user.id,
          config: config as any
        });

      if (error) throw error;

      toast({
        title: "Avatar salvo!",
        description: "Seu avatar foi salvo com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('https://awpbkulsybdgourhgqyx.supabase.co/functions/v1/generate-avatar-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cGJrdWxzeWJkZ291cmhncXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzUwMDMsImV4cCI6MjA3MTgxMTAwM30.Tq1RFKUBjxNp84r_hOSE4DprpBSV-rjfWcOWFET31d8'}`,
        },
        body: JSON.stringify({
          prompt: "Crie um avatar fofo e divertido"
        }),
      });

      if (!response.ok) throw new Error('Falha ao gerar sugestões');

      const data = await response.json();
      
      if (data.suggestions) {
        setConfig(prev => ({ ...prev, ...data.suggestions }));
        toast({
          title: "Sugestões geradas!",
          description: data.description || "Avatar atualizado com sugestões da IA.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro na IA",
        description: "Não foi possível gerar sugestões. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ThriveSprite Avatar Creator
          </h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            {user ? (
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            ) : (
              <Button onClick={handleSignIn} className="gap-2">
                <User className="h-4 w-4" />
                Conectar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* 3D Avatar Preview */}
          <div className="order-2 lg:order-1">
            <div className="aspect-square bg-card rounded-lg border border-border overflow-hidden">
              <Canvas
                camera={{ position: [0, 0, 4], fov: 50 }}
                dpr={[1, 2]}
              >
                <Suspense fallback={null}>
                  {/* Lighting setup based on theme */}
                  <ambientLight intensity={theme === "dark" ? 0.3 : 0.6} />
                  <directionalLight
                    position={[5, 5, 5]}
                    intensity={theme === "dark" ? 0.8 : 1.2}
                    color={theme === "dark" ? "#4A90E2" : "#FFF5E6"}
                  />
                  <pointLight
                    position={[-5, 0, 5]}
                    intensity={0.5}
                    color={theme === "dark" ? "#7B68EE" : "#FFE4B5"}
                  />
                  
                  {/* Environment */}
                  <Environment preset={theme === "dark" ? "night" : "dawn"} />
                  
                  {/* Avatar */}
                  <Avatar3D config={config} isDark={theme === "dark"} />
                  
                  {/* Controls */}
                  <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    maxDistance={8}
                    minDistance={2}
                    autoRotate={false}
                  />
                </Suspense>
              </Canvas>
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              🖱️ Arraste para rotacionar • 🔄 Role para zoom
            </p>
          </div>

          {/* Customization Panel */}
          <div className="order-1 lg:order-2">
            <AvatarCustomizer
              config={config}
              onConfigChange={setConfig}
              onSave={handleSave}
              onGenerateSuggestions={handleGenerateSuggestions}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
