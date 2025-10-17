"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { TaskService } from "@/services/task";
import { UserService } from "@/services/user";
import { handleApiError } from "@/helpers/handleApiError";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Loader2, X, Calendar, Filter } from "lucide-react";
import { TaskStatus } from "@/types/task-status";

interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  deadline?: string | null;
  user?: { id: number; name: string };
  created_by?: { id: number; name: string };
}

interface User {
  id: number;
  name: string;
}

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

interface Params {
  status?: "all" | TaskStatus,
  sort_order?: "asc" | "desc",
}

const Modal: React.FC<ModalProps> = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-3">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<number>(0);
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [deadline, setDeadline] = useState<string>("");

  const fetchData = async (customParams?: Partial<Params>) => {
    try {
      setLoading(true);
  
      const params: Params = {
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
        sort_order: sortOrder,
        ...customParams,
      };
  
      const [taskRes, userRes] = await Promise.all([
        TaskService.list(params),
        UserService.list(),
      ]);
  
      setTasks(taskRes.data || taskRes);
      setUsers(userRes.data || userRes);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignedTo(0);
    setStatus("todo");
    setDeadline("");
    setSelectedTask(null);
  };

  const getStatusBadge = (s: TaskStatus): JSX.Element => {
    const colors: Record<TaskStatus, string> = {
      todo: "bg-gray-200 text-gray-700",
      in_progress: "bg-yellow-200 text-yellow-800",
      done: "bg-green-200 text-green-800",
    };
    const labels: Record<TaskStatus, string> = {
      todo: "To Do",
      in_progress: "In Progress",
      done: "Done",
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors[s]}`}>
        {labels[s]}
      </span>
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Judul tidak boleh kosong");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        user_id: assignedTo,
        title,
        description,
        status,
        deadline: deadline || null,
      };

      if (selectedTask) {
        await TaskService.update(selectedTask.id, payload);
        toast.success("Task berhasil diperbarui!");
      } else {
        await TaskService.create(payload);
        toast.success("Task berhasil ditambahkan!");
      }

      setShowFormModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      handleApiError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setAssignedTo(task.user_id ?? 0);
    setStatus(task.status);
    setDeadline(task.deadline || "");
    setShowFormModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTask) return;
    try {
      setDeleting(true);
      await TaskService.delete(selectedTask.id);
      toast.success("Task berhasil dihapus!");
      fetchData();
      setShowDeleteModal(false);
    } catch (err) {
      handleApiError(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-10">
      <div className="mx-auto bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <span>Task Management</span>
            </h1>
          </div>
  
          <button
            onClick={() => {
              resetForm();
              setShowFormModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm px-2.5 py-2 md:text-base md:px-5 md:py-2.5 rounded-xl hover:bg-blue-700 hover:shadow transition-all duration-200 hover:cursor-pointer"
          >
            <Plus size={18} />
            Tambah Task
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                const val = e.target.value as "all" | TaskStatus;
                setStatusFilter(val);
                fetchData({
                  status: val === "all" ? undefined : val,
                });
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-500" />
            <select
              value={sortOrder}
              onChange={(e) => {
                const val = e.target.value as "asc" | "desc";
                setSortOrder(val);
                fetchData({ sort_order: val });
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="asc">Deadline Terdekat</option>
              <option value="desc">Deadline Terjauh</option>
            </select>
          </div>
        </div>
  
        {loading ? (
          <div className="flex justify-center py-20 text-gray-500">
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            Memuat data...
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Plus className="text-gray-400 w-8 h-8" />
            </div>
            <p className="text-gray-600 font-medium">Belum ada task</p>
            <p className="text-gray-400 text-sm">
              Tambahkan task pertama Anda untuk memulai 🚀
            </p>
            <p className="text-gray-400 text-sm">
              Task yang anda buat atau yang di assign ke anda akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-2.5 px-4 text-left font-semibold">Judul</th>
                  <th className="py-2.5 px-4 text-left font-semibold">Deskripsi</th>
                  <th className="py-2.5 px-4 text-left font-semibold">Status</th>
                  <th className="py-2.5 px-4 text-left font-semibold">Assigned To</th>
                  <th className="py-2.5 px-4 text-left font-semibold">Deadline</th>
                  <th className="py-2.5 px-4 text-left font-semibold">Dibuat Oleh</th>
                  <th className="py-2.5 px-4 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, i) => (
                  <tr
                    key={task.id}
                    className={`transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/70"
                    } hover:bg-blue-50`}
                  >
                    <td className="py-2.5 px-4 font-medium text-gray-800 truncate max-w-[150px]">
                      {task.title}
                    </td>
                    <td className="py-2.5 px-4 text-gray-600 truncate max-w-[200px]">
                      {task.description || "-"}
                    </td>
                    <td className="py-2.5 px-4">{getStatusBadge(task.status)}</td>
                    <td className="py-2.5 px-4">{task.user?.name || "-"}</td>
                    <td className="py-2.5 px-4">
                      {task.deadline
                        ? new Intl.DateTimeFormat("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }).format(new Date(task.deadline))
                        : "-"}
                    </td>
                    <td className="py-2.5 px-4">{task.created_by?.name || "-"}</td>
                    <td className="py-2.5 px-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-1.5 rounded hover:bg-blue-100 text-blue-600 transition hover:cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 rounded hover:bg-red-100 text-red-600 transition hover:cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  
      {/* === Form Modal === */}
      <Modal
        open={showFormModal}
        title={selectedTask ? "Edit Task" : "Tambah Task"}
        onClose={() => setShowFormModal(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Judul</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="Masukkan judul tugas"
            />
          </div>
  
          <div>
            <label className="block text-sm text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 h-24 focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="Deskripsi tugas (opsional)"
            />
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Assign ke</label>
              <select
                value={assignedTo ?? ""}
                onChange={(e) => setAssignedTo(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-400 outline-none transition hover:cursor-pointer"
              >
                <option value="">Pilih User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
  
            <div>
              <label className="block text-sm text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-400 outline-none transition hover:cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
  
          <div>
            <label className="block text-sm text-gray-700 mb-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>
        </div>
  
        <div className="flex justify-end gap-3 mt-6 pt-4">
          <button
            onClick={() => setShowFormModal(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition hover:cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition hover:cursor-pointer ${
              saving
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-sm"
            }`}
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {selectedTask ? "Update" : "Simpan"}
          </button>
        </div>
      </Modal>
  
      {/* === Delete Modal === */}
      <Modal
        open={showDeleteModal}
        title="Konfirmasi Hapus"
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="space-y-4">
          <p className="text-gray-700 text-sm">
            Apakah Anda yakin ingin menghapus task{" "}
            <strong>{selectedTask?.title}</strong>?
          </p>
  
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition hover:cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className={`px-5 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:cursor-pointer transition ${
                deleting
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 shadow-sm"
              }`}
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );  
}
