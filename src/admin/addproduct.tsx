import React, { useState, useEffect } from 'react';
import AdminLayout from './adminLayout';
import { BACKEND_URL } from '../config';
import { useNotification } from '../multishareCodes/notificationProvider';

function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
}) {
  const inputClass = 'border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500';
  const inputNoSpinner = 'appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

  return (
    <div>
      <label className="font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`${inputClass} ${type === 'number' ? inputNoSpinner : ''}`}
        required={required}
      />
    </div>
  );
}

const ProductPage: React.FC = () => {
  const [formData, setFormData] = useState({
    brand_name: '',
    display_name: '',
    product_authetication: '',
    model_name: '',
    model_year: '',
    product_type: '',
    suitable_for: '',
    color: '',
    ram: '',
    ram_type: '',
    processor: '',
    processor_series: '',
    processor_generation: '',
    storage: '',
    storage_type: '',
    warranty: '',
    graphic: '',
    graphic_ram: '',
    display: '',
    display_type: '',
    battery: '',
    power_supply: '',
    touchscreen: false,
    cost_price: '',
    quantity: '',
    faceImage: null as File | null,
    sideImages: [] as File[],
  });

  const resetForm = () => {
    setFormData({
      brand_name: '',
      display_name: '',
      product_authetication: '',
      model_name: '',
      model_year: '',
      product_type: '',
      suitable_for: '',
      color: '',
      ram: '',
      ram_type: '',
      processor: '',
      processor_series: '',
      processor_generation: '',
      storage: '',
      storage_type: '',
      warranty: '',
      graphic: '',
      graphic_ram: '',
      display: '',
      display_type: '',
      battery: '',
      power_supply: '',
      touchscreen: false,
      cost_price: '',
      quantity: '',
      faceImage: null,
      sideImages: [],
    });
    setFacePreview(null);
    setSidePreviews([]);
  };

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
      'brand_name', 'display_name', 'product_authetication', 'model_name', 'model_year', 'product_type', 'suitable_for',
      'color', 'ram', 'ram_type', 'processor', 'processor_series', 'processor_generation', 'storage',
      'storage_type', 'warranty', 'graphic', 'graphic_ram', 'display', 'display_type', 'battery',
      'power_supply', 'cost_price', 'quantity'
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
      display_name: formData.display_name,
      product_authetication: formData.product_authetication,
      model_name: formData.model_name,
      model_year: parseInt(formData.model_year),
      product_type: formData.product_type,
      suitable_for: formData.suitable_for,
      color: formData.color,
      ram: parseInt(formData.ram),
      ram_type: formData.ram_type,
      processor: formData.processor,
      processor_series: formData.processor_series,
      processor_generation: formData.processor_generation,
      storage: parseInt(formData.storage),
      storage_type: formData.storage_type,
      warranty: formData.warranty,
      graphic: formData.graphic,
      graphic_ram: parseInt(formData.graphic_ram),
      display: formData.display,
      display_type: formData.display_type,
      battery: formData.battery,
      power_supply: formData.power_supply,
      touchscreen: Boolean(formData.touchscreen),
      cost_price: parseFloat(formData.cost_price),
      quantity: parseInt(formData.quantity),
    };
    payload.append('form', JSON.stringify(laptopForm));
    if (formData.faceImage) payload.append('faceImage', formData.faceImage);
    formData.sideImages.forEach((img) => payload.append('sideImages[]', img));

    try {
      const res = await fetch(`${BACKEND_URL}/api/insertion`, { method: 'POST', body: payload });
      const result = await res.json();
      if (res.ok) {
        showNotification(result.message || '✅ Product successfully added!', 'success');
        window.scrollTo(0, 0);
        resetForm();
      } else {
        showNotification(result.message || '❌ Failed to add product.', 'error');
      }
    } catch (err) {
      console.error('Error submitting product:', err);
      showNotification('❌ Request error.', 'error');
    }
  };

  const inputClass = 'border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500';
  const inputNoSpinner = 'appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
  const twoCol = 'grid grid-cols-2 gap-4';
  const threeCol = 'grid grid-cols-3 gap-4';
  const ratio2to3 = 'grid grid-cols-[2fr_3fr] gap-4';
  const ratio3to2 = 'grid grid-cols-[3fr_2fr] gap-4';

  return (
    <AdminLayout pageName="Add Product">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow space-y-6 overflow-auto">
        <h2 className="text-2xl font-semibold text-gray-700">Add New Product</h2>

        <div className={ratio2to3}>
          <div>
            <label className="font-medium">Brand Name</label>
            <input name="brand_name" value={formData.brand_name} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="font-medium">Display Name</label>
            <input name="display_name" value={formData.display_name} onChange={handleChange} required className={inputClass} />
          </div>
        </div>

        <div className={threeCol}>
          <div>
            <label className="font-medium">Product Authentication</label>
            <select name="product_authetication" value={formData.product_authetication} onChange={handleChange} required className={inputClass}>
              <option value="">-- Select --</option>
              <option value="Authentic">Authentic</option>
              <option value="Grey">Grey</option>
              <option value="Refurbished">Refurbished</option>
            </select>
          </div>
          <div>
            <label className="font-medium">Model Name</label>
            <input name="model_name" value={formData.model_name} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="font-medium">Model Year</label>
            <input type="number" name="model_year" value={formData.model_year} onChange={handleChange} required className={`${inputClass} ${inputNoSpinner}`} />
          </div>
        </div>

        <div className={twoCol}>
          <div>
            <label className="font-medium">Product Type</label>
            <input name="product_type" value={formData.product_type} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="font-medium">Suitable For</label>
            <input name="suitable_for" value={formData.suitable_for} onChange={handleChange} required className={inputClass} />
          </div>
        </div>

        <div className={threeCol}>
          <InputField
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />

          <InputField
            label="RAM (GB)"
            name="ram"
            type="number"
            value={formData.ram}
            onChange={handleChange}
          />

          <InputField
            label="RAM Type"
            name="ram_type"
            value={formData.ram_type}
            onChange={handleChange}
          />

        </div>

        <div className={threeCol}>
          <InputField
            label="Processor"
            name="processor"
            value={formData.processor}
            onChange={handleChange}
          />

          <InputField
            label="Processor Series"
            name="processor_series"
            value={formData.processor_series}
            onChange={handleChange}
          />

          <InputField
            label="Processor Generation"
            name="processor_generation"
            value={formData.processor_generation}
            onChange={handleChange}
          />
        </div>

        <div className={threeCol}>
          <InputField
            label="Storage (GB)"
            name="storage"
            type="number"
            value={formData.storage}
            onChange={handleChange}
          />

          <InputField
            label="Storage Type"
            name="storage_type"
            value={formData.storage_type}
            onChange={handleChange}
          />

          <InputField
            label="Warranty"
            name="warranty"
            value={formData.warranty}
            onChange={handleChange}
          />
        </div>

        <div className={ratio3to2}>
          <InputField
            label="Graphic Card"
            name="graphic"
            value={formData.graphic}
            onChange={handleChange}
          />

          <InputField
            label="Graphic RAM (GB)"
            name="graphic_ram"
            type="number"
            value={formData.graphic_ram}
            onChange={handleChange}
          />

        </div>

        <div className={twoCol}>
          <InputField
            label="Display Size"
            name="display"
            value={formData.display}
            onChange={handleChange}
          />

          <InputField
            label="Display Type"
            name="display_type"
            value={formData.display_type}
            onChange={handleChange}
          />

        </div>

        <div className={threeCol}>
          <InputField
            label="Battery"
            name="battery"
            value={formData.battery}
            onChange={handleChange}
          />

          <InputField
            label="Power Supply"
            name="power_supply"
            value={formData.power_supply}
            onChange={handleChange}
          />
          <div className="flex items-center gap-2 mt-6">
            <input type="checkbox" name="touchscreen" checked={formData.touchscreen} onChange={handleChange} className="w-5 h-5" />
            <label className="font-medium">Touchscreen</label>
          </div>
        </div>

        <div className={twoCol}>
          <InputField
            label="Cost Price"
            name="cost_price"
            type="number"
            value={formData.cost_price}
            onChange={handleChange}
          />

          <InputField
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block font-medium">Face Image</label>
            <input type="file" accept="image/*" onChange={handleFaceImageChange} required className="mt-2" />
            {facePreview && <img src={facePreview} alt="Face Preview" className="mt-3 w-40 h-40 object-cover rounded shadow" />}
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
          className={`w-full py-2 text-white font-semibold rounded transition duration-300 ${isFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Insert
        </button>
      </form>
    </AdminLayout>
  );

};

export default ProductPage;