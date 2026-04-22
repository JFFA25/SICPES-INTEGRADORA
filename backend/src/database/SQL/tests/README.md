# TEST - API (Sistema Integral de Control de Pensión de Estudiantes)

## Dashboard Inicial - SICPES

![Dashboard Inicial](/backend/src/database/SQL/dashboard/Dashboard%20-%20SICPES.png) 

### Test 1: Prueba de Rendimiento Analítico Puro (Max Load)

**Propósito:** Probar cuánto tarda la Base de Datos y Node.js en dibujar y devolver 1500 nodos en las tablas del Panel Admin con una aleatoriedad.

```json
{
  "cantidad": 1500
}
```

![Test](/backend/src/database/SQL/tests/1.1500-Usuarios.png) 


### Test 2: Prueba Financiera de Cartera Vencida (Deudores)

**Propósito:** Llenar el sistema con 500 usuarios que actualmente están confirmados, viven en el complejo (tienen estancia activa), pero son morosos que no han pagado su renta. Esto es excelente para probar dashboards financieros y alertas visuales rojas.

```json
{
  "cantidad": 500,
  "estado_reservacion": "activa",
  "estado_pago": "Atrasado",
  "usuario_confirmado": 1
}
```
![Test](/backend/src/database/SQL/tests/2.500-Deudores.png) 

### Test 3: Simulación de Ataque de Spam y Solicitudes Falsificadas

**Propósito:** Simula que el sistema recibió una oleada de 300 registros basura. Demuestra cómo las cuentas ni siquiera están confirmadas, y activa nuestra regla de negocio para "cortar/resetear" los cobros al rechazar la habitación.

```json
{
  "cantidad": 300,
  "estado_reservacion": "rechazada",
  "motivo_rechazo": "SOSPECHA: IP Registrada en Blacklist / Documentos Falsos",
  "usuario_confirmado": 0
}
```
![Test](/backend/src/database/SQL/tests/3.300-spamers.png) 

### Test 4: Ciclo de Éxito Histórico (Prueba de Finalización)

**Propósito:** Generar datos "limpios y perfectos". Se inyectan 250 expedientes históricos de estudiantes que vivieron en la residencia, confirmaron su email, terminaron su contrato y pagaron todas sus cuotas en tiempo y forma.

```json
{
  "cantidad": 250,
  "estado_reservacion": "terminada",
  "estado_pago": "Pagado",
  "usuario_confirmado": 1
}
```
![Test](/backend/src/database/SQL/tests/4.250-exitosos.png) 

### Test 5: Temporada Alta de Inscripciones (Para paginación)

**Propósito:** Simular que hoy abrieron las inscripciones y cayeron de golpe 200 solicitudes de reservación que faltan por administrar. Aquí el estado del pago será dictado por la inteligencia del script SQL (los dejará "Pendientes" porque la reservación apenas es "solicitud"). Ideal para testear si la Paginación de tu panel frontend no se congela al navegar.

```json
{
  "cantidad": 250,
  "estado_reservacion": "solicitud",
  "usuario_confirmado": 1
}
```
![Test](/backend/src/database/SQL/tests/5-250-inscripciones.png) 


## Dashboard Final - SICPES

![Dashboard Final](/backend/src/database/SQL/dashboard/Dashboard%20-%20SICPES_upgrade.png) 