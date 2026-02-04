import { useState } from "react";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await register(nombreCompleto, email, password);
    if (ok) {
      alert("Usuario registrado");
      navigate('/login');
    } else alert("Error en registro");
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="mb-4">Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nombre completo</label>
            <input className="form-control" value={nombreCompleto} onChange={(e)=>setNombreCompleto(e.target.value)} placeholder="Nombre completo" />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div className="mb-3">
            <label>Contraseña</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-primary w-100">Registrar</button>
        </form>
      </div>
    </div>
  );
} 
