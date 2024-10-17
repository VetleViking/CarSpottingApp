import jwt from 'jsonwebtoken'

export const generate_jwt = async (username: string) => {
    return jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

export const verify_jwt = async (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export const get_user = async (token: string) => {
    const decoded = await verify_jwt(token);

    return decoded.username;
}