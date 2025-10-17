<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users,username',
                'email' => 'required|string|email|unique:users,email',
                'password' => 'required|string|min:6',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $data = [
                'user' => $user
            ];

            return ApiResponse::success($data, 'Register user berhasil!');
        } catch (ValidationException $e) {
            return ApiResponse::error('Validation Exception', 422, $e->errors());
        } catch (Exception $e) {
            return ApiResponse::error('Failed to register user', 500, $e->getMessage());
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string|min:6',
            ]);

            $credentials = $request->only('email', 'password');

            if (!$token = Auth::guard('api')->attempt($credentials)) {
                return ApiResponse::error('Email atau password salah', 401);
            }

            return ApiResponse::success($this->respondWithToken($token), 'Login berhasil');
        } catch (ValidationException $e) {
            return ApiResponse::error('Validation Exception', 422, $e->errors());
        } catch (Exception $e) {
            return ApiResponse::error('Login gagal', 500, $e->getMessage());
        }
    }

    public function me()
    {
        try {
            $user = Auth::guard('api')->user();
            return ApiResponse::success($user, 'Berhasil mengambil profil user');
        } catch (Exception $e) {
            return ApiResponse::error('Gagal mengambil profil user', 500, $e->getMessage());
        }
    }

    public function refresh()
    {
        try {
            $token = Auth::guard('api')->refresh();
            return ApiResponse::success($this->respondWithToken($token), 'Token direfresh');
        } catch (Exception $e) {
            return ApiResponse::error('Gagal merefresh token', 500, $e->getMessage());
        }
    }

    public function listUser()
    {
        try {
            $user = User::all();
            return ApiResponse::success($user, 'Data User berhasil diambil');
        } catch (Exception $e) {
            return ApiResponse::error('Gagal mendapatkan data user', 500, $e->getMessage());
        }
    }

    private function respondWithToken($token)
    {
        return [
            'token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => Auth::guard('api')->factory()->getTTL() * 60,
        ];
    }
}
