import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password + process.env.BCRYPT_PEPPER, 11);
}
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password + process.env.BCRYPT_PEPPER, hashedPassword);
}