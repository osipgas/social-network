// components/InputWithLabel.jsx
import '../styles/loginPage.css'
export default function InputWithLabel({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder
}) {
  return (
    <label className="input-group">
      <span className="input-label">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    </label>
  );
}