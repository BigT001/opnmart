'use client';

interface SpecOption {
  value: string;
  label: string;
}

interface Specification {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  required: boolean;
  options?: (string | SpecOption)[];
}

interface SpecificationsProps {
  specifications: Record<string, any>;
  currentSpecs: Specification[];
  onSpecChange: (specName: string, value: any) => void;
  errors: Record<string, string>;
}

export default function Specifications({
  specifications,
  currentSpecs,
  onSpecChange,
  errors,
}: SpecificationsProps) {
  if (currentSpecs.length === 0) {
    return null;
  }

  const getOptionValue = (option: string | SpecOption): string => {
    return typeof option === 'string' ? option : option.value;
  };

  const getOptionLabel = (option: string | SpecOption): string => {
    return typeof option === 'string' ? option : option.label;
  };

  return (
    <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
        Product Specifications
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {currentSpecs.map(spec => (
          <div key={spec.name}>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              {spec.label} {spec.required && <span className="text-red-500">*</span>}
            </label>

            {spec.type === 'text' && (
              <input
                type="text"
                value={specifications[spec.name] || ''}
                onChange={(e) => onSpecChange(spec.name, e.target.value)}
                placeholder={spec.label}
                className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors[`spec_${spec.name}`] ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                }`}
              />
            )}

            {spec.type === 'number' && (
              <input
                type="number"
                value={specifications[spec.name] || ''}
                onChange={(e) => onSpecChange(spec.name, e.target.value)}
                placeholder={spec.label}
                className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors[`spec_${spec.name}`] ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                }`}
              />
            )}

            {spec.type === 'select' && spec.options && (
              <select
                value={specifications[spec.name] || ''}
                onChange={(e) => onSpecChange(spec.name, e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors[`spec_${spec.name}`] ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                }`}
              >
                <option value="">Select {spec.label.toLowerCase()}</option>
                {spec.options.map((option, idx) => (
                  <option key={`${spec.name}_${getOptionValue(option)}_${idx}`} value={getOptionValue(option)}>
                    {getOptionLabel(option)}
                  </option>
                ))}
              </select>
            )}

            {spec.type === 'checkbox' && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specifications[spec.name] || false}
                  onChange={(e) => onSpecChange(spec.name, e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                />
                <span className="text-gray-700 dark:text-gray-300">{spec.label}</span>
              </label>
            )}

            {errors[`spec_${spec.name}`] && (
              <p className="text-red-500 text-sm mt-2">{errors[`spec_${spec.name}`]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
