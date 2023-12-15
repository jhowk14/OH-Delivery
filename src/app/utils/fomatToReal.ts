export default function formatarReal(valor: number) {
    var real = valor
    if (typeof valor !== 'number') {
      real = parseFloat(valor)
    }
  
    // Formata o valor como Real brasileiro
    const valorFormatado = real.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  
    return valorFormatado;
}