# Dashboard - SICPES

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Dashboard](https://img.shields.io/badge/Dashboard-Navicat-33679C?style=for-the-badge&logo=navicat&logoColor=white)

Esta carpeta contiene el dashboard visual del sistema SICPES generado con **Navicat Premium 17** para análisis y monitoreo del sistema.

## Archivos Incluidos

| Archivo | Descripción |
|---------|-------------|
| `Dashboard - SICPES.png` | Dashboard principal con métricas generales |
| `Dashboard - SICPES_upgrade.png` | Dashboard mejorado con métricas adicionales |
| `SICPES.nbi` | Archivo de modelo de datos de Navicat |

## Capturas del Dashboard

### Dashboard Principal
![Dashboard Principal](Dashboard%20-%20SICPES.png)

### Dashboard Upgrade
![Dashboard Upgrade](Dashboard%20-%20SICPES_upgrade.png)

## Métricas Incluidas

### Resumen General
- Total de usuarios registrados
- Usuarios activos vs inactivos
- Total de reservaciones
- Reservaciones por estado

### Financiero
- Ingresos totales por mes
- Pagos pendientes
- Pagos verificados
- Pagos rechazados
- Deudores activos

### Ocupación
- Habitaciones disponibles
- Habitaciones ocupadas
- Tasa de ocupación por piso
- Capacidad total vs ocupación

### Temporal
- Reservaciones por mes
- Tendencias de inscripción
- Comparativa anual
- Estacionalidad

## Uso del Dashboard

1. Abre el archivo `SICPES.nbi` en Navicat Premium 17
2. Conecta a la base de datos MySQL
3. Visualiza las consultas y gráficos
4. Exporta a imagen o PDF

## Requisitos

- Navicat Premium 17 (o versión anterior compatible)
- Conexión a MySQL 8.0+
- Licencia de Navicat (versión de prueba o pagada)

## Actualización de Datos

Para actualizar los datos en el dashboard:

1. Abre Navicat Premium 17
2. Conecta a la base de datos SICPE
3. Ejecuta las consultas del modelo
4. Refresca las visualizaciones

## Generación de Reportes

Puedes generar reportes en:

- PDF para impresión
- Excel para análisis detallado
- PNG/JPG para imágenes
- CSV para datos crudos

## Descripción de Gráficos

### 1. Usuarios por Estado
```sql
SELECT estado, COUNT(*) as total 
FROM usuarios 
GROUP BY estado;
```

### 2. Reservaciones por Mes
```sql
SELECT MONTH(fecha_solicitud) as mes, COUNT(*) as total 
FROM reservaciones 
GROUP BY MONTH(fecha_solicitud);
```

### 3. Ingresos por Mes
```sql
SELECT MONTH(fecha_pago) as mes, SUM(monto) as ingresos 
FROM pagos 
WHERE estado = 'verificado' 
GROUP BY MONTH(fecha_pago);
```

### 4. Ocupación por Piso
```sql
SELECT p.numero as piso, 
       COUNT(h.id) as total,
       SUM(CASE WHEN h.estado = 'ocupada' THEN 1 ELSE 0 END) as ocupadas
FROM pisos p
LEFT JOIN habitaciones h ON p.id = h.piso_id
GROUP BY p.numero;
```

### 5. Deudores Activos
```sql
SELECT u.nombre, u.email, r.precio_total - COALESCE(SUM(p.monto), 0) as deuda
FROM usuarios u
JOIN reservaciones r ON u.id = r.usuario_id
LEFT JOIN pagos p ON r.id = p.reservacion_id AND p.estado = 'verificado'
WHERE r.estado = 'activa'
GROUP BY u.id, r.precio_total
HAVING r.precio_total > COALESCE(SUM(p.monto), 0);
```

## Guía de Interpretación

### Indicadores Clave

| Métrica | Valor Ideal | Alerta |
|---------|------------|--------|
| Tasa ocupación | > 80% | < 50% |
| Pagos pendientes | < 10% | > 30% |
| Usuarios activos | > 70% | < 50% |

### Lectura de Gráficos

- **Barras positivas**: Valores normals/en esperados
- **Barras rojas**: Valores fuera de rango
- **Tendencias**: Comparar mes actual vs anterior

## Resolución de Problemas

### Error: No conecta a la base de datos
1. Verifica que MySQL esté ejecutándose
2. Confirma credenciales en Navicat
3. Verifica que la base de datos exista

### Error: Gráficos vacíos
1. Ejecuta las queries manualmente en MySQL
2. Verifica que haya datos en las tablas
3. Actualiza el modelo en Navicat

### Error: Datos desactualizados
1. Ve a Query > Run
2. Ejecuta las consultas nuevamente
3. Refresh del modelo

## Personalización

Para agregar nuevos gráficos:

1. Abre Query Designer en Navicat
2. Escribe tu query SQL
3. Selecciona el tipo de gráfico
4. Arrastra los campos a los ejes
5. Guarda el modelo

## Conexión Directa MySQL

Para conectar Navicat a la base:

Host: localhost
Puerto: 3306
Usuario: root
Contraseña: (tu password)
Base de datos: sicpes

## Licencia

ISC