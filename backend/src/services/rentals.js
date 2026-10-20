function inclusiveDays(start, end) {
  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
}

function rentalOverlapFilter(machineId, start, end) {
  return {
    machineId,
    status: "ATIVO",
    finalizadoEm: null,
    start: { lte: end },
    end: { gte: start }
  };
}

export { inclusiveDays, rentalOverlapFilter };