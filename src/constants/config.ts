import argv from 'minimist'
//kiểm tra môi trường chạy để biết trả về đường dẩn ảnh cho hợp lý
const options = argv(process.argv.slice(2))
export const isProduction = Boolean(options.production)
