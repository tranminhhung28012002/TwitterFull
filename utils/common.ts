export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
  //trả về kiểu number[] ,kiểu [0,1,2,3,4]
}