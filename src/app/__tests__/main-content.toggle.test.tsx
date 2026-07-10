import { test, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MainContent } from "@/app/main-content";

// Isolate the Preview/Code toggle logic by stubbing the heavy child
// components and the context providers. We only care that clicking the
// tab buttons switches which view is rendered.
vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame">PREVIEW_FRAME</div>,
}));
vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor">CODE_EDITOR</div>,
}));
vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree">FILE_TREE</div>,
}));
vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div data-testid="chat">CHAT</div>,
}));
vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions">HEADER</div>,
}));
vi.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: { children: any }) => <>{children}</>,
  useFileSystem: () => ({}),
}));
vi.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: { children: any }) => <>{children}</>,
  useChat: () => ({}),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("defaults to the Preview view", () => {
  render(<MainContent />);
  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("clicking the Code tab switches to the code view", () => {
  render(<MainContent />);

  fireEvent.click(screen.getByRole("tab", { name: "Code" }));

  expect(screen.getByTestId("code-editor")).toBeDefined();
  expect(screen.getByTestId("file-tree")).toBeDefined();
  expect(screen.queryByTestId("preview-frame")).toBeNull();
});

test("clicking Code then Preview toggles back to the preview view", () => {
  render(<MainContent />);

  fireEvent.click(screen.getByRole("tab", { name: "Code" }));
  expect(screen.getByTestId("code-editor")).toBeDefined();

  fireEvent.click(screen.getByRole("tab", { name: "Preview" }));
  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});
