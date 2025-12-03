import React from 'react';

interface SpecificationsDisplayProps {
  category: string;
  subcategory: string;
  specifications: Record<string, any>;
}

/**
 * Maps specification field names to user-friendly labels
 */
const specLabelMap: Record<string, string> = {
  // Mobile Phones
  memory_storage: 'Storage Memory',
  ram: 'RAM Memory',
  processor: 'Processor',
  display_size: 'Display Size',
  display_type: 'Display Type',
  refresh_rate: 'Refresh Rate',
  rear_camera: 'Rear Camera',
  front_camera: 'Front Camera',
  battery_capacity: 'Battery Capacity',
  charging: 'Charging Technology',
  operating_system: 'Operating System',
  sim_slots: 'SIM Slots',
  water_resistance: 'Water Resistance',
  warranty_months: 'Warranty Period',
  model_number: 'Model Number',
  phone_color: 'Color',
  network_type: 'Network Type',
  condition_details: 'Condition Details',
  imei_confirmed: 'IMEI Confirmed',
  
  // Laptops
  processor_cores: 'Processor Cores',
  graphics_card_type: 'Graphics Type',
  storage_type: 'Storage Type',
  storage_capacity: 'Storage Capacity',
  graphics_card: 'Graphics Card',
  display_resolution: 'Display Resolution',
  battery_hours: 'Battery Life',
  weight_kg: 'Weight',
  product_condition: 'Product Condition',
  condition_grade: 'Condition Grade',
  wifi_version: 'Wi-Fi Version',
  bluetooth_version: 'Bluetooth Version',
  ports: 'Ports & Connectivity',
  webcam_quality: 'Webcam Quality',
  integrity_confirmed: 'Integrity Confirmed',
  
  // Cameras
  camera_type: 'Camera Type',
  megapixels: 'Megapixels',
  sensor_size: 'Sensor Size',
  iso_range: 'ISO Range',
  aperture: 'Maximum Aperture',
  focal_length: 'Focal Length',
  video_resolution: 'Video Resolution',
  autofocus_points: 'Autofocus Points',
  shutter_speed: 'Shutter Speed Range',
  camera_connectivity: 'Connectivity',
  camera_battery_type: 'Battery Type',
  camera_dimensions: 'Dimensions',
  weight_grams: 'Weight (Grams)',
  memory_card_support: 'Memory Card Support',
  lens_mount: 'Lens Mount Type',
  
  // Tablets
  tablet_display_type: 'Display Type',
  resolution: 'Display Resolution',
  tablet_rear_camera: 'Rear Camera',
  tablet_front_camera: 'Front Camera',
  stylus_support: 'Stylus Support',
  keyboard_compatible: 'Keyboard Compatibility',
  
  // Headphones
  headphone_type: 'Headphone Type',
  connection_type: 'Connection Type',
  driver_size: 'Driver Size',
  headphone_frequency_response: 'Frequency Response',
  impedance: 'Impedance',
  headphone_charging_port: 'Charging Port',
  noise_cancellation: 'Noise Cancellation',
  has_microphone: 'Microphone',
  headphone_weight_grams: 'Weight',
  headphone_special_features: 'Special Features',
  water_resistance_rating: 'Water Resistance',
  
  // Appliances
  capacity_liters: 'Capacity',
  fridge_type: 'Refrigerator Type',
  cooling_technology: 'Cooling Technology',
  energy_rating: 'Energy Rating',
  warranty_years: 'Warranty Period',
  power_output_kva: 'Power Output',
  fuel_type: 'Fuel Type',
  fuel_tank_liters: 'Fuel Tank Capacity',
  runtime_hours: 'Runtime',
  noise_level_db: 'Noise Level',
  
  // Furniture
  seating_capacity: 'Seating Capacity',
  material: 'Material',
  furniture_color: 'Color',
  width_cm: 'Width',
  depth_cm: 'Depth',
  reclining: 'Reclining Feature',
  bed_size: 'Bed Size',
  storage: 'Storage Options',
  mattress_included: 'Mattress Included',
  
  // Grocery
  produce_type: 'Type',
  origin: 'Origin',
  organic_certified: 'Organic Certified',
  expiry_days: 'Shelf Life',
  product_type: 'Product Type',
  fat_content: 'Fat Content',
  pasteurized: 'Pasteurized',
  
  // Power Banks
  capacity_mah: 'Capacity',
  output_ports: 'Output Ports',
  input_charging_options: 'Input Charging Options',
  fast_charging_support: 'Fast Charging Support',
  powerbank_battery_type: 'Battery Type',
  led_display: 'LED Display',
  powerbank_special_features: 'Special Features',
  powerbank_weight_grams: 'Weight',
  powerbank_dimensions: 'Dimensions',
  
  // Microphones
  microphone_type: 'Microphone Type',
  polar_pattern: 'Polar Pattern',
  microphone_frequency_response: 'Frequency Response',
  sensitivity: 'Sensitivity',
  mic_connectivity: 'Connectivity',
  power_requirement: 'Power Requirement',
  cable_length_meters: 'Cable Length',
  mic_weight_grams: 'Weight',
  
  // Televisions
  screen_size_inches: 'Screen Size',
  tv_resolution: 'Display Resolution',
  display_technology: 'Display Technology',
  is_smart_tv: 'Smart TV',
  operating_system_tv: 'Operating System',
  refresh_rate_tv: 'Refresh Rate',
  screen_type: 'Screen Type',
  tv_connectivity: 'Connectivity',
  hdr_support: 'HDR Support',
  power_consumption_watts: 'Power Consumption',
  speaker_output: 'Speaker Output',
  tv_warranty_months: 'Warranty Period',
  
  // Networking
  device_type: 'Device Type',
  networking_brand: 'Brand',
  model_number_network: 'Model Number',
  wifi_standard: 'Wi-Fi Standard',
  network_speed_mbps: 'Maximum Speed',
  ethernet_ports: 'Ethernet Ports',
  wireless_bands: 'Wireless Bands',
  network_connectivity: 'Connectivity & Features',
  network_warranty_months: 'Warranty Period',
  
  // CCTV
  cctv_device_type: 'Device Type',
  cctv_brand: 'Brand',
  camera_type_cctv: 'Camera Type',
  cctv_resolution: 'Video Resolution',
  cctv_connectivity: 'Connectivity',
  cctv_night_vision: 'Night Vision',
  number_of_cameras: 'Number of Cameras',
  storage_type_cctv: 'Storage Method',
  cctv_features: 'Special Features',
  cctv_warranty_months: 'Warranty Period',
  
  // Speakers
  speaker_type: 'Speaker Type',
  power_output: 'Power Output',
  driver_count: 'Number of Drivers',
  speaker_frequency_response: 'Frequency Response',
  speaker_connectivity: 'Connectivity',
  waterproof_rating: 'Waterproof Rating',
  speaker_battery_capacity: 'Battery Capacity',
  battery_life_hours: 'Battery Life',
  speaker_charging_port: 'Charging Port',
  speaker_weight: 'Weight',
  speaker_special_features: 'Special Features',
  
  // New Appliances
  ac_type: 'AC Type',
  tonnage_tr: 'Tonnage (TR)',
  cooling_capacity_btu: 'Cooling Capacity',
  washer_type: 'Machine Type',
  capacity_kg: 'Capacity',
  spin_speed_rpm: 'Spin Speed',
  cooker_type: 'Cooker Type',
  burner_count: 'Number of Burners',
  capacity_liters_or_cups: 'Capacity',
  power_rating_watts: 'Power Rating',
  temperature_range: 'Max Temperature',
  cleaner_type: 'Appliance Type',
  tank_capacity_liters: 'Tank Capacity',
  fan_type: 'Fan Type',
  speed_settings: 'Speed Settings',
  solar_type: 'Product Type',
  power_capacity: 'Power Capacity',
  efficiency_percent: 'Efficiency',
  appliance_type: 'Appliance Type',
  capacity_or_feature: 'Capacity/Feature',
};

export default function SpecificationsDisplay({
  category,
  subcategory,
  specifications,
}: SpecificationsDisplayProps) {
  if (!specifications || Object.keys(specifications).length === 0) {
    return null;
  }

  // Filter out empty specifications
  const nonEmptySpecs = Object.entries(specifications).filter(
    ([_, value]) => value !== undefined && value !== null && value !== ''
  );

  if (nonEmptySpecs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
      <h3 className="text-2xl font-bold mb-6 text-black dark:text-white flex items-center gap-2">
        <span className="text-3xl">⚙️</span>
        Key Specifications
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nonEmptySpecs.map(([key, value]) => (
          <div key={key} className="border-b border-gray-200 dark:border-zinc-800 pb-4">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
              {specLabelMap[key] || key.replace(/_/g, ' ')}
            </p>
            <p className="text-lg font-bold text-black dark:text-white break-words">
              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
