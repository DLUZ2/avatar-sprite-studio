import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Save, Shuffle } from "lucide-react";

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

interface AvatarCustomizerProps {
  config: AvatarConfig;
  onConfigChange: (newConfig: AvatarConfig) => void;
  onSave: () => void;
  onGenerateSuggestions: () => void;
  isGenerating: boolean;
}

const bodyTypes = [
  { id: "sphere", name: "Redondo", emoji: "⚪" },
  { id: "cube", name: "Quadrado", emoji: "⬜" },
  { id: "cylinder", name: "Cilindro", emoji: "🔵" }
];

const eyeStyles = [
  { id: "dots", name: "Pontos", emoji: "👀" },
  { id: "large", name: "Grandes", emoji: "😃" },
  { id: "sleepy", name: "Sonolento", emoji: "😴" }
];

const mouthStyles = [
  { id: "smile", name: "Sorriso", emoji: "😊" },
  { id: "neutral", name: "Neutro", emoji: "😐" },
  { id: "excited", name: "Animado", emoji: "😆" }
];

const hairStyles = [
  { id: "bald", name: "Careca", emoji: "🔵" },
  { id: "straight", name: "Liso", emoji: "💇" },
  { id: "spiky", name: "Espetado", emoji: "🦔" },
  { id: "curly", name: "Cacheado", emoji: "🌀" },
  { id: "ponytail", name: "Rabo de Cavalo", emoji: "🎀" },
  { id: "messy", name: "Bagunçado", emoji: "🌪️" }
];

const accessories = [
  { id: "none", name: "Nenhum", emoji: "❌" },
  { id: "glasses", name: "Óculos", emoji: "👓" },
  { id: "hat", name: "Chapéu", emoji: "🎩" },
  { id: "bow", name: "Laço", emoji: "🎀" },
  { id: "antenna", name: "Antena", emoji: "📡" }
];

const colors = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", 
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F8BBD9", "#B2DFDB", "#FFE0B2", "#D1C4E9", "#FFCDD2"
];

export function AvatarCustomizer({ 
  config, 
  onConfigChange, 
  onSave, 
  onGenerateSuggestions, 
  isGenerating 
}: AvatarCustomizerProps) {
  
  const updateConfig = (key: keyof AvatarConfig, value: string) => {
    onConfigChange({ ...config, [key]: value });
  };

  const randomizeAvatar = () => {
    const randomConfig: AvatarConfig = {
      bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)].id,
      eyeStyle: eyeStyles[Math.floor(Math.random() * eyeStyles.length)].id,
      mouthStyle: mouthStyles[Math.floor(Math.random() * mouthStyles.length)].id,
      hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)].id,
      accessory: accessories[Math.floor(Math.random() * accessories.length)].id,
      bodyColor: colors[Math.floor(Math.random() * colors.length)],
      hairColor: colors[Math.floor(Math.random() * colors.length)],
      accessoryColor: colors[Math.floor(Math.random() * colors.length)]
    };
    onConfigChange(randomConfig);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={randomizeAvatar} variant="outline" className="gap-2">
          <Shuffle className="w-4 h-4" />
          Aleatório
        </Button>
        <Button 
          onClick={onGenerateSuggestions} 
          variant="outline" 
          className="gap-2"
          disabled={isGenerating}
        >
          <Sparkles className="w-4 h-4" />
          {isGenerating ? "Gerando..." : "IA Sugestões"}
        </Button>
        <Button onClick={onSave} className="gap-2">
          <Save className="w-4 h-4" />
          Salvar Avatar
        </Button>
      </div>

      {/* Customization Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Body Type */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-center">Formato do Corpo</h3>
          <div className="grid grid-cols-3 gap-2">
            {bodyTypes.map((type) => (
              <Button
                key={type.id}
                variant={config.bodyType === type.id ? "default" : "outline"}
                className="h-16 flex flex-col gap-1"
                onClick={() => updateConfig("bodyType", type.id)}
              >
                <span className="text-lg">{type.emoji}</span>
                <span className="text-xs">{type.name}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Eyes */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-center">Olhos</h3>
          <div className="grid grid-cols-3 gap-2">
            {eyeStyles.map((style) => (
              <Button
                key={style.id}
                variant={config.eyeStyle === style.id ? "default" : "outline"}
                className="h-16 flex flex-col gap-1"
                onClick={() => updateConfig("eyeStyle", style.id)}
              >
                <span className="text-lg">{style.emoji}</span>
                <span className="text-xs">{style.name}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Mouth */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-center">Boca</h3>
          <div className="grid grid-cols-3 gap-2">
            {mouthStyles.map((style) => (
              <Button
                key={style.id}
                variant={config.mouthStyle === style.id ? "default" : "outline"}
                className="h-16 flex flex-col gap-1"
                onClick={() => updateConfig("mouthStyle", style.id)}
              >
                <span className="text-lg">{style.emoji}</span>
                <span className="text-xs">{style.name}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Hair */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-center">Cabelo</h3>
          <div className="grid grid-cols-3 gap-2">
            {hairStyles.map((style) => (
              <Button
                key={style.id}
                variant={config.hairStyle === style.id ? "default" : "outline"}
                className="h-12 flex flex-col gap-1 text-xs"
                onClick={() => updateConfig("hairStyle", style.id)}
              >
                <span>{style.emoji}</span>
                <span className="text-[10px]">{style.name}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Accessories */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-center">Acessórios</h3>
          <div className="grid grid-cols-3 gap-2">
            {accessories.map((accessory) => (
              <Button
                key={accessory.id}
                variant={config.accessory === accessory.id ? "default" : "outline"}
                className="h-12 flex flex-col gap-1 text-xs"
                onClick={() => updateConfig("accessory", accessory.id)}
              >
                <span>{accessory.emoji}</span>
                <span className="text-[10px]">{accessory.name}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Colors */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-center">Cores</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Corpo</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {colors.map((color) => (
                  <button
                    key={`body-${color}`}
                    className="w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: color,
                      borderColor: config.bodyColor === color ? "#000" : "#ccc" 
                    }}
                    onClick={() => updateConfig("bodyColor", color)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Cabelo</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {colors.map((color) => (
                  <button
                    key={`hair-${color}`}
                    className="w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: color,
                      borderColor: config.hairColor === color ? "#000" : "#ccc" 
                    }}
                    onClick={() => updateConfig("hairColor", color)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Acessório</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {colors.map((color) => (
                  <button
                    key={`accessory-${color}`}
                    className="w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: color,
                      borderColor: config.accessoryColor === color ? "#000" : "#ccc" 
                    }}
                    onClick={() => updateConfig("accessoryColor", color)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}