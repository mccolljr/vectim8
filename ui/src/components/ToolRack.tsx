export interface ToolDefinition {
  icon: string;
  name: string;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

export const ToolRack = ({ tools }: { tools: ToolDefinition[] }) => {
  return (
    <div style="display: flex; flex-direction: column;">
      {tools.map((t, i) => (
        <div style="display: inline-flex; justify-content: center; align-items: center; border-radius: 1.5em; width: 3em; height: 3em; background-color: red;">
          <i class={`bi bi-${t.icon}`} style="font-size: 2em;" />
        </div>
      ))}
    </div>
  );
};
