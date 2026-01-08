# 🚀 Guía de Clonación y Ejecución (Front End)

Sigue estos pasos para replicar el entorno de desarrollo del **Front End de ChurnInsight** en tu máquina local.

---

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: versión **18.0 o superior**
- **Git**: para la gestión del repositorio
- **Navegador Web**: Chrome o Edge (recomendado para herramientas de desarrollo)

---

## 2. Clonar el Repositorio

Abre tu terminal y ejecuta los siguientes comandos:

```bash
# Clonar el proyecto
git clone https://github.com/tu-usuario/churn-insight-ui.git

# Entrar al directorio del proyecto
cd churn-insight-ui
```

---

## 3. Instalación de Dependencias

Debido al uso de librerías de gráficos y componentes UI con posibles conflictos menores de versiones, es **obligatorio** instalar las dependencias usando el flag:

```bash
npm install --legacy-peer-deps
```

Este paso evita errores de resolución de dependencias comunes en proyectos React modernos.

---

## 4. Configuración del Entorno

Asegúrate de que la comunicación con el **Backend en Spring Boot** esté apuntando a la dirección correcta.

1. Abre el archivo:
```
src/services/api.js
```

2. Verifica que el `baseURL` coincida con tu servidor backend (por defecto):

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080',
});
```

Si el backend está desplegado en otra dirección o puerto, actualiza este valor.

---

## 5. Ejecución del Proyecto

Inicia el servidor de desarrollo de **Vite** con el comando:

```bash
npm run dev
```

Al finalizar, la consola mostrará una URL similar a:

```
http://localhost:5173
```

Ábrela en tu navegador para visualizar la aplicación.

---

## 🛠️ Flujo de Trabajo para el Desarrollador

| Acción | Comando / Ubicación |
|------|---------------------|
| Añadir nuevos estilos | Usa clases de **Tailwind CSS** directamente en el JSX |
| Cambiar íconos | Busca el nombre correcto en la librería **Lucide React** |
| Probar predicciones | Accede a la ruta `/predict` e ingresa datos numéricos válidos |
| Cerrar sesión | Usa el botón del **Sidebar** (limpia el `localStorage`) |

---

## ⚠️ Nota Importante sobre Permisos

Si al intentar realizar una predicción recibes un error de **permisos**, verifica que:

- El usuario autenticado tenga el rol:
  - `ROLE_ANALYST` **o**
  - `ROLE_ADMIN`
- El rol esté correctamente configurado en la base de datos del **Backend en Spring Boot**.

Sin estos permisos, el endpoint de predicción rechazará la solicitud aunque el token JWT sea válido.

---

📌 **Observación técnica**  
Un entorno Front End correctamente clonado pero mal alineado con el backend suele fallar de forma silenciosa.  
Antes de depurar React, confirma siempre **URL base, roles y contrato de datos**.
