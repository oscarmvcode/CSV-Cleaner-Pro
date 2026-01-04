// headers/HeaderDictionary.js
export const HeaderDictionary = {
  id: {
    keywords: [
      'id', 'uuid', 'documento', 'doc', 'cedula', 'dni', 'passport', 'num', 'numero', 'identificador', 'folio', 'registro'
    ],
    validator: v => v !== null && v !== undefined && v.toString().trim() !== ''
  },

  nombre: {
    keywords: [
      'nombre', 'persona', 'cliente', 'user', 'full', 'name', 'firstname', 'lastname',
      'apellidos', 'apellido', 'nombres', 'nombrecompleto', 'fullname', 'nombre_completo', 'nombre_persona'
    ],
    validator: v => typeof v === 'string' && v.trim() !== '' && isNaN(v)
  },

  email: {
    keywords: [
      'email', 'correo', 'mail', 'emailaddress', 'correo_electronico', 'contactemail', 'e-mail', 'mailcontact'
    ],
    validator: v => typeof v === 'string' && v.includes('@') && v.trim() !== ''
  },

  edad: {
    keywords: [
      'edad', 'age', 'años', 'anos', 'edadpersona', 'edadcliente', 'years', 'edad_usuario'
    ],
    validator: v => {
      const n = Number(v);
      return Number.isFinite(n) && n >= 0 && n <= 120; // límite superior razonable
    }
  },

  fecha: {
    keywords: [
      'fecha', 'date', 'alta', 'registro', 'fec', 'fechareg', 'created', 'updated', 'birthday',
      'nacimiento', 'fecha_nacimiento', 'fechaalta', 'fecha_registro', 'fecha_creacion'
    ],
    validator: v => {
      if (!v) return false;
      const d = new Date(v);
      return !isNaN(d.getTime());
    }
  },

  ingreso: {
    keywords: [
      'ingreso', 'monto', 'valor', 'usd', 'total', 'amount', 'salary', 'sueldo', 'revenue',
      'income', 'pago', 'payment', 'ingresos', 'total_ingreso'
    ],
    validator: v => {
      const n = Number(v);
      return !isNaN(n) && n >= 0;
    }
  },

  ciudad: {
    keywords: [
      'ciudad', 'city', 'ubic', 'location', 'town', 'municipio', 'poblacion', 'localidad',
      'state', 'provincia', 'departamento', 'ciudad_residencia'
    ],
    validator: v => typeof v === 'string' && v.trim() !== ''
  },

  pais: {
    keywords: [
      'pais', 'country', 'nacion', 'nation', 'estado', 'país', 'countryname'
    ],
    validator: v => typeof v === 'string' && v.trim() !== ''
  },

  telefono: {
    keywords: [
      'telefono', 'phone', 'phone_number', 'cell', 'celular', 'mobile', 'contact', 'movil',
      'phonecontact'
    ],
    validator: v => {
      if (!v) return false;
      const s = v.toString().trim();
      return /^[\d+\-().\s]+$/.test(s); // solo números y símbolos comunes
    }
  },

  genero: {
    keywords: [
      'genero', 'sexo', 'gender', 'sex', 'male', 'female', 'other'
    ],
    validator: v => {
      if (!v || typeof v !== 'string') return false;
      return ['m', 'f', 'male', 'female', 'other'].includes(v.toLowerCase());
    }
  },

  estado_usuario: {
    keywords: [
      'estado', 'status', 'active', 'activo', 'inactivo', 'estado_usuario', 'user_status'
    ],
    validator: v => typeof v === 'string' && v.trim() !== ''
  },

  direccion: {
    keywords: [
      'direccion', 'address', 'street', 'avenue', 'direccion_completa', 'addr', 'direccion_calle'
    ],
    validator: v => typeof v === 'string' && v.trim() !== ''
  },

  codigo_postal: {
    keywords: [
      'cp', 'zipcode', 'postal', 'codigo_postal', 'zip', 'postalcode'
    ],
    validator: v => {
      if (v === null || v === undefined) return false;
      return /^[\w\s-]+$/.test(v.toString());
    }
  },

  notas: {
    keywords: [
      'notas', 'notes', 'observaciones', 'comments', 'remark', 'extra', 'extra_01', 'extra_02', 'comentario'
    ],
    validator: v => typeof v === 'string'
  },

  departamento: {
    keywords: [
      'departamento', 'department', 'area', 'division', 'seccion'
    ],
    validator: v => typeof v === 'string' && v.trim() !== ''
  }
};
