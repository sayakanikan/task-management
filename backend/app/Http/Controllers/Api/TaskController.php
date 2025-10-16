<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Task;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class TaskController extends Controller
{
    public function getAll(Request $request)
    {
        try {
            $status = $request->query('status');
            $sort   = $request->query('sort', 'asc');

            if (!in_array(strtolower($sort), ['asc', 'desc'])) {
                $sort = 'asc';
            }

            $query = Task::with(['user', 'createdBy'])
                ->where(function ($q) {
                    $q->where('created_by', Auth::id())
                      ->orWhere('user_id', Auth::id());
                });

            if (!empty($status) && in_array(strtolower($status), ['todo', 'in_progress', 'done'])) {
                $query->where('status', $status);
            }

            $tasks = $query->orderBy('deadline', $sort)->get();

            return ApiResponse::success($tasks, 'List task berhasil diambil');
        } catch (Exception $e) {
            return ApiResponse::error('Internal Server Error', 500, $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $task = Task::with(['user', 'createdBy'])
                ->where(function ($q) {
                    $q->where('created_by', Auth::id())
                      ->orWhere('user_id', Auth::id());
                })
                ->where('id', $id)
                ->first();

            if (!$task) {
                return ApiResponse::error('Task tidak ditemukan', 404);
            }

            return ApiResponse::success($task, 'Detail task berhasil diambil');
        } catch (Exception $e) {
            return ApiResponse::error('Internal Server Error', 500, $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id'     => 'required|exists:users,id',
                'title'       => 'required|string|max:255',
                'description' => 'nullable|string',
                'status'      => 'required|in:todo,in_progress,done',
                'deadline'    => 'nullable|date'
            ]);

            $task = Task::create([
                'user_id'     => $validated['user_id'],
                'title'       => $validated['title'],
                'description' => $validated['description'] ?? null,
                'status'      => $validated['status'],
                'deadline'    => $validated['deadline'] ?? null,
                'created_by'  => Auth::id(),
            ]);

            return ApiResponse::success($task, 'Task berhasil dibuat', 201);
        } catch (ValidationException $e) {
            return ApiResponse::error('Validation Exception', 422, $e->errors());
        } catch (Exception $e) {
            return ApiResponse::error('Internal Server Error', 500, $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $task = Task::where(function ($q) {
                $q->where('created_by', Auth::id())
                  ->orWhere('user_id', Auth::id());
            })->where('id', $id)->first();

            if (!$task) {
                return ApiResponse::error('Not Found', 404, 'Task tidak ditemukan');
            }

            $validated = $request->validate([
                'user_id'     => 'required|exists:users,id',
                'title'       => 'required|string|max:255',
                'description' => 'nullable|string',
                'status'      => 'required|in:todo,in_progress,done',
                'deadline'    => 'nullable|date'
            ]);

            $task->update($validated);

            return ApiResponse::success($task, 'Task berhasil diperbarui');
        } catch (ValidationException $e) {
            return ApiResponse::error('Validation Exception', 422, $e->errors());
        } catch (Exception $e) {
            return ApiResponse::error('Internal Server Error', 500, $e->getMessage());
        }
    }

    public function delete($id)
    {
        try {
            $task = Task::where(function ($q) {
                $q->where('created_by', Auth::id())
                  ->orWhere('user_id', Auth::id());
            })->where('id', $id)->first();

            if (!$task) {
                return ApiResponse::error('Not Found', 404, 'Task tidak ditemukan');
            }

            $task->delete();

            return ApiResponse::success(null, 'Task berhasil dihapus');
        } catch (Exception $e) {
            return ApiResponse::error('Internal Server Error', 500, $e->getMessage());
        }
    }
}
