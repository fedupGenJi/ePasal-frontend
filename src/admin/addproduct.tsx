import React, { useState, useEffect } from 'react';
import AdminLayout from './adminLayout';
import { BACKEND_URL } from '../config';
import { useNotification } from '../multishareCodes/notificationProvider';

const ProductPage: React.FC = () => {
  const [formData, setFormData] = useState({
    brand_name: '',
    model_name: '',
    model_year: '',
    product_type: '',
    cost_price: '',
    ram: '',
    ram_type: '',
    storage: '',
    storage_type: '',
    processor: '',
    processor_series: '',
    graphic_ram: '',
    graphic: '',
    warranty: '',
    display: '',
    display_type: '',
    quantity: '',
    touchscreen: false,
    faceImage: null as File | null,
    sideImages: [] as File[],
  });

  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [sidePreviews, setSidePreviews] = useState<string[]>([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (formData.faceImage) {
      const reader = new FileReader();
      reader.onload = () => setFacePreview(reader.result as string);
      reader.readAsDataURL(formData.faceImage);
    } else {
      setFacePreview(null);
    }
  }, [formData.faceImage]);

  useEffect(() => {
    if (formData.sideImages.length > 0) {
      const previews = formData.sideImages.map((file) => URL.createObjectURL(file));
      setSidePreviews(previews);
      return () => previews.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setSidePreviews([]);
    }
  }, [formData.sideImages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFaceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, faceImage: e.target.files[0] });
    }
  };

  const handleSideImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, sideImages: Array.from(e.target.files) });
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      'brand_name', 'model_name', 'model_year', 'product_type', 'cost_price',
      'ram', 'ram_type', 'storage', 'storage_type', 'processor', 'processor_series',
      'graphic_ram', 'graphic', 'warranty', 'display', 'display_type', 'quantity'
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) return false;
    }
    return !!formData.faceImage;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please fill all fields and upload a face image.');
      return;
    }
    submitProduct();
  };

  const submitProduct = async () => {
    const payload = new FormData();

    const laptopForm = {
      brand_name: formData.brand_name,
      model_name: formData.model_name,
      model_year: parseInt(formData.model_year),
      product_type: formData.product_type,
      cost_price: parseFloat(formData.cost_price),
      ram: parseInt(formData.ram),
      ram_type: formData.ram_type,
      storage: parseInt(formData.storage),
      storage_type: formData.storage_type,
      processor: formData.processor,
      processor_series: formData.processor_series,
      graphic_ram: parseInt(formData.graphic_ram),
      graphic: formData.graphic,
      warranty: formData.warranty,
      display: formData.display,
      display_type: formData.display_type,
      quantity: parseInt(formData.quantity),
      touchscreen:
        typeof formData.touchscreen === "string"
          ? formData.touchscreen === "true"
          : Boolean(formData.touchscreen),
    };

    payload.append("form", JSON.stringify(laptopForm));

    if (formData.faceImage) {
      payload.append("faceImage", formData.faceImage);
    }
    formData.sideImages.forEach((img) => payload.append("sideImages[]", img));

    try {
      const response = await fetch(`${BACKEND_URL}/api/insertion`, {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

      if (response.ok) {
        showNotification(result.message || "✅ Product successfully added!", "success");
      } else {
        showNotification(result.message || "❌ Failed to add product.", "error");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      showNotification("❌ Request error.", "error");
    }
  };

  const inputClass =
    'border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500';
  const inputNoSpinner =
    'appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

  return (
    <AdminLayout pageName="Add Product">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow space-y-6 overflow-auto"
      >
        <h2 className="text-2xl font-semibold text-gray-700">Add New Product</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="font-medium">Brand Name</label>
            <select name="brand_name" value={formData.brand_name} onChange={handleChange} required className={inputClass}>
              <option value="">-- Select Brand --</option>
              <option value="Acer">Acer</option>
              <option value="Dell">Dell</option>
              <option value="Lenovo">Lenovo</option>
              <option value="Asus">Asus</option>
              <option value="MSI">MSI</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Product Type</label>
            <select name="product_type" value={formData.product_type} onChange={handleChange} required className={inputClass}>
              <option value="">-- Select Type --</option>
              <option value="Authentic">Authentic</option>
              <option value="Refurbished">Refurbished</option>
              <option value="Grey">Grey</option>
            </select>
          </div>

          {[
            { name: 'model_name', label: 'Model Name' },
            { name: 'model_year', label: 'Model Year', type: 'number' },
            { name: 'cost_price', label: 'Cost Price', type: 'number' },
            { name: 'ram', label: 'RAM (GB)', type: 'number' },
            { name: 'ram_type', label: 'RAM Type' },
            { name: 'storage', label: 'Storage (GB)', type: 'number' },
            { name: 'storage_type', label: 'Storage Type' },
            { name: 'processor', label: 'Processor' },
            { name: 'processor_series', label: 'Processor Series' },
            { name: 'graphic_ram', label: 'Graphic RAM (GB)', type: 'number' },
            { name: 'graphic', label: 'Graphic Card' },
            { name: 'warranty', label: 'Warranty' },
            { name: 'display', label: 'Display Size' },
            { name: 'display_type', label: 'Display Type' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="font-medium">{label}</label>
              <input
                type={type || 'text'}
                name={name}
                value={formData[name as keyof typeof formData] as string}
                onChange={handleChange}
                className={`${inputClass} ${type === 'number' ? inputNoSpinner : ''}`}
                min={type === 'number' ? '0' : undefined}
                step={type === 'number' ? 'any' : undefined}
                required
              />
            </div>
          ))}

          <div className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              name="touchscreen"
              checked={formData.touchscreen}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="font-medium">Touchscreen</label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block font-medium">Face Image</label>
            <input type="file" accept="image/*" onChange={handleFaceImageChange} required className="mt-2" />
            {facePreview && (
              <img src={facePreview} alt="Face Preview" className="mt-3 w-40 h-40 object-cover rounded shadow" />
            )}
          </div>

          <div>
            <label className="block font-medium">Side Images</label>
            <input type="file" accept="image/*" multiple onChange={handleSideImageChange} className="mt-2" />
            {sidePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {sidePreviews.map((src, idx) => (
                  <img key={idx} src={src} alt={`Side ${idx}`} className="w-24 h-24 object-cover rounded shadow" />
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid()}
          className={`w-full py-2 text-white font-semibold rounded transition duration-300 ${isFormValid()
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          Insert
        </button>
      </form>
    </AdminLayout>
  );
};

export default ProductPage;