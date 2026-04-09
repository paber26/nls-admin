<template>
  <AppShell>
    <template #header>
      <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <h1 class="text-lg font-semibold text-slate-800">Integrasi Codeforces</h1>
          <p class="text-sm text-slate-500">Akses Codeforces diamankan lewat nls-osn-api</p>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isPinging"
          @click="pingApi()"
        >
          <svg v-if="isPinging" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ isPinging ? "Menguji Koneksi..." : "Test Koneksi API" }}
        </button>
      </div>
    </template>

    <div class="mx-auto max-w-7xl space-y-6 p-6 text-slate-800">
      <div
        v-if="successMessage"
        class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      >
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600">📡</div>
          <div>
            <p class="text-sm font-medium text-slate-500">Status Server CF</p>
            <div class="mt-1 flex items-center gap-2">
              <div class="h-2.5 w-2.5 rounded-full" :class="serverStatusDotClass"></div>
              <p class="text-lg font-semibold text-slate-900">{{ serverStatusLabel }}</p>
            </div>
            <p class="mt-1 text-xs text-slate-500">Cek terakhir: {{ lastCheckedLabel }}</p>
          </div>
        </div>

        <div class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl text-indigo-600">
            🔐
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Mode Akses</p>
            <p class="mt-1 text-lg font-semibold text-slate-900">Via nls-osn-api</p>
            <p class="mt-1 text-xs text-slate-500">
              {{ connection.signedRequest ? "Signed request aktif" : "Signed request belum aktif" }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl text-orange-600">
            📥
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Submission Ditampilkan</p>
            <p class="mt-1 text-lg font-semibold text-slate-900">{{ submissions.length }}</p>
            <p class="mt-1 text-xs text-slate-500">Data terbaru dari handle yang dipilih</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-1">
          <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div class="border-b border-slate-100 bg-slate-50/60 px-6 py-5">
              <h2 class="text-base font-semibold text-slate-900">Tarik Data Manual</h2>
              <p class="mt-1 text-sm text-slate-500">
                Masukkan Codeforces handle. Admin akan membaca data lewat backend, bukan langsung ke Codeforces.
              </p>
            </div>

            <div class="space-y-5 p-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Codeforces Handle</label>
                <input
                  v-model.trim="targetHandle"
                  type="text"
                  placeholder="contoh: tourist"
                  class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  @keyup.enter="syncHandle"
                />
              </div>

              <button
                type="button"
                class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isSyncing"
                @click="syncHandle"
              >
                <svg v-if="isSyncing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ isSyncing ? "Mengambil Data..." : "Ambil Profil & Submission" }}
              </button>
            </div>
          </div>

          <div class="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 class="text-base font-semibold text-slate-900">Informasi Penting</h3>
            <ul class="list-disc space-y-2 pl-4 text-sm text-slate-600 marker:text-slate-300">
              <li>Kredensial Codeforces tetap berada di server `nls-osn-api` dan tidak dikirim ke browser admin.</li>
              <li>Endpoint Codeforces hanya bisa diakses admin yang sudah login lewat token NLS.</li>
              <li>
                Integrasi ke `cf_problem_id` dan sinkronisasi tryout penuh bisa dilanjutkan setelah schema databasenya
                ditambahkan.
              </li>
            </ul>
          </div>
        </div>

        <div class="space-y-6 lg:col-span-2">
          <section class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="text-base font-semibold text-slate-900">Profil Handle</h2>
                <p class="mt-1 text-sm text-slate-500">Data user diambil dari backend proxy Codeforces.</p>
              </div>
            </div>

            <div v-if="cfUser" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-500">Handle</p>
                <p class="mt-1 text-base font-semibold text-slate-900">{{ cfUser.handle || "-" }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-500">Rank</p>
                <p class="mt-1 text-base font-semibold text-slate-900">{{ cfUser.rank || "-" }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-500">Rating</p>
                <p class="mt-1 text-base font-semibold text-slate-900">{{ cfUser.rating ?? "-" }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-500">Max Rating</p>
                <p class="mt-1 text-base font-semibold text-slate-900">{{ cfUser.maxRating ?? "-" }}</p>
              </div>
            </div>

            <div
              v-else
              class="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
            >
              Belum ada handle yang dimuat.
            </div>
          </section>

          <section class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div class="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-5">
              <div>
                <h2 class="text-base font-semibold text-slate-900">Submission Terbaru</h2>
                <p class="mt-1 text-sm text-slate-500">Riwayat terbaru untuk handle yang dipilih.</p>
              </div>
              <button
                type="button"
                class="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="!targetHandle || isSyncing"
                @click="syncHandle"
              >
                Segarkan
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr class="border-b border-slate-100 bg-white">
                    <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Waktu</th>
                    <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Problem</th>
                    <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Bahasa</th>
                    <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Tes Lolos</th>
                    <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Verdict</th>
                  </tr>
                </thead>
                <tbody v-if="submissions.length" class="divide-y divide-slate-50 text-sm">
                  <tr v-for="submission in submissions" :key="submission.id" class="transition hover:bg-slate-50/50">
                    <td class="px-6 py-4 whitespace-nowrap text-slate-500">
                      {{ formatSubmissionTime(submission.creationTimeSeconds) }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="font-medium text-slate-900">{{ problemCode(submission) }}</div>
                      <div class="text-xs text-slate-500">{{ submission.problem?.name || "-" }}</div>
                    </td>
                    <td class="px-6 py-4 text-slate-600">{{ submission.programmingLanguage || "-" }}</td>
                    <td class="px-6 py-4 text-slate-600">{{ submission.passedTestCount ?? 0 }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex rounded-md px-2 py-1 text-xs font-medium"
                        :class="verdictClass(submission.verdict)"
                      >
                        {{ verdictLabel(submission.verdict) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">
                      Belum ada submission yang ditampilkan.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-slate-200 my-8"></div>

      <!-- MANAJEMEN PROBLEM CODEFORCES -->
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Manajemen Problem Codeforces</h2>
          <p class="text-sm text-slate-500">Tambah problem Codeforces untuk dikerjakan peserta secara otomatis.</p>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Cari & Resolove Kolom Kiri -->
          <div class="space-y-6 lg:col-span-1">
            <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div class="border-b border-slate-100 bg-slate-50/60 px-6 py-5">
                <h3 class="text-base font-semibold text-slate-900">Impor Problem Baru</h3>
                <p class="mt-1 text-sm text-slate-500">Masukkan URL lengkap dari website Codeforces.</p>
              </div>

              <div class="space-y-5 p-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-700">URL Problem</label>
                  <input
                    v-model.trim="targetProblemUrl"
                    type="text"
                    placeholder="https://codeforces.com/problemset/problem/2209/D"
                    class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    @keyup.enter="resolveProblem"
                  />
                </div>

                <button
                  type="button"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="isResolving || !targetProblemUrl"
                  @click="resolveProblem"
                >
                  <svg v-if="isResolving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  {{ isResolving ? "Mencari..." : "Validasi Problem" }}
                </button>
              </div>

              <!-- Hasil Resolve Form Simpan -->
              <div v-if="resolvedProblem" class="border-t border-slate-100 bg-indigo-50/30 p-6 space-y-4">
                <div>
                  <p class="text-xs font-semibold uppercase text-indigo-500">Ditemukan</p>
                  <p class="mt-1 font-bold text-slate-900">{{ resolvedProblem.contestId }}{{ resolvedProblem.index }} - {{ resolvedProblem.name }}</p>
                  <div class="mt-2 flex flex-wrap gap-1">
                    <span v-for="tag in (resolvedProblem.tags || [])" :key="tag" class="rounded bg-white px-2 py-0.5 text-xs text-slate-600 border border-slate-200">
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <div class="space-y-3 pt-4 border-t border-indigo-100">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
                    <select v-model="newProblemMapelId" class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="">Pilih Mapel...</option>
                      <option v-for="mapel in mapelList" :key="mapel.id" :value="mapel.id">
                        {{ mapel.nama }} ({{ mapel.tingkat }})
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Poin Dasar</label>
                    <input v-model.number="newProblemPoints" type="number" min="0" class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <button
                    type="button"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isSavingProblem"
                    @click="saveProblem"
                  >
                    {{ isSavingProblem ? "Menyimpan..." : "Simpan ke Soal Codeforces" }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabel Daftar Problem Kolom Kanan -->
          <div class="space-y-6 lg:col-span-2">
            <section class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div class="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-5">
                <div>
                  <h3 class="text-base font-semibold text-slate-900">Daftar Problem Tersimpan</h3>
                  <p class="mt-1 text-sm text-slate-500">Soal-soal ini dapat dipilih saat menyusun Tryout / Paket NLS-OSN.</p>
                </div>
                <button
                  type="button"
                  class="text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
                  @click="loadSavedProblems"
                >
                  Segarkan
                </button>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left">
                  <thead>
                    <tr class="border-b border-slate-100 bg-white">
                      <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">ID CF</th>
                      <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Nama Problem</th>
                      <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Mapel</th>
                      <th class="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">Poin</th>
                      <th class="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody v-if="savedProblems.length" class="divide-y divide-slate-50 text-sm">
                    <tr v-for="p in savedProblems" :key="p.id" class="transition hover:bg-slate-50/50">
                      <td class="px-6 py-4 font-medium text-slate-900">
                        {{ p.cf_contest_id }}{{ p.cf_index }}
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-slate-900">{{ p.name }}</div>
                        <div class="text-xs text-slate-400 mt-0.5">Rating: {{ p.rating || 'N/A' }}</div>
                      </td>
                      <td class="px-6 py-4 text-slate-600">
                        {{ p.mapel ? p.mapel.nama : '-' }}
                      </td>
                      <td class="px-6 py-4 text-slate-600">{{ p.points }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
                        <button class="text-blue-600 hover:text-blue-800 text-xs font-medium cursor-pointer" @click="viewStatement(p)">Lihat Soal</button>
                        <button class="text-indigo-600 hover:text-indigo-800 text-xs font-medium cursor-pointer" @click="openEditor(p)">Edit Text</button>
                        <button class="text-rose-600 hover:text-rose-800 text-xs font-medium cursor-pointer" @click="deleteProblem(p.id)">Hapus</button>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">
                        Belum ada problem Codeforces yang tersimpan.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Lihat Soal -->
    <div v-if="isStatementModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 class="text-lg font-semibold text-slate-800">{{ selectedProblem?.name || 'Deskripsi Soal' }}</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600 cursor-pointer" @click="isStatementModalOpen = false">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1">
          <div v-if="isFetchingStatement" class="flex justify-center py-12">
            <svg class="h-8 w-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
          <div v-else-if="statementError" class="text-center py-8 text-rose-600">
            {{ statementError }}
          </div>
          <div v-else class="cf-problem-statement prose max-w-none prose-slate" v-html="statementHtml"></div>
        </div>
        
        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 flex-wrap">
          <a v-if="selectedProblem" :href="'https://codeforces.com/contest/' + selectedProblem.cf_contest_id + '/problem/' + selectedProblem.cf_index" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium text-sm transition-colors border border-indigo-200 flex items-center gap-2">
            Buka di Codeforces
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
          <button type="button" class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium text-sm transition-colors" @click="isStatementModalOpen = false">Tutup</button>
        </div>
      </div>
    </div>
    <!-- Modal Konfirmasi Hapus -->
    <div v-if="isConfirmDeleteModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col overflow-hidden">
        <div class="p-6 text-center">
          <div class="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">Hapus Codeforces Problem?</h3>
          <p class="text-sm text-slate-500">
            Tindakan ini akan menghapus soal dari pangkalan data. Anda dapat menariknya kembali kapan saja jika diperlukan.
          </p>
        </div>
        <div class="flex items-center gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 justify-end">
          <button @click="isConfirmDeleteModalOpen = false; problemToDelete = null" class="px-4 py-2 font-medium text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">Batal</button>
          <button @click="confirmDelete" class="px-4 py-2 font-medium text-sm text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer">Ya, Hapus</button>
        </div>
      </div>
    </div>
    <!-- Modal Edit Narasi Soal -->
    <div v-if="isEditorModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 class="text-lg font-semibold text-slate-800">Edit Narasi (HTML) - {{ selectedProblem?.name }}</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600 cursor-pointer" @click="isEditorModalOpen = false">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1 cf-editor-container">
          <p class="text-sm text-slate-500 mb-4">Gunakan editor ini untuk menyusun narasi bahasa Indonesia kustom untuk problem ini. Input dan output *judgement* tetap mengacu ke Codeforces aslinya.</p>
          <div class="border rounded-lg border-slate-200 overflow-hidden">
            <ckeditor :editor="editor" v-model="editStatementHtml" :config="editorConfig" />
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button type="button" class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium text-sm transition-colors cursor-pointer" @click="isEditorModalOpen = false">Batal</button>
          <button type="button" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors cursor-pointer" @click="saveStatementHtml" :disabled="isSavingHtml">
            {{ isSavingHtml ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import AppShell from "@/components/layout/AppShell.vue"
import api from "@/services/api"
import { Ckeditor } from "@ckeditor/ckeditor5-vue"
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  Image,
  ImageToolbar,
  ImageResize,
  ImageUpload
} from "ckeditor5"

const isPinging = ref(false)
const isSyncing = ref(false)
const targetHandle = ref("")
const successMessage = ref("")
const errorMessage = ref("")
const lastConnectionError = ref("")
const cfUser = ref(null)
const submissions = ref([])

// CF Problem Mgmt
const isResolving = ref(false)
const targetProblemUrl = ref("")
const resolvedProblem = ref(null)
const mapelList = ref([])
const savedProblems = ref([])
const newProblemMapelId = ref("")
const newProblemPoints = ref(100)
const isSavingProblem = ref(false)

// Statement Viewer
const isStatementModalOpen = ref(false)
const isFetchingStatement = ref(false)
const statementHtml = ref("")
const statementError = ref("")
const selectedProblem = ref(null)

const isEditorModalOpen = ref(false)
const editStatementHtml = ref("")
const isSavingHtml = ref(false)

const isConfirmDeleteModalOpen = ref(false)
const problemToDelete = ref(null)

const editor = ClassicEditor

function MyUploadAdapter(loader) {
  this.loader = loader
}

MyUploadAdapter.prototype.upload = function () {
  return this.loader.file.then((file) => {
    const data = new FormData()
    data.append("upload", file)

    return api
      .post("/upload-image", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res) => {
        return {
          default: res.data.url
        }
      })
  })
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader)
  }
}

const editorConfig = {
  licenseKey: "GPL",
  plugins: [Essentials, Paragraph, Bold, Italic, Underline, Link, List, Image, ImageToolbar, ImageResize, ImageUpload],
  extraPlugins: [MyCustomUploadAdapterPlugin],
  toolbar: [
    "undo",
    "redo",
    "|",
    "bold",
    "italic",
    "underline",
    "|",
    "link",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "imageUpload"
  ],
  image: {
    resizeOptions: [
      {
        name: "resizeImage:original",
        label: "Original",
        value: null
      },
      {
        name: "resizeImage:50",
        label: "50%",
        value: "50"
      },
      {
        name: "resizeImage:75",
        label: "75%",
        value: "75"
      }
    ],
    toolbar: ["resizeImage:original", "resizeImage:50", "resizeImage:75"]
  }
}

const connection = ref({
  online: null,
  configured: false,
  signedRequest: false,
  checkedAt: ""
})

const serverStatusLabel = computed(() => {
  if (connection.value.online === null) {
    return "Belum Diuji"
  }

  return connection.value.online ? "Online" : "Gagal"
})

const serverStatusDotClass = computed(() => {
  if (connection.value.online === null) {
    return "bg-slate-300"
  }

  return connection.value.online ? "bg-emerald-500" : "bg-rose-500"
})

const lastCheckedLabel = computed(() => {
  if (!connection.value.checkedAt) {
    return "Belum ada"
  }

  return formatIsoDate(connection.value.checkedAt)
})

const pingApi = async ({ silent = false } = {}) => {
  isPinging.value = true

  if (!silent) {
    successMessage.value = ""
    errorMessage.value = ""
  }

  try {
    const { data } = await api.get("/codeforces/health")
    lastConnectionError.value = ""

    connection.value = {
      online: true,
      configured: Boolean(data.data?.configured),
      signedRequest: Boolean(data.data?.signed_request),
      checkedAt: data.data?.checked_at || new Date().toISOString()
    }

    if (!silent) {
      successMessage.value = data.message || "Koneksi Codeforces berhasil."
    }

    return true
  } catch (error) {
    const message = extractErrorMessage(error)
    lastConnectionError.value = message

    connection.value = {
      online: false,
      configured: false,
      signedRequest: false,
      checkedAt: new Date().toISOString()
    }

    if (!silent) {
      errorMessage.value = message
    }

    return false
  } finally {
    isPinging.value = false
  }
}

const syncHandle = async () => {
  const handle = targetHandle.value.trim()

  successMessage.value = ""
  errorMessage.value = ""

  if (!handle) {
    errorMessage.value = "Handle Codeforces wajib diisi."
    return
  }

  isSyncing.value = true

  try {
    const healthOk = await pingApi({ silent: true })

    if (!healthOk) {
      errorMessage.value = buildConnectionErrorMessage()
      return
    }

    const encodedHandle = encodeURIComponent(handle)

    const [userResponse, submissionsResponse] = await Promise.all([
      api.get(`/codeforces/handles/${encodedHandle}`),
      api.get(`/codeforces/handles/${encodedHandle}/submissions`, {
        params: { count: 20 }
      })
    ])

    cfUser.value = userResponse.data.data || null
    submissions.value = submissionsResponse.data.data || []
    successMessage.value = `Data Codeforces untuk handle ${handle} berhasil diambil.`
  } catch (error) {
    errorMessage.value = extractErrorMessage(error)
  } finally {
    isSyncing.value = false
  }
}

const buildConnectionErrorMessage = () => {
  if (lastConnectionError.value) {
    return lastConnectionError.value
  }

  if (connection.value.configured === false) {
    return "Konfigurasi Codeforces API di server belum lengkap. Cek CF_API_KEY dan CF_API_SECRET di nls-osn-api."
  }

  if (connection.value.online === false) {
    return "Backend belum bisa terhubung ke Codeforces API. Jalankan Test Koneksi API untuk melihat status terbaru."
  }

  return "Terjadi kesalahan saat menghubungkan ke Codeforces."
}

const extractErrorMessage = (error) => {
  return (
    error?.response?.data?.errors?.handle?.[0] ||
    error?.response?.data?.message ||
    error?.message ||
    "Terjadi kesalahan saat menghubungkan ke Codeforces."
  )
}

const formatIsoDate = (value) => {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value))
}

const formatSubmissionTime = (timestamp) => {
  if (!timestamp) {
    return "-"
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(timestamp * 1000))
}

const problemCode = (submission) => {
  const contestId = submission.problem?.contestId || submission.contestId || ""
  const index = submission.problem?.index || ""

  return `${contestId}${index}` || "-"
}

const verdictLabel = (verdict) => {
  if (!verdict) {
    return "In Queue"
  }

  if (verdict === "OK") {
    return "Accepted"
  }

  return verdict.replaceAll("_", " ")
}

const verdictClass = (verdict) => {
  if (verdict === "OK") {
    return "bg-emerald-50 text-emerald-700"
  }

  if (!verdict) {
    return "bg-amber-50 text-amber-700"
  }

  return "bg-rose-50 text-rose-700"
}

const loadMapel = async () => {
  try {
    const { data } = await api.get('/mapel')
    mapelList.value = data
  } catch (err) {
    console.error("Gagal load mapel", err)
  }
}

const loadSavedProblems = async () => {
  try {
    const { data } = await api.get('/cf-problems')
    savedProblems.value = data.data || []
  } catch (err) {
    console.error("Gagal load saved problems", err)
  }
}

const resolveProblem = async () => {
  if (!targetProblemUrl.value) return
  isResolving.value = true
  resolvedProblem.value = null
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const { data } = await api.get('/codeforces/problems/resolve', { params: { url: targetProblemUrl.value } })
    resolvedProblem.value = data.data?.problem || data.data
    successMessage.value = data.message || "Problem berhasil ditemukan."
  } catch (error) {
    errorMessage.value = extractErrorMessage(error)
  } finally {
    isResolving.value = false
  }
}

const saveProblem = async () => {
  if (!newProblemMapelId.value || typeof newProblemPoints.value !== 'number') {
    errorMessage.value = "Mapel dan poin wajib diisi."
    return
  }
  isSavingProblem.value = true
  errorMessage.value = ''
  
  try {
    const { data } = await api.post('/cf-problems', {
      mapel_id: newProblemMapelId.value,
      cf_contest_id: resolvedProblem.value.contestId,
      cf_index: resolvedProblem.value.index,
      name: resolvedProblem.value.name,
      rating: resolvedProblem.value.rating || null,
      tags: resolvedProblem.value.tags || [],
      points: newProblemPoints.value
    })
    
    if (data.message && data.message.includes("Gagal")) {
      errorMessage.value = data.message // Tampilkan sbg error/warning jika diblokir
      successMessage.value = ""
    } else {
      successMessage.value = data.message || "Problem Codeforces berhasil disimpan ke database!"
      errorMessage.value = ""
    }
    
    resolvedProblem.value = null
    targetProblemUrl.value = ""
    loadSavedProblems()
  } catch (error) {
    errorMessage.value = extractErrorMessage(error)
  } finally {
    isSavingProblem.value = false
  }
}

const deleteProblem = (id) => {
  problemToDelete.value = id
  isConfirmDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!problemToDelete.value) return
  isConfirmDeleteModalOpen.value = false
  
  try {
    await api.delete(`/cf-problems/${problemToDelete.value}`)
    loadSavedProblems()
    successMessage.value = "Problem Codeforces berhasil dihapus."
  } catch (error) {
    errorMessage.value = extractErrorMessage(error)
  } finally {
    problemToDelete.value = null
  }
}

const viewStatement = async (problem) => {
  selectedProblem.value = problem
  isStatementModalOpen.value = true
  isFetchingStatement.value = true
  statementError.value = ""
  statementHtml.value = ""

  try {
    const { data } = await api.get(`/cf-problems/${problem.id}/statement`)
    statementHtml.value = data.data || ""
    
    // Inject mathjax styling logic if needed natively
    setTimeout(() => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise()
      }
    }, 100)
  } catch (error) {
    statementError.value = extractErrorMessage(error)
  } finally {
    isFetchingStatement.value = false
  }
}

const openEditor = async (problem) => {
  selectedProblem.value = problem
  isEditorModalOpen.value = true
  editStatementHtml.value = "Memuat..." // Placeholder
  
  try {
    const { data } = await api.get(`/cf-problems/${problem.id}/statement`)
    editStatementHtml.value = data.data || ""
  } catch (error) {
    // Jika API aslinya terblokir, kita bisa memberi area kosong kepada pengguna.
    editStatementHtml.value = problem.statement_html || ""
    successMessage.value = ''
    errorMessage.value = "Soal asal diblokir Cloudflare. Anda dapat menulis manual dari awal."
  }
}

const saveStatementHtml = async () => {
  if (!selectedProblem.value) return
  isSavingHtml.value = true
  errorMessage.value = ""
  
  try {
    const { data } = await api.put(`/cf-problems/${selectedProblem.value.id}`, {
      statement_html: editStatementHtml.value
    })
    successMessage.value = data.message || "Teks soal berhasil diupdate."
    isEditorModalOpen.value = false
    loadSavedProblems()
  } catch (error) {
    errorMessage.value = extractErrorMessage(error)
  } finally {
    isSavingHtml.value = false
  }
}

onMounted(() => {
  pingApi({ silent: true })
  loadMapel()
  loadSavedProblems()
})
</script>

<style>
/* Custom Codeforces Statement Styling */
.cf-problem-statement {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #222;
}
.cf-problem-statement .header {
  text-align: center;
  margin-bottom: 2em;
}
.cf-problem-statement .header .title {
  font-size: 1.75em;
  font-weight: bold;
  margin-bottom: 0.5em;
}
.cf-problem-statement .header .time-limit,
.cf-problem-statement .header .memory-limit,
.cf-problem-statement .header .input-file,
.cf-problem-statement .header .output-file {
  margin: 0;
  font-size: 0.9em;
}
.cf-problem-statement .header .property-title {
  display: inline;
  font-weight: bold;
}
.cf-problem-statement .header .property-title:after {
  content: ": ";
}
.cf-problem-statement .sample-tests {
  margin-top: 2em;
}
.cf-problem-statement .sample-tests .section-title {
  font-weight: bold;
  font-size: 1.25em;
  margin-bottom: 0.5em;
}
.cf-problem-statement .sample-tests .sample-test {
  display: flex;
  flex-direction: column;
}
.cf-problem-statement .sample-tests .sample-test .input,
.cf-problem-statement .sample-tests .sample-test .output {
  border: 1px solid #ccc;
  margin-bottom: 1em;
  border-radius: 4px;
}
.cf-problem-statement .sample-tests .sample-test .title {
  font-weight: bold;
  padding: 0.25em 0.75em;
  border-bottom: 1px solid #ccc;
  background-color: #f5f5f5;
  font-size: 0.9em;
  margin: 0;
}
.cf-problem-statement .sample-tests .sample-test pre {
  margin: 0;
  padding: 0.75em;
  background-color: #fafafa !important;
  color: #333 !important;
  font-family: Consolas, "Courier New", monospace;
  white-space: pre-wrap;
  border-radius: 0 0 4px 4px;
  font-size: 0.9em;
  line-height: 1.4;
}
.cf-problem-statement p {
  margin-top: 0.5em;
  margin-bottom: 1em;
}
.cf-problem-statement ul {
  list-style-type: disc !important;
  padding-left: 2em !important;
}
.cf-problem-statement li {
  margin-bottom: 0.25em;
}
.cf-editor-container .ck-editor__editable_inline {
  min-height: 400px;
}
</style>
