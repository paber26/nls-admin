<template>
    <!-- ================= LENGKAPI DATA ================= -->
    <section id="profileForm" class="min-h-screen flex items-center justify-center px-6">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
            <h1 class="text-2xl font-bold text-slate-800 mb-2">
                Lengkapi Data Peserta
            </h1>
            <p class="text-sm text-slate-500 mb-8">
                Data ini diperlukan untuk keperluan tryout, sertifikat, dan pengumuman
                hasil.
            </p>

            <form onsubmit="showDashboard(event)" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-medium">Nama Lengkap</label>
                        <input required type="text" class="w-full mt-1 px-4 py-2 border rounded-lg" />
                    </div>

                    <div>
                        <label class="text-sm font-medium">Asal Sekolah</label>
                        <input required type="text" class="w-full mt-1 px-4 py-2 border rounded-lg" />
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-medium">Kelas</label>
                        <select required class="w-full mt-1 px-4 py-2 border rounded-lg">
                            <option value="">Pilih Kelas</option>
                            <option>X</option>
                            <option>XI</option>
                            <option>XII</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm font-medium">Provinsi / Kota</label>
                        <input required type="text" class="w-full mt-1 px-4 py-2 border rounded-lg" />
                    </div>
                </div>

                <div>
                    <label class="text-sm font-medium">Nomor WhatsApp Aktif</label>
                    <input required type="text" placeholder="08xxxxxxxxxx"
                        class="w-full mt-1 px-4 py-2 border rounded-lg" />
                </div>

                <div>
                    <label class="text-sm font-medium">Minat Tryout</label>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        <label class="flex items-center gap-2 text-sm">
                            <input type="checkbox" /> Matematika
                        </label>
                        <label class="flex items-center gap-2 text-sm">
                            <input type="checkbox" /> Fisika
                        </label>
                        <label class="flex items-center gap-2 text-sm">
                            <input type="checkbox" /> Kimia
                        </label>
                        <label class="flex items-center gap-2 text-sm">
                            <input type="checkbox" /> Biologi
                        </label>
                        <label class="flex items-center gap-2 text-sm">
                            <input type="checkbox" /> Informatika
                        </label>
                        <label class="flex items-center gap-2 text-sm">
                            <input type="checkbox" /> Ekonomi
                        </label>
                    </div>
                </div>

                <button type="submit"
                    class="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                    Simpan & Lanjut ke Dashboard
                </button>
            </form>
        </div>
    </section>
</template>