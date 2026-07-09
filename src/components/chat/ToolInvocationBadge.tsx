"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  args?: any;
  state: string;
  result?: any;
}

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

function getToolLabel(toolInvocation: ToolInvocation, isDone: boolean): string {
  const { toolName, args } = toolInvocation;
  const path = args?.path;
  const newPath = args?.new_path;

  if (toolName === "str_replace_editor" && path) {
    switch (args?.command) {
      case "create":
        return isDone ? `Created ${path}` : `Creating ${path}`;
      case "str_replace":
      case "insert":
        return isDone ? `Edited ${path}` : `Editing ${path}`;
      case "view":
        return isDone ? `Viewed ${path}` : `Viewing ${path}`;
      case "undo_edit":
        return isDone ? `Reverted ${path}` : `Reverting ${path}`;
    }
  }

  if (toolName === "file_manager" && path) {
    switch (args?.command) {
      case "rename":
        return newPath
          ? isDone
            ? `Renamed ${path} to ${newPath}`
            : `Renaming ${path} to ${newPath}`
          : isDone
          ? `Renamed ${path}`
          : `Renaming ${path}`;
      case "delete":
        return isDone ? `Deleted ${path}` : `Deleting ${path}`;
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const isDone = toolInvocation.state === "result" && Boolean(toolInvocation.result);
  const label = getToolLabel(toolInvocation, isDone);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
