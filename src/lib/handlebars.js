import { format } from 'timeago.js';
import moment from 'moment';
const helpers = {};



helpers.counter = (index)=>{
  return index + 1;
};

helpers.timeago = (timestamp) => {
  return format(timestamp);
}

helpers.minusculas = (string) => {
  return string.toLowerCase();
}

helpers.unix2es = (unixTime) => {
  // Convertir el tiempo Unix (en segundos) a milisegundos
  const fecha = new Date(unixTime * 1000);

  // Extraer día, mes y año
  const dia = String(fecha.getDate()).padStart(2, '0'); // Asegura 2 dígitos
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const anio = fecha.getFullYear();

  // Formato dd/mm/yyyy
  return `${dia}/${mes}/${anio}`;
}

helpers.stripeprecio = (precio) => {
  precio = precio / 100;
  return precio;
}

//Este es el formateo necesario para encajar una fecha en un input de type="date"
helpers.formatearEn = (timestamp) => {
  if (timestamp) {
    let mnth = ("0" + (timestamp.getMonth() + 1)).slice(-2);
    let day = ("0" + timestamp.getDate()).slice(-2);
    return [timestamp.getFullYear(), mnth, day].join("-");
  }
}

helpers.formatearSp = (timestamp) => {
  if (timestamp) {
    let mnth = ("0" + (timestamp.getMonth() + 1)).slice(-2);
    let day = ("0" + timestamp.getDate()).slice(-2);
    return [day, mnth, timestamp.getFullYear()].join("/");
  }
}

helpers.getDay = (timestamp) => {
  if (timestamp) {
    let mnth = ("" + (timestamp.getMonth() + 1)).slice(-2);
    let day = ("" + timestamp.getDate()).slice(-2);
    return [day, mnth, timestamp.getFullYear()].join("");
  }
}

helpers.datetimelocal = (timestamp) => {
  if (timestamp) {
    let t = timestamp.toString().split(/[- :]/);
    let mnth = ("0" + (timestamp.getMonth() + 1)).slice(-2);
    let day = ("0" + timestamp.getDate()).slice(-2);
    return [timestamp.getFullYear(), mnth, day,].join("-") + "T" + t[4] + ":" + t[5];
  }
}


helpers.formatearHoras = (timestamp) => {
  if (timestamp) {
    var t = timestamp.toString().split(/[- :]/);
    return t[4] + ":" + t[5];
  }
}

/* helpers.fsh = (string) => {
  if (string) {
    return string.slice(0, 5);
  }
} */

helpers.yaAsiste = (usuario) => {
  return (usuario.privilegio == "master");
}

helpers.esMaster = (usuario) => {
  return (usuario.privilegio == "master");
}

helpers.esAdmin = (usuario) => {
  return (usuario.privilegio == "admin");
}

helpers.clasesMes = (asistencias) => {
  var contador = 0;
  const date = new Date();
  for (let i = 0; i < asistencias.length; i++) {
    if (date.getMonth() == asistencias[i].fecha_hora.getMonth())
      contador++;
  }
  return (contador);
}

helpers.clasesAno = (asistencias) => {
  var contador = 0;
  const date = new Date();
  for (let i = 0; i < asistencias.length; i++) {
    if (date.getFullYear() == asistencias[i].fecha_hora.getFullYear())
      contador++;
  }
  return (contador);
}

helpers.clasesTotales = (asistencias) => {
  var contador = 0;
  for (let i = 0; i < asistencias.length; i++) {
      contador++;
  }
  return (contador);
}

//TODO:
helpers.clasesCinturon = (asistencias) => {
  var contador = 0;
  for (let i = 0; i < asistencias.length; i++) {
      contador++;
  }
  return (contador);
}

helpers.when = (operand_1, operator, operand_2, options) => {
  var operators = {
    'eq': function (l, r) { return l == r; },
    'noteq': function (l, r) { return l != r; },
    'gt': function (l, r) { return Number(l) > Number(r); },
    'or': function (l, r) { return l || r; },
    'and': function (l, r) { return l && r; },
    '%': function (l, r) { return (l % r) === 0; }
  }
    , result = operators[operator](operand_1, operand_2);

  if (result) return options.fn(this);
  else return options.inverse(this);
}

helpers.diaSemana = (fecha_hora) => moment(fecha_hora).format('dddd');

helpers.horaClase = (fecha_hora) => moment(fecha_hora).format('HH:mm');

// Helper para verificar si es un día nuevo
helpers.isNewDay = (clases, index, fechaActual) => {
  if (index === 0) return true; // Siempre mostrar el primer día
  const fechaPrev = clases[index - 1].fecha_hora;
  return moment(fechaActual).format('YYYY-MM-DD') !== moment(fechaPrev).format('YYYY-MM-DD');
};


export default helpers;