import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

test("shows 'Creating' message while a file is being created", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "call",
      }}
    />
  );

  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows 'Created' message once file creation is done", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "result",
        result: "File created: /App.jsx",
      }}
    />
  );

  expect(screen.getByText("Created /App.jsx")).toBeDefined();
});

test("shows 'Editing' / 'Edited' message for str_replace command", () => {
  const { rerender } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "str_replace", path: "/components/Card.jsx" },
        state: "call",
      }}
    />
  );

  expect(screen.getByText("Editing /components/Card.jsx")).toBeDefined();

  rerender(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "str_replace", path: "/components/Card.jsx" },
        state: "result",
        result: "Replaced 1 occurrence(s)",
      }}
    />
  );

  expect(screen.getByText("Edited /components/Card.jsx")).toBeDefined();
});

test("shows 'Editing' / 'Edited' message for insert command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "insert", path: "/components/Card.jsx" },
        state: "call",
      }}
    />
  );

  expect(screen.getByText("Editing /components/Card.jsx")).toBeDefined();
});

test("shows 'Viewing' / 'Viewed' message for view command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "view", path: "/App.jsx" },
        state: "result",
        result: "1\tfile contents",
      }}
    />
  );

  expect(screen.getByText("Viewed /App.jsx")).toBeDefined();
});

test("shows renaming message with both paths for file_manager rename", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "file_manager",
        args: {
          command: "rename",
          path: "/components/Old.jsx",
          new_path: "/components/New.jsx",
        },
        state: "call",
      }}
    />
  );

  expect(
    screen.getByText("Renaming /components/Old.jsx to /components/New.jsx")
  ).toBeDefined();
});

test("shows renamed message once file_manager rename is done", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "file_manager",
        args: {
          command: "rename",
          path: "/components/Old.jsx",
          new_path: "/components/New.jsx",
        },
        state: "result",
        result: { success: true },
      }}
    />
  );

  expect(
    screen.getByText("Renamed /components/Old.jsx to /components/New.jsx")
  ).toBeDefined();
});

test("shows deleting / deleted message for file_manager delete", () => {
  const { rerender } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "file_manager",
        args: { command: "delete", path: "/components/Old.jsx" },
        state: "call",
      }}
    />
  );

  expect(screen.getByText("Deleting /components/Old.jsx")).toBeDefined();

  rerender(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "file_manager",
        args: { command: "delete", path: "/components/Old.jsx" },
        state: "result",
        result: { success: true },
      }}
    />
  );

  expect(screen.getByText("Deleted /components/Old.jsx")).toBeDefined();
});

test("falls back to the raw tool name when there is no path or command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        args: {},
        state: "call",
      }}
    />
  );

  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("falls back to the raw tool name for unrecognized tools", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "some_other_tool",
        args: { path: "/App.jsx" },
        state: "call",
      }}
    />
  );

  expect(screen.getByText("some_other_tool")).toBeDefined();
});

test("renders a spinner while in progress and a solid dot when done", () => {
  const { container, rerender } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "call",
      }}
    />
  );

  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();

  rerender(
    <ToolInvocationBadge
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "result",
        result: "File created: /App.jsx",
      }}
    />
  );

  expect(container.querySelector(".animate-spin")).toBeNull();
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
});
