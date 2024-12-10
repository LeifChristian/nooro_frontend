import TaskForm from "@/app/components/TaskForm";

export default function CreateTaskPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create New Task</h1>
      <TaskForm mode="create" />
    </main>
  );
}