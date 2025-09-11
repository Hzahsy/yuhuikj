# EcoAisla - Aislamiento Térmico de Áticos

¡Bienvenido a EcoAisla! Esta aplicación web permite a los usuarios solicitar evaluaciones gratuitas para el aislamiento térmico de sus áticos por solo 1€.

## 🚀 Despliegue en Replit

### Pasos para desplegar:

1. **Importar el proyecto a Replit:**
   - Ve a [replit.com](https://replit.com)
   - Haz clic en "Create Repl"
   - Selecciona "Import from GitHub" o "Upload from computer"
   - Sube todos los archivos del proyecto

2. **Configuración automática:**
   - Replit detectará automáticamente la configuración de Node.js
   - Los archivos `.replit` y `replit.nix` configurarán el entorno

3. **Instalar dependencias:**
   - Replit ejecutará automáticamente `npm install`
   - Si es necesario, puedes ejecutar manualmente: `npm install`

4. **Ejecutar la aplicación:**
   - Haz clic en el botón "Run" en Replit
   - O ejecuta: `npm start`
   - La aplicación estará disponible en la URL proporcionada por Replit

## 📋 Características

### Formulario Multi-Paso
- **Paso 1:** Selección del tipo de vivienda (Casa/Un piso)
- **Paso 2:** Selección del tipo de ático (Perdido/Habitable/No sé)
- **Paso 3:** Información personal (Nombre, Email, Teléfono, Dirección, Código Postal)

### Validaciones
- Campos obligatorios marcados con *
- Validación de email
- Teléfono: exactamente 9 dígitos
- Código postal: 5 dígitos

### Funcionalidades
- Progreso visual del formulario
- Navegación entre pasos
- Validación en tiempo real
- Mensajes de error y éxito
- Almacenamiento de submissions en JSON

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js con Express
- **Despliegue:** Replit
- **Estilos:** CSS moderno con animaciones AOS

## 📁 Estructura del Proyecto

```
eco-aisla/
├── index.html              # Página principal
├── server.js               # Servidor Express
├── package.json            # Dependencias y scripts
├── .replit                 # Configuración de Replit
├── replit.nix              # Entorno Nix para Replit
├── submissions.json        # Almacenamiento de formularios
├── js/
│   ├── multi-step-form.js  # Lógica del formulario multi-paso
│   ├── benefits.js         # Funcionalidades de beneficios
│   ├── faq.js             # Funcionalidades del FAQ
│   └── mobile-menu.js     # Menú móvil
├── css/
│   ├── main-consolidated.css
│   ├── form-styles.css
│   └── media.css
├── images/                 # Imágenes del sitio
└── netlify/
    └── functions/
        └── submit.js       # Función serverless (opcional)
```

## 🔧 Configuración Local (Opcional)

Si deseas ejecutar localmente:

```bash
# Instalar dependencias
npm install

# Ejecutar el servidor
npm start

# La aplicación estará disponible en http://localhost:3000
```

## 📊 Dashboard de Administrador

Para ver los formularios enviados:
- Visita `/dashboard` en tu aplicación desplegada
- Los datos se almacenan en `submissions.json`

## 🎨 Personalización

### Colores y Tema
Los colores principales se definen en `:root` en `index.html`:
```css
--primary: #10b981;
--secondary: #10b981;
--accent: #f59e0b;
```

### Contenido
- Edita `index.html` para cambiar textos y contenido
- Modifica los archivos CSS para cambiar estilos
- Actualiza `server.js` para cambiar la lógica del backend

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, por favor contacta al equipo de desarrollo.

---

**EcoAisla** - Haciendo hogares más eficientes con aislamiento térmico de calidad.