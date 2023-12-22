export const getFractionString = (countInd: number, divisao: number, id: number, deletarProd: (id:number)=>void, totalCount: number) => {
    if (divisao === 0) {
      return countInd.toString();
    }
    if(countInd == 0){
      deletarProd(id)
      return countInd.toString(); 
    }
    const fraction = `${countInd}/${totalCount}`;
    return fraction;
  };