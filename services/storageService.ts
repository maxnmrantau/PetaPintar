
import { PinLocation, LocationCategory, LocationReport } from '../types';
import { supabase } from '../lib/supabaseClient'; // Import Supabase client

// --- HELPER MAPPING FUNCTIONS ---
// Ini PENTING: Mengubah format variabel aplikasi (camelCase) ke format Database (snake_case)
// agar tidak muncul error "Column not found"
const toDbLocation = (pin: PinLocation) => ({
  id: pin.id,
  name: pin.name,
  description: pin.description,
  category: pin.category,
  lat: pin.lat,
  lng: pin.lng,
  image_url: pin.imageUrl,         // Mapping: imageUrl -> image_url
  address: pin.address,
  phone: pin.phone,
  owner_name: pin.ownerName,       // Mapping: ownerName -> owner_name
  email: pin.email,
  whatsapp: pin.whatsapp,
  operating_hours: pin.operatingHours, // Mapping: operatingHours -> operating_hours
  status: pin.status,
  created_at: pin.createdAt        // Mapping: createdAt -> created_at
});

// Mengubah format Database (snake_case) kembali ke aplikasi (camelCase)
const fromDbLocation = (dbPin: any): PinLocation => ({
  id: dbPin.id,
  name: dbPin.name,
  description: dbPin.description,
  category: dbPin.category,
  lat: dbPin.lat,
  lng: dbPin.lng,
  imageUrl: dbPin.image_url,       // Mapping balik
  address: dbPin.address,
  phone: dbPin.phone,
  ownerName: dbPin.owner_name,     // Mapping balik
  email: dbPin.email,
  whatsapp: dbPin.whatsapp,
  operatingHours: dbPin.operating_hours, // Mapping balik
  status: dbPin.status,
  createdAt: dbPin.created_at      // Mapping balik
});

// --- PINS CRUD ---

export const getPins = async (): Promise<PinLocation[]> => {
  try {
    const { data, error } = await supabase.from('locations').select('*');
    if (error) throw error;
    
    // Convert data dari DB format ke App format
    const formattedData = data.map(fromDbLocation);
    
    // Sort by createdAt descending
    return formattedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error: any) {
    console.error("Failed to load pins from Supabase", error.message);
    return [];
  }
};

export const addPin = async (pin: PinLocation): Promise<void> => {
  try {
    // Gunakan toDbLocation sebelum insert
    const { error } = await supabase.from('locations').insert([toDbLocation(pin)]);
    if (error) throw error;
  } catch (error: any) {
    console.error("Failed to add pin to Supabase", error.message);
    alert(`Gagal menambahkan lokasi: ${error.message}`);
    throw error; // Throw agar UI tau kalau gagal
  }
};

export const importPins = async (newPins: PinLocation[]): Promise<void> => {
  try {
    // Map semua pin ke format DB
    const dbPins = newPins.map(toDbLocation);
    const { error } = await supabase.from('locations').insert(dbPins);
    if (error) throw error;
  } catch (error: any) {
    console.error("Failed to import pins to Supabase", error.message);
    alert(`Gagal mengimpor lokasi: ${error.message}`);
  }
};

export const updatePin = async (updatedPin: PinLocation): Promise<void> => {
  try {
    // Gunakan toDbLocation sebelum update
    const { error } = await supabase.from('locations').update(toDbLocation(updatedPin)).eq('id', updatedPin.id);
    if (error) throw error;
  } catch (error: any) {
    console.error("Failed to update pin in Supabase", error.message);
    alert(`Gagal memperbarui lokasi: ${error.message}`);
  }
};

export const deletePin = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from('locations').delete().eq('id', id);
    if (error) throw error;
  } catch (error: any) {
    console.error("Failed to delete pin from Supabase", error.message);
    alert(`Gagal menghapus lokasi: ${error.message}`);
  }
};

// --- REPORTS CRUD ---

export const getReports = async (): Promise<LocationReport[]> => {
  try {
    const { data, error } = await supabase.from('reports').select('*');
    if (error) throw error;
    
    return data.map((r: any) => ({
      reportId: r.report_id,
      pinId: r.pin_id,
      pinName: r.pin_name,
      changes: r.changes,
      reportedAt: r.reported_at
    })).sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
  } catch (error: any) {
    console.error("Failed to load reports from Supabase", error.message);
    return [];
  }
};

export const addReport = async (report: LocationReport): Promise<void> => {
  try {
    const dbReport = {
      report_id: report.reportId,
      pin_id: report.pinId,
      pin_name: report.pinName,
      changes: report.changes,
      reported_at: report.reportedAt
    };

    const { error } = await supabase.from('reports').insert([dbReport]);
    if (error) throw error;
  } catch (error: any) {
    console.error("Failed to add report to Supabase", error.message);
    alert(`Gagal mengirim laporan: ${error.message}`);
    throw error;
  }
};

export const deleteReport = async (reportId: string): Promise<void> => {
  try {
    const { error } = await supabase.from('reports').delete().eq('report_id', reportId);
    if (error) throw error;
  } catch (error: any) {
    console.error("Failed to delete report from Supabase", error.message);
    alert(`Gagal menghapus laporan: ${error.message}`);
  }
};

// --- IMAGE UPLOAD ---
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`; // Path inside the 'location-images' bucket

    const { error: uploadError } = await supabase.storage
      .from('location-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('location-images')
      .getPublicUrl(filePath);
    
    return data.publicUrl;

  } catch (error: any) {
    console.error("Failed to upload image to Supabase Storage:", error.message);
    alert(`Gagal mengunggah gambar: ${error.message}`);
    return null;
  }
};
